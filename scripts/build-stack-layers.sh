#!/usr/bin/env bash
#
# Derive the exploded-stack plates from `public/media/construction.jpg`.
#
# The BUILD chapter needs the four material layers of the garment as separate,
# transparent plates. The workspace has exactly one source for that content: the
# construction photograph, which is this jacket separated into its shell,
# membrane, insulation and lining. This script keys those four layers out of
# that single image — colour for the membrane, luminance bands for the shell,
# insulation and lining — and writes four PNGs that share one canvas, so they
# stay in perfect register when the stage separates them.
#
# This is a deterministic, idempotent derivation: re-running it against the same
# source produces byte-identical plates. The outputs are checked in under
# `public/media/layers/` because they are content, not build artifacts — the
# stage serves them directly.
#
# Usage: bash scripts/build-stack-layers.sh
set -euo pipefail

src="public/media/construction.jpg"
out="public/media/layers"
canvas="924x1240+240+80"   # the union of the four layers' bounding boxes, plus margin
width=900                  # served width; the source canvas is 924px

[ -f "$src" ] || { echo "missing $src" >&2; exit 1; }
mkdir -p "$out"

# Luminance and saturation expressions, kept in one place so the four keys are
# visibly the same maths with different thresholds.
luma="max(max(r,g),b)"
chroma="max(max(r,g),b)-min(min(r,g),b)"

key() {
  local name="$1" test="$2"
  echo "  · $name"
  convert "$src" -alpha off \
    -fx "$test ? 1 : 0" \
    -alpha off "/tmp/stack-$name-mask.png"
  # Colour comes from the source; opacity from the key.
  convert "$src" -alpha off "/tmp/stack-$name-mask.png" \
    -alpha off -compose CopyOpacity -composite \
    -crop "$canvas" +repage \
    -resize "${width}x" \
    -strip \
    -define png:compression-level=9 \
    "$out/$name.png"
}

echo "deriving stack plates from $src"
# Outer shell: neutral, mid-dark, and only in the upper band.
key shell     "$chroma < 0.10 && $luma > 0.045 && $luma < 0.45 && j < 480"
# Breathable membrane: the only saturated layer in the photograph.
key membrane  "$chroma > 0.075 && $luma > 0.14"
# Thermal insulation: neutral and mid-dark, between the membrane and the lining.
key thermal   "$chroma < 0.10 && $luma > 0.035 && $luma < 0.42 && j > 660 && j < 1160"
# Comfort lining: the bright neutral layer at the bottom of the stack.
key lining    "$chroma < 0.16 && $luma > 0.6 && j > 1120"

rm -f /tmp/stack-*-mask.png
ls -l "$out"
