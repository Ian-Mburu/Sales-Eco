import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PaymentSuccess = () => {
  return (
    <motion.div 
      className="min-h-screen flex items-center justify-center"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
    >
      <div className="text-center max-w-md p-8 bg-white rounded-lg shadow-lg">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-2xl font-bold mb-4">Payment Successful!</h1>
        <p className="text-gray-600 mb-6">
          Thank you for your purchase. Your payment has been processed successfully.
        </p>
        <Link 
          to="/orders"
          className="inline-block bg-blue-600 text-white px-6 py-2 rounded hover:bg-blue-700"
        >
          View Orders
        </Link>
      </div>
    </motion.div>
  );
};

export default PaymentSuccess;