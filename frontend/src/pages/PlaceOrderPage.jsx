// frontend/src/pages/PlaceOrderPage.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps';

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  // Get cart items, shipping address, payment method from localStorage
  const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
  const shippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};
  const paymentMethod = localStorage.getItem('paymentMethod') || 'PayPal';
  const userInfo = JSON.parse(localStorage.getItem('userInfo')) || null;

  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Calculate prices
  const itemsPrice = cartItems.reduce((acc, item) => acc + item.price * item.qty, 0);
  const shippingPrice = itemsPrice > 100 ? 0 : 10; // Example: Free shipping over $100
  const taxPrice = 0.15 * itemsPrice; // Example: 15% tax
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // Check if required info is present
  useEffect(() => {
    if (!userInfo) {
      navigate('/login?redirect=/placeorder');
    } else if (cartItems.length === 0) {
      navigate('/cart');
    } else if (!shippingAddress.address) {
      navigate('/shipping');
    } else if (!paymentMethod) {
      navigate('/payment');
    }
  }, [navigate, userInfo, cartItems, shippingAddress, paymentMethod]);


  const placeOrderHandler = async () => {
    setLoading(true);
    setError('');
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const { data } = await axios.post(
        '/api/orders',
        {
          orderItems: cartItems,
          shippingAddress,
          paymentMethod,
          itemsPrice: itemsPrice.toFixed(2), // Send fixed to 2 decimal places
          shippingPrice: shippingPrice.toFixed(2),
          taxPrice: taxPrice.toFixed(2),
          totalPrice: totalPrice.toFixed(2),
        },
        config
      );

      setLoading(false);
      localStorage.removeItem('cartItems'); // Clear cart after successful order
      navigate(`/order/${data._id}`); // Navigate to order details page (future)
    } catch (err) {
      setLoading(false);
      setError(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message
      );
    }
  };

  return (
    <div className="container mx-auto p-4">
      <CheckoutSteps step1 step2 step3 step4 /> {/* Highlight Place Order step */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Place Order</h1>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Order Details Column */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Shipping</h2>
            <p className="mb-2">
              <strong className="font-semibold">Address:</strong> {shippingAddress.address},{' '}
              {shippingAddress.city}, {shippingAddress.address} {shippingAddress.postalCode},{' '}
              {shippingAddress.country}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Payment Method</h2>
            <p className="mb-2">
              <strong className="font-semibold">Method:</strong> {paymentMethod}
            </p>
          </div>

          <div className="bg-white rounded-lg shadow-md p-6 mb-6">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Items</h2>
            {cartItems.length === 0 ? (
              <p>Your cart is empty.</p>
            ) : (
              <ul className="divide-y divide-gray-200">
                {cartItems.map((item) => (
                  <li key={item.product} className="py-3 flex items-center justify-between">
                    <div className="flex items-center space-x-4">
                      <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                      <Link to={`/product/${item.product}`} className="text-blue-600 hover:underline text-lg font-medium">
                        {item.name}
                      </Link>
                    </div>
                    <div className="text-gray-800 text-lg">
                      {item.qty} x ${item.price.toFixed(2)} = ${(item.qty * item.price).toFixed(2)}
                    </div>
                  </li>
                ))}
              </ul>
            )}
          </div>
        </div>

        {/* Order Summary Column */}
        <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit">
          <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Summary</h2>
          <div className="space-y-2 mb-4">
            <div className="flex justify-between text-lg">
              <span>Items</span>
              <span>${itemsPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Shipping</span>
              <span>${shippingPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-lg">
              <span>Tax</span>
              <span>${taxPrice.toFixed(2)}</span>
            </div>
            <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
              <span>Total</span>
              <span>${totalPrice.toFixed(2)}</span>
            </div>
          </div>

          {error && <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mb-4">{error}</div>}

          <button
            onClick={placeOrderHandler}
            className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg w-full"
            disabled={cartItems.length === 0 || loading}
          >
            {loading ? 'Placing Order...' : 'Place Order'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderPage;