# GitHub Pages Deployment Guide

This guide will help you deploy the Gyanhive A-Levels Institute website to GitHub Pages.

## 🚀 Quick Setup

### 1. Create GitHub Repository

1. Go to [GitHub](https://github.com) and sign in
2. Click the "+" icon and select "New repository"
3. Name your repository: `gyanhive-static-site`
4. Make it **Public** (required for free GitHub Pages)
5. Don't initialize with README (we already have one)
6. Click "Create repository"

### 2. Upload Your Files

#### Option A: Using GitHub Desktop
1. Download and install [GitHub Desktop](https://desktop.github.com/)
2. Clone your repository
3. Copy all project files to the repository folder
4. Commit and push to GitHub

#### Option B: Using Git Command Line
```bash
# Initialize git repository
git init

# Add all files
git add .

# Commit changes
git commit -m "Initial commit: Gyanhive A-Levels Institute"

# Add remote repository (replace YOUR_USERNAME with your GitHub username)
git remote add origin https://github.com/YOUR_USERNAME/gyanhive-static-site.git

# Push to GitHub
git push -u origin main
```

#### Option C: Using GitHub Web Interface
1. Go to your repository on GitHub
2. Click "Add file" → "Upload files"
3. Drag and drop all project files
4. Add commit message: "Initial commit: Gyanhive A-Levels Institute"
5. Click "Commit changes"

### 3. Enable GitHub Pages

1. Go to your repository on GitHub
2. Click "Settings" tab
3. Scroll down to "Pages" section
4. Under "Source", select "Deploy from a branch"
5. Choose "main" branch and "/ (root)" folder
6. Click "Save"

### 4. Configure Repository Settings

Update the following files with your actual GitHub username:

#### Update `package.json`:
```json
{
  "repository": {
    "url": "https://github.com/YOUR_USERNAME/gyanhive-static-site.git"
  },
  "homepage": "https://YOUR_USERNAME.github.io/gyanhive-static-site"
}
```

#### Update `README.md`:
Replace all instances of `yourusername` with your actual GitHub username.

### 5. Wait for Deployment

- GitHub Pages will automatically build and deploy your site
- It may take 5-10 minutes for the first deployment
- You'll see a green checkmark when deployment is complete
- Your site will be available at: `https://YOUR_USERNAME.github.io/gyanhive-static-site`

## 🔧 Custom Domain (Optional)

If you have a custom domain:

1. Add your domain to the `CNAME` file:
   ```
   yourdomain.com
   ```

2. In GitHub repository settings:
   - Go to "Pages" section
   - Add your custom domain
   - Enable "Enforce HTTPS"

3. Configure DNS with your domain provider:
   - Add CNAME record pointing to `YOUR_USERNAME.github.io`

## 📁 File Structure for GitHub Pages

Your repository should look like this:
```
gyanhive-static-site/
├── .github/
│   └── workflows/
│       └── deploy.yml
├── index.html
├── login.html
├── student.html
├── teacher.html
├── admin.html
├── auth.js
├── student-dashboard.js
├── teacher-dashboard.js
├── admin-dashboard.js
├── style.css
├── script.js
├── about.html
├── classes.html
├── contact.html
├── faq.html
├── [other subject pages...]
├── 404.html
├── CNAME
├── .gitignore
├── package.json
├── README.md
└── DEPLOYMENT.md
```

## 🔄 Automatic Deployment

The included GitHub Actions workflow (`.github/workflows/deploy.yml`) will:
- Automatically deploy on every push to main branch
- Build and deploy to GitHub Pages
- Handle pull requests for testing

## 🧪 Testing Your Deployment

1. **Test the main site**: Visit your GitHub Pages URL
2. **Test login functionality**:
   - Go to `/login.html`
   - Use test credentials:
     - Student: `john_student` / `pass123`
     - Teacher: `dr_brown` / `teach123`
     - Admin: `admin` / `admin123`
3. **Test all dashboards**: Verify each role works correctly
4. **Test responsive design**: Check on mobile devices

## 🐛 Troubleshooting

### Common Issues:

1. **Site not loading**:
   - Check if repository is public
   - Verify GitHub Pages is enabled
   - Wait 10-15 minutes for initial deployment

2. **Login not working**:
   - Check browser console for errors
   - Verify all JavaScript files are uploaded
   - Test localStorage functionality

3. **Styling issues**:
   - Check if CSS files are properly linked
   - Verify file paths are correct
   - Clear browser cache

4. **404 errors**:
   - Check file names and paths
   - Verify all files are committed
   - Check GitHub Pages settings

### Getting Help:

- Check GitHub Pages documentation: https://pages.github.com/
- Review GitHub Actions logs in your repository
- Test locally first: `python -m http.server 8000`

## 🔒 Security Notes

Remember that this is a client-side only implementation:
- All data is stored in browser localStorage
- No server-side validation
- Suitable for demonstration and prototyping
- For production use, implement proper backend security

## 📞 Support

For deployment issues:
- Email: gyanhive74@gmail.com
- GitHub Issues: Create an issue in your repository
- Documentation: Check this README and DEPLOYMENT.md

---

**Your site will be live at**: `https://YOUR_USERNAME.github.io/gyanhive-static-site` 