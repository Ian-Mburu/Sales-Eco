import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts, addToCart } from '../../slices/productsSlice';
import Footer from '../Footer-Header/Footer';
import Header from '../Footer-Header/Header';
import '../../styles/pages/productList.css';
import { IoMdHeartEmpty } from "react-icons/io";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import CategoriesList from '../../components/pages/CategoriesList';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, productsStatus, error, cartStatus } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const handleAddToCart = (productId, e) => {
    e.preventDefault(); // Prevent link navigation when clicking the cart button
    dispatch(addToCart(productId));
  };

  if (productsStatus === 'loading') return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!products || products.length === 0) return <div className="text-center py-8">No products found</div>;

  return (
    <>
      <Header />
      <CategoriesList />
      <div className="prd-list">
        {products.map(product => (
          <div key={product.id} className="prd-list2">
            <Link to={`/products/${product.slug}`} className="block">
              <div className="seller-info">
                <Link 
                  to={`/profile/${product.seller.username}`} 
                  className="seller-link"
                  onClick={(e) => e.stopPropagation()} // Prevent conflict with outer link
                >
                  <img src={product.seller.image} alt={product.seller.username} className="seller-img" />
                  <p className='seller-username'>{product.seller.username}</p>
                </Link>
                <Link 
                  className='add-cart' 
                  onClick={(e) => handleAddToCart(product.id, e)}
                  disabled={cartStatus === 'loading'}
                >
                  <FaShoppingCart className='cart-icon' />
                </Link>
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
                  <IoMdHeartEmpty className='like-icon' />
                  <p className="likes-prd"> {product.likes_count}</p>
                </div>
                
                <Link to="#" className='add-wishlist'><FaHeart className='wishlist-icon' /></Link>
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
