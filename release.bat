
:: save source changes

call git add --all
call git commit -m "update docs"
call git push

:: publish to pota.quack.uy

cd /D S:/www/pota.docs.cloudflare/

del localhost.zip

call mpa http://localhost:11433/


:: tar -c -f ../pota.quack.uy.zip ./*
:: tar -xf localhost.zip

:: call cpx -L -v ./src/** S:/www/quack.uy/client/pota.quack.uy/
:: call cpx -L -v ./node_modules/pota/**/!(node_modules) S:/www/quack.uy/client/pota.quack.uy/node_modules/pota/
