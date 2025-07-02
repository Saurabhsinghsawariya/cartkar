// frontend/src/pages/OrderPage.jsx (or OrderDetailsPage.jsx)
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useParams } from 'react-router-dom';

const OrderPage = () => {
  const { id: orderId } = useParams(); // Get order ID from URL
  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchOrder = async () => {
      try {
        setLoading(true);
        const userInfo = JSON.parse(localStorage.getItem('userInfo'));

        if (!userInfo || !userInfo.token) {
          setError('Please log in to view order details.');
          setLoading(false);
          return;
        }

        const config = {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        };
        const { data } = await axios.get(`/api/orders/${orderId}`, config);
        setOrder(data);
        setLoading(false);
      } catch (err) {
        setLoading(false);
        setError(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message
        );
        console.error('Error fetching order details:', err);
      }
    };

    fetchOrder();
  }, [orderId]);

  return (
    <div className="container mx-auto p-4">
      <Link to="/profile" className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-6">
        Go Back To Profile
      </Link>
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Order {orderId}</h1>

      {loading ? (
        <div className="text-center text-xl text-gray-600">Loading order details...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">{error}</div>
      ) : order ? (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Order Details Column */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Shipping</h2>
              <p className="mb-2">
                <strong className="font-semibold">Name:</strong> {order.user.username}
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Email:</strong>{' '}
                <a href={`mailto:${order.user.email}`} className="text-blue-600 hover:underline">{order.user.email}</a>
              </p>
              <p className="mb-2">
                <strong className="font-semibold">Address:</strong> {order.shippingAddress.address},{' '}
                {order.shippingAddress.city}, {order.shippingAddress.postalCode},{' '}
                {order.shippingAddress.country}
              </p>
              {order.isDelivered ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
                  Delivered on {order.deliveredAt.substring(0, 10)}
                </div>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                  Not Delivered
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Payment Method</h2>
              <p className="mb-2">
                <strong className="font-semibold">Method:</strong> {order.paymentMethod}
              </p>
              {order.isPaid ? (
                <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded relative mt-4">
                  Paid on {order.paidAt.substring(0, 10)}
                </div>
              ) : (
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative mt-4">
                  Not Paid
                </div>
              )}
            </div>

            <div className="bg-white rounded-lg shadow-md p-6 mb-6">
              <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Items</h2>
              {order.orderItems.length === 0 ? (
                <p>Order is empty</p>
              ) : (
                <ul className="divide-y divide-gray-200">
                  {order.orderItems.map((item) => (
                    <li key={item.product._id || item.product} className="py-3 flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <img src={item.image} alt={item.name} className="w-16 h-16 object-cover rounded-md" />
                        <Link to={`/product/${item.product._id || item.product}`} className="text-blue-600 hover:underline text-lg font-medium">
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
                <span>${order.itemsPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Shipping</span>
                <span>${order.shippingPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-lg">
                <span>Tax</span>
                <span>${order.taxPrice.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold border-t pt-2 mt-2">
                <span>Total</span>
                <span>${order.totalPrice.toFixed(2)}</span>
              </div>
            </div>
            {/* Payment buttons (e.g., PayPal) would go here later */}
          </div>
        </div>
      ) : (
        <div>No order found.</div>
      )}
    </div>
  );
};

export default OrderPage;