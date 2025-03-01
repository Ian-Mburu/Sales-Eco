import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { getProducts } from '../../slices/productsSlice';
import axios from 'axios';

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


  // Loading and error states
  if (status === 'loading') return <div className="text-center py-8">Loading products...</div>;
  if (error) return <div className="text-red-500 text-center py-8">Error: {error}</div>;
  if (!products.length) return <div className="text-center py-8">No products found</div>;

  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-6 p-4">
      {products.map(product => (
        <div key={product.id} className="border rounded-lg overflow-hidden shadow-lg">
          <Link to={`/products/${product.slug}`} className="block">
          <img className='prd-image' src={product.image} alt={product.title} />
            <div className="p-4">
              <h3 className="font-bold text-lg mb-2">{product.title}</h3>
              <p className="text-gray-700">{product.description}</p>
              <p className="text-gray-700">${product.price}</p>
              <p className="text-gray-700">{product.quantity}</p>
              <p className="text-gray-700">{product.likes_count}</p>
              <button onClick={() => addToCart(product.id)}>Add to Cart</button>
            </div>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;