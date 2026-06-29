#!/usr/bin/env bash
# Generate the per-season QR codes for the seasonal posters.
#
# Each poster carries a MONTHLY ATTRIBUTION QR: the campaign is the poster id,
# so every season's scans are attributed separately in GA4 — the same UTM
# convention the /invite and /card printables already use
# (utm_medium=qr, #events deep-link onto the calendar).
#
# QRs are committed as static SVGs (crisp at any size, tiny, no build-time
# dependency) under public/img/posters/qr/<id>.svg. Re-run this whenever the
# poster set changes. Uses `npx qrcode` — nothing to install.
#
#   ./scripts/gen-poster-qr.sh
set -euo pipefail
cd "$(dirname "$0")/.."

BASE="https://mahjongforthegirls.com/"
OUT="public/img/posters/qr"
mkdir -p "$OUT"

# Keep in sync with app/data/posters.ts (the `id` of each poster).
IDS=(summer-2026 disco wild brunch)

for id in "${IDS[@]}"; do
  url="${BASE}?utm_source=poster&utm_medium=qr&utm_campaign=${id}#events"
  npx --yes qrcode -t svg -o "${OUT}/${id}.svg" "$url"
  echo "  ${id} -> ${url}"
done

echo "Done: ${#IDS[@]} QR codes in ${OUT}"
