#!/bin/zsh
# Build the submission demo narration, one WAV per shot.
#
#   ./build-narration.sh            # default voice
#   ./build-narration.sh Serena     # any macOS en_GB/en_US voice
#
# Same approach as the July promo, whose narration was macOS `say` with a UK
# system voice. No microphone and no on-camera presence required.
#
# Numbers and product names are spelled phonetically below because `say` reads
# "gemini-2.5-flash" and "49%" badly. The spoken text must still match
# docs/submission/DEMO-VIDEO-SCRIPT.md in substance.

set -u
VOICE="${1:-Daniel}"
RATE=165
OUT="$(cd "$(dirname "$0")" && pwd)/shots"
mkdir -p "$OUT"

say_shot() {
  local n="$1" text="$2"
  say -v "$VOICE" -r "$RATE" -o "$OUT/shot-$n.aiff" "$text" || return 1
  ffmpeg -y -loglevel error -i "$OUT/shot-$n.aiff" -ar 48000 -ac 2 "$OUT/shot-$n.wav"
  rm -f "$OUT/shot-$n.aiff"
  local d
  d=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/shot-$n.wav")
  printf '  shot %s: %.1fs\n' "$n" "$d"
}

echo "voice: $VOICE at $RATE wpm"

say_shot 1 "Cyber Essentials is the UK government-backed security standard. For a small business it usually means either two weeks of paperwork, or two to five thousand pounds for a consultant. BrightCert is a readiness service. It gets a company prepared in about two hours. And to be clear up front: it does not issue the certificate. That comes from a licensed Certification Body. What BrightCert does is get you ready to pass."

say_shot 2 "The assessment is sixty plain-English questions across the five Cyber Essentials control areas. Firewalls, secure configuration, user access, malware protection, and update management. There is no payment to start, and progress saves as you go."

say_shot 3 "When you submit, the answers go to Google's Gemini API. Gemini two point five Flash. Gemini scores each of the five control areas, writes the gap analysis in plain English, and produces a prioritised remediation plan. This is a real assessment. Forty nine per cent. Firewalls at fifteen. Secure configuration at forty five. User access at seventy five. Eleven issues to fix, each with a specific next step. And none of that text is templated. Gemini wrote it from these answers."

say_shot 4 "Unlocking the full report is a one-off payment. The report is generated server-side and stored in Google Cloud Storage, then served through a signed, expiring URL, so the file is never public. Twenty four pages: an executive summary, every control area scored, and a prioritised remediation plan the business can hand to whoever does the work."

say_shot 5 "That boundary is stated in the product, in the report, and in every email. BrightCert prepares you. An IASME-licensed Certification Body certifies you."

say_shot 6 "BrightCert. Built on the Gemini API and Google Cloud, for UK small businesses that need Cyber Essentials without the two-week detour. bright cert dot co dot uk."

echo ""
TOTAL=$(for f in "$OUT"/shot-*.wav; do ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"; done | paste -sd+ - | bc)
printf 'total narration: %.1fs\n' "$TOTAL"
echo "written to $OUT"
