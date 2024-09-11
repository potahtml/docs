
:: save changes

call git add --all
call git commit -m "update docs"
call git push

call cpx -L -v ./src/** S:/www/quack.uy/client/pota.quack.uy/
call cpx -L -v ./node_modules/pota/** S:/www/quack.uy/client/pota.quack.uy/node_modules/pota/

:: save changes on pota.quack.uy

cd /D S:/www/quack.uy/client/pota.quack.uy/
call git add --all
call git commit -m "update pota docs"
call git push

cd /D S:/www/quack.uy/client/pota.quack.uy/
tar.exe -c -f ../pota.quack.uy.zip ./*
