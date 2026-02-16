import { useState } from 'react';
import { useAuth } from '../contexts/AuthContext';
import { FaUser, FaEnvelope, FaPhone, FaBuilding } from 'react-icons/fa';

const Profile = () => {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);

  return (
    <div className="page-container">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">My Profile</h1>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Profile Card */}
        <div className="md:col-span-1">
          <div className="card p-6 text-center">
            <div className="w-24 h-24 bg-primary-100 rounded-full flex items-center justify-center mx-auto mb-4">
              <FaUser className="w-12 h-12 text-primary-600" />
            </div>
            <h2 className="text-xl font-semibold text-gray-900">{user?.name}</h2>
            <p className="text-gray-500 capitalize">{user?.role}</p>
            
            <div className="mt-6 space-y-3 text-left">
              <div className="flex items-center space-x-3">
                <FaEnvelope className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{user?.email}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaPhone className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600">{user?.phone || 'Not provided'}</span>
              </div>
              <div className="flex items-center space-x-3">
                <FaBuilding className="w-5 h-5 text-gray-400" />
                <span className="text-gray-600 capitalize">{user?.role}</span>
              </div>
            </div>

            <button
              onClick={() => setIsEditing(!isEditing)}
              className="w-full btn-outline mt-6"
            >
              Edit Profile
            </button>
          </div>
        </div>

        {/* Activity Stats */}
        <div className="md:col-span-2">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Saved PGs</p>
                  <p className="text-2xl font-bold text-gray-900">{user?.wishlist?.length || 0}</p>
                </div>
                <div className="w-12 h-12 bg-red-100 rounded-full flex items-center justify-center">
                  <FaBuilding className="w-6 h-6 text-red-500" />
                </div>
              </div>
            </div>

            <div className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">Member Since</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                  </p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <FaUser className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          </div>

          {/* Quick Actions */}
          <div className="card p-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Quick Actions</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <a href="/wishlist" className="flex items-center p-4 border rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <FaBuilding className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">View Wishlist</p>
                  <p className="text-sm text-gray-500">See your saved PGs</p>
                </div>
              </a>
              <a href="/search" className="flex items-center p-4 border rounded-lg hover:border-primary-300 hover:bg-primary-50 transition-colors">
                <FaBuilding className="w-5 h-5 text-primary-600 mr-3" />
                <div>
                  <p className="font-medium text-gray-900">Search PGs</p>
                  <p className="text-sm text-gray-500">Find new accommodations</p>
                </div>
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
