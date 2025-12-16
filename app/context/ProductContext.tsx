import React, { createContext, useContext, useState, ReactNode, useEffect } from 'react';
import { 
  collection, 
  getDocs, 
  addDoc, 
  updateDoc, 
  deleteDoc, 
  doc, 
  query, 
  orderBy,
  Timestamp 
} from 'firebase/firestore';
import { db } from '../config/firebase';
import { Product } from '../types';
import productsData from '../data/products.json';

interface ProductContextType {
  products: Product[];
  categories: string[];
  loading: boolean;
  addProduct: (product: Omit<Product, 'id'>) => Promise<void>;
  updateProduct: (id: string, product: Partial<Product>) => Promise<void>;
  deleteProduct: (id: string) => Promise<void>;
  getProductById: (id: string) => Product | undefined;
  getProductsByCategory: (category: string) => Product[];
  initializeProducts: () => Promise<void>;
}

const ProductContext = createContext<ProductContextType | undefined>(undefined);

export const ProductProvider = ({ children }: { children: ReactNode }) => {
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  const categories = ['mens', 'womens', 'children', 'accessories'];

  useEffect(() => {
    loadProducts();
  }, []);

  const loadProducts = async () => {
    try {
      setLoading(true);
      const productsCollection = collection(db, 'products');
      const q = query(productsCollection, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(q);
      
      const loadedProducts: Product[] = [];
      querySnapshot.forEach((doc) => {
        loadedProducts.push({
          id: doc.id,
          ...doc.data()
        } as Product);
      });
      
      setProducts(loadedProducts);
    } catch (error) {
      console.error('Error loading products:', error);
      // Fallback to local data if Firestore fails
      setProducts(productsData as Product[]);
    } finally {
      setLoading(false);
    }
  };

  const initializeProducts = async () => {
    try {
      // Check if products already exist
      const productsCollection = collection(db, 'products');
      const querySnapshot = await getDocs(productsCollection);
      
      if (querySnapshot.empty) {
        // Add initial products from JSON file
        console.log('Initializing products in Firestore...');
        
        for (const product of productsData) {
          await addDoc(productsCollection, {
            name: product.name,
            price: product.price,
            category: product.category,
            image: product.image,
            description: product.description,
            createdAt: Timestamp.now(),
            updatedAt: Timestamp.now()
          });
        }
        
        console.log('Products initialized successfully!');
        await loadProducts();
      } else {
        console.log('Products already exist in Firestore');
      }
    } catch (error) {
      console.error('Error initializing products:', error);
    }
  };

  const addProduct = async (product: Omit<Product, 'id'>) => {
    try {
      const productsCollection = collection(db, 'products');
      const docRef = await addDoc(productsCollection, {
        ...product,
        createdAt: Timestamp.now(),
        updatedAt: Timestamp.now()
      });
      
      const newProduct: Product = {
        id: docRef.id,
        ...product
      };
      
      setProducts(prev => [newProduct, ...prev]);
    } catch (error) {
      console.error('Error adding product:', error);
      throw error;
    }
  };

  const updateProduct = async (id: string, updatedProduct: Partial<Product>) => {
    try {
      const productRef = doc(db, 'products', id);
      await updateDoc(productRef, {
        ...updatedProduct,
        updatedAt: Timestamp.now()
      });
      
      setProducts(prev =>
        prev.map(product =>
          product.id === id ? { ...product, ...updatedProduct } : product
        )
      );
    } catch (error) {
      console.error('Error updating product:', error);
      throw error;
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const productRef = doc(db, 'products', id);
      await deleteDoc(productRef);
      
      setProducts(prev => prev.filter(product => product.id !== id));
    } catch (error) {
      console.error('Error deleting product:', error);
      throw error;
    }
  };

  const getProductById = (id: string) => {
    return products.find(product => product.id === id);
  };

  const getProductsByCategory = (category: string) => {
    return products.filter(product => 
      product.category.toLowerCase() === category.toLowerCase()
    );
  };

  return (
    <ProductContext.Provider value={{
      products,
      categories,
      loading,
      addProduct,
      updateProduct,
      deleteProduct,
      getProductById,
      getProductsByCategory,
      initializeProducts
    }}>
      {children}
    </ProductContext.Provider>
  );
};

export const useProducts = () => {
  const context = useContext(ProductContext);
  if (!context) {
    throw new Error('useProducts must be used within ProductProvider');
  }
  return context;
};
