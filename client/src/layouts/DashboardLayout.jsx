import { Outlet, Link, useLocation, useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import {
  FaHome,
  FaPlus,
  FaList,
  FaEnvelope,
  FaUsers,
  FaBuilding,
  FaChartBar,
  FaSignOutAlt,
  FaArrowLeft
} from 'react-icons/fa';

const DashboardLayout = () => {
  const { user, logout, isAdmin, isOwner } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();

  const ownerLinks = [
    { to: '/owner/dashboard', icon: FaChartBar, label: 'Dashboard' },
    { to: '/owner/create-pg', icon: FaPlus, label: 'Add New PG' },
    { to: '/owner/dashboard', icon: FaList, label: 'My Listings' },
    { to: '/owner/inquiries', icon: FaEnvelope, label: 'Inquiries' },
  ];

  const adminLinks = [
    { to: '/admin/dashboard', icon: FaChartBar, label: 'Dashboard' },
    { to: '/admin/pgs', icon: FaBuilding, label: 'All PGs' },
    { to: '/admin/users', icon: FaUsers, label: 'Users' },
  ];

  const links = isAdmin ? adminLinks : ownerLinks;
  const basePath = isAdmin ? '/admin' : '/owner';

  return (
    <div className="min-h-screen bg-gray-50 flex">
      {/* Sidebar */}
      <aside className="w-64 bg-white shadow-lg fixed h-full z-10 hidden md:flex flex-col">
        <div className="p-6 border-b">
          <h1 className="text-xl font-bold text-primary-600">
            {isAdmin ? 'Admin Panel' : 'Owner Dashboard'}
          </h1>
          <p className="text-sm text-gray-500 mt-1">{user?.name}</p>
        </div>

        <nav className="flex-1 p-4 space-y-1">
          {links.map((link) => {
            const Icon = link.icon;
            const isActive = location.pathname === link.to;
            return (
              <Link
                key={link.to}
                to={link.to}
                className={`flex items-center space-x-3 px-4 py-3 rounded-lg transition-colors ${
                  isActive
                    ? 'bg-primary-50 text-primary-600'
                    : 'text-gray-600 hover:bg-gray-50'
                }`}
              >
                <Icon className="w-5 h-5" />
                <span className="font-medium">{link.label}</span>
              </Link>
            );
          })}
        </nav>

        <div className="p-4 border-t space-y-2">
          <button
            onClick={() => navigate('/')}
            className="flex items-center space-x-3 px-4 py-3 w-full text-gray-600 hover:bg-gray-50 rounded-lg transition-colors"
          >
            <FaArrowLeft className="w-5 h-5" />
            <span className="font-medium">Back to Site</span>
          </button>
          <button
            onClick={logout}
            className="flex items-center space-x-3 px-4 py-3 w-full text-red-600 hover:bg-red-50 rounded-lg transition-colors"
          >
            <FaSignOutAlt className="w-5 h-5" />
            <span className="font-medium">Logout</span>
          </button>
        </div>
      </aside>

      {/* Mobile Header */}
      <div className="md:hidden fixed top-0 left-0 right-0 bg-white shadow-md z-20">
        <div className="flex items-center justify-between p-4">
          <h1 className="text-lg font-bold text-primary-600">
            {isAdmin ? 'Admin Panel' : 'Owner Dashboard'}
          </h1>
          <button
            onClick={() => navigate(basePath + '/dashboard')}
            className="p-2 text-gray-600"
          >
            <FaHome className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Main Content */}
      <main className="flex-1 md:ml-64 p-4 md:p-8 pt-20 md:pt-8">
        <Outlet />
      </main>
    </div>
  );
};

export default DashboardLayout;
