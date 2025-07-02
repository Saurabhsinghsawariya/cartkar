// frontend/src/components/Header.jsx
import { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Header = () => {
  const navigate = useNavigate();
  const [userInfo, setUserInfo] = useState(null);
  const [cartCount, setCartCount] = useState(0);

  useEffect(() => {
    // Check user info from localStorage
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    }

    const updateCartCount = () => {
      const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];
      const totalCount = cartItems.reduce((acc, item) => acc + item.qty, 0);
      setCartCount(totalCount);
    };

    updateCartCount();
    window.addEventListener('storage', updateCartCount);

    return () => {
      window.removeEventListener('storage', updateCartCount);
    };
  }, []);

  const logoutHandler = () => {
    localStorage.removeItem('userInfo');
    localStorage.removeItem('cartItems');
    localStorage.removeItem('shippingAddress'); // Clear shipping info on logout
    localStorage.removeItem('paymentMethod'); // Clear payment method on logout
    setUserInfo(null);
    setCartCount(0);
    navigate('/login');
  };

  return (
    <header className="bg-gray-800 text-white p-4 shadow-md">
      <div className="container mx-auto flex justify-between items-center">
        <Link to="/" className="text-2xl font-bold hover:text-gray-300">
          E-Commerce MVP
        </Link>
        <nav className="flex items-center space-x-6">
          <Link to="/" className="hover:text-gray-300 transition duration-200">
            Home
          </Link>

          {/* Cart Icon */}
          <Link to="/cart" className="relative hover:text-gray-300 transition duration-200 flex items-center">
            <svg className="w-6 h-6 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M3 3h2l.4 2M7 13h10l4-8H5.4M7 13L5.4 5M7 13l-2.293 2.293c-.63.63-.186 1.705.707 1.705H17m0 0a2 2 0 100 4 2 2 0 000-4zm-8 2a2 2 0 11-4 0 2 2 0 014 0z"></path></svg>
            Cart
            {cartCount > 0 && (
              <span className="absolute -top-2 -right-2 bg-red-600 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center">
                {cartCount}
              </span>
            )}
          </Link>

          {userInfo ? (
            <div className="relative group">
              <button className="flex items-center hover:text-gray-300 focus:outline-none">
                {userInfo.username}
                <svg className="w-4 h-4 ml-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7"></path></svg>
              </button>
              <div className="absolute right-0 mt-2 w-40 bg-white rounded-md shadow-lg py-1 z-20 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition duration-300">
                <Link to="/profile" className="block px-4 py-2 text-gray-800 hover:bg-gray-100">
                  Profile
                </Link>
                <Link to="/myorders" className="block px-4 py-2 text-gray-800 hover:bg-gray-100"> {/* New: My Orders Link */}
                  My Orders
                </Link>
                <button onClick={logoutHandler} className="block px-4 py-2 text-gray-800 hover:bg-gray-100 w-full text-left">
                  Logout
                </button>
              </div>
            </div>
          ) : (
            <Link to="/login" className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded transition duration-200">
              Login
            </Link>
          )}
        </nav>
      </div>
    </header>
  );
};

export default Header;