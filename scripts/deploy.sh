#!/usr/bin/env bash
# Build the site and publish dist/ to the gh-pages branch (GitHub Pages source).
set -euo pipefail
cd "$(dirname "$0")/.."
REMOTE_URL="$(git remote get-url origin)"
npm run build
touch dist/.nojekyll   # keep _astro/ (underscore folder) from being dropped by Jekyll
TMP="$(mktemp -d)"
cp -R dist/. "$TMP"
cd "$TMP"
git init -q -b gh-pages
git add -A
git -c user.name="$(git -C "$OLDPWD" config user.name)" -c user.email="$(git -C "$OLDPWD" config user.email)" \
  commit -q -m "Deploy $(git -C "$OLDPWD" rev-parse --short HEAD)"
git push -q -f "$REMOTE_URL" gh-pages
cd - >/dev/null
rm -rf "$TMP"
echo "Deployed to gh-pages"
