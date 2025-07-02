// frontend/src/components/CheckoutSteps.jsx
import { Link } from 'react-router-dom';

const CheckoutSteps = ({ step1, step2, step3, step4 }) => {
  return (
    <div className="flex justify-center mb-6">
      <div className="flex space-x-4">
        {/* Login Step */}
        <div className={`px-4 py-2 rounded-md ${step1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {step1 ? (
            <Link to="/login" className="font-semibold">Login</Link>
          ) : (
            <span className="text-gray-500">Login</span>
          )}
        </div>

        {/* Shipping Step */}
        <div className={`px-4 py-2 rounded-md ${step2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {step2 ? (
            <Link to="/shipping" className="font-semibold">Shipping</Link>
          ) : (
            <span className="text-gray-500">Shipping</span>
          )}
        </div>

        {/* Payment Step */}
        <div className={`px-4 py-2 rounded-md ${step3 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {step3 ? (
            <Link to="/payment" className="font-semibold">Payment</Link>
          ) : (
            <span className="text-gray-500">Payment</span>
          )}
        </div>

        {/* Place Order Step */}
        <div className={`px-4 py-2 rounded-md ${step4 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700'}`}>
          {step4 ? (
            <Link to="/placeorder" className="font-semibold">Place Order</Link>
          ) : (
            <span className="text-gray-500">Place Order</span>
          )}
        </div>
      </div>
    </div>
  );
};

export default CheckoutSteps;