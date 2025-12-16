# Backend Implementation Guide for FashionHub

This guide explains how to transform the current demo app into a production-ready application with a fully functional backend.

## Architecture Overview

The current app uses:
- Mock authentication (no real backend)
- JSON file for product storage
- Client-side only state management

A production backend should have:
- Real authentication server with JWT tokens
- Database for persistent storage
- RESTful API or GraphQL
- Payment processing integration

## Option 1: Node.js + Express + PostgreSQL (Recommended)

### 1. Backend Setup

```bash
# Create backend directory
mkdir fashionhub-backend
cd fashionhub-backend
npm init -y

# Install dependencies
npm install express cors dotenv bcrypt jsonwebtoken pg
npm install --save-dev typescript @types/node @types/express @types/bcrypt @types/jsonwebtoken
```

### 2. Database Schema (PostgreSQL)

```sql
-- users table
CREATE TABLE users (
  id SERIAL PRIMARY KEY,
  email VARCHAR(255) UNIQUE NOT NULL,
  password_hash VARCHAR(255) NOT NULL,
  name VARCHAR(255) NOT NULL,
  is_admin BOOLEAN DEFAULT false,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- products table
CREATE TABLE products (
  id SERIAL PRIMARY KEY,
  name VARCHAR(255) NOT NULL,
  price DECIMAL(10, 2) NOT NULL,
  category VARCHAR(50) NOT NULL,
  image TEXT NOT NULL,
  description TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- cart_items table
CREATE TABLE cart_items (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id) ON DELETE CASCADE,
  quantity INTEGER NOT NULL DEFAULT 1,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
  UNIQUE(user_id, product_id)
);

-- orders table
CREATE TABLE orders (
  id SERIAL PRIMARY KEY,
  user_id INTEGER REFERENCES users(id),
  total_price DECIMAL(10, 2) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- order_items table
CREATE TABLE order_items (
  id SERIAL PRIMARY KEY,
  order_id INTEGER REFERENCES orders(id) ON DELETE CASCADE,
  product_id INTEGER REFERENCES products(id),
  quantity INTEGER NOT NULL,
  price DECIMAL(10, 2) NOT NULL
);
```

### 3. Backend API Structure

```
fashionhub-backend/
├── src/
│   ├── config/
│   │   └── database.ts       # Database connection
│   ├── controllers/
│   │   ├── authController.ts
│   │   ├── productController.ts
│   │   ├── cartController.ts
│   │   └── orderController.ts
│   ├── middleware/
│   │   ├── auth.ts           # JWT verification
│   │   └── admin.ts          # Admin check
│   ├── models/
│   │   ├── User.ts
│   │   ├── Product.ts
│   │   ├── Cart.ts
│   │   └── Order.ts
│   ├── routes/
│   │   ├── auth.ts
│   │   ├── products.ts
│   │   ├── cart.ts
│   │   └── orders.ts
│   └── server.ts
├── .env
├── package.json
└── tsconfig.json
```

### 4. Example API Implementation

**server.ts**
```typescript
import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import authRoutes from './routes/auth';
import productRoutes from './routes/products';
import cartRoutes from './routes/cart';
import orderRoutes from './routes/orders';

dotenv.config();

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/products', productRoutes);
app.use('/api/cart', cartRoutes);
app.use('/api/orders', orderRoutes);

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
```

**routes/auth.ts**
```typescript
import express from 'express';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { pool } from '../config/database';

const router = express.Router();

// Register
router.post('/signup', async (req, res) => {
  try {
    const { email, password, name } = req.body;
    
    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Insert user
    const result = await pool.query(
      'INSERT INTO users (email, password_hash, name) VALUES ($1, $2, $3) RETURNING id, email, name, is_admin',
      [email, hashedPassword, name]
    );
    
    const user = result.rows[0];
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({ token, user });
  } catch (error) {
    res.status(500).json({ error: 'Registration failed' });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    // Get user
    const result = await pool.query(
      'SELECT * FROM users WHERE email = $1',
      [email]
    );
    
    if (result.rows.length === 0) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    const user = result.rows[0];
    
    // Verify password
    const validPassword = await bcrypt.compare(password, user.password_hash);
    
    if (!validPassword) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    
    // Generate JWT
    const token = jwt.sign(
      { userId: user.id, email: user.email, isAdmin: user.is_admin },
      process.env.JWT_SECRET!,
      { expiresIn: '7d' }
    );
    
    res.json({
      token,
      user: {
        id: user.id,
        email: user.email,
        name: user.name,
        isAdmin: user.is_admin
      }
    });
  } catch (error) {
    res.status(500).json({ error: 'Login failed' });
  }
});

export default router;
```

**middleware/auth.ts**
```typescript
import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

export interface AuthRequest extends Request {
  user?: {
    userId: number;
    email: string;
    isAdmin: boolean;
  };
}

export const authenticate = (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.replace('Bearer ', '');
    
    if (!token) {
      return res.status(401).json({ error: 'Authentication required' });
    }
    
    const decoded = jwt.verify(token, process.env.JWT_SECRET!) as any;
    req.user = decoded;
    next();
  } catch (error) {
    res.status(401).json({ error: 'Invalid token' });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  if (!req.user?.isAdmin) {
    return res.status(403).json({ error: 'Admin access required' });
  }
  next();
};
```

**routes/products.ts**
```typescript
import express from 'express';
import { pool } from '../config/database';
import { authenticate, requireAdmin } from '../middleware/auth';

const router = express.Router();

// Get all products
router.get('/', async (req, res) => {
  try {
    const { category, search } = req.query;
    let query = 'SELECT * FROM products WHERE 1=1';
    const params: any[] = [];
    
    if (category && category !== 'all') {
      params.push(category);
      query += ` AND category = $${params.length}`;
    }
    
    if (search) {
      params.push(`%${search}%`);
      query += ` AND name ILIKE $${params.length}`;
    }
    
    query += ' ORDER BY created_at DESC';
    
    const result = await pool.query(query, params);
    res.json(result.rows);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch products' });
  }
});

// Get single product
router.get('/:id', async (req, res) => {
  try {
    const result = await pool.query(
      'SELECT * FROM products WHERE id = $1',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to fetch product' });
  }
});

// Create product (admin only)
router.post('/', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    
    const result = await pool.query(
      'INSERT INTO products (name, price, category, image, description) VALUES ($1, $2, $3, $4, $5) RETURNING *',
      [name, price, category, image, description]
    );
    
    res.status(201).json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to create product' });
  }
});

// Update product (admin only)
router.put('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const { name, price, category, image, description } = req.body;
    
    const result = await pool.query(
      'UPDATE products SET name = $1, price = $2, category = $3, image = $4, description = $5, updated_at = CURRENT_TIMESTAMP WHERE id = $6 RETURNING *',
      [name, price, category, image, description, req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json(result.rows[0]);
  } catch (error) {
    res.status(500).json({ error: 'Failed to update product' });
  }
});

// Delete product (admin only)
router.delete('/:id', authenticate, requireAdmin, async (req, res) => {
  try {
    const result = await pool.query(
      'DELETE FROM products WHERE id = $1 RETURNING *',
      [req.params.id]
    );
    
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Product not found' });
    }
    
    res.json({ message: 'Product deleted' });
  } catch (error) {
    res.status(500).json({ error: 'Failed to delete product' });
  }
});

export default router;
```

### 5. Frontend Integration

Update your React Native app to use the backend API:

**app/config/api.ts**
```typescript
const API_URL = process.env.EXPO_PUBLIC_API_URL || 'http://localhost:3000/api';

export const api = {
  // Auth
  login: async (email: string, password: string) => {
    const response = await fetch(`${API_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password }),
    });
    return response.json();
  },
  
  signup: async (email: string, password: string, name: string) => {
    const response = await fetch(`${API_URL}/auth/signup`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, name }),
    });
    return response.json();
  },
  
  // Products
  getProducts: async (category?: string, search?: string) => {
    const params = new URLSearchParams();
    if (category) params.append('category', category);
    if (search) params.append('search', search);
    
    const response = await fetch(`${API_URL}/products?${params}`);
    return response.json();
  },
  
  getProduct: async (id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`);
    return response.json();
  },
  
  // Admin - Products
  createProduct: async (token: string, product: any) => {
    const response = await fetch(`${API_URL}/products`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return response.json();
  },
  
  updateProduct: async (token: string, id: string, product: any) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`,
      },
      body: JSON.stringify(product),
    });
    return response.json();
  },
  
  deleteProduct: async (token: string, id: string) => {
    const response = await fetch(`${API_URL}/products/${id}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${token}`,
      },
    });
    return response.json();
  },
};
```

**Update AuthContext to use real API:**
```typescript
import AsyncStorage from '@react-native-async-storage/async-storage';
import { api } from '../config/api';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  useEffect(() => {
    // Load token on mount
    loadToken();
  }, []);

  const loadToken = async () => {
    const storedToken = await AsyncStorage.getItem('authToken');
    const storedUser = await AsyncStorage.getItem('user');
    
    if (storedToken && storedUser) {
      setToken(storedToken);
      setUser(JSON.parse(storedUser));
    }
  };

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const response = await api.login(email, password);
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const signup = async (email: string, password: string, name: string): Promise<boolean> => {
    try {
      const response = await api.signup(email, password, name);
      
      if (response.token) {
        setToken(response.token);
        setUser(response.user);
        
        await AsyncStorage.setItem('authToken', response.token);
        await AsyncStorage.setItem('user', JSON.stringify(response.user));
        
        return true;
      }
      return false;
    } catch (error) {
      return false;
    }
  };

  const logout = async () => {
    setUser(null);
    setToken(null);
    await AsyncStorage.removeItem('authToken');
    await AsyncStorage.removeItem('user');
  };

  return (
    <AuthContext.Provider value={{ user, token, login, signup, logout, isAuthenticated: !!user }}>
      {children}
    </AuthContext.Provider>
  );
};
```

## Option 2: Firebase (Easier Setup)

Firebase provides a complete backend solution without managing servers:

```bash
npm install firebase @react-native-firebase/app @react-native-firebase/auth @react-native-firebase/firestore
```

**Firebase Setup:**
1. Create a Firebase project at https://firebase.google.com
2. Enable Authentication (Email/Password)
3. Create Firestore database
4. Add Firebase config to your app

**app/config/firebase.ts**
```typescript
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: process.env.EXPO_PUBLIC_FIREBASE_API_KEY,
  authDomain: process.env.EXPO_PUBLIC_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.EXPO_PUBLIC_FIREBASE_PROJECT_ID,
  storageBucket: process.env.EXPO_PUBLIC_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.EXPO_PUBLIC_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.EXPO_PUBLIC_FIREBASE_APP_ID,
};

const app = initializeApp(firebaseConfig);
export const auth = getAuth(app);
export const db = getFirestore(app);
```

## Option 3: Supabase (PostgreSQL + Real-time)

Supabase provides PostgreSQL database with auto-generated APIs:

```bash
npm install @supabase/supabase-js
```

**app/config/supabase.ts**
```typescript
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const supabaseKey = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseKey);
```

## Next Steps

1. **Choose your backend approach:**
   - Option 1: Full control, requires server management
   - Option 2: Easiest, Firebase handles everything
   - Option 3: PostgreSQL + auto APIs, good middle ground

2. **Install required dependencies:**
   ```bash
   # For AsyncStorage (needed for all options)
   npx expo install @react-native-async-storage/async-storage
   ```

3. **Set up environment variables:**
   Create `.env` file in your project root:
   ```
   EXPO_PUBLIC_API_URL=http://localhost:3000/api
   # or Firebase/Supabase credentials
   ```

4. **Migrate data:**
   - Export products from `products.json`
   - Import into your database
   - Update contexts to fetch from API

5. **Add payment processing:**
   - Stripe: `npm install @stripe/stripe-react-native`
   - PayPal: Use PayPal SDK
   - Follow their integration guides

6. **Deploy:**
   - Backend: Heroku, Railway, DigitalOcean, AWS
   - Database: Heroku Postgres, Supabase, Firebase
   - Frontend: Continue using Expo for mobile apps

## Recommended Path for FashionHub

I recommend **Option 1 (Node.js + Express + PostgreSQL)** because:
- Full control over business logic
- Better for learning backend development
- Scalable for future features
- Industry-standard stack
- Easy to add payment processing

Start with the example code above and expand from there!
