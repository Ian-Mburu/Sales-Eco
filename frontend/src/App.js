import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/pages/ProductList';
import ProductDetail from './components/pages/ProductDetail';
import Cart from './components/pages/Cart';
import Profile from './components/auth/Profile';
import CategoriesList from './components/pages/CategoriesList';
import CategoryProducts from './components/pages/CategroyProducts';
import ProtectedRoute from '../src/common/ProtectedRoute';


const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/products" element={<ProductList />} />
        <Route path="/products/:slug" element={<ProductDetail />} />
        <Route path="/categories" element={<CategoriesList />} />
        <Route path="/categories/:categorySlug" element={<CategoryProducts />} />        
        <Route path="/cart" element={
          <ProtectedRoute>
            <Cart />
          </ProtectedRoute>
        } />
      </Routes>
    </Router>
  );
};

export default App;