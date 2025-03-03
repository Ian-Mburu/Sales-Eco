import React, { useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { fetchOrderItems } from '../../slices/OrderItemSlice';

const OrderDetail = () => {
  const { id } = useParams();
  const dispatch = useDispatch();
  const { items: orderItems, status } = useSelector((state) => state.orderItems);
  const order = useSelector((state) => 
    state.orders.items.find(order => order.id === Number(id))
  );

  useEffect(() => {
    dispatch(fetchOrderItems());
  }, [dispatch, id]);

  if (!order) return <div>Order not found</div>;
  if (status === 'loading') return <div>Loading order details...</div>;

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Order #{order.id}</h1>
      <div className="bg-white rounded-lg shadow-md p-6">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-2">Order Summary</h2>
          <p>Status: <span className="capitalize">{order.status}</span></p>
          <p>Total Price: ${order.total_price}</p>
          <p>Date: {new Date(order.date).toLocaleDateString()}</p>
        </div>

        <h3 className="text-lg font-semibold mb-4">Items</h3>
        <div className="space-y-4">
          {orderItems.filter(item => item.order === order.id).map(item => (
            <div key={item.id} className="border-b pb-4">
              <div className="flex justify-between items-center">
                <div>
                  <h4 className="font-medium">{item.product.title}</h4>
                  <p>Quantity: {item.quantity}</p>
                </div>
                <p>${item.total_price}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default OrderDetail;