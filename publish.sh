#!/usr/bin/env bash

# save source changes

git add --all
git commit -m "update docs"
git push

npm run build

npx wrangler pages deploy dist --project-name=potahtml
