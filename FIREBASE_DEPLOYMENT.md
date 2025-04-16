# Firebase Deployment with GitHub Actions

This document explains how to set up and use the automated Firebase deployment workflow for the MovieExplorerExpo app.

## Prerequisites

1. A Firebase project
2. A GitHub repository for your project
3. GitHub Actions enabled on your repository

## Setup Instructions

### 1. Set up Firebase

If you haven't already, create a Firebase project:

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" and follow the setup wizard
3. Once your project is created, add a web app to it

### 2. Install Firebase CLI and Login

```bash
npm install -g firebase-tools
firebase login
```

### 3. Initialize Firebase in your project

This has already been done. The repository contains:
- `firebase.json` - Configuration for Firebase hosting
- `.firebaserc` - Project association file

### 4. Set up GitHub Secrets

You need to add the following secrets to your GitHub repository:

1. Go to your GitHub repository
2. Navigate to Settings > Secrets and variables > Actions
3. Add the following secrets:
   - `FIREBASE_TOKEN`: Generate with `firebase login:ci` command
   - `FIREBASE_PROJECT_ID`: Your Firebase project ID

### 5. Push to GitHub

Once you push your code to the main/master branch, the GitHub Actions workflow will:
1. Build your Expo app for web
2. Run tests
3. Deploy to Firebase Hosting

## Manual Deployment

If you want to deploy manually:

```bash
# Build the web version
npm run build:web

# Deploy to Firebase
npm run deploy
```

## Workflow Details

The GitHub Actions workflow is defined in `.github/workflows/firebase-deploy.yml` and includes:

- Checkout code
- Set up Node.js
- Install dependencies
- Run tests
- Build web app
- Deploy to Firebase

The workflow runs automatically on pushes to main/master branches and can also be triggered manually from the Actions tab in your GitHub repository.
