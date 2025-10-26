# GitHub Pages Deployment Guide

This guide explains how to deploy the Ayrton Mining Game to GitHub Pages.

## Quick Deployment (Recommended)

### Option 1: Using the GitHub Actions Workflow

1. **Push your code to GitHub:**
```bash
git add .
git commit -m "Deploy mining game"
git push origin main
```

2. **Enable GitHub Pages:**
   - Go to your repository settings
   - Navigate to "Pages" in the sidebar
   - Under "Source", select "GitHub Actions"

3. **The workflow will automatically:**
   - Build your application
   - Deploy to GitHub Pages
   - Your game will be available at: `https://yourusername.github.io/repository-name/`

### Option 2: Manual Build and Deploy

1. **Build the project:**
```bash
npm run build
```

2. **The build output is in `dist/public/`**

3. **Deploy using GitHub Pages:**

**Method A: Using gh-pages package**
```bash
npm install -g gh-pages
gh-pages -d dist/public
```

**Method B: Using git directly**
```bash
# Create gh-pages branch
git checkout --orphan gh-pages

# Remove all files
git rm -rf .

# Copy build files
cp -r dist/public/* .

# Commit and push
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages --force

# Go back to main branch
git checkout main
```

4. **Configure GitHub Pages:**
   - Go to repository settings → Pages
   - Set source to `gh-pages` branch
   - Your site will be published at `https://yourusername.github.io/repository-name/`

## Important Notes

### Base Path Configuration

Since vite.config.ts cannot be modified in this environment, you have two options:

**Option 1: Root deployment**
- Deploy to a custom domain or root of your GitHub Pages
- No base path needed
- Access at: `https://yourusername.github.io/`

**Option 2: Subdirectory deployment**
- If deploying to a subdirectory (e.g., `/mining-game/`), you'll need to:
  1. Fork/clone this repo to your local machine
  2. Update `vite.config.ts` to include: `base: '/your-repo-name/'`
  3. Build and deploy from your local machine

### Firebase Configuration

Remember to:
1. Set up your Firebase project first (see FIREBASE_SETUP.md)
2. Users will need to enter Firebase config on first visit
3. The config is stored in browser localStorage

## Verifying Deployment

1. Visit your GitHub Pages URL
2. You should see the Firebase setup screen
3. Enter your Firebase configuration
4. Create an account and start playing!

## Troubleshooting

### "Page not found" errors
- Make sure GitHub Pages is enabled in repository settings
- Check that the deployment source is correct
- Wait a few minutes for GitHub to process the deployment

### Assets not loading
- Check browser console for CORS errors
- Verify all paths are relative (no absolute paths starting with `/`)
- Make sure base path in vite config matches your deployment URL

### Firebase errors
- Verify Firebase configuration is correct
- Check Firebase Console for authentication and Firestore setup
- Review FIREBASE_SETUP.md for proper configuration

## Alternative Deployment Options

### Deploy to Netlify
1. Connect your GitHub repository to Netlify
2. Build command: `npm run build`
3. Publish directory: `dist/public`
4. Deploy!

### Deploy to Vercel
1. Import your GitHub repository to Vercel
2. Build command: `npm run build`
3. Output directory: `dist/public`
4. Deploy!

### Deploy to Firebase Hosting
```bash
npm install -g firebase-tools
firebase login
firebase init hosting
# Select dist/public as public directory
firebase deploy
```

## Support

For deployment issues:
1. Check GitHub Actions logs (if using automated deployment)
2. Verify build completes successfully locally
3. Check browser console for errors
4. Review Firebase Console for backend issues
