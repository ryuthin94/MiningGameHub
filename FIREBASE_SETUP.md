# Firebase Setup Guide

This guide will help you set up Firebase for the Ayrton Mining Game.

## Step 1: Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project"
3. Enter a project name (e.g., "mining-game")
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Enable Authentication

1. In your Firebase project, click "Authentication" in the left sidebar
2. Click "Get started"
3. Click on the "Email/Password" provider
4. Enable "Email/Password"
5. Click "Save"

## Step 3: Enable Firestore Database

1. Click "Firestore Database" in the left sidebar
2. Click "Create database"
3. Select "Start in production mode" (we'll add rules later)
4. Choose a location close to your users
5. Click "Enable"

## Step 4: Set Up Firestore Security Rules

1. Go to the "Rules" tab in Firestore
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Players collection
    match /players/{userId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Leaderboard collection
    match /leaderboard/{userId} {
      allow read: if true;
      allow create: if request.auth != null && request.auth.uid == userId;
      allow update, delete: if request.auth != null && request.auth.uid == userId;
    }
    
    // Game state collection
    match /gameState/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

3. Click "Publish"

## Step 5: Get Your Firebase Configuration

1. Click the gear icon next to "Project Overview" → "Project settings"
2. Scroll down to "Your apps"
3. Click the web icon (`</>`) to add a web app
4. Register your app with a nickname (e.g., "Mining Game Web")
5. Don't enable Firebase Hosting
6. Click "Register app"
7. Copy your Firebase configuration object

It will look like this:

```javascript
{
  apiKey: "AIza...",
  authDomain: "your-project.firebaseapp.com",
  projectId: "your-project",
  storageBucket: "your-project.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef"
}
```

## Step 6: Enter Configuration in Game

1. Open the game in your browser
2. On the first screen, you'll be prompted to enter your Firebase configuration
3. Copy and paste each field from your Firebase config
4. Click "Initialize Game"

## Step 7: Create Your First Account

1. After entering Firebase config, you'll see the registration screen
2. Enter your email and password
3. Click "Register"
4. Choose your player name and avatar
5. Start playing!

## Optional: Set Up Indexes (for better performance)

If you plan to have many players, create these composite indexes:

1. Go to Firestore → Indexes
2. Create a composite index:
   - Collection ID: `leaderboard`
   - Fields to index:
     - `coins` (Descending)
     - `__name__` (Ascending)

3. Create another composite index:
   - Collection ID: `leaderboard`
   - Fields to index:
     - `maxDepth` (Descending)
     - `__name__` (Ascending)

## Troubleshooting

### "Firebase not initialized" error
- Make sure you've entered all configuration fields correctly
- Check your browser console for specific error messages

### "Permission denied" error
- Verify that Firestore security rules are set up correctly
- Make sure you're logged in to the app

### Users can't register
- Check that Email/Password authentication is enabled in Firebase Console
- Verify your Firebase configuration is correct

### Leaderboard not showing data
- Make sure Firestore is enabled
- Check that security rules allow read access to the leaderboard collection
- Verify that at least one player has saved their game data

## Support

If you encounter issues, check:
1. Browser console for error messages
2. Firebase Console → Authentication for user registration issues
3. Firebase Console → Firestore for data issues

For more help, refer to the [Firebase Documentation](https://firebase.google.com/docs).
