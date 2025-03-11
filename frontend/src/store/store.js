import { configureStore } from '@reduxjs/toolkit';
import authReducer from '../slices/authSlice';
import productsReducer from '../slices/productsSlice'
import profileReducer from '../slices/profileSlice'
import OrderReducer from '../slices/OrderSlice'
import OrderItemReducer from '../slices/OrderItemSlice'
import PaymentReducer from '../slices/PaymentSlice'
import ReviewReducer from '../slices/ReviewSlice'
import WishlistReducer from '../slices/WishlistSlice'
import ContactReducer from '../slices/ContactSlice'
import CartReducer from '../slices/CartSlice'



export const store = configureStore({
  reducer: {
    auth: authReducer,
    products: productsReducer,
    profile:profileReducer,
    orders: OrderReducer,
    orderItems: OrderItemReducer,
    payments: PaymentReducer,
    reviews: ReviewReducer,
    wishlist: WishlistReducer,
    contact: ContactReducer,
    cart: CartReducer,
  },
});