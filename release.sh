
:: save source changes

git add --all
git commit -m "update docs"
git push

:: publish to pota.quack.uy

cd /mnt/Data/www/pota/pota.docs.cloudflare/

rm -f localhost.zip

mpa http://localhost:37808/


:: tar -c -f ../pota.quack.uy.zip ./*
:: tar -xf localhost.zip

:: call cpx -L -v ./src/** S:/www/quack.uy/client/pota.quack.uy/
:: call cpx -L -v ./node_modules/pota/**/!(node_modules) S:/www/quack.uy/client/pota.quack.uy/node_modules/pota/
