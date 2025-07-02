// frontend/src/pages/ProductPage.jsx
import axios from 'axios';
import { useEffect, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom'; // Import useNavigate

const ProductPage = () => {
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [qty, setQty] = useState(1); // State for quantity

  const { id } = useParams();
  const navigate = useNavigate(); // Initialize navigate

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await axios.get(`/api/products/${id}`);
        setProduct(data);
        setLoading(false);
      } catch (err) {
        setError('Product not found or failed to fetch product details.');
        setLoading(false);
        console.error(`Error fetching product ${id}:`, err);
      }
    };

    fetchProduct();
  }, [id]);

  // Function to add product to cart
  const addToCartHandler = () => {
    // We'll manage cart in localStorage directly for now.
    // In a real app, you might use Redux, Context API, or send to backend.
    const cartItems = JSON.parse(localStorage.getItem('cartItems')) || [];

    const existItem = cartItems.find((x) => x.product === product._id);

    if (existItem) {
      // Update quantity if item already in cart
      existItem.qty = Number(qty);
    } else {
      // Add new item to cart
      cartItems.push({
        product: product._id,
        name: product.name,
        image: product.image,
        price: product.price,
        countInStock: product.countInStock,
        qty: Number(qty),
      });
    }

    localStorage.setItem('cartItems', JSON.stringify(cartItems));
    navigate('/cart'); // Redirect to cart page after adding
  };

  return (
    <div className="container mx-auto p-4">
      <Link to="/" className="inline-block bg-gray-300 hover:bg-gray-400 text-gray-800 font-bold py-2 px-4 rounded mb-6">
        Go Back
      </Link>

      {loading ? (
        <div className="text-center text-xl text-gray-600">Loading product details...</div>
      ) : error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative text-center" role="alert">{error}</div>
      ) : product ? (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 bg-white p-6 rounded-lg shadow-md">
          {/* Product Image */}
          <div>
            <img src={product.image} alt={product.name} className="w-full h-auto rounded-lg" />
          </div>

          {/* Product Details */}
          <div>
            <h1 className="text-4xl font-bold text-gray-800 mb-4">{product.name}</h1>
            <p className="text-gray-600 text-lg mb-4 border-b pb-4">
              <span className="font-semibold">Brand:</span> {product.brand} |{' '}
              <span className="font-semibold">Category:</span> {product.category}
            </p>
            <p className="text-gray-700 text-xl mb-4">{product.description}</p>
            <div className="flex items-center mb-4 text-lg">
              <span className="text-yellow-500 mr-1">{'★'.repeat(Math.floor(product.rating))}</span>
              <span className="text-gray-400">{'★'.repeat(5 - Math.floor(product.rating))}</span>
              <span className="text-gray-600 ml-2">{product.numReviews} reviews</span>
            </div>
            <p className="text-green-600 text-3xl font-bold mb-4">${product.price.toFixed(2)}</p>
            <div className="mb-4 text-xl">
              <span className="font-semibold">Status:</span>{' '}
              {product.countInStock > 0 ? (
                <span className="text-green-500">In Stock ({product.countInStock})</span>
              ) : (
                <span className="text-red-500">Out of Stock</span>
              )}
            </div>

            {/* Quantity Selector */}
            {product.countInStock > 0 && (
              <div className="mb-4 flex items-center">
                <label htmlFor="qty-select" className="mr-2 font-semibold text-lg">Qty:</label>
                <select
                  id="qty-select"
                  className="p-2 border rounded-md"
                  value={qty}
                  onChange={(e) => setQty(e.target.value)}
                >
                  {[...Array(product.countInStock).keys()].map((x) => (
                    <option key={x + 1} value={x + 1}>
                      {x + 1}
                    </option>
                  ))}
                </select>
              </div>
            )}

            {/* Add to Cart button */}
            <button
              onClick={addToCartHandler}
              className="bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 px-6 rounded-lg text-lg w-full"
              disabled={product.countInStock === 0}
            >
              Add To Cart
            </button>
          </div>
        </div>
      ) : (
        <div>No product found.</div>
      )}
    </div>
  );
};

export default ProductPage;