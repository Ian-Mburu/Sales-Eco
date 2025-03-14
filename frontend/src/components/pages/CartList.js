import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { motion, AnimatePresence } from 'framer-motion';
import { fetchCart, updateCartItem, removeCartItem } from '../../slices/CartSlice';
import '../../styles/pages/cart.css';
import Header from '../Footer-Header/Header';
import Footer from '../Footer-Header/Footer';
import { useNavigate } from 'react-router-dom';
import { FaTrash, FaPlus, FaMinus } from 'react-icons/fa';

const CartList = () => {
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const { items: cartItems, loading } = useSelector(state => state.cart);

    useEffect(() => {
        dispatch(fetchCart());
    }, [dispatch]);

    const handleUpdateCart = async (cartId, quantity) => {
        if (quantity < 1) return;
        await dispatch(updateCartItem({ cartId, quantity }));
        dispatch(fetchCart()); // Re-fetch cart after update
    };
    
    const handleRemoveCart = async (cartId) => {
        await dispatch(removeCartItem(cartId));
        dispatch(fetchCart()); // Re-fetch cart after removal
    };
    

    const calculateTotal = () => {
        if (!cartItems || cartItems.length === 0) return "0.00";
      
        return cartItems.reduce((total, item) => {
          // Handle both backend-calculated total and client-side verification
          const backendTotal = parseFloat(item?.total_price) || 0;
          const clientCalculated = (item?.product?.price || 0) * (item?.quantity || 0);
          
          // Prefer backend calculation but fallback to client-side
          return total + (backendTotal > 0 ? backendTotal : clientCalculated);
        }, 0).toLocaleString('en-US', {
          style: 'currency',
          currency: 'USD',
          minimumFractionDigits: 2,
          maximumFractionDigits: 2
        });
      };
    
    
    

    if (loading) return (
        <div className="loading-container">
            <div className="loading-spinner"></div>
        </div>
    );

    return (
        <>
            <Header />
            <motion.div className="cart-container" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                <h1 className="cart-header">Your Shopping Cart</h1>
                <AnimatePresence>
                    {cartItems.length === 0 ? (
                        <motion.div className="empty-cart" initial={{ scale: 0.8 }} animate={{ scale: 1 }}>
                            <h2>Your cart is empty</h2>
                            <p>Start adding items to see them here!</p>
                        </motion.div>
                    ) : (
                        <>
                            <div className="cart-items">
                                <AnimatePresence>
                                    {cartItems.map(item => (
                                        <motion.div key={item.id} className="cart-item" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, x: 50 }} transition={{ duration: 0.3 }}>
                                            <div className="item-image">
                                            <img src={item.product_image} alt={item.product.title} />
                                            </div>
                                            <div className="item-details">
                                                <h3>{item.product.title}</h3>
                                                <p className="price-prd">${item.product.price}</p>

                                                <p className="item-total">
                                                    Total: ${(item.product.price * item.quantity).toFixed(2)}
                                                </p>
                                            </div>
                                            <div className="quantity-controls">
                                                <button onClick={() => handleUpdateCart(item.id, item.quantity - 1)} disabled={item.quantity <= 1}>
                                                    <FaMinus />
                                                </button>
                                                <input type="number" value={item.quantity} min="1" onChange={(e) => handleUpdateCart(item.id, parseInt(e.target.value))} />
                                                <button onClick={() => handleUpdateCart(item.id, item.quantity + 1)}>
                                                    <FaPlus />
                                                </button>
                                            </div>
                                            <button className="remove-button" onClick={() => handleRemoveCart(item.id)}>
                                                <FaTrash />
                                            </button>
                                        </motion.div>
                                    ))}
                                </AnimatePresence>
                            </div>
                            <motion.div className="cart-summary" initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
                                <h3>Order Summary</h3>
                                <div className="summary-row">
                                    <span>Subtotal ({cartItems.length} items)</span>
                                    <span>{calculateTotal()}</span>
                                </div>
                                <button 
    className="checkout-button" 
    onClick={() => navigate('/payments', { state: { totalAmount: calculateTotal() } })}
>
    Proceed to Checkout
</button>

                            </motion.div>
                        </>
                    )}
                </AnimatePresence>
            </motion.div>
            <Footer />
        </>
    );
};

export default CartList;
