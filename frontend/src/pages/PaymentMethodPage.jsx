// frontend/src/pages/PaymentMethodPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const PaymentMethodPage = () => {
  const navigate = useNavigate();

  // Load saved payment method from localStorage if exists
  const storedPaymentMethod = localStorage.getItem('paymentMethod') || 'PayPal';

  const [paymentMethod, setPaymentMethod] = useState(storedPaymentMethod);

  // Check if user is logged in and shipping address is set
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    const shippingAddress = localStorage.getItem('shippingAddress');
    if (!userInfo) {
      navigate('/login?redirect=/payment');
    } else if (!shippingAddress) {
      navigate('/shipping'); // Redirect to shipping if not set
    }
  }, [navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    localStorage.setItem('paymentMethod', paymentMethod);
    navigate('/placeorder'); // Move to place order summary
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <CheckoutSteps step1 step2 step3 /> {/* Highlight Payment step */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Payment Method</h1>
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-6">
          <h2 className="text-xl font-semibold mb-4">Select Method</h2>
          <div className="flex items-center mb-4">
            <input
              type="radio"
              id="PayPal"
              name="paymentMethod"
              value="PayPal"
              checked={paymentMethod === 'PayPal'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="mr-2 h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300"
            />
            <label htmlFor="PayPal" className="text-gray-700 text-lg">
              PayPal or Credit Card
            </label>
          </div>
          {/* You can add more payment options here */}
        </div>
        <button
          type="submit"
          className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded focus:outline-none focus:shadow-outline w-full"
        >
          Continue
        </button>
      </form>
    </div>
  );
};

export default PaymentMethodPage;