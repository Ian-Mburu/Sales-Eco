import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../slices/WishlistSlice';
import { Link, useNavigate } from 'react-router-dom';
import '../../styles/pages/wishlist.css'
import Header from '../Footer-Header/Header';
import Footer from '../Footer-Header/Footer';


const Wishlist = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { items, status, error } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (!user) {
      navigate('/login'); // Redirect to login if user is not authenticated
    } else {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user, navigate]);

  const handleRemove = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };

  if (!user) {
    return null; // Prevents flickering before redirection
  }

  return (
    <>
    <Header />
    <div className="wishlist-container">
      <h1 className="wishlist-title">My Wishlist</h1>
      {status === 'loading' ? (
        <div className="wishlist-loading">Login to view your wishlist <a className='wishlist-login' href='/login'>Login</a> </div>
      ) : error ? (
        <div className="wishlist-error">{error}</div>
      ) : items.length > 0 ? ( 
        <div className="wishlist-grid">
          {items.map((item) => {
            const product = item.product;
            return (
              <div key={item.id} className="wishlist-item">
                <Link to={`/products/${product.slug}`} className="wishlist-link">
                  <img 
                    src={product.image || '/placeholder-product.jpg'} 
                    alt={product.title}
                    className="wishlist-image"
                    onError={(e) => (e.target.src = '/placeholder-product.jpg')}
                  />
                  <h3 className="wishlist-product-title">{product.title}</h3>
                  <p className="wishlist-price">${product.price}</p>
                  <p className="wishlist-stock">
                    In stock: {product.quantity > 0 ? 'Yes' : 'No'}
                  </p>
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="wishlist-remove-btn"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="wishlist-empty">Your wishlist is empty. Start adding products!</div>
      )}
    </div>
    <Footer />
    </>
  );
};

export default Wishlist;
