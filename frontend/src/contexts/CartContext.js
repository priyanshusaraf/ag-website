'use client';

import React, { createContext, useContext, useReducer, useEffect } from 'react';
import api from '../lib/utils';
import { useAuth } from './AuthContext';
import { toast } from '@/hooks/use-toast';

// Cart actions
const CART_ACTIONS = {
  SET_CART: 'SET_CART',
  SET_LOADING: 'SET_LOADING',
  SET_ERROR: 'SET_ERROR',
};

// Cart reducer
const cartReducer = (state, action) => {
  switch (action.type) {
    case CART_ACTIONS.SET_CART:
      return { ...state, items: action.payload, loading: false, error: null };
    case CART_ACTIONS.SET_LOADING:
      return { ...state, loading: true, error: null };
    case CART_ACTIONS.SET_ERROR:
      return { ...state, loading: false, error: action.payload };
    default:
      return state;
  }
};

// Initial state
const initialState = {
  items: [],
  loading: true,
  error: null,
};

// Create context
const CartContext = createContext();

// Cart provider component
export const CartProvider = ({ children }) => {
  const [state, dispatch] = useReducer(cartReducer, initialState);
  const { token, isAuthenticated } = useAuth();

  // Fetch cart from backend on mount or when user logs in
  useEffect(() => {
    if (!isAuthenticated || !token) {
      dispatch({ type: CART_ACTIONS.SET_CART, payload: [] });
      return;
    }
    dispatch({ type: CART_ACTIONS.SET_LOADING });
    api.get('/cart', { headers: { Authorization: `Bearer ${token}` } })
      .then(res => {
        dispatch({ type: CART_ACTIONS.SET_CART, payload: res.data.cart_items || [] });
      })
      .catch(err => {
        dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to load cart' });
      });
  }, [isAuthenticated, token]);

  // Add item to cart
  const addItem = async (product, quantity = 1) => {
    if (!token) {
      // Show sign-in required message and redirect
      toast({
        title: "Sign in required",
        description: "Please sign in to add items to your cart.",
        duration: 2000,
      });
      // Small delay to let user see the message
      setTimeout(() => {
        window.location.href = '/auth/signin?redirect=' + encodeURIComponent(window.location.pathname);
      }, 500);
      return;
    }
    dispatch({ type: CART_ACTIONS.SET_LOADING });
    try {
      const payload = { quantity };

      const numericId = Number(product.id);
      if (!isNaN(numericId) && Number.isInteger(numericId) && numericId > 0) {
        payload.product_id = numericId;
      } else {
        payload.product_id = product.id;
        if (product.name) payload.product_name = product.name.split(' - ')[0].trim();
        if (product.category) payload.product_category = product.category;
      }

      if (product.customization) {
        payload.customization = product.customization;
      }

      if (product.price != null) {
        payload.price_override = parseFloat(product.price);
      }

      const res = await api.post('/cart/add', payload, { headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: CART_ACTIONS.SET_CART, payload: res.data.cart_items || [] });
      
      toast({
        variant: "success",
        title: "Added to Cart!",
        description: `${product.name} has been added to your cart.`,
        duration: 2000,
      });
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to add item' });
      
      const errorMsg = err.response?.data?.message || "There was an error adding the item to your cart. Please try again.";
      toast({
        variant: "destructive",
        title: "Failed to add item",
        description: errorMsg,
        duration: 3000,
      });
    }
  };

  // Update cart item quantity
  const updateQuantity = async (itemId, quantity) => {
    if (!token) return;
    dispatch({ type: CART_ACTIONS.SET_LOADING });
    try {
      const res = await api.put('/cart/update', { item_id: itemId, quantity }, { headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: CART_ACTIONS.SET_CART, payload: res.data.cart_items || [] });
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to update item' });
    }
  };

  // Remove item from cart
  const removeItem = async (itemId) => {
    if (!token) return;
    dispatch({ type: CART_ACTIONS.SET_LOADING });
    try {
      const res = await api.delete('/cart/remove', { data: { item_id: itemId }, headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: CART_ACTIONS.SET_CART, payload: res.data.cart_items || [] });
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to remove item' });
    }
  };

  // Clear cart
  const clearCart = async () => {
    if (!token) {
      // If no token, just clear local state
      dispatch({ type: CART_ACTIONS.SET_CART, payload: [] });
      return;
    }
    dispatch({ type: CART_ACTIONS.SET_LOADING });
    try {
      const res = await api.delete('/cart/clear', { headers: { Authorization: `Bearer ${token}` } });
      dispatch({ type: CART_ACTIONS.SET_CART, payload: res.data.cart_items || [] });
    } catch (err) {
      dispatch({ type: CART_ACTIONS.SET_ERROR, payload: 'Failed to clear cart' });
    }
  };

  // Computed values
  const itemCount = state.items.reduce((total, item) => total + item.quantity, 0);
  const totalPrice = state.items.reduce((total, item) => {
    const override = item.price_override != null ? parseFloat(item.price_override) : null;
    const price = override || parseFloat(item.products?.sale_price || item.products?.price || item.price || 0);
    return total + (price * item.quantity);
  }, 0);

  const contextValue = {
    ...state,
    addItem,
    removeItem,
    updateQuantity,
    clearCart,
    itemCount,
    totalPrice,
  };

  return (
    <CartContext.Provider value={contextValue}>
      {children}
    </CartContext.Provider>
  );
};

// Custom hook to use cart context
export const useCart = () => {
  const context = useContext(CartContext);
  if (!context) {
    throw new Error('useCart must be used within a CartProvider');
  }
  return context;
};

export default CartContext; 