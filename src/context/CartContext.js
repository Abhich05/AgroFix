import React, { createContext, useContext, useReducer } from 'react';

const CartContext = createContext();

function cartReducer(state, action) {
  switch (action.type) {
    case 'ADD_TO_CART': {
      const existing = state.items.find(i => i.id === action.product.id);
      if (existing) {
        return {
          ...state,
          items: state.items.map(i => i.id === action.product.id ? { ...i, quantity: i.quantity + 1 } : i)
        };
      }
      return {
        ...state,
        items: [...state.items, { ...action.product, quantity: 1 }]
      };
    }
    case 'REMOVE_FROM_CART': {
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id)
      };
    }
    case 'UPDATE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, quantity: action.quantity } : i)
      };
    }
    case 'INCREASE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(i => i.id === action.id ? { ...i, quantity: i.quantity + 1 } : i)
      };
    }
    case 'DECREASE_QUANTITY': {
      return {
        ...state,
        items: state.items.map(i => i.id === action.id && i.quantity > 1 ? { ...i, quantity: i.quantity - 1 } : i)
      };
    }
    case 'REMOVE_ITEM': {
      return {
        ...state,
        items: state.items.filter(i => i.id !== action.id)
      };
    }
    case 'CLEAR_CART': {
      return { ...state, items: [] };
    }
    default:
      return state;
  }
}

export function CartProvider({ children }) {
  const [state, dispatch] = useReducer(cartReducer, { items: [] });
  return (
    <CartContext.Provider value={{ cart: state, dispatch }}>
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  return useContext(CartContext);
}
