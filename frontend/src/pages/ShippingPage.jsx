// frontend/src/pages/ShippingPage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CheckoutSteps from '../components/CheckoutSteps'; // We'll create this component next

const ShippingPage = () => {
  const navigate = useNavigate();

  // Load saved shipping address from localStorage if exists
  const storedShippingAddress = JSON.parse(localStorage.getItem('shippingAddress')) || {};

  const [address, setAddress] = useState(storedShippingAddress.address || '');
  const [city, setCity] = useState(storedShippingAddress.city || '');
  const [postalCode, setPostalCode] = useState(storedShippingAddress.postalCode || '');
  const [country, setCountry] = useState(storedShippingAddress.country || '');

  // Check if user is logged in
  useEffect(() => {
    const userInfo = localStorage.getItem('userInfo');
    if (!userInfo) {
      navigate('/login?redirect=/shipping');
    }
  }, [navigate]);

  const submitHandler = (e) => {
    e.preventDefault();
    const shippingAddress = { address, city, postalCode, country };
    localStorage.setItem('shippingAddress', JSON.stringify(shippingAddress));
    navigate('/payment'); // Move to payment method selection
  };

  return (
    <div className="container mx-auto p-4 max-w-lg">
      <CheckoutSteps step1 step2 /> {/* Highlight Shipping step */}
      <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Shipping</h1>
      <form onSubmit={submitHandler} className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="address">
            Address
          </label>
          <input
            type="text"
            id="address"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter address"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="city">
            City
          </label>
          <input
            type="text"
            id="city"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter city"
            value={city}
            onChange={(e) => setCity(e.target.value)}
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="postalCode">
            Postal Code
          </label>
          <input
            type="text"
            id="postalCode"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter postal code"
            value={postalCode}
            onChange={(e) => setPostalCode(e.target.value)}
            required
          />
        </div>
        <div className="mb-6">
          <label className="block text-gray-700 text-sm font-bold mb-2" htmlFor="country">
            Country
          </label>
          <input
            type="text"
            id="country"
            className="shadow appearance-none border rounded w-full py-2 px-3 text-gray-700 leading-tight focus:outline-none focus:shadow-outline"
            placeholder="Enter country"
            value={country}
            onChange={(e) => setCountry(e.target.value)}
            required
          />
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

export default ShippingPage;