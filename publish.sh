
# save source changes

git add --all
git commit -m "update docs"
git push

# publish to pota.quack.uy

cd /mnt/Data/www/pota/pota.docs.cloudflare/

rm -f localhost.zip
rm -f extracted

mpa http://localhost:37808/

unzip localhost.zip -d ./extracted
npx wrangler pages deploy extracted --project-name=potahtml
