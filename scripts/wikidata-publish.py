#!/usr/bin/env python3
"""Publish the Cognumi Ltd statements to Wikidata via the API.

Fills Q141136710 in a single wbeditentity call rather than through the web
UI's autocomplete. Records exactly what was published, so the item's content
is reproducible from the repo.

Credentials come from .env.local (gitignored, mode 600) and are never printed:

    WIKIDATA_BOT_USER=Rumi7911@brightcert
    WIKIDATA_BOT_PASSWORD=<from Special:BotPasswords>

Create the bot password at https://www.wikidata.org/wiki/Special:BotPasswords
with only the "Edit existing pages" grant. Revoke it there when finished.

    python3 -m venv /tmp/wd && /tmp/wd/bin/pip install requests
    /tmp/wd/bin/python scripts/wikidata-publish.py [--dry-run]
"""

import json
import os
import sys
from pathlib import Path

import requests

API = "https://www.wikidata.org/w/api.php"
ITEM = "Q141136710"
UA = "BrightCert-entity-bot/1.0 (https://brightcert.co.uk; hello@brightcert.co.uk)"
GREGORIAN = "http://www.wikidata.org/entity/Q1985727"


def load_env():
    path = Path(__file__).resolve().parent.parent / ".env.local"
    if not path.exists():
        return
    for line in path.read_text().splitlines():
        if "=" not in line or line.strip().startswith("#"):
            continue
        key, _, value = line.partition("=")
        os.environ.setdefault(key.strip(), value.strip().strip("\"'"))


def item(qid):
    return {"snaktype": "value", "datavalue": {
        "value": {"entity-type": "item", "numeric-id": int(qid[1:])},
        "type": "wikibase-entityid"}}


def string(value):
    return {"snaktype": "value", "datavalue": {"value": value, "type": "string"}}


def date(iso):
    return {"snaktype": "value", "datavalue": {"value": {
        "time": f"+{iso}T00:00:00Z", "timezone": 0, "before": 0, "after": 0,
        "precision": 11, "calendarmodel": GREGORIAN}, "type": "time"}}


def claim(prop, snak, references=None):
    body = {"mainsnak": {**snak, "property": prop}, "type": "statement", "rank": "normal"}
    if references:
        body["references"] = references
    return body


# The Companies House ID is the statement the item's survival rests on, so it
# carries a reference URL and a retrieval date.
CH_REFERENCE = [{"snaks": {
    "P854": [{**string("https://find-and-update.company-information.service.gov.uk/company/17265250"),
              "property": "P854"}],
    "P813": [{**date("2026-08-20"), "property": "P813"}],
}}]

CLAIMS = [
    claim("P31", item("Q6832945")),                        # instance of: private company limited by shares
    claim("P17", item("Q145")),                            # country: United Kingdom
    claim("P571", date("2026-06-06")),                     # inception
    claim("P2622", string("17265250"), CH_REFERENCE),      # Companies House ID
    claim("P856", string("https://brightcert.co.uk")),     # official website
]


def main():
    load_env()
    dry_run = "--dry-run" in sys.argv
    user = os.environ.get("WIKIDATA_BOT_USER")
    password = os.environ.get("WIKIDATA_BOT_PASSWORD")
    if not dry_run and not (user and password):
        sys.exit("WIKIDATA_BOT_USER and WIKIDATA_BOT_PASSWORD must be set in .env.local")

    session = requests.Session()
    session.headers["User-Agent"] = UA

    existing = session.get(API, params={
        "action": "wbgetclaims", "entity": ITEM, "format": "json"}).json().get("claims", {})
    pending = [c for c in CLAIMS if c["mainsnak"]["property"] not in existing]
    skipped = [c["mainsnak"]["property"] for c in CLAIMS if c["mainsnak"]["property"] in existing]

    if skipped:
        print(f"already present, skipping: {', '.join(skipped)}")
    if not pending:
        print("nothing to publish — every statement already exists")
        return
    print(f"to publish: {', '.join(c['mainsnak']['property'] for c in pending)}")

    if dry_run:
        print(json.dumps({"claims": pending}, indent=2))
        return

    token = session.get(API, params={
        "action": "query", "meta": "tokens", "type": "login", "format": "json",
    }).json()["query"]["tokens"]["logintoken"]

    login = session.post(API, data={
        "action": "login", "lgname": user, "lgpassword": password,
        "lgtoken": token, "format": "json",
    }).json()
    if login.get("login", {}).get("result") != "Success":
        sys.exit(f"login failed: {login.get('login', {}).get('reason', login)}")
    print(f"logged in as {login['login']['lgusername']}")

    csrf = session.get(API, params={
        "action": "query", "meta": "tokens", "format": "json",
    }).json()["query"]["tokens"]["csrftoken"]

    result = session.post(API, data={
        "action": "wbeditentity", "id": ITEM, "token": csrf, "format": "json",
        "bot": 1, "summary": "add company statements sourced to Companies House",
        "data": json.dumps({"claims": pending}),
    }).json()

    if "error" in result:
        sys.exit(f"edit failed: {result['error'].get('info', result['error'])}")
    print(f"published {len(pending)} statements to {ITEM}")
    print(f"https://www.wikidata.org/wiki/{ITEM}")


if __name__ == "__main__":
    main()
