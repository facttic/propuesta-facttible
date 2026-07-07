#!/usr/bin/env bash
# Buildea la app y publica el contenido de dist/ en la rama gh-pages del remoto
# `origin`. GitHub Pages sirve esa rama, así que con esto queda online.
#
# Uso:  ./deploy.sh
set -euo pipefail
cd "$(dirname "$0")"

REMOTE="$(git remote get-url origin)"

echo "▸ Build de producción…"
npm run build

# .nojekyll evita que GitHub Pages ignore archivos que empiezan con "_".
touch dist/.nojekyll

echo "▸ Publicando dist/ en gh-pages…"
# Se arma un repo efímero dentro de dist/ y se hace force-push: gh-pages solo
# contiene el build, no tiene historia que preservar.
rm -rf dist/.git
git -C dist init -q
git -C dist add -A
git -C dist commit -qm "Deploy $(git rev-parse --short HEAD)"
git -C dist push -f "$REMOTE" HEAD:gh-pages
rm -rf dist/.git

echo "✓ Publicado. En ~1 min: https://facttic.github.io/propuesta-facttible/?for=<slug>"
