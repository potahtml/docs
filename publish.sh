
# save source changes

git add --all
git commit -m "update docs"
git push

# publish to pota.quack.uy

cd /mnt/Data/www/pota/pota.docs.cloudflare/

rm -f localhost.zip

mpa http://localhost:37808/
