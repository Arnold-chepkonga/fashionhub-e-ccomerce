# Firebase Setup Guide for FashionHub

This guide will help you set up Firebase for the FashionHub e-commerce app.

## Prerequisites

- Node.js and npm installed
- Expo CLI installed (`npm install -g expo-cli`)
- A Google account for Firebase

## Step 1: Create a Firebase Project

1. Go to the [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or "Create a project"
3. Enter project name: `fashionhub` (or your preferred name)
4. Disable Google Analytics (optional)
5. Click "Create project"

## Step 2: Register Your App

1. In the Firebase Console, click the **web icon** (`</>`) to add a web app
2. Enter app nickname: `FashionHub Web`
3. **Do not** check "Also set up Firebase Hosting"
4. Click "Register app"
5. Copy the Firebase configuration object

## Step 3: Enable Authentication

1. In the Firebase Console, go to **Authentication** > **Sign-in method**
2. Click on **Email/Password**
3. Enable **Email/Password**
4. Click **Save**

## Step 4: Create Firestore Database

1. In the Firebase Console, go to **Firestore Database**
2. Click **Create database**
3. Choose **Start in test mode** (for development)
   - **Important**: Test mode allows read/write access for 30 days. You'll need to update security rules later.
4. Select a location (choose one close to your users)
5. Click **Enable**

### Configure Firestore Security Rules

For development, use these rules (in Firestore > Rules tab):

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Users collection - users can read their own data, only authenticated users can write
    match /users/{userId} {
      allow read: if request.auth != null && request.auth.uid == userId;
      allow write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Products collection - anyone can read, only admins can write
    match /products/{productId} {
      allow read: if true; // Anyone can read products
      allow create, update, delete: if request.auth != null 
        && get(/databases/$(database)/documents/users/$(request.auth.uid)).data.isAdmin == true;
    }
    
    // Cart items - users can only access their own cart
    match /carts/{userId}/items/{itemId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    
    // Orders - users can only access their own orders
    match /orders/{orderId} {
      allow read: if request.auth != null 
        && resource.data.userId == request.auth.uid;
      allow create: if request.auth != null;
    }
  }
}
```

For production, make these rules more restrictive.

## Step 5: Configure Your App

1. Create a `.env` file in the project root:

```bash
cp .env.example .env
```

2. Edit `.env` and add your Firebase configuration:

```env
# Firebase Configuration from Step 2
EXPO_PUBLIC_FIREBASE_API_KEY=AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX
EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
EXPO_PUBLIC_FIREBASE_PROJECT_ID=your-project-id
EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID=123456789012
EXPO_PUBLIC_FIREBASE_APP_ID=1:123456789012:web:abcdef123456

# Admin emails (comma-separated)
EXPO_PUBLIC_ADMIN_EMAILS=admin@fashionhub.com,admin@test.com
```

3. Replace the placeholder values with your actual Firebase configuration

## Step 6: Install Dependencies

```bash
npm install
```

Dependencies installed:
- `firebase` - Firebase SDK
- `@react-native-async-storage/async-storage` - For persistent authentication

## Step 7: Initialize Products Database

1. Start the app:

```bash
npm start
# Press 'w' for web
```

2. Navigate to the setup screen: `/setup`

3. Click "Initialize Products" to populate Firestore with sample products

Alternatively, you can manually add products through the Firestore Console.

## Step 8: Create Admin User

1. Go to the signup screen
2. Create an account with email: `admin@fashionhub.com`
3. Use a secure password
4. This user will automatically be marked as an admin

## Step 9: Test the App

1. **Test Authentication:**
   - Sign up with a new account
   - Log out
   - Log in with the account
   
2. **Test Products:**
   - Browse products on the home screen
   - Search for products
   - Filter by category
   
3. **Test Cart:**
   - Add products to cart
   - Update quantities
   - Remove items
   
4. **Test Admin Panel:**
   - Log in as admin user
   - Add a new product
   - Edit an existing product
   - Delete a product

## Project Structure with Firebase

```
app/
├── config/
│   └── firebase.ts          # Firebase configuration
├── context/
│   ├── AuthContext.tsx      # Firebase Authentication
│   ├── ProductContext.tsx   # Firestore products
│   ├── CartContext.tsx      # Local cart (can be Firestore)
│   └── ThemeContext.tsx     # Theme management
├── auth/
│   ├── login.tsx
│   └── signup.tsx
└── setup.tsx                # Firebase initialization screen
```

## Firestore Data Structure

### Users Collection (`users`)
```javascript
{
  "userId": {
    "name": "John Doe",
    "email": "john@example.com",
    "isAdmin": false,
    "createdAt": "2024-12-15T12:00:00Z"
  }
}
```

### Products Collection (`products`)
```javascript
{
  "productId": {
    "name": "Classic Denim Jacket",
    "price": 89.99,
    "category": "mens",
    "image": "https://...",
    "description": "A timeless denim jacket...",
    "createdAt": Timestamp,
    "updatedAt": Timestamp
  }
}
```

## Common Issues & Solutions

### Issue: "Firebase: Error (auth/configuration-not-found)"
**Solution:** Check that your `.env` file has the correct Firebase configuration values.

### Issue: "Permission denied" when accessing Firestore
**Solution:** 
1. Check Firestore security rules
2. Ensure you're authenticated
3. Verify admin status for product operations

### Issue: Products not loading
**Solution:**
1. Run the setup screen to initialize products
2. Check browser console for errors
3. Verify Firestore rules allow reading products

### Issue: Cannot create admin user
**Solution:**
1. Check that the email is in `EXPO_PUBLIC_ADMIN_EMAILS` in `.env`
2. Restart the app after changing `.env`

## Next Steps

### 1. Implement Cart Persistence with Firestore

Currently, the cart is stored in local state. To persist it in Firestore:

```typescript
// app/context/CartContext.tsx
import { doc, setDoc, onSnapshot } from 'firebase/firestore';

// Listen to user's cart
useEffect(() => {
  if (user) {
    const unsubscribe = onSnapshot(
      doc(db, 'carts', user.id),
      (doc) => {
        if (doc.exists()) {
          setItems(doc.data().items || []);
        }
      }
    );
    return () => unsubscribe();
  }
}, [user]);

// Save cart changes
const addToCart = async (product: Product) => {
  // ... add logic
  if (user) {
    await setDoc(doc(db, 'carts', user.id), { items });
  }
};
```

### 2. Add Orders Collection

Create an orders collection to store completed purchases:

```typescript
const checkout = async () => {
  const order = {
    userId: user.id,
    items: cartItems,
    total: totalPrice,
    status: 'pending',
    createdAt: Timestamp.now()
  };
  
  await addDoc(collection(db, 'orders'), order);
  clearCart();
};
```

### 3. Add Image Upload

Use Firebase Storage to upload product images:

```bash
npm install firebase/storage
```

```typescript
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { storage } from '../config/firebase';

const uploadImage = async (imageFile) => {
  const imageRef = ref(storage, `products/${Date.now()}.jpg`);
  await uploadBytes(imageRef, imageFile);
  return await getDownloadURL(imageRef);
};
```

### 4. Deploy to Production

1. **Update Firestore Rules** for production
2. **Enable Firebase Hosting** for web deployment
3. **Build mobile apps** with `eas build`

## Security Best Practices

1. **Never commit `.env` file** - It's already in `.gitignore`
2. **Use environment variables** for all sensitive data
3. **Update Firestore rules** before going to production
4. **Enable App Check** to prevent API abuse
5. **Set up Firebase Authentication limits**
6. **Monitor Firebase usage** to avoid unexpected costs

## Monitoring & Analytics

### Enable Firebase Analytics (Optional)

1. In Firebase Console, go to **Analytics**
2. Enable Analytics
3. Add analytics tracking in your app

### Monitor Firestore Usage

1. Go to **Firestore Database** > **Usage** tab
2. Monitor:
   - Document reads
   - Document writes
   - Document deletes
   - Storage

## Support

- [Firebase Documentation](https://firebase.google.com/docs)
- [Firebase Authentication Guide](https://firebase.google.com/docs/auth)
- [Firestore Guide](https://firebase.google.com/docs/firestore)
- [React Native Firebase](https://rnfirebase.io/)

## Summary

You've successfully set up Firebase for FashionHub! Your app now has:

✅ User authentication with email/password
✅ Real-time product database with Firestore
✅ Admin role management
✅ Secure data access with Firestore rules

The app is now ready for development and testing with a real backend!
