
:: save changes
git add --all
git commit -m "update"


:: build docs
call npm run build

call cpx "./src/public/pota.standalone.js" "./dist/public/"
call cpx "./src/public/pota.standalone.js.map" "./dist/public/"
call cpx "./src/public/favicon.ico" "./dist/public/"
call cpx "./src/public/quack.png" "./dist/public/"
call cpx "./src/public/video.mp4" "./dist/public/"
call cpx "./src/public/flair.css" "./dist/public/"
call cpx "./src/public/logo.svg" "./dist/public/"

:: delete published docs
call rmdir "S:/www/quack.uy/client/pota.quack.uy/" /s /q

:: copy new docs to public folder
call robocopy "S:/www/npm/pota.docs/" "S:/www/quack.uy/client/pota.quack.uy/" /S /XD "node_modules" ".git" /XF ".gitignore"

:: commit and push
cd "S:/www/quack.uy/client/pota.quack.uy/"
call git add --all
call git commit -m "update"
call git push
call exit