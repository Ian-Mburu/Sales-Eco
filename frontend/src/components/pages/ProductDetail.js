// src/components/Products/ProductDetail.js
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { getProductDetail } from '../../slices/productsSlice';
import axios from 'axios';
// import AddToCart from '../Cart/AddToCart';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const [quantity] = useState(1);
  const { product} = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(getProductDetail(slug));
  }, [dispatch, slug]);

  const addToCart = async () => {
    try {
        await axios.post('/api/cart/add/', { product_id: product.id, quantity });
        alert('Product added to cart!');
    } catch (error) {
        console.error('Error adding to cart:', error);
    }
};

  return (
    <div className="product-detail">
      {product && (
        <>
          <h1>{product.title}</h1>
          <img src={product.image} alt={product.title} />
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          <p className="date-posted">Posted on: {product.date_posted}</p>
          <button onClick={addToCart}>Add to Cart</button>
        </>
      )}
    </div>
  );
};

export default ProductDetail;