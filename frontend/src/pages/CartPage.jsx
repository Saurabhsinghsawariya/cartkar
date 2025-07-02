// frontend/src/pages/CartPage.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const navigate = useNavigate();

  // Load cart items from localStorage on component mount
  useEffect(() => {
    const storedCartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
    setCartItems(storedCartItems);
  }, []);

  // Update quantity handler
  const updateQuantityHandler = (id, newQty) => {
    const updatedCartItems = cartItems.map((item) =>
      item.product === id ? { ...item, qty: Number(newQty) } : item
    );
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  // Remove item handler
  const removeItemHandler = (id) => {
    const updatedCartItems = cartItems.filter((item) => item.product !== id);
    setCartItems(updatedCartItems);
    localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
  };

  // Calculate total price
  const totalPrice = cartItems.reduce((acc, item) => acc + item.qty * item.price, 0).toFixed(2);

  // Proceed to Checkout handler (placeholder for now)
  const checkoutHandler = () => {
    navigate('/login?redirect=/shipping'); // Redirect to login, then to shipping
  };

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Shopping Cart</h1>

      {cartItems.length === 0 ? (
        <div className="bg-blue-100 border border-blue-400 text-blue-700 px-4 py-3 rounded relative text-center text-xl">
          Your cart is empty. <Link to="/" className="text-blue-800 hover:underline">Go back to shopping</Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Cart Items List */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-md p-6">
            {cartItems.map((item) => (
              <div key={item.product} className="flex items-center justify-between border-b py-4">
                <div className="flex items-center space-x-4">
                  <Link to={`/product/${item.product}`}>
                    <img src={item.image} alt={item.name} className="w-20 h-20 object-cover rounded-md" />
                  </Link>
                  <div>
                    <Link to={`/product/${item.product}`}>
                      <h3 className="text-lg font-semibold hover:text-blue-600">{item.name}</h3>
                    </Link>
                    <p className="text-gray-600">${item.price.toFixed(2)}</p>
                  </div>
                </div>
                <div className="flex items-center space-x-4">
                  <select
                    className="p-2 border rounded-md"
                    value={item.qty}
                    onChange={(e) => updateQuantityHandler(item.product, e.target.value)}
                  >
                    {[...Array(item.countInStock).keys()].map((x) => (
                      <option key={x + 1} value={x + 1}>
                        {x + 1}
                      </option>
                    ))}
                  </select>
                  <button
                    onClick={() => removeItemHandler(item.product)}
                    className="text-red-500 hover:text-red-700 focus:outline-none"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16"></path></svg>
                  </button>
                </div>
              </div>
            ))}
          </div>

          {/* Order Summary */}
          <div className="lg:col-span-1 bg-white rounded-lg shadow-md p-6 h-fit">
            <h2 className="text-2xl font-bold mb-4 border-b pb-2">Order Summary</h2>
            <div className="flex justify-between mb-2 text-lg">
              <span>Items ({cartItems.reduce((acc, item) => acc + item.qty, 0)})</span>
              <span>${totalPrice}</span>
            </div>
            <button
              onClick={checkoutHandler}
              className="bg-green-600 hover:bg-green-700 text-white font-bold py-3 px-6 rounded-lg text-lg w-full mt-4"
              disabled={cartItems.length === 0}
            >
              Proceed To Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;