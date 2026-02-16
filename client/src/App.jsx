import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Layouts
import MainLayout from './layouts/MainLayout';
import DashboardLayout from './layouts/DashboardLayout';

// Public Pages
import Home from './pages/Home';
import Search from './pages/Search';
import PGDetails from './pages/PGDetails';
import Login from './pages/Login';
import Register from './pages/Register';

// User Pages
import Wishlist from './pages/Wishlist';
import Profile from './pages/Profile';

// Owner Pages
import OwnerDashboard from './pages/owner/Dashboard';
import CreatePG from './pages/owner/CreatePG';
import EditPG from './pages/owner/EditPG';
import OwnerInquiries from './pages/owner/Inquiries';

// Admin Pages
import AdminDashboard from './pages/admin/Dashboard';
import AdminPGs from './pages/admin/PGs';
import AdminUsers from './pages/admin/Users';

// Components
import ProtectedRoute from './components/ProtectedRoute';

function App() {
  const { isAuthenticated, isAdmin, isOwner } = useAuth();

  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/" element={<MainLayout />}>
        <Route index element={<Home />} />
        <Route path="search" element={<Search />} />
        <Route path="pg/:id" element={<PGDetails />} />
        <Route path="login" element={<Login />} />
        <Route path="register" element={<Register />} />
        
        {/* Protected User Routes */}
        <Route path="wishlist" element={
          <ProtectedRoute>
            <Wishlist />
          </ProtectedRoute>
        } />
        <Route path="profile" element={
          <ProtectedRoute>
            <Profile />
          </ProtectedRoute>
        } />
      </Route>

      {/* Owner Routes */}
      <Route path="/owner" element={
        <ProtectedRoute allowedRoles={['owner', 'admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<OwnerDashboard />} />
        <Route path="create-pg" element={<CreatePG />} />
        <Route path="edit-pg/:id" element={<EditPG />} />
        <Route path="inquiries" element={<OwnerInquiries />} />
      </Route>

      {/* Admin Routes */}
      <Route path="/admin" element={
        <ProtectedRoute allowedRoles={['admin']}>
          <DashboardLayout />
        </ProtectedRoute>
      }>
        <Route path="dashboard" element={<AdminDashboard />} />
        <Route path="pgs" element={<AdminPGs />} />
        <Route path="users" element={<AdminUsers />} />
      </Route>
    </Routes>
  );
}

export default App;
