import { useNavigate } from 'react-router-dom';
import { FaPlus, FaEdit, FaTrash, FaEye, FaStar, FaBuilding } from 'react-icons/fa';
import { useMyListings, useDeletePG } from '../../hooks/usePGs';
import { useAuth } from '../../contexts/AuthContext';

const OwnerDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { data: listings, isLoading } = useMyListings();
  const deletePG = useDeletePG();

  const handleDelete = (id) => {
    if (confirm('Are you sure you want to delete this PG listing?')) {
      deletePG.mutate(id);
    }
  };

  const stats = [
    { label: 'Total Listings', value: listings?.length || 0, icon: FaBuilding },
    { label: 'Active Listings', value: listings?.filter(l => l.isActive).length || 0, icon: FaEye },
    { label: 'Total Reviews', value: listings?.reduce((sum, l) => sum + (l.reviewCount || 0), 0) || 0, icon: FaStar },
  ];

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Listings</h1>
          <p className="text-gray-600">Manage your PG listings</p>
        </div>
        <button
          onClick={() => navigate('/owner/create-pg')}
          className="btn-primary flex items-center space-x-2"
        >
          <FaPlus className="w-4 h-4" />
          <span>Add New PG</span>
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-8">
        {stats.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">{stat.value}</p>
                </div>
                <div className="w-12 h-12 bg-primary-100 rounded-full flex items-center justify-center">
                  <Icon className="w-6 h-6 text-primary-600" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Listings Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : listings?.length === 0 ? (
          <div className="p-8 text-center">
            <FaBuilding className="w-16 h-16 text-gray-300 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">No listings yet</h3>
            <p className="text-gray-500 mb-4">Start by adding your first PG listing</p>
            <button
              onClick={() => navigate('/owner/create-pg')}
              className="btn-primary"
            >
              Add New PG
            </button>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Price</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {listings?.map((pg) => (
                  <tr key={pg._id} className="hover:bg-gray-50">
                    <td className="px-6 py-4">
                      <div className="flex items-center">
                        <img
                          src={pg.photos?.[0] || '/placeholder-pg.jpg'}
                          alt={pg.title}
                          className="w-12 h-12 rounded-lg object-cover"
                        />
                        <div className="ml-4">
                          <p className="font-medium text-gray-900">{pg.title}</p>
                          <div className="flex items-center text-sm text-gray-500">
                            <FaStar className="w-3 h-3 text-yellow-400 mr-1" />
                            {pg.avgRating?.toFixed(1) || '0.0'} ({pg.reviewCount || 0})
                          </div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{pg.location?.city}</td>
                    <td className="px-6 py-4 text-gray-600">
                      ₹{Math.min(...(pg.sharingTypes?.map(s => s.price) || [0]))?.toLocaleString()}
                    </td>
                    <td className="px-6 py-4">
                      <span className={`badge ${pg.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                        {pg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center space-x-2">
                        <button
                          onClick={() => navigate(`/pg/${pg._id}`)}
                          className="p-2 text-gray-600 hover:text-primary-600"
                          title="View"
                        >
                          <FaEye className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => navigate(`/owner/edit-pg/${pg._id}`)}
                          className="p-2 text-gray-600 hover:text-blue-600"
                          title="Edit"
                        >
                          <FaEdit className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(pg._id)}
                          className="p-2 text-gray-600 hover:text-red-600"
                          title="Delete"
                        >
                          <FaTrash className="w-4 h-4" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
