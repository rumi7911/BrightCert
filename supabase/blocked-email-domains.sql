-- Blocks signups from disposable / temporary email providers at the database
-- level. The signup form already rejects these with a friendly message
-- (src/lib/auth/disposable-domains.ts) — this trigger is the hard backstop for
-- anyone calling the Supabase auth API directly with the anon key.
--
-- Run once in the Supabase SQL editor. Keep the domain list in sync with
-- src/lib/auth/disposable-domains.ts.

create table if not exists public.blocked_email_domains (
  domain text primary key
);

-- Not readable by clients — only the trigger (security definer) uses it
alter table public.blocked_email_domains enable row level security;

insert into public.blocked_email_domains (domain) values
  ('mailinator.com'), ('mailinator.net'), ('mailinator.org'), ('mailinater.com'),
  ('binkmail.com'), ('bobmail.info'), ('chammy.info'), ('suremail.info'),
  ('safetymail.info'), ('sogetthis.com'), ('spamherelots.com'), ('thisisnotmyrealemail.com'),
  ('guerrillamail.com'), ('guerrillamail.net'), ('guerrillamail.org'), ('guerrillamail.biz'),
  ('guerrillamail.de'), ('guerrillamail.info'), ('guerrillamailblock.com'),
  ('grr.la'), ('sharklasers.com'), ('pokemail.net'), ('spam4.me'),
  ('10minutemail.com'), ('10minutemail.net'), ('10minutemail.co.uk'), ('10minemail.com'),
  ('10mail.org'), ('20minutemail.com'), ('minuteinbox.com'), ('10minutesemail.net'),
  ('temp-mail.org'), ('temp-mail.io'), ('temp-mail.ru'), ('tempmail.com'),
  ('tempmail.net'), ('tempmail.dev'), ('tempmailo.com'), ('tempmailaddress.com'),
  ('tempail.com'), ('tempr.email'), ('tempinbox.com'), ('tmpmail.org'),
  ('tmpmail.net'), ('tmpeml.com'), ('tmail.ws'), ('mytemp.email'), ('mail-temp.com'),
  ('yopmail.com'), ('yopmail.fr'), ('yopmail.net'), ('cool.fr.nf'), ('jetable.fr.nf'),
  ('courriel.fr.nf'), ('moncourrier.fr.nf'), ('monemail.fr.nf'), ('monmail.fr.nf'),
  ('trashmail.com'), ('trashmail.de'), ('trashmail.net'), ('trashmail.me'),
  ('trash-mail.com'), ('trash-mail.de'), ('kurzepost.de'), ('wegwerfmail.de'),
  ('wegwerfmail.net'), ('wegwerfmail.org'), ('mytrashmail.com'),
  ('1secmail.com'), ('1secmail.org'), ('1secmail.net'), ('33mail.com'),
  ('abyssmail.com'), ('anonbox.net'), ('anonymbox.com'), ('burnermail.io'),
  ('byom.de'), ('crazymailing.com'), ('deadaddress.com'), ('discard.email'),
  ('discardmail.com'), ('discardmail.de'), ('dispostable.com'), ('dropmail.me'),
  ('emailfake.com'), ('emailondeck.com'), ('emailsensei.com'), ('emltmp.com'),
  ('fakeinbox.com'), ('fakemailgenerator.com'), ('getairmail.com'), ('getnada.com'),
  ('harakirimail.com'), ('inboxbear.com'), ('inboxkitten.com'), ('incognitomail.com'),
  ('jetable.org'), ('mail.tm'), ('mail7.io'), ('mailcatch.com'), ('maildrop.cc'),
  ('maildu.de'), ('mailexpire.com'), ('mailhazard.com'), ('mailnesia.com'),
  ('mailpoof.com'), ('mailsac.com'), ('mailslurp.com'), ('meltmail.com'),
  ('mintemail.com'), ('moakt.com'), ('moakt.cc'), ('mohmal.com'), ('muellmail.com'),
  ('mvrht.com'), ('nada.email'), ('no-spam.ws'), ('nospam.ze.tc'), ('nowmymail.com'),
  ('objectmail.com'), ('obobbo.com'), ('onewaymail.com'), ('owlymail.com'),
  ('proxymail.eu'), ('rcpt.at'), ('receiveee.com'), ('rhyta.com'),
  ('sendspamhere.com'), ('spam.la'), ('spambog.com'), ('spambog.de'), ('spambog.ru'),
  ('spambox.us'), ('spamex.com'), ('spamfree24.com'), ('spamfree24.de'),
  ('spamfree24.org'), ('spamgourmet.com'), ('spamhole.com'), ('spaml.com'),
  ('spamspot.com'), ('speed.1s.fr'), ('supermailer.jp'), ('teleworm.us'),
  ('temporarymail.com'), ('throwawaymail.com'), ('tradermail.info'), ('trbvm.com'),
  ('trickmail.net'), ('veryrealemail.com'), ('webemail.me'), ('wh4f.org'),
  ('whyspam.me'), ('willselfdestruct.com'), ('winemaven.info'), ('wuzup.net'),
  ('xagloo.com'), ('xemaps.com'), ('xents.com'), ('xmaily.com'), ('yep.it'),
  ('yogamaven.com'), ('yuurok.com'), ('zehnminutenmail.de'), ('zippymail.info'),
  ('zoemail.net')
on conflict (domain) do nothing;

create or replace function public.reject_disposable_email()
returns trigger
language plpgsql
security definer
set search_path = public
as $$
declare
  email_domain text;
begin
  email_domain := lower(split_part(new.email, '@', 2));

  if exists (
    select 1
    from public.blocked_email_domains b
    where email_domain = b.domain
       or email_domain like '%.' || b.domain
  ) then
    raise exception 'Signups from temporary email providers are not allowed';
  end if;

  return new;
end;
$$;

drop trigger if exists reject_disposable_email on auth.users;
create trigger reject_disposable_email
  before insert on auth.users
  for each row
  execute function public.reject_disposable_email();
