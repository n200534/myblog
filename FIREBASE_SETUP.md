# Firebase Setup Guide

## 🚀 Setting up Firebase Backend

### 1. Create a Firebase Project

1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Create a project" or "Add project"
3. Enter your project name (e.g., "security-blog")
4. Follow the setup wizard

### 2. Enable Authentication

1. In Firebase Console, go to "Authentication"
2. Click "Get started"
3. Go to "Sign-in method" tab
4. Enable "Email/Password" provider
5. Save the changes

### 3. Set up Firestore Database

1. In Firebase Console, go to "Firestore Database"
2. Click "Create database"
3. Choose "Start in test mode" (for development)
4. Select a location for your database
5. Click "Done"

### 4. Set up Storage (Optional)

1. In Firebase Console, go to "Storage"
2. Click "Get started"
3. Choose "Start in test mode" (for development)
4. Select a location for your storage
5. Click "Done"

### 5. Get Firebase Configuration

1. In Firebase Console, go to Project Settings (gear icon)
2. Scroll down to "Your apps" section
3. Click the web app icon (</>) to add a web app
4. Register your app with a nickname
5. Copy the configuration object

### 6. Configure Environment Variables

Create a `.env.local` file in your project root with the following variables:

```env
NEXT_PUBLIC_FIREBASE_API_KEY=your_api_key_here
NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN=your_project_id.firebaseapp.com
NEXT_PUBLIC_FIREBASE_PROJECT_ID=your_project_id
NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET=your_project_id.appspot.com
NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your_messaging_sender_id
NEXT_PUBLIC_FIREBASE_APP_ID=your_app_id
```

Replace the values with your actual Firebase configuration.

### 7. Firestore Security Rules

Update your Firestore security rules in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users can read all posts
    match /posts/{postId} {
      allow read: if true;
      allow write: if request.auth != null && request.auth.uid == resource.data.authorId;
    }
    
    // Users can only access their own user document
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### 8. Storage Security Rules (if using Storage)

Update your Storage security rules:

```javascript
rules_version = '2';
service firebase.storage {
  match /b/{bucket}/o {
    match /{allPaths=**} {
      allow read: if true;
      allow write: if request.auth != null;
    }
  }
}
```

### 9. Test the Setup

1. Run your development server: `npm run dev`
2. Try signing up with a new account
3. Create a blog post
4. Verify that data is stored in Firestore

## 🔧 Features Implemented

- ✅ **Firebase Authentication** - Email/password sign up and sign in
- ✅ **Firestore Database** - Store and retrieve blog posts
- ✅ **User Management** - User profiles and data
- ✅ **Real-time Updates** - Automatic data synchronization
- ✅ **Security Rules** - Proper access control

## 📁 Project Structure

```
src/
├── lib/
│   ├── firebase.ts      # Firebase configuration
│   ├── auth.ts          # Authentication services
│   └── posts.ts         # Blog post services
├── components/
│   ├── auth/            # Authentication components
│   └── ui/              # UI components
└── app/                 # Next.js pages
```

## 🚀 Next Steps

1. **Deploy to Production** - Set up proper security rules
2. **Add Image Upload** - Implement Firebase Storage
3. **Add Comments** - Extend the data model
4. **Add Likes/Bookmarks** - Implement social features
5. **Add Search** - Implement Algolia or similar
6. **Add Analytics** - Implement Firebase Analytics

## 🔒 Security Notes

- Always use proper security rules in production
- Never expose sensitive API keys
- Use environment variables for configuration
- Implement proper error handling
- Add rate limiting for production use

## 📚 Resources

- [Firebase Documentation](https://firebase.google.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Firebase Security Rules](https://firebase.google.com/docs/firestore/security/get-started) 