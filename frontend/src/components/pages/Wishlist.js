import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchWishlist, removeFromWishlist } from '../../slices/WishlistSlice';
import { Link } from 'react-router-dom';

const Wishlist = () => {
  const dispatch = useDispatch();
  const { items, status, error } = useSelector((state) => state.wishlist);
  const { user } = useSelector((state) => state.auth);

  useEffect(() => {
    if (user) {
      dispatch(fetchWishlist());
    }
  }, [dispatch, user]);

  const handleRemove = (itemId) => {
    dispatch(removeFromWishlist(itemId));
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Wishlist</h1>
      {status === 'loading' ? (
        <div className="text-center py-8">Loading wishlist...</div>
      ) : error ? (
        <div className="text-red-500 text-center">{error}</div>
      ) : items.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {items.map((item) => {
            const product = item.product; // Extract product from wishlist item
            return (
              <div key={item.id} className="border rounded-lg p-4 hover:shadow-lg transition-shadow">
                <Link 
                  to={`/products/${product.slug}`} 
                  className="block mb-2"
                >
                  <img 
                    src={product.image || '/placeholder-product.jpg'} 
                    alt={product.title}
                    className="w-full h-48 object-cover mb-2 rounded"
                    onError={(e) => e.target.src = '/placeholder-product.jpg'}
                  />
                  <h3 className="font-semibold text-lg">{product.title}</h3>
                  <p className="text-gray-600">${product.price}</p>
                  <p className="text-sm text-gray-500">
                    In stock: {product.quantity > 0 ? 'Yes' : 'No'}
                  </p>
                </Link>
                <button
                  onClick={() => handleRemove(item.id)}
                  className="mt-2 text-red-600 hover:text-red-800 font-medium w-full py-1 border border-red-600 rounded hover:bg-red-50 transition-colors"
                >
                  Remove
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <div className="text-center py-8 text-gray-500">
          Your wishlist is empty. Start adding products!
        </div>
      )}
    </div>
  );
};

export default Wishlist;