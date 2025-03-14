import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './components/pages/Home';
import Login from './components/auth/Login';
import Register from './components/auth/Register';
import ProductList from './components/pages/ProductList';
import ProductDetail from './components/pages/ProductDetail';
import Cart from './components/pages/CartList';
import Profile from './components/auth/Profile';
import CategoriesList from './components/pages/CategoriesList';
import CategoryProducts from './components/pages/CategoryProducts';
import ProtectedRoute from '../src/common/ProtectedRoute';
import OrderDetail from './components/pages/OrderDetail';
import OrderList from './components/pages/OrderList';
import PaymentList from'./components/pages/PaymentList';
import Wishlist from './components/pages/Wishlist';
import ContactForm from './components/pages/ContactForm';
import ReviewList from './components/pages/ReviewList';
import PaymentSuccess from './components/pages/PaymentSuccess';


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
        <Route path="/orders" element={<OrderList />} />
        <Route path="/orders/:id" element={<OrderDetail />} />
        <Route path="/payments" element={<PaymentList />} />
        <Route path="/payment-success" element={<PaymentSuccess />} />
        <Route path="/wishlist" element={<Wishlist />} />
        <Route path="/contact" element={<ContactForm />} />
        <Route path="/reviews" element={<ReviewList />} />
      </Routes>
    </Router>
  );
};

export default App;