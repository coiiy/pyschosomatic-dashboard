# 🚀 Pyschosomatic Admin Dashboard - GitHub Pages Deployment Guide

## Step-by-Step Deployment Instructions

### 1. Create a GitHub Repository

1. Go to [GitHub](https://github.com) and log in
2. Click the "+" icon in the top right → "New repository"
3. Name it: `pyschosomatic-dashboard`
4. Keep it **Public** (required for free GitHub Pages)
5. **Don't** initialize with README, .gitignore, or license
6. Click "Create repository"

### 2. Update package.json with Your GitHub Username

Open `package.json` and replace `YOUR_GITHUB_USERNAME` with your actual GitHub username:

```json
"homepage": "https://YOUR_GITHUB_USERNAME.github.io/pyschosomatic-dashboard"
```

For example, if your username is `harraz`, it should be:
```json
"homepage": "https://harraz.github.io/pyschosomatic-dashboard"
```

### 3. Initialize Git and Push to GitHub

Run these commands in the terminal (in the admin-dashboard folder):

```powershell
# Initialize Git
git init

# Add all files
git add .

# Commit
git commit -m "Initial commit - Pyschosomatic Dashboard"

# Add your GitHub repository (replace YOUR_USERNAME)
git remote add origin https://github.com/YOUR_USERNAME/pyschosomatic-dashboard.git

# Push to GitHub
git branch -M main
git push -u origin main
```

### 4. Deploy to GitHub Pages

```powershell
npm run deploy
```

This command will:
- Build your React app
- Create a `gh-pages` branch
- Push the built files to GitHub Pages

### 5. Enable GitHub Pages (if not automatic)

1. Go to your GitHub repository
2. Click "Settings" tab
3. Scroll to "Pages" section
4. Under "Source", select branch: `gh-pages` and folder: `/ (root)`
5. Click "Save"

### 6. Access Your Live Website

After 2-3 minutes, your website will be live at:
```
https://YOUR_GITHUB_USERNAME.github.io/pyschosomatic-dashboard
```

---

## 🔄 Updating Your Website

Whenever you make changes and want to update the live site:

```powershell
# Save and commit changes
git add .
git commit -m "Update dashboard"
git push origin main

# Deploy new version
npm run deploy
```

---

## ⚠️ Important Notes

1. **Firebase Security**: Your Firebase database URL is in the code. Make sure your Firebase rules are properly configured!

2. **Admin Credentials**: The admin password hash is committed. Consider using environment variables for production.

3. **First Deployment**: Takes 2-5 minutes to go live

4. **Updates**: Usually reflect within 1-2 minutes

---

## 🎯 Your Website URLs

- **Production**: `https://YOUR_USERNAME.github.io/pyschosomatic-dashboard`
- **Local Development**: `http://localhost:3000`

---

## 💡 Pro Tips

1. **Custom Domain**: You can add a custom domain in GitHub Pages settings
2. **HTTPS**: GitHub Pages automatically provides HTTPS
3. **Free Hosting**: Completely free forever on GitHub Pages!

---

Need help? Check the troubleshooting section below or reach out!
