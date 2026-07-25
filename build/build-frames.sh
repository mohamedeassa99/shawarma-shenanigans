#!/usr/bin/env bash
# Extract a scroll-scrubbable WebP frame sequence from the six Higgsfield clips.
# Frames are sampled at a fixed rate so each shot's frame count stays proportional
# to its real duration, which keeps the scroll pacing honest.
set -euo pipefail

HERE="$(cd "$(dirname "$0")" && pwd)"
OUT="$HERE/../site/frames"
FPS=6.6
WIDTH=1280
QUALITY=72

# shot id -> source clip, in narrative order
IDS=(spit blade saj toum pickles roll)
SRCS=(s1 s2 s3 s4 s5 s6)

rm -rf "$OUT" "$HERE/tmp"
mkdir -p "$OUT" "$HERE/tmp"

n=0
manifest_shots=""
for i in "${!IDS[@]}"; do
  id="${IDS[$i]}"; src="${SRCS[$i]}"
  mkdir -p "$HERE/tmp/$id"
  ffmpeg -v error -i "$HERE/clips/$src.mp4" \
    -vf "fps=$FPS,scale=$WIDTH:-2" -fps_mode passthrough \
    -f image2 -c:v libwebp -quality $QUALITY \
    "$HERE/tmp/$id/%04d.webp"

  count=0
  for f in "$HERE/tmp/$id"/*.webp; do
    n=$((n+1)); count=$((count+1))
    cp "$f" "$OUT/$(printf 'f_%03d.webp' "$n")"
  done

  [ -n "$manifest_shots" ] && manifest_shots="$manifest_shots,"
  manifest_shots="$manifest_shots{\"id\":\"$id\",\"frames\":$count}"
  echo "  $id: $count frames"
done

printf '{"total":%d,"shots":[%s]}\n' "$n" "$manifest_shots" > "$OUT/manifest.json"

rm -rf "$HERE/tmp"
echo "TOTAL: $n frames, $(du -sh "$OUT" | cut -f1)"
