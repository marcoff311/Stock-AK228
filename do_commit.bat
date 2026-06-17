@echo off
cd /d C:\Users\SURFACE LAP\Downloads\Stocks-AK228
git config user.name "Stocks User"
git config user.email "stocks@example.com"
if exist .gitignore (echo .gitignore exists) else (echo .gitignore missing)
git add .gitignore
rem add everything else
git add .
git commit -m "Initial commit - app de gestion des stocks"
git status --short
echo DONE
