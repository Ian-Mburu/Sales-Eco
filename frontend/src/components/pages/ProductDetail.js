// src/components/Products/ProductDetail.js
import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { fetchProductDetail } from '../../services/api';
// import AddToCart from '../Cart/AddToCart';

const ProductDetail = () => {
  const { slug } = useParams();
  const dispatch = useDispatch();
  const { product} = useSelector((state) => state.products);

  useEffect(() => {
    dispatch(fetchProductDetail(slug));
  }, [dispatch, slug]);

  return (
    <div className="product-detail">
      {product && (
        <>
          <h1>{product.title}</h1>
          <img src={product.image} alt={product.title} />
          <p>{product.description}</p>
          <p>Price: ${product.price}</p>
          {/* <AddToCart product={product} /> */}
        </>
      )}
    </div>
  );
};

export default ProductDetail;