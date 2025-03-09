// src/components/Products/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetail } from '../../slices/productsSlice';
import axios from 'axios';
import Footer from '../Footer-Header/Footer';
import Header from '../Footer-Header/Header';
import '../../styles/pages/productDetails.css';
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import { motion } from 'framer-motion';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [quantity] = useState(1);
  const { product } = useSelector((state) => state.products);
  const [isImageLoaded, setIsImageLoaded] = useState(false);

  useEffect(() => {
    dispatch(getProductDetail(slug));
  }, [dispatch, slug]);

  const buttonVariants = {
    hover: { scale: 1.05 },
    tap: { scale: 0.95 }
  };

  const addToCart = async () => {
    try {
      await axios.post('/api/cart/add/', { product_id: product.id, quantity });
      alert('Product added to cart!');
    } catch (error) {
      console.error('Error adding to cart:', error);
    }
  };

  const addToWishlist = async () => {
    try {
      await axios.post('/api/wishlist/add/', { product_id: product.id });
      alert('Added to wishlist!');
    } catch (error) {
      console.error('Error adding to wishlist:', error);
    }
  };

  return (
    <>
      <Header />
      <div className="product-detail">
        {product ? (
          <div className='detail-page'>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: isImageLoaded ? 1 : 0 }}
              transition={{ duration: 0.5 }}
            >
              <img 
                className='detail-image' 
                src={product.image} 
                alt={product.title} 
                onLoad={() => setIsImageLoaded(true)}
              />
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="product-info"
            >
              <h1>{product.title}</h1>
              <p className='detail-desc'>{product.description}</p>
              
              <div className="meta-info">
                <p>Price: <span className="price">${product.price}</span></p>
                <p>Likes: {product.likes_count}</p>
                <p>Views: {product.views}</p>
                <p className="date-posted">Posted: {new Date(product.date_posted).toLocaleDateString()}</p>
              </div>

              <div className="button-group">
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={addToCart}
                >
                  <FaShoppingCart className='like-icon' /> Add to Cart
                </motion.button>
                
                <motion.button
                  variants={buttonVariants}
                  whileHover="hover"
                  whileTap="tap"
                  onClick={addToWishlist}
                >
                  <FaHeart className='wishlist-icon' /> Wishlist
                </motion.button>
              </div>
            </motion.div>
          </div>
        ) : (
          <div className="loading">Loading product details...</div>
        )}
      </div>
      <Footer />
    </>
  );
};

export default ProductDetail;