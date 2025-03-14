import React, { useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import PaymentService from '../../services/paymentService';
import Header from '../Footer-Header/Header'
import Footer from '../Footer-Header/Footer'
import '../../styles/pages/paymentList.css';

const PaymentList = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { totalAmount } = location.state || {};
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    expiry: '',
    cvc: '',
    name: ''
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await PaymentService.processPayment({
        amount: totalAmount,
        paymentDetails
      });
      navigate('/payment-success');
    } catch (err) {
      setError('Payment failed. Please check your details and try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
    <Header />
    <div className='payment-container'>
      <h1 className="payment-title">Payment Checkout</h1>
      {totalAmount ? (
        <div className="payment-box">
          <div className="payment-summary">
            <h2 className="summary-title">Total Amount:</h2>
            <p className="summary-amount">{totalAmount}</p>
          </div>

          <form onSubmit={handleSubmit} className="payment-form">
            <div className="input-group">
              <label className="input-label">Card Number</label>
              <input
                type="text"
                className="payment-input"
                placeholder="4242 4242 4242 4242"
                value={paymentDetails.cardNumber}
                onChange={(e) => setPaymentDetails({...paymentDetails, cardNumber: e.target.value})}
                required
              />
            </div>

            <div className="input-row">
              <div className="input-group">
                <label className="input-label">Expiry Date</label>
                <input
                  type="date"
                  className="payment-input"
                  placeholder="MM/YY"
                  value={paymentDetails.expiry}
                  onChange={(e) => setPaymentDetails({...paymentDetails, expiry: e.target.value})}
                  required
                />
              </div>
              
              <div className="input-group">
                <label className="input-label">CVC</label>
                <input
                  type="text"
                  className="payment-input"
                  placeholder="123"
                  value={paymentDetails.cvc}
                  onChange={(e) => setPaymentDetails({...paymentDetails, cvc: e.target.value})}
                  required
                />
              </div>
            </div>

            <div className="input-group">
              <label className="input-label">Cardholder Name</label>
              <input
                type="text"
                className="payment-input"
                placeholder="John Doe"
                value={paymentDetails.name}
                onChange={(e) => setPaymentDetails({...paymentDetails, name: e.target.value})}
                required
              />
            </div>

            {error && <p className="payment-error">{error}</p>}

            <button 
              type="submit"
              className="payment-button"
              disabled={loading}
            >
              {loading ? 'Processing...' : 'Pay Now'}
            </button>
          </form>
        </div>
      ) : (
        <div className="payment-error-box">
          <p className="error-text">No payment amount specified</p>
          <button 
            onClick={() => navigate('/cart')}
            className="return-button"
          >
            Return to Cart
          </button>
        </div>
      )}
      </div>
    <Footer />
    </>
  );
};

export default PaymentList;
