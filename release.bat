
:: save changes

call git add --all
call git commit -m "update docs"
call git push

call cpx -L ./** S:/www/quack.uy/client/pota.quack.uy/

:: save changes on pota.quack.uy

cd /D S:/www/quack.uy/client/pota.quack.uy/
call git add --all
call git commit -m "update pota docs"
call git push