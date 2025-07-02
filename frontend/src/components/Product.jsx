// frontend/src/components/Product.jsx
import { Link } from 'react-router-dom';

const Product = ({ product }) => {
  return (
    <div className="bg-white rounded-lg shadow-md overflow-hidden transform transition duration-300 hover:scale-105">
      <Link to={`/product/${product._id}`}>
        <img
          src={product.image}
          alt={product.name}
          className="w-full h-48 object-cover"
        />
      </Link>
      <div className="p-4">
        <Link to={`/product/${product._id}`}>
          <h3 className="text-xl font-semibold mb-2 line-clamp-2 hover:text-blue-600">{product.name}</h3>
        </Link>
        <div className="flex items-center mb-2">
          {/* Simple star rating for now. You might want a dedicated Rating component later */}
          <span className="text-yellow-500 mr-1">{'★'.repeat(Math.floor(product.rating))}</span>
          <span className="text-gray-400">{'★'.repeat(5 - Math.floor(product.rating))}</span>
          <span className="text-gray-600 text-sm ml-2">{product.numReviews} reviews</span>
        </div>
        <p className="text-gray-800 text-2xl font-bold">${product.price.toFixed(2)}</p>
      </div>
    </div>
  );
};

export default Product;