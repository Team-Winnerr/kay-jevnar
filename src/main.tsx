import React from 'react';
import ReactDOM from 'react-dom/client';
import { AuthProvider } from './context/AuthContext';
import { CartProvider } from './context/CartContext';
import { ReactApp } from './ReactApp';
import './styles/app.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <AuthProvider>
      <CartProvider>
        <ReactApp />
      </CartProvider>
    </AuthProvider>
  </React.StrictMode>
);
