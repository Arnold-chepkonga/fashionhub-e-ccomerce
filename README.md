# FashionHub E-Commerce App

A production-ready cross-platform e-commerce application built with React Native, Expo Router, and TypeScript.

## Features

### 🔐 Authentication
- Login and Signup screens with input validation
- Email and password validation
- Mock authentication system (ready for API integration)
- Admin user detection

### 🏠 Home Screen
- Category navigation (Mens, Womens, Children, Accessories)
- Product search functionality
- Dynamic product cards with images, names, prices
- Smooth animations and transitions
- Add to Cart from product cards

### 📱 Product Details
- Product detail modal with larger images
- Full product information (description, price, category)
- Add to Cart functionality
- Dynamic routes for product pages

### 🛒 Shopping Cart
- View all cart items
- Update quantities (increase/decrease)
- Remove items from cart
- Real-time total price calculation
- Badge showing number of items in cart
- Mock checkout process

### 👨‍💼 Admin Panel
- Add new products
- Edit existing products
- Delete products
- Category management
- Image URL support

### 🎨 UI/UX Features
- Dark mode support with auto/light/dark options
- Smooth animations for interactions
- Responsive mobile-first design
- Clean, modern styling
- Rounded corners and quality visuals

## Tech Stack

- **Framework**: React Native with Expo Router
- **Language**: TypeScript
- **State Management**: Context API (Auth, Cart, Theme, Products)
- **Navigation**: Expo Router (file-based routing)
- **Styling**: React Native StyleSheet
- **Icons**: FontAwesome (@expo/vector-icons)

## Project Structure

```
app/
├── auth/                 # Authentication screens
│   ├── login.tsx
│   └── signup.tsx
├── (tabs)/              # Main tab navigation
│   ├── index.tsx        # Home screen
│   ├── cart.tsx         # Shopping cart
│   ├── admin.tsx        # Admin panel
│   └── profile.tsx      # User profile
├── product/             # Product details
│   └── [id].tsx         # Dynamic product page
├── components/          # Reusable components
│   ├── ProductCard.tsx
│   ├── CategoryNavbar.tsx
│   ├── CartItem.tsx
│   └── ProductModal.tsx
├── context/             # Context API providers
│   ├── AuthContext.tsx
│   ├── CartContext.tsx
│   ├── ThemeContext.tsx
│   └── ProductContext.tsx
├── data/                # Data files
│   └── products.json    # Product catalog
└── _layout.tsx          # Root layout with providers
```

## Installation & Setup

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd fashionhub-e-ccomerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start the development server**
   ```bash
   npm start
   ```

4. **Run on different platforms**
   - **Web**: Press `w` or run `npm run web`
   - **iOS**: Press `i` or run `npm run ios` (requires macOS)
   - **Android**: Press `a` or run `npm run android` (requires Android Studio)

## Usage

### Default Login Credentials

- **Regular User**: Any email with password (min 6 characters)
- **Admin User**: Use email containing "admin" (e.g., admin@test.com)

### Navigation

- **Home**: Browse products by category and search
- **Cart**: View and manage cart items
- **Admin**: Add, edit, and delete products (admin users only)
- **Profile**: View user info and logout

## Data Structure

Products are stored in `app/data/products.json` with the following structure:

```json
{
  "id": "string",
  "name": "string",
  "price": number,
  "category": "mens" | "womens" | "children" | "accessories",
  "image": "string (URL)",
  "description": "string"
}
```

## Development

- **TypeScript**: Full type safety throughout the app
- **Context API**: Centralized state management
- **Expo Router**: File-based routing for easy navigation
- **Responsive Design**: Mobile-first approach

## Production Deployment

The app is ready for deployment to:
- **Expo**: `eas build` for iOS/Android
- **Web**: `npm run web` builds static site
- **Vercel/Netlify**: Deploy web version

## Future Enhancements

- Integration with real backend API
- Payment gateway integration
- User profile management
- Order history tracking
- Wishlist functionality
- Push notifications
- Product reviews and ratings

## License

MIT License - feel free to use for personal or commercial projects.
