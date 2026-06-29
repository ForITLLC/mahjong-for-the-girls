#!/usr/bin/env python3
"""
Mint every QR code on the site as a BRANDED, self-verifying SVG.

Each code is stylized to match the brand instead of the stock black-on-white
square: softly rounded modules in deep pine, rounded "eye" finders in deep sage,
a proper quiet zone, and a center brand tile (馬 in pine inside a seasonal accent
ring). Error-correction level H gives a ~30% redundancy budget, so the center
tile never threatens a real scan.

The styling parameters below were tuned empirically: rounder/gappier "dots" look
nice but fall off a cliff where decoders can no longer lock onto the module grid.
These values sit comfortably inside the readable zone.

VERIFICATION — we ship nothing we haven't proven readable, two independent ways:
  1. Structural (deterministic): rasterize the SVG, sample every module's center,
     reconstruct the bit matrix, and require it to match the intended QR exactly
     on all data modules (finder + logo cells excepted — the logo is recovered by
     ECC). This proves the payload bits are rendered faithfully.
  2. End-to-end: rasterize at several sizes and decode with OpenCV's two QR
     detectors; require at least one to read back the exact URL.
If any code fails either check, the script writes NOTHING and exits non-zero.

Re-run whenever the poster set or a target URL changes:

    python3 scripts/gen-qr.py
"""
import json
import os
import subprocess
import sys
import tempfile

import cv2
import qrcode
from qrcode.constants import ERROR_CORRECT_H

ROOT = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))

# 馬 brand mark as a baked vector outline (Songti serif, extracted once) so the
# center mark renders identically everywhere — no CJK font needed on the viewer's
# device or printer. Y-up font units; we flip + scale it into the tile below.
_MA = json.load(open(os.path.join(os.path.dirname(os.path.abspath(__file__)),
                                  "ma-glyph.json")))

# --- brand palette ---------------------------------------------------------
INK = "#2f4138"     # deep pine — data modules + 馬 glyph
EYE = "#436a57"     # deep sage — finder eyes
FIELD = "#ffffff"   # QR light field — max contrast for reliable scans

# --- geometry (empirically tuned: rounded but robustly decodable) ----------
QUIET = 4           # quiet-zone modules (spec minimum)
COVER = 0.95        # module fill fraction (subtle gap → soft look)
RX = 0.28           # module corner radius (fraction of a module)
EYE_RX = 1.4        # finder-eye corner radius (modules)
LOGO_FRAC = 0.13    # center brand-tile size, as a fraction of the QR width
TILE_PAD = 0.40     # tile bleed beyond the logo window (<0.5 → never covers a
                    # neighbor module's center, so data fidelity stays perfect)


def ma_glyph(cx, cy, target):
    """馬 outline, scaled to `target` modules wide/tall and centered at (cx, cy)."""
    xmin, ymin, xmax, ymax = _MA["bbox"]
    gw, gh = xmax - xmin, ymax - ymin
    s = target / max(gw, gh)
    gcx, gcy = xmin + gw / 2, ymin + gh / 2
    return (
        f'<g transform="translate({cx:.3f} {cy:.3f}) scale({s:.5f} {-s:.5f}) '
        f'translate({-gcx:.3f} {-gcy:.3f})"><path d="{_MA["path"]}" fill="{INK}"/></g>'
    )


def finder_origins(n):
    """Top-left (row, col) of each 7x7 finder pattern."""
    return [(0, 0), (0, n - 7), (n - 7, 0)]


def in_finder(r, c, n):
    return any(r0 <= r < r0 + 7 and c0 <= c < c0 + 7 for r0, c0 in finder_origins(n))


def rrect(x, y, w, h, rad, fill=None, stroke=None, sw=0.0):
    s = (
        f' fill="none" stroke="{stroke}" stroke-width="{sw:.3f}"'
        if stroke
        else f' fill="{fill}"'
    )
    return (
        f'<rect x="{x:.3f}" y="{y:.3f}" width="{w:.3f}" height="{h:.3f}" '
        f'rx="{rad:.3f}" ry="{rad:.3f}"{s}/>'
    )


def logo_window(n):
    lg = max(7, round(n * LOGO_FRAC))
    if lg % 2 == 0:
        lg += 1
    return (n - lg) // 2, lg          # (origin row==col, size)


def build_svg(url, accent):
    qr = qrcode.QRCode(error_correction=ERROR_CORRECT_H, border=0, box_size=1)
    qr.add_data(url)
    qr.make(fit=True)
    m = qr.get_matrix()               # n x n booleans, no border
    n = len(m)
    q = QUIET
    dim = n + 2 * q
    lo, lg = logo_window(n)

    def in_logo(r, c):
        return lo <= r < lo + lg and lo <= c < lo + lg

    p = [
        f'<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 {dim} {dim}" '
        f'shape-rendering="geometricPrecision" role="img" aria-label="Scan to RSVP">',
        rrect(0, 0, dim, dim, 0, fill=FIELD),     # white field incl. quiet zone
    ]

    # data modules (skip finder + logo windows)
    off = (1 - COVER) / 2
    for r in range(n):
        row = m[r]
        for c in range(n):
            if not row[c] or in_finder(r, c, n) or in_logo(r, c):
                continue
            p.append(rrect(q + c + off, q + r + off, COVER, COVER, RX * COVER, fill=INK))

    # finder eyes: rounded outer ring + rounded pupil
    for r0, c0 in finder_origins(n):
        ox, oy = q + c0, q + r0
        p.append(rrect(ox + 0.08, oy + 0.08, 6.84, 6.84, EYE_RX, fill=EYE))
        p.append(rrect(ox + 1.08, oy + 1.08, 4.84, 4.84, EYE_RX * 0.7, fill=FIELD))
        p.append(rrect(ox + 2.00, oy + 2.00, 3.00, 3.00, EYE_RX * 0.5, fill=INK))

    # center brand tile: white rounded tile + seasonal accent ring + 馬
    tx, ty = q + lo - TILE_PAD, q + lo - TILE_PAD
    tw = lg + 2 * TILE_PAD
    p.append(rrect(tx, ty, tw, tw, tw * 0.24, fill=FIELD))
    p.append(rrect(tx + 0.28, ty + 0.28, tw - 0.56, tw - 0.56, (tw - 0.56) * 0.22,
                   stroke=accent, sw=0.55))
    cx = cy = q + lo + lg / 2
    p.append(ma_glyph(cx, cy, lg * 0.72))
    p.append("</svg>")
    return "\n".join(p), m, n, lo, lg


def _rasterize(svg, width):
    with tempfile.TemporaryDirectory() as d:
        sp = os.path.join(d, "q.svg")
        with open(sp, "w") as f:
            f.write(svg)
        pp = os.path.join(d, "q.png")
        subprocess.run(
            ["cairosvg", sp, "-o", pp, "--output-width", str(width),
             "--output-height", str(width)],
            check=True, capture_output=True,
        )
        return cv2.imread(pp), cv2.imread(pp, cv2.IMREAD_GRAYSCALE)


def structural_errors(svg, m, n, lo, lg, scale=16):
    """Deterministic: do the rendered module centers match the intended bits?"""
    dim = n + 2 * QUIET
    _, gray = _rasterize(svg, dim * scale)
    bad = 0
    for r in range(n):
        for c in range(n):
            if in_finder(r, c, n) or (lo <= r < lo + lg and lo <= c < lo + lg):
                continue
            cy = int((QUIET + r + 0.5) * scale)
            cx = int((QUIET + c + 0.5) * scale)
            if (gray[cy, cx] < 128) != bool(m[r][c]):
                bad += 1
    return bad


_CLASSIC = cv2.QRCodeDetector()
_ARUCO = cv2.QRCodeDetectorAruco()


def real_decodes(svg, url):
    """End-to-end: how many (scale, detector) combos read back the exact URL?"""
    hits = 0
    for w in (1100, 1400, 1700, 2000, 2400, 3000):
        color, _ = _rasterize(svg, w)
        if color is None:
            continue
        for det in (_CLASSIC, _ARUCO):
            try:
                data, _, _ = det.detectAndDecode(color)
            except cv2.error:
                data = ""
            if data == url:
                hits += 1
                break
    return hits


# --- jobs: every QR on the site -------------------------------------------
POSTER_BASE = ("https://mahjongforthegirls.com/"
               "?utm_source=poster&utm_medium=qr&utm_campaign={id}#events")
POSTERS = [  # keep in sync with app/data/posters.ts (id, accent)
    ("summer-2026", "#ff7a3c"),
    ("disco", "#ffd15c"),
    ("wild", "#ff5fa0"),
    ("brunch", "#f5803a"),
]
# Shared print QR (invite + cards + learn guide). URL unchanged from the PNG it
# replaces, so GA4 attribution is preserved.
EVENTS_URL = ("https://www.mahjongforthegirls.com/"
              "?utm_source=qr&utm_medium=print&utm_campaign=invite#events")
EVENTS_ACCENT = "#ec7c63"  # brand coral-deep


def main():
    jobs = [(POSTER_BASE.format(id=i), a, f"public/img/posters/qr/{i}.svg")
            for i, a in POSTERS]
    jobs.append((EVENTS_URL, EVENTS_ACCENT, "public/img/qr-events.svg"))

    built, ok = [], True
    for url, accent, out in jobs:
        svg, m, n, lo, lg = build_svg(url, accent)
        serr = structural_errors(svg, m, n, lo, lg)
        reads = real_decodes(svg, url)
        passed = serr == 0 and reads >= 1
        ok = ok and passed
        print(f"  [{'OK ' if passed else 'FAIL'}] {out:34s} "
              f"struct_err={serr}  real_reads={reads}/6")
        if not passed:
            print(f"         wanted: {url}")
        built.append((out, svg))

    if not ok:
        print("\nAborted — a QR failed verification. Nothing written.", file=sys.stderr)
        return 1

    for out, svg in built:
        path = os.path.join(ROOT, out)
        os.makedirs(os.path.dirname(path), exist_ok=True)
        with open(path, "w") as f:
            f.write(svg)
    print(f"\nDone: {len(built)} branded QR codes minted, "
          f"structurally verified, and decode-confirmed.")
    return 0


if __name__ == "__main__":
    sys.exit(main())
