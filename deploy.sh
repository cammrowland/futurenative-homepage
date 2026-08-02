#!/bin/bash
# Push a plain static site (HTML/CSS/JS) to GitHub Pages.
# Handles two layouts:
#   - Flat:        index.html at project root, .git at project root.
#   - FutureNative: blueprint files at project root (BRIEF.md, DESIGN.md, etc.),
#                   deployable site inside website/, .git at project root,
#                   Pages configured to serve from /website.
#
# Usage: ./deploy.sh ["commit message"]

set -euo pipefail
cd "$(dirname "$0")"
MSG="${1:-Update site}"

# .nojekyll must live at the directory Pages serves from. For the FutureNative
# layout that's website/; for the flat layout it's the project root.
if [ -d website ]; then
  touch website/.nojekyll
else
  touch .nojekyll
fi

if [ -z "$(git status --porcelain)" ]; then
  echo "No changes to publish."
  exit 0
fi
git add -A
git commit -m "$MSG"
git push origin main

echo "Deployed."
git remote get-url origin
