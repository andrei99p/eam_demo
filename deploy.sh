#!/usr/bin/env sh

set -e

npm run build

cd dist

git init
git add -A
git commit -m "deployment"
git push -f git@github.com:eam-demo/eam-demo.git master:gh-pages

cd -