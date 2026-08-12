#!/usr/bin/env bash
# Cloudflare Pages / CI build adımında LUMA_API_BASE ortam değişkeni ile çalıştırın.
set -euo pipefail
ROOT="$(cd "$(dirname "$0")/.." && pwd)"
TARGET="$ROOT/js/config.production.js"
BASE="${LUMA_API_BASE:?LUMA_API_BASE tanımlı değil}"
cat > "$TARGET" <<EOF
window.__LUMA_API_BASE__ = '${BASE}';
EOF
echo "Wrote $TARGET"
