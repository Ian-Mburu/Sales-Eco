import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { 
  getProducts, 
  addToCart,
  likeProduct,
} from '../../slices/productsSlice';
import Footer from '../Footer-Header/Footer';
import Header from '../Footer-Header/Header';
import '../../styles/pages/productList.css';
import { IoMdHeartEmpty, IoMdHeart } from "react-icons/io";
import { FaHeart, FaRegHeart, FaShoppingCart } from "react-icons/fa";
import CategoriesList from '../../components/pages/CategoriesList';
import Loader from '../../components/Loader/Loader';
import { addToWishlist } from '../../slices/WishlistSlice';

const ProductList = () => {
  const [feedback, setFeedback] = useState(null);
  // const { wishlistItems } = useSelector((state) => state.wishlist);

  const dispatch = useDispatch();
  const { 
  products = [], // Default to an empty array if undefined
  productsStatus, 
  error, 
  cartStatus,
  likeStatus,
  wishlistStatus,
  currentProductId
  } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  // Clear feedback messages after 3 seconds
  useEffect(() => {
    if (feedback) {
      const timer = setTimeout(() => setFeedback(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [feedback]);

  useEffect(() => {
    console.log('Products updated:', products);
  }, [products]);

  const handleCart = async (productId, e) => {
    e.preventDefault();
    const product = products.find(p => p.id === productId);
    if (product.is_in_cart) {
      setFeedback({ type: 'error', message: 'Already in cart!' });
      return;
    }
    try {
      await dispatch(addToCart({ productId, quantity: 1 })).unwrap();
      setFeedback({ type: 'success', message: 'Added to cart!' });
    } catch (error) {
      setFeedback({ type: 'error', message: 'Failed to add to cart' });
    }
  };


  // Handle like action
  const handleLike = async (productId, e) => {
    e.preventDefault();
    try {
      // Immediate UI update
      const productIndex = products.findIndex(p => p.id === productId);
      const updatedProducts = [...products];
      const currentLikeStatus = updatedProducts[productIndex].has_liked;
      const currentLikes = updatedProducts[productIndex].likes_count;
      
      // Optimistic update
      updatedProducts[productIndex] = {
        ...updatedProducts[productIndex],
        has_liked: !currentLikeStatus,
        likes_count: currentLikeStatus ? currentLikes - 1 : currentLikes + 1
      };
      dispatch({ type: 'products/getAll/fulfilled', payload: updatedProducts });

      // Dispatch actual API call
      await dispatch(likeProduct(productId)).unwrap();
    } catch (error) {
      // Rollback on error
      dispatch(getProducts());
      setFeedback({ 
        type: 'error', 
        message: error.detail || error.message || 'Failed to update like' 
      });
    }
  };


  // Handle add to wishlist action
  const handleWishlist = async (productId, e) => {
    e.preventDefault();
    try {
      await dispatch(addToWishlist(productId)).unwrap();
      setFeedback({ type: 'success', message: 'Added to wishlist!' });
    } catch (error) {
      setFeedback({ type: 'error', message: error });
    }
  };

    // Add this validation
if (!Array.isArray(products)) {
  return <div className="text-center py-8">Invalid products data format</div>;
}

  if (productsStatus === 'loading') return <div className="text-center py-8"><Loader /></div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-8">No products found</div>;

  return (
    <>
      <Header />
      <div className='categories-prd'>
        <CategoriesList />
      </div>

      {/* Feedback messages */}
      {feedback && (
        <div className={`feedback-message ${feedback.type}`}>
          {feedback.message}
        </div>
      )}
      
      <div className="prd-list">
        {products.map(product => (
          <div key={product.id} className="prd-list2">
            <Link to={`/products/${product.slug}`} className="block">
              <div className="seller-info">
                <Link 
                  to={`/profile/${product.seller.username}`} 
                  className="seller-link"
                  onClick={(e) => e.stopPropagation()}
                >
                  <img src={product.seller.image} alt={product.seller.username} className="seller-img" />
                  <p className='seller-username'>{product.seller.username}</p>
                </Link>
                
                <button 
                  className='add-cart' 
                  onClick={(e) => handleCart(product.id, e)}
                  disabled={cartStatus === 'loading' && currentProductId === product.id}
                >
                  {cartStatus === 'loading' && currentProductId === product.id ? (
                    <Loader size="small" />
                  ) : (
                    <FaShoppingCart className='cart-icon' />
                  )}
                </button>
              </div>

              <img className='prd-image' src={product.image} alt={product.title} />
            </Link>
              
            <div className="prd-3">
              <div className='title-price-div'>
                <Link to={`/products/${product.slug}`} className="block">
                  <h3 className="title-prd">{product.title}</h3>
                </Link>
                <p className="price-prd">${product.price}</p>
              </div>
              
              <div className='date-prd'>
                <div className='likes'>
                <button 
        onClick={(e) => handleLike(product.id, e)}
        disabled={likeStatus === 'loading' && currentProductId === product.id}
        className='add-like'
      >
        {product.has_liked ? (
          <IoMdHeart className="like-icon text-red-500 animate-pulse" />
        ) : (
          <IoMdHeartEmpty className="like-icon hover:text-red-300" />
        )}
      </button>
      <p className="likes-prd transition-all duration-300">
        {product.likes_count}
      </p>
                </div>
                
                <button 
                  onClick={(e) => handleWishlist(product.id, e)}
                  disabled={wishlistStatus === 'loading' && currentProductId === product.id}
                  className='add-wishlist'
                >
                  {product.is_in_wishlist ? (
                    <FaHeart className='wishlist-icon' />
                  ) : (
                    <FaRegHeart className='wishlist-icon' />
                  )}
                </button>
              </div>  
            </div>
          </div>
        ))}
      </div>
      <Footer />
    </>
  );
};

export default ProductList;