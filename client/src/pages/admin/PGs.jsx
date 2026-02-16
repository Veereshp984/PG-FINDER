import { useQuery } from '@tanstack/react-query';
import { useState } from 'react';
import { FaEye, FaTrash, FaSearch, FaFilter } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';
import api from '../../services/api';

const AdminPGs = () => {
  const navigate = useNavigate();
  const [searchTerm, setSearchTerm] = useState('');
  const [filter, setFilter] = useState('all');

  const { data: pgs, isLoading, refetch } = useQuery({
    queryKey: ['admin-pgs'],
    queryFn: async () => {
      const { data } = await api.get('/admin/pgs');
      return data;
    },
  });

  const handleDelete = async (id) => {
    if (confirm('Are you sure you want to delete this PG?')) {
      try {
        await api.delete(`/pgs/${id}`);
        refetch();
      } catch (error) {
        console.error('Error deleting PG:', error);
      }
    }
  };

  const filteredPGs = pgs?.filter(pg => {
    const matchesSearch = pg.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         pg.location?.city?.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesFilter = filter === 'all' ? true :
                         filter === 'active' ? pg.isActive :
                         !pg.isActive;
    return matchesSearch && matchesFilter;
  });

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">All PGs</h1>
          <p className="text-gray-600">Manage all PG listings</p>
        </div>
      </div>

      {/* Filters */}
      <div className="card p-4 mb-6">
        <div className="flex flex-col sm:flex-row gap-4">
          <div className="flex-1 relative">
            <FaSearch className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              placeholder="Search PGs..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="input pl-10"
            />
          </div>
          <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-400" />
            <select
              value={filter}
              onChange={(e) => setFilter(e.target.value)}
              className="input"
            >
              <option value="all">All</option>
              <option value="active">Active</option>
              <option value="inactive">Inactive</option>
            </select>
          </div>
        </div>
      </div>

      {/* PGs Table */}
      <div className="card overflow-hidden">
        {isLoading ? (
          <div className="p-8 space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-gray-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">PG</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Owner</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Location</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Status</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-200">
                {filteredPGs?.map((pg) => (
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
                          <p className="text-sm text-gray-500 capitalize">{pg.genderAllowed}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-gray-600">{pg.ownerId?.name}</td>
                    <td className="px-6 py-4 text-gray-600">{pg.location?.city}</td>
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

        {!isLoading && filteredPGs?.length === 0 && (
          <div className="p-8 text-center">
            <p className="text-gray-500">No PGs found matching your criteria</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminPGs;
