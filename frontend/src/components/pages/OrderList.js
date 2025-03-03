import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { fetchOrders } from '../../slices/OrderSlice';

const OrderList = () => {
  const dispatch = useDispatch();
  const { items: orders, status, error } = useSelector((state) => state.orders);

  useEffect(() => {
    dispatch(fetchOrders());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading orders...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">My Orders</h1>
      <div className="space-y-4">
        {orders.map(order => (
          <div key={order.id} className="border rounded-lg p-4 shadow-sm">
            <Link to={`/orders/${order.id}`} className="block">
              <div className="flex justify-between items-center">
                <div>
                  <h2 className="text-lg font-semibold">Order #{order.id}</h2>
                  <p className="text-gray-600">Status: {order.status}</p>
                  <p className="text-gray-600">Total: ${order.total_price}</p>
                </div>
                <span className="text-blue-600 hover:text-blue-800">View Details →</span>
              </div>
            </Link>
          </div>
        ))}
      </div>
    </div>
  );
};

export default OrderList;