import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../slices/productsSlice';
import axios from 'axios';
import Footer from '../Footer-Header/Footer';
import Header from '../Footer-Header/Header';
import '../../styles/pages/productList.css';
import { IoMdHeartEmpty } from "react-icons/io";
import { FaHeart, FaShoppingCart } from "react-icons/fa";
import CategoriesList from '../../components/pages/CategoriesList'

const ProductList = () => {
  const dispatch = useDispatch();
  const { products, status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  const addToCart = async (productId) => {
    try {
        await axios.post('/api/cart/add/', { product_id: productId });
        alert('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
  };

  if (status === 'loading') return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!products.length) return <div className="text-center py-8">No products found</div>;

  return (
    <>
      <Header />
      <CategoriesList />
      <div className="prd-list">
        {products.map(product => (
          <div key={product.id} className="prd-list2">
            <Link to={`/products/${product.slug}`} className="block">

                <div className="seller-info">
                  <Link to={`/profile/${product.seller.username}`} className="seller-link">
                    <img src={product.seller.image} alt={product.seller.username} className="seller-img" />
                    <p>{product.seller.username}</p>
                  </Link>
                  <Link className='add-cart' onClick={() => addToCart(product.id)}><FaShoppingCart /></Link>
                </div>

              <img className='prd-image' src={product.image} alt={product.title} />
              </Link>
              
              <div className="prd-3">
                <div className='title-price-div '>
                <Link to={`/products/${product.slug}`} className="block">
                  <h3 className="title-prd">{product.title}</h3>
                </Link>
                  <p className="price-prd">${product.price}</p>
                </div>
                
              <div className='date-prd'>
                <p className="date-posted">Posted on: {product.date_posted}</p>
                <div className='likes'>
                  <IoMdHeartEmpty className='like-icon' />
                <p className="likes-prd"> {product.likes_count}</p>
                </div>
                
                <Link className='add-wishlist'><FaHeart /></Link>
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
