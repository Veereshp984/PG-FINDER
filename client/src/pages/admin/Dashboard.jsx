import { useQuery } from '@tanstack/react-query';
import { FaUsers, FaBuilding, FaStar, FaEnvelope, FaChartLine } from 'react-icons/fa';
import api from '../../services/api';

const AdminDashboard = () => {
  const { data: stats, isLoading } = useQuery({
    queryKey: ['admin-stats'],
    queryFn: async () => {
      const { data } = await api.get('/admin/dashboard');
      return data;
    },
  });

  const statCards = [
    { label: 'Total Users', value: stats?.stats?.totalUsers || 0, icon: FaUsers, color: 'bg-blue-100 text-blue-600' },
    { label: 'Total PGs', value: stats?.stats?.totalPGs || 0, icon: FaBuilding, color: 'bg-green-100 text-green-600' },
    { label: 'Total Reviews', value: stats?.stats?.totalReviews || 0, icon: FaStar, color: 'bg-yellow-100 text-yellow-600' },
    { label: 'Total Inquiries', value: stats?.stats?.totalInquiries || 0, icon: FaEnvelope, color: 'bg-purple-100 text-purple-600' },
  ];

  return (
    <div>
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-gray-900">Admin Dashboard</h1>
        <p className="text-gray-600">Overview of platform activity</p>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        {statCards.map((stat) => {
          const Icon = stat.icon;
          return (
            <div key={stat.label} className="card p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-500 text-sm">{stat.label}</p>
                  <p className="text-2xl font-bold text-gray-900">
                    {isLoading ? '-' : stat.value}
                  </p>
                </div>
                <div className={`w-12 h-12 rounded-full flex items-center justify-center ${stat.color}`}>
                  <Icon className="w-6 h-6" />
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
        {/* Users by Role */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Users by Role</h3>
          {isLoading ? (
            <div className="h-48 bg-gray-100 rounded animate-pulse" />
          ) : (
            <div className="space-y-4">
              {stats?.usersByRole?.map((item) => (
                <div key={item._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700 capitalize">{item._id}s</span>
                    <span className="font-medium">{item.count}</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-primary-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.count / (stats?.stats?.totalUsers || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Top Cities */}
        <div className="card p-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">Top Cities</h3>
          {isLoading ? (
            <div className="h-48 bg-gray-100 rounded animate-pulse" />
          ) : (
            <div className="space-y-4">
              {stats?.pgsByCity?.map((item) => (
                <div key={item._id}>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-gray-700">{item._id}</span>
                    <span className="font-medium">{item.count} PGs</span>
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-2">
                    <div
                      className="bg-secondary-600 h-2 rounded-full transition-all"
                      style={{
                        width: `${(item.count / (stats?.pgsByCity?.[0]?.count || 1)) * 100}%`,
                      }}
                    />
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Recent PGs */}
      <div className="card overflow-hidden">
        <div className="p-6 border-b">
          <h3 className="text-lg font-semibold text-gray-900">Recently Added PGs</h3>
        </div>
        {isLoading ? (
          <div className="p-4 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-16 bg-gray-100 rounded animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="divide-y">
            {stats?.recentPGs?.map((pg) => (
              <div key={pg._id} className="p-4 flex items-center space-x-4 hover:bg-gray-50">
                <img
                  src={pg.photos?.[0] || '/placeholder-pg.jpg'}
                  alt={pg.title}
                  className="w-16 h-16 rounded-lg object-cover"
                />
                <div className="flex-1">
                  <p className="font-medium text-gray-900">{pg.title}</p>
                  <p className="text-sm text-gray-500">{pg.location?.city}</p>
                </div>
                <div className="text-right">
                  <p className="text-sm text-gray-500">Added by</p>
                  <p className="font-medium">{pg.ownerId?.name}</p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default AdminDashboard;
