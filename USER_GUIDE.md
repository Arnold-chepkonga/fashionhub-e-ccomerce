# FashionHub E-Commerce App - User Guide

## Quick Start

### Installation

1. Clone the repository:
```bash
git clone https://github.com/Arnold-chepkonga/fashionhub-e-ccomerce.git
cd fashionhub-e-ccomerce
```

2. Install dependencies:
```bash
npm install
```

3. Start the development server:
```bash
npm start
```

4. Choose your platform:
   - Press `w` for Web
   - Press `i` for iOS (requires macOS)
   - Press `a` for Android (requires Android Studio)

## Features Guide

### 1. Authentication

**Login Screen**
- Email: Any valid email address
- Password: Minimum 6 characters
- For admin access, use: `admin@fashionhub.com` or `admin@test.com`

**Signup Screen**
- Name: Your full name
- Email: Valid email address
- Password: Minimum 6 characters
- Confirm Password: Must match password

### 2. Home Screen

**Search Products**
- Use the search bar at the top to find products by name
- Results update in real-time as you type

**Category Navigation**
- Tap on category buttons to filter products:
  - All: Shows all products
  - Mens: Men's fashion items
  - Womens: Women's fashion items
  - Children: Kids' clothing and accessories
  - Accessories: Bags, wallets, sunglasses, etc.

**Product Cards**
- Each card shows:
  - Product image
  - Product name
  - Price
  - "Add to Cart" button
- Tap a product card to see detailed information
- Tap "Add to Cart" to add item to your shopping cart

### 3. Product Details

**Viewing Product Details**
- Tap any product card to open the detail modal
- View larger product image
- Read full product description
- See product category
- Check current price

**Adding to Cart**
- Tap "Add to Cart" in the modal to add item
- Modal will close automatically after adding
- View cart badge in tab bar for item count

### 4. Shopping Cart

**Managing Cart Items**
- View all items added to cart
- Each item shows:
  - Product image and name
  - Unit price
  - Quantity controls (+ and -)
  - Remove button

**Updating Quantities**
- Tap + to increase quantity
- Tap - to decrease quantity
- Item automatically removes when quantity reaches 0

**Removing Items**
- Tap "Remove" button on any item
- Item will be immediately removed from cart

**Checkout**
- View total price at the bottom
- Tap "Checkout" to place order
- Confirm order in the dialog
- Cart clears after successful checkout

### 5. Admin Panel (Admin Users Only)

**Accessing Admin Panel**
- Only visible when logged in as admin
- Login with `admin@fashionhub.com` or `admin@test.com`
- Admin tab appears in bottom navigation

**Managing Products**

*Adding New Products:*
1. Tap "+ Add Product" button
2. Fill in all fields:
   - Name: Product name
   - Price: Numeric value (e.g., 29.99)
   - Category: Select from available categories
   - Image URL: Full URL to product image
   - Description: Product details
3. Tap "Save" to add product
4. Product appears immediately in the list

*Editing Products:*
1. Find the product in the list
2. Tap "Edit" button
3. Modify any fields
4. Tap "Save" to update
5. Changes apply immediately

*Deleting Products:*
1. Find the product to delete
2. Tap "Delete" button
3. Confirm deletion in the dialog
4. Product is removed immediately

### 6. User Profile

**Theme Settings**
- Tap "Theme" to cycle through options:
  - Auto: Follows system preference
  - Light: Light mode
  - Dark: Dark mode

**Account Options**
- Notifications: (Feature placeholder)
- Wishlist: (Feature placeholder)
- Order History: (Feature placeholder)

**Logging Out**
- Tap "Logout" button at bottom
- Confirm logout
- Returns to login screen

## Tips & Tricks

1. **Dark Mode**: Toggle between themes from the Profile tab or use the moon icon on the Home screen header

2. **Quick Add to Cart**: Use the "Add to Cart" button directly on product cards without opening the detail modal

3. **Search**: The search is case-insensitive and searches product names in real-time

4. **Admin Access**: For testing admin features, always use the predefined admin emails

5. **Cart Badge**: The cart icon shows a red badge with the total number of items (not products)

## Troubleshooting

**Issue: App won't start**
- Solution: Run `npm install` again to ensure all dependencies are installed

**Issue: Images not loading**
- Solution: Check your internet connection. Product images are loaded from external URLs.

**Issue: Can't access admin panel**
- Solution: Make sure you're logged in with an admin email (`admin@fashionhub.com` or `admin@test.com`)

**Issue: TypeScript errors**
- Solution: Run `npx tsc --noEmit` to check for errors

## Development Notes

### Adding New Products
Products use Unsplash image URLs. You can:
1. Find images on https://unsplash.com
2. Copy the image URL
3. Add `?w=400&h=400&fit=crop` for optimal sizing

### Customizing Categories
To add new categories:
1. Edit `app/context/ProductContext.tsx`
2. Add category to the `categories` array
3. Ensure products have matching category values

### Styling
All colors are defined in `ThemeContext.tsx`:
- Modify `lightColors` for light theme
- Modify `darkColors` for dark theme

## Production Deployment

### Web Deployment
```bash
npx expo export --platform web
```
Deploy the `dist` folder to your hosting provider (Vercel, Netlify, etc.)

### Mobile App Build
```bash
# Install EAS CLI
npm install -g eas-cli

# Build for iOS
eas build --platform ios

# Build for Android
eas build --platform android
```

## Support

For issues or questions:
1. Check this guide first
2. Review the main README.md
3. Check Expo documentation: https://docs.expo.dev
4. Create an issue on GitHub

## Version

Current Version: 1.0.0
Last Updated: December 2024
