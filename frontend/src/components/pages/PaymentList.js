import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchPayments } from '../../slices/PaymentSlice';
import Header from '../Footer-Header/Header';
import Footer from '../Footer-Header/Footer';

const PaymentList = () => {
  const dispatch = useDispatch();
  const { items: payments, status, error } = useSelector((state) => state.payments);

  useEffect(() => {
    dispatch(fetchPayments());
  }, [dispatch]);

  if (status === 'loading') return <div>Loading payments...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!payments.length) return <div>No payment history found</div>;

  return (
    <>
    <Header />
    <div className="container mx-auto p-4">
      <h1 className="text-2xl font-bold mb-4">Payment History</h1>
      <div className="space-y-4">
        {payments.map(payment => (
          <div key={payment.id} className="border rounded-lg p-4 shadow-sm">
            <div className="flex justify-between items-center">
              <div>
                <h2 className="text-lg font-semibold">Payment #{payment.id}</h2>
                <p className="text-gray-600">Amount: ${payment.amount}</p>
                <p className="text-gray-600">Method: {payment.payment_method}</p>
                <p className="text-gray-600">Date: {new Date(payment.timestamp).toLocaleDateString()}</p>
              </div>
              <span className={`px-2 py-1 rounded ${payment.status === 'completed' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
                {payment.status}
              </span>
            </div>
            {payment.transaction_id && (
              <div className="mt-2">
                <p className="text-sm text-gray-500">Transaction ID: {payment.transaction_id}</p>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
    <Footer />
    </>
  );
};

export default PaymentList;