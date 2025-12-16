# FashionHub App Testing Guide

This guide will help you test all features of the FashionHub e-commerce application.

## Prerequisites

Before testing, ensure you have:
- [ ] Node.js and npm installed
- [ ] Dependencies installed (`npm install`)
- [ ] Firebase project created (optional - app works without it)
- [ ] `.env` file configured (optional - uses demo mode without it)

## Testing Modes

### Mode 1: Demo Mode (No Firebase Required)
Test the UI and basic functionality without Firebase setup.

### Mode 2: Full Mode (With Firebase)
Test complete backend integration with real authentication and database.

---

## Quick Start Testing (Demo Mode)

### 1. Start the Application

```bash
# Install dependencies (first time only)
npm install

# Start the development server
npm start
```

Choose your platform:
- Press `w` for **Web** (recommended for quick testing)
- Press `i` for **iOS** (requires macOS)
- Press `a` for **Android** (requires Android Studio)

### 2. Test Authentication

**Login Screen:**
1. App should open on the login screen
2. Try entering invalid email: Should show error "Please enter a valid email"
3. Try password less than 6 characters: Should show error
4. Enter valid credentials:
   - Email: `test@example.com`
   - Password: `password123`
5. Should navigate to Home screen

**Signup Screen:**
1. Click "Sign Up" link on login screen
2. Fill in:
   - Name: `Test User`
   - Email: `newuser@example.com`
   - Password: `password123`
   - Confirm Password: `password123`
3. Verify password mismatch validation works
4. Sign up should succeed and navigate to Home

### 3. Test Home Screen

**Product Display:**
- [ ] Products should load and display in 2-column grid
- [ ] Each product card shows image, name, price, and "Add to Cart" button
- [ ] Products have smooth scale animation on press

**Search Functionality:**
1. Type in search bar: "jacket"
2. Products should filter in real-time
3. Clear search - all products should return

**Category Navigation:**
1. Click "Mens" - should filter to men's products
2. Click "Womens" - should filter to women's products
3. Click "Children" - should filter to children's products
4. Click "Accessories" - should filter to accessories
5. Click "All" - should show all products

**Product Details:**
1. Tap any product card
2. Modal should slide up from bottom
3. Should show larger image, full description, and category badge
4. "Add to Cart" button should work
5. "Close" button should dismiss modal

### 4. Test Shopping Cart

**Adding Items:**
1. Add 3 different products to cart
2. Cart badge (on tab bar) should show "3"
3. Navigate to Cart tab

**Cart Management:**
1. Should see all 3 items listed
2. Verify total price is correct
3. Click "+" on an item - quantity should increase
4. Click "-" on an item - quantity should decrease
5. When quantity reaches 0, item should be removed
6. Click "Remove" button - item should disappear immediately
7. Total price should update in real-time

**Checkout:**
1. Click "Checkout" button
2. Dialog should appear with total
3. Click "Confirm"
4. Success message should appear
5. Cart should be cleared

### 5. Test Theme Toggle

**From Home Screen:**
1. Click moon icon in header
2. Theme should cycle: Auto → Light → Dark → Auto
3. Colors should change immediately
4. Test on different screens to verify consistency

**From Profile:**
1. Go to Profile tab
2. Click "Theme" setting
3. Should cycle through modes
4. Check that system preference works in "Auto" mode

### 6. Test Admin Panel (Demo Mode)

**Access Admin:**
1. Logout (if logged in)
2. Sign up with email: `admin@fashionhub.com`
3. Password: any password (min 6 chars)
4. Admin tab should appear in navigation

**Add Product:**
1. Click "+ Add Product"
2. Fill in:
   - Name: "Test Product"
   - Price: "99.99"
   - Category: Select "Mens"
   - Image URL: Use any Unsplash URL
   - Description: "Test description"
3. Click "Save"
4. Product should appear in list immediately
5. Go to Home - new product should be visible

**Edit Product:**
1. In Admin panel, find your product
2. Click "Edit"
3. Change name to "Updated Product"
4. Change price to "79.99"
5. Click "Save"
6. Changes should reflect immediately

**Delete Product:**
1. Click "Delete" on a product
2. Confirmation dialog should appear
3. Click "Delete" to confirm
4. Product should disappear from list
5. Verify it's gone from Home screen too

### 7. Test Profile Screen

1. Navigate to Profile tab
2. Should display:
   - User avatar
   - User name and email
   - Admin badge (if admin)
3. Settings should be accessible
4. Click "Logout" - should return to Login screen

### 8. Test Responsive Design

**Desktop (Web):**
1. Resize browser window
2. Products should maintain 2-column layout
3. All elements should be readable

**Mobile:**
1. Product cards should be appropriately sized
2. Touch targets should be easy to tap
3. Modals should be full-width on mobile

---

## Full Testing (With Firebase)

### Setup Firebase

1. **Create Firebase Project:**
   - Follow `FIREBASE_SETUP.md` instructions
   - Create project at https://console.firebase.google.com
   - Enable Email/Password authentication
   - Create Firestore database

2. **Configure App:**
   ```bash
   cp .env.example .env
   # Edit .env with your Firebase credentials
   ```

3. **Initialize Products:**
   - Run the app
   - Navigate to `/setup` screen
   - Click "Initialize Products"
   - Products will be added to Firestore

### Test Firebase Features

**Authentication:**
1. Sign up with a new email
2. Check Firebase Console → Authentication
3. User should appear in user list
4. Logout and login - session should persist
5. Close browser and reopen - should stay logged in

**Products Database:**
1. Go to Firebase Console → Firestore
2. Should see `products` collection
3. Add a product in admin panel
4. Check Firestore - new product should appear
5. Edit product in admin panel
6. Firestore should update in real-time
7. Delete product - should be removed from Firestore

**User Profiles:**
1. Sign up with new account
2. Check Firestore → `users` collection
3. User document should contain:
   - name
   - email
   - isAdmin (true/false)
   - createdAt timestamp

**Admin Management:**
1. Create user with `admin@fashionhub.com`
2. Check Firestore - `isAdmin` should be `true`
3. Create user with different email
4. Check Firestore - `isAdmin` should be `false`

**Real-time Sync:**
1. Open app in two browser windows
2. Login as admin in both
3. Add product in window 1
4. Product should appear in window 2 automatically
5. Edit in window 1 - changes appear in window 2
6. Delete in window 1 - disappears from window 2

---

## Performance Testing

### Load Testing

1. **Large Cart:**
   - Add 20+ items to cart
   - Navigate to cart
   - Should load quickly
   - Scrolling should be smooth

2. **Many Products:**
   - Add 50+ products via admin panel
   - Navigate to home
   - Scrolling should remain smooth
   - Search should still be fast

### Network Testing

1. **Slow Network:**
   - Open browser DevTools
   - Set network to "Slow 3G"
   - Navigate between screens
   - Loading states should appear
   - No crashes should occur

2. **Offline Mode:**
   - Disconnect internet
   - Try to login - should show error
   - Try to add product - should show error
   - App should remain stable

---

## Cross-Platform Testing

### Web Testing

**Browsers:**
- [ ] Chrome (latest)
- [ ] Firefox (latest)
- [ ] Safari (latest)
- [ ] Edge (latest)

**Features to verify:**
- Authentication works
- Products load
- Cart functionality
- Theme toggle
- Admin panel (if admin)

### Mobile Testing (Optional)

**iOS:**
```bash
npm run ios
```

**Android:**
```bash
npm run android
```

Verify:
- Touch gestures work
- Navigation is smooth
- Keyboard appears correctly
- Modals display properly

---

## Security Testing

### Authentication Security

1. **Invalid Credentials:**
   - Try logging in with wrong password
   - Should show error, not crash

2. **SQL Injection Attempt:**
   - Try email: `admin'--@test.com`
   - Should validate as invalid email

3. **XSS Attempt:**
   - In product description: `<script>alert('xss')</script>`
   - Should display as text, not execute

### Admin Access

1. Login as regular user
2. Admin tab should NOT appear
3. Try navigating to `/admin` manually
4. Should not have access (Firebase rules)

---

## Bug Checklist

Check for these common issues:

**UI Bugs:**
- [ ] Text overlapping
- [ ] Images not loading
- [ ] Buttons not responsive
- [ ] Modals not closing

**Functional Bugs:**
- [ ] Cart total incorrect
- [ ] Products not filtering
- [ ] Search not working
- [ ] Theme not persisting

**Performance Bugs:**
- [ ] Slow loading
- [ ] Memory leaks
- [ ] Crash on navigation
- [ ] Unresponsive UI

---

## Test Report Template

After testing, document your findings:

```
## Test Report - FashionHub

**Date:** [Date]
**Tester:** [Your Name]
**Platform:** [Web/iOS/Android]
**Mode:** [Demo/Firebase]

### Features Tested
- [ ] Authentication
- [ ] Product Browsing
- [ ] Shopping Cart
- [ ] Admin Panel
- [ ] Theme Toggle
- [ ] Profile

### Passed Tests
- [List tests that passed]

### Failed Tests
- [List tests that failed with details]

### Bugs Found
1. [Bug description]
   - Steps to reproduce
   - Expected behavior
   - Actual behavior

### Performance Notes
- Load times: [Fast/Medium/Slow]
- Smoothness: [Excellent/Good/Needs Improvement]
- Memory usage: [Low/Medium/High]

### Recommendations
- [Suggestions for improvements]
```

---

## Quick Smoke Test (5 minutes)

If you're short on time, run this quick test:

1. ✅ Start app - login screen appears
2. ✅ Sign up with new account
3. ✅ Home screen loads with products
4. ✅ Add item to cart
5. ✅ Cart shows correct item and total
6. ✅ Theme toggle works
7. ✅ Logout and login again
8. ✅ Cart is empty (as expected)

If all pass, core functionality works!

---

## Troubleshooting

**App won't start:**
```bash
rm -rf node_modules package-lock.json
npm install
npm start
```

**TypeScript errors:**
```bash
npx tsc --noEmit
```

**Products not loading:**
- Check if Firebase is configured
- Check browser console for errors
- Verify network connection

**Authentication not working:**
- Check Firebase Authentication is enabled
- Verify .env file has correct credentials
- Check browser console for errors

---

## Next Steps After Testing

1. **If bugs found:** Create list of issues to fix
2. **If all works:** Ready for deployment!
3. **Enhancements:** Consider adding features from BACKEND_GUIDE.md

Good luck with testing! 🚀
