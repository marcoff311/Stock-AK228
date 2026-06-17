cd /d C:\Users\SURFACE LAP\Downloads\Stocks-AK228
if not exist .git mkdir .git
git add .
git commit -m "Initial commit - app de gestion des stocks"
git status --short
echo DONE
