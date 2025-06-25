@echo off
REM Gyanhive Static Site - GitHub Setup Script (Windows)
REM This script helps you set up your repository for GitHub Pages deployment

echo 🚀 Gyanhive A-Levels Institute - GitHub Setup
echo ==============================================

REM Check if git is installed
git --version >nul 2>&1
if errorlevel 1 (
    echo ❌ Git is not installed. Please install Git first.
    pause
    exit /b 1
)

REM Get GitHub username
set /p github_username="Enter your GitHub username: "

if "%github_username%"=="" (
    echo ❌ GitHub username is required.
    pause
    exit /b 1
)

REM Update package.json with GitHub username (Windows version)
echo 📝 Updating package.json with your GitHub username...
powershell -Command "(Get-Content package.json) -replace 'yourusername', '%github_username%' | Set-Content package.json"

REM Initialize git repository
echo 🔧 Initializing Git repository...
git init

REM Add all files
echo 📁 Adding files to Git...
git add .

REM Initial commit
echo 💾 Creating initial commit...
git commit -m "Initial commit: Gyanhive A-Levels Institute with Role-Based Access Control"

REM Add remote repository
echo 🔗 Adding remote repository...
git remote add origin https://github.com/%github_username%/gyanhive-static-site.git

REM Push to GitHub
echo 🚀 Pushing to GitHub...
git push -u origin main

echo.
echo ✅ Setup complete!
echo.
echo 📋 Next steps:
echo 1. Go to https://github.com/%github_username%/gyanhive-static-site
echo 2. Go to Settings → Pages
echo 3. Source: 'Deploy from a branch'
echo 4. Branch: 'main' → '/ (root)'
echo 5. Click Save
echo.
echo 🌐 Your site will be live at:
echo    https://%github_username%.github.io/gyanhive-static-site
echo.
echo 🔐 Test login credentials:
echo    Student: john_student / pass123
echo    Teacher: dr_brown / teach123
echo    Admin: admin / admin123
echo.
echo 📖 For detailed instructions, see DEPLOYMENT.md
pause 