#!/usr/bin/env bash

# save source changes

git add --all
git commit -m "update docs"
git push

# publish to pota.quack.uy

rm -f localhost.zip
rm -Rf extracted/

npx mpa http://localhost:1340/

unzip localhost.zip -d ./extracted

rm mpa/state.json

npx wrangler pages deploy extracted --project-name=potahtml
