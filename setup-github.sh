#!/bin/bash

# Gyanhive Static Site - GitHub Setup Script
# This script helps you set up your repository for GitHub Pages deployment

echo "🚀 Gyanhive A-Levels Institute - GitHub Setup"
echo "=============================================="

# Check if git is installed
if ! command -v git &> /dev/null; then
    echo "❌ Git is not installed. Please install Git first."
    exit 1
fi

# Get GitHub username
read -p "Enter your GitHub username: " github_username

if [ -z "$github_username" ]; then
    echo "❌ GitHub username is required."
    exit 1
fi

# Update package.json with GitHub username
echo "📝 Updating package.json with your GitHub username..."
sed -i "s/yourusername/$github_username/g" package.json

# Initialize git repository
echo "🔧 Initializing Git repository..."
git init

# Add all files
echo "📁 Adding files to Git..."
git add .

# Initial commit
echo "💾 Creating initial commit..."
git commit -m "Initial commit: Gyanhive A-Levels Institute with Role-Based Access Control"

# Add remote repository
echo "🔗 Adding remote repository..."
git remote add origin https://github.com/$github_username/gyanhive-static-site.git

# Push to GitHub
echo "🚀 Pushing to GitHub..."
git push -u origin main

echo ""
echo "✅ Setup complete!"
echo ""
echo "📋 Next steps:"
echo "1. Go to https://github.com/$github_username/gyanhive-static-site"
echo "2. Go to Settings → Pages"
echo "3. Source: 'Deploy from a branch'"
echo "4. Branch: 'main' → '/ (root)'"
echo "5. Click Save"
echo ""
echo "🌐 Your site will be live at:"
echo "   https://$github_username.github.io/gyanhive-static-site"
echo ""
echo "🔐 Test login credentials:"
echo "   Student: john_student / pass123"
echo "   Teacher: dr_brown / teach123"
echo "   Admin: admin / admin123"
echo ""
echo "📖 For detailed instructions, see DEPLOYMENT.md" 