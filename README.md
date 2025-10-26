# Ayrton Mining Game - Web Edition

A modern web-based version of the classic C mining game, featuring Firebase authentication, real-time leaderboards, and bilingual support (English/Thai).

## Features

- 🔐 **Firebase Authentication** - Secure user login and registration
- 👤 **Player Customization** - Choose your name and avatar
- 🎮 **Classic Mining Gameplay** - WASD controls, depth-based ore rarity
- 💎 **Ore Collection** - Coal, Iron, Gold, Diamond, and Crystal
- 🛒 **Shop System** - Upgrade pickaxe and energy capacity
- 🏆 **Leaderboards** - Compete with other players
- 🌍 **Bilingual Support** - Full Thai and English translations
- 🎨 **Kid-Friendly Design** - Colorful, modern UI with smooth animations
- 💾 **Cloud Save** - Game progress saved to Firebase Firestore

## Setup Instructions

### 1. Firebase Configuration

1. Create a Firebase project at [firebase.google.com](https://firebase.google.com)
2. Enable **Authentication** (Email/Password provider)
3. Enable **Firestore Database**
4. Get your Firebase config from Project Settings

### 2. Running Locally

```bash
npm install
npm run dev
```

The game will prompt you to enter your Firebase configuration on first run.

### 3. Building for Production

```bash
npm run build
```

The build output will be in `dist/public/`.

## Deploying to GitHub Pages

### Method 1: Manual Deployment

1. Build the project:
```bash
npm run build
```

2. The built files will be in `dist/public/`

3. Create a `gh-pages` branch:
```bash
git checkout --orphan gh-pages
git rm -rf .
cp -r dist/public/* .
git add .
git commit -m "Deploy to GitHub Pages"
git push origin gh-pages
```

4. Go to your repository settings → Pages → Set source to `gh-pages` branch

### Method 2: GitHub Actions (Automated)

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to GitHub Pages

on:
  push:
    branches: [ main ]

jobs:
  build-and-deploy:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v3
      
      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '20'
          
      - name: Install dependencies
        run: npm ci
        
      - name: Build
        run: npm run build
        env:
          GITHUB_PAGES: true
        
      - name: Deploy to GitHub Pages
        uses: peaceiris/actions-gh-pages@v3
        with:
          github_token: ${{ secrets.GITHUB_TOKEN }}
          publish_dir: ./dist/public
```

Then enable GitHub Pages in your repository settings.

## Firebase Security Rules

### Firestore Rules

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /players/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /leaderboard/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    match /gameState/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## Game Controls

- **W / ↑** - Move Up
- **A / ←** - Move Left
- **S / ↓** - Move Down
- **D / →** - Move Right
- **ESC** - Open Menu

## Ore Values

- Coal (C): 2 coins
- Iron (I): 5 coins
- Gold (G): 12 coins
- Diamond (D): 40 coins
- Crystal (X): 80 coins

## Shop Prices

- Upgrade Pickaxe: 50 + (30 × (level - 1)) coins
- Increase Energy: 60 coins (+20 energy)

## Credits

Based on the original C mining game by **Ayrton**

License: Creative Commons Attribution-NonCommercial-ShareAlike 4.0 International (CC BY-NC-SA 4.0)

## Support

For issues or questions, please open an issue on GitHub.
#
