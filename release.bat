
:: save changes

rem call git add --all
rem call git commit -m "update docs"
rem call git push

call cpx -L ./** S:/www/quack.uy/client/pota.quack.uy/

:: save changes on pota.quack.uy

cd /D S:/www/quack.uy/client/pota.quack.uy/
call git add --all
call git commit -m "update pota docs"
call git push