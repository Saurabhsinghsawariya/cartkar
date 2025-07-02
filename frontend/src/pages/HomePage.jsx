// frontend/src/pages/HomePage.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import Product from '../components/Product';

const HomePage = () => {
  const [products, setProducts] = useState([]); // Initialize as an empty array
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get('/api/products'); // Fetch from your backend API

        // --- ADD THIS CHECK ---
        if (Array.isArray(data)) {
            setProducts(data);
        } else {
            // If backend returned something unexpected, treat it as an error or empty
            console.warn("Backend /api/products did not return an array:", data);
            setError('Received invalid data from server.');
            setProducts([]); // Ensure it's an array so map doesn't crash
        }
        // --- END ADD THIS CHECK ---

        setLoading(false);
      } catch (err) {
        setError('Failed to fetch products. Please try again later.');
        setLoading(false);
        console.error('Error fetching products:', err);
      }
    };

    fetchProducts();
  }, []);

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">Latest Products</h1>
      {loading ? (
        <div className="text-center text-xl text-gray-600">Loading products...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">{error}</div>
      ) : (
        // --- THE PROBLEM LINE IS HERE (line 37 if no other lines changed) ---
        // Ensure products is an array before mapping.
        // The Array.isArray(products) check makes sure it's safe to call .map()
        Array.isArray(products) && products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {products.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        ) : (
          <div className="text-center text-xl text-gray-600">No products found.</div>
        )
      )}
    </div>
  );
};

export default HomePage;