import React, { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';
import { getProducts } from '../../store/slices/productsSlice';

const ProductList = () => {
  const dispatch = useDispatch();
  const { products = [], status, error } = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProducts());
  }, [dispatch]);

  console.log('Redux products state:', products); // Add this for debugging

  if (status === 'loading') return <div>Loading products...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!products.length) return <div>No products available</div>;

  return (
    <div className="product-grid">
      {products.map(product => (
        <div key={product.id} className="product-card">
          <Link to={`/products/${product.slug}`}>
            <img 
              src={product.image || '/placeholder.jpg'} 
              alt={product.title}
              onError={(e) => e.target.src = '/placeholder.jpg'}
            />
            <h3>{product.title}</h3>
            <p>${product.price}</p>
          </Link>
        </div>
      ))}
    </div>
  );
};

export default ProductList;