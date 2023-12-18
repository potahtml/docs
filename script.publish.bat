
:: save changes

call npm version patch

call git add --all
call git commit -m "update"
call git push

