#!/usr/bin/env bash
# Run during Cloudflare Pages / CI build with the LUMA_API_BASE env var set.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$ROOT/js/config.production.js"
BASE="${LUMA_API_BASE:?LUMA_API_BASE is not set}"
cat > "$TARGET" <<EOF
window.__LUMA_API_BASE__ = '${BASE}';
EOF
echo "Wrote $TARGET"
