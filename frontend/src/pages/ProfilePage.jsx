// frontend/src/pages/ProfilePage.jsx
import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';

const ProfilePage = () => {
  const [userInfo, setUserInfo] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const storedUserInfo = localStorage.getItem('userInfo');
    if (storedUserInfo) {
      setUserInfo(JSON.parse(storedUserInfo));
    } else {
      // If no user info, redirect to login
      navigate('/login');
    }
  }, [navigate]);

  if (!userInfo) {
    return <div className="container mx-auto p-4 text-center text-xl">Loading profile...</div>;
  }

  return (
    <div className="container mx-auto p-4 max-w-md">
      <h1 className="text-4xl font-bold text-gray-800 mb-6 text-center">User Profile</h1>
      <div className="bg-white p-8 rounded-lg shadow-md">
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Username:
          </label>
          <p className="text-gray-900 text-lg">{userInfo.username}</p>
        </div>
        <div className="mb-4">
          <label className="block text-gray-700 text-sm font-bold mb-2">
            Email:
          </label>
          <p className="text-gray-900 text-lg">{userInfo.email}</p>
        </div>
        {/* You can add more profile details or an update form here later */}
        <h2 className="text-2xl font-bold text-gray-800 mt-8 mb-4">My Orders</h2>
        <p className="text-gray-700">
          <span className="font-semibold">View your past orders:</span>{' '}
          <a href="/myorders" className="text-blue-600 hover:underline">Go to My Orders</a>
        </p>
      </div>
    </div>
  );
};

export default ProfilePage;