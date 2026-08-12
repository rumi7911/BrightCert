#!/bin/zsh
# Generate the demo narration with ElevenLabs, one MP3 per shot.
#
#   ./build-narration.sh                      # default voice, George
#   ./build-narration.sh IKne3meq5aSn9XLyUdCD # any voice id
#
# Reads ELEVENLABS_API_KEY from .env.local (gitignored, mode 600). Text lives in
# NARRATION.txt and is parsed from there, so the script and the spoken words
# cannot drift apart.
#
# Voice ids (public ElevenLabs voices, British accents):
#   George   JBFqnCBsd6RMkjVDRZzb   warm, measured, male
#   Charlie  IKne3meq5aSn9XLyUdCD   natural, conversational, male
#   Daniel   onwK4e9ZLuTAKqWW03F9   news-reader, authoritative, male
#   Alice    Xb7hH8MSUJpSbSDYk0k2   clear, professional, female
#   Lily     pFZP5JQG7iQjIQuC4Bku   warm, female
#
# Settings rationale: stability 0.5 avoids the flat robotic read that high
# stability produces; style 0.1 keeps it from "performing"; speaker boost on.

set -u
cd "$(dirname "$0")/../.." || exit 1   # repo root

VOICE="${1:-JBFqnCBsd6RMkjVDRZzb}"
MODEL="eleven_multilingual_v2"
SRC="docs/submission/NARRATION.txt"
OUT="docs/submission/narration"

set -a; . ./.env.local; set +a
if [[ -z "${ELEVENLABS_API_KEY:-}" ]]; then
  echo "ELEVENLABS_API_KEY not found in .env.local" >&2
  exit 1
fi

mkdir -p "$OUT"
echo "voice: $VOICE   model: $MODEL"

for N in 1 2 3 4 5 6; do
  TEXT=$(python3 - "$N" "$SRC" <<'PY'
import re, sys
n, path = sys.argv[1], sys.argv[2]
blocks = re.split(r"={70,}\n", open(path).read())
for i, b in enumerate(blocks):
    if b.strip().startswith(f"SHOT {n}"):
        print(blocks[i + 1].strip())
        break
PY
)
  if [[ -z "$TEXT" ]]; then echo "  shot $N: no text found" >&2; continue; fi

  CODE=$(python3 -c "
import json,sys
print(json.dumps({'text': sys.argv[1], 'model_id': sys.argv[2],
  'voice_settings': {'stability':0.5,'similarity_boost':0.75,'style':0.1,'use_speaker_boost':True}}))
" "$TEXT" "$MODEL" | curl -s -o "$OUT/shot-$N.mp3" -w "%{http_code}" \
      -X POST "https://api.elevenlabs.io/v1/text-to-speech/$VOICE" \
      -H "xi-api-key: $ELEVENLABS_API_KEY" \
      -H "Content-Type: application/json" \
      --data-binary @- --max-time 120)

  if [[ "$CODE" != "200" ]]; then
    echo "  shot $N: HTTP $CODE" >&2
    head -c 200 "$OUT/shot-$N.mp3" >&2; echo >&2
    rm -f "$OUT/shot-$N.mp3"
    continue
  fi
  D=$(ffprobe -v error -show_entries format=duration -of csv=p=0 "$OUT/shot-$N.mp3")
  printf '  shot %s: %.1fs  (%s chars)\n' "$N" "$D" "${#TEXT}"
done

echo ""
TOTAL=$(for f in "$OUT"/shot-*.mp3; do ffprobe -v error -show_entries format=duration -of csv=p=0 "$f"; done | paste -sd+ - | bc)
printf 'total narration: %.0fs (%dm%02ds)\n' "$TOTAL" $((${TOTAL%.*}/60)) $((${TOTAL%.*}%60))
echo "written to $OUT"
