import React, { useState, useEffect } from 'react';
import API from '../../services/api';

const CartList = () => {
    const [cartItems, setCartItems] = useState([]);

    useEffect(() => {
        fetchCart();
    }, []);

    const fetchCart = async () => {
      try {
          const response = await API.get('/cart/');
          console.log("Cart Response:", response.data); 
          setCartItems(response.data);
      } catch (error) {
          console.error('Error fetching cart:', error);
      }
  };
  

    const updateCartItem = async (cartId, quantity) => {
        if (quantity < 1) {
            removeCartItem(cartId);
            return;
        }

        try {
            await API.put(`/api/cart/update/${cartId}/`, { quantity }); // Use API
            fetchCart();
        } catch (error) {
            console.error('Error updating cart:', error);
        }
    };

    const removeCartItem = async (cartId) => {
        try {
            await API.delete(`/api/cart/remove/${cartId}/`); // Use API
            setCartItems(cartItems.filter(item => item.id !== cartId));
        } catch (error) {
            console.error('Error removing item from cart:', error);
        }
    };

    return (
      <div>
      <h2>Your Cart</h2>
      {cartItems.length === 0 ? (
          <p>Your cart is empty.</p>
      ) : (
          <div className="cart-list">
              {cartItems.map(item => (
                  <div key={item.id} className="cart-item">
                      <h3>{item.product.title}</h3>
                      <p>Price: ${item.product.price}</p>
                      <label>
                          Quantity:
                          <input 
                              type="number" 
                              value={item.quantity} 
                              min="1" 
                              onChange={(e) => updateCartItem(item.id, parseInt(e.target.value))}
                          />
                      </label>
                      <button onClick={() => removeCartItem(item.id)}>Remove</button>
                  </div>
              ))}
          </div>
      )}
  </div>
    );
};

export default CartList;
