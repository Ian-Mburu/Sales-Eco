import React, { useEffect } from 'react';
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
import { fetchWishlist, addToWishlist } from '../../slices/WishlistSlice';

const ProductList = () => {
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

  // Add this validation
if (!Array.isArray(products)) {
  return <div className="text-center py-8">Invalid products data format</div>;
}

  const handleCart = (productId, e) => {
    e.preventDefault();
    dispatch(addToCart({ productId, quantity: 1 }));
  };

  const handleLike = (productId, e) => {
    e.preventDefault();
    dispatch(likeProduct(productId));
  };

  const handleWishlist = (productId, e) => {
    e.preventDefault();
    dispatch(addToWishlist(productId))
      .unwrap()
      .then(() => {
        dispatch(fetchWishlist());  // Refresh wishlist after adding
      })
      .catch((error) => {
        console.error("Wishlist error:", error);
      });
  };

  if (productsStatus === 'loading') return <div className="text-center py-8"><Loader /></div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-8">No products found</div>;

  return (
    <>
      <Header />
      <div className='categories-prd'>
        <CategoriesList />
      </div>
      
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
                      <IoMdHeart className="like-icon" />
                    ) : (
                      <IoMdHeartEmpty className="like-icon" />
                    )}
                  </button>
                  <p className="likes-prd">{product.likes_count}</p>
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