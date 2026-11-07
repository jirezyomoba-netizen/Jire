#!/usr/bin/env bash
# Builds the deployable site: site/index.html (full document) next to site/media/.
# Drag the "site" folder onto https://app.netlify.com/drop to publish it.
set -euo pipefail
cd "$(dirname "$0")"
{
  printf '<!doctype html>\n<html lang="en">\n<head>\n<meta charset="utf-8">\n'
  printf '<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">\n'
  printf '<meta name="site-live" content="netlify">\n'
  printf '<style>:root{padding-top:env(safe-area-inset-top,0px);padding-bottom:env(safe-area-inset-bottom,0px)}body{margin:0}img{max-width:100%%}[hidden]{display:none!important}</style>\n'
  printf '</head>\n<body>\n'
  cat page.html
  printf '\n</body>\n</html>\n'
} > site/index.html
echo "built site/index.html"
