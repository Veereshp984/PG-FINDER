import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">👤</div>
        <h1 className="text-2xl font-semibold mb-2">Please login to view your profile</h1>
        <p className="text-slate-500 mb-6">Sign in to access your account and saved PGs</p>
        <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">
          Login
        </Link>
      </div>
    );
  }

  const roleLabels = {
    user: "Tenant",
    owner: "PG Owner",
    admin: "Administrator"
  };

  const roleColors = {
    user: "bg-blue-100 text-blue-700",
    owner: "bg-emerald-100 text-emerald-700",
    admin: "bg-purple-100 text-purple-700"
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-10 space-y-6">
      <h1 className="text-2xl font-semibold">My Profile</h1>

      <div className="bg-white border rounded-xl p-6 space-y-6">
        {/* User Info Header */}
        <div className="flex items-start gap-4 pb-6 border-b">
          <div className="w-20 h-20 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center text-3xl font-bold">
            {user.name?.charAt(0).toUpperCase()}
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-semibold">{user.name}</h2>
            <p className="text-slate-500">{user.email}</p>
            <span className={`inline-block mt-2 px-3 py-1 rounded-full text-xs font-medium ${roleColors[user.role]}`}>
              {roleLabels[user.role]}
            </span>
          </div>
        </div>

        {/* Details Grid */}
        <div className="grid md:grid-cols-2 gap-6">
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Full Name</label>
            <p className="text-slate-900">{user.name}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Email Address</label>
            <p className="text-slate-900">{user.email}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Phone Number</label>
            <p className="text-slate-900">{user.phone || "Not provided"}</p>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-500 mb-1">Account Type</label>
            <p className="text-slate-900 capitalize">{user.role}</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4">
        <Link
          to="/wishlist"
          className="bg-white border rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
        >
          <span className="text-2xl">♥</span>
          <div>
            <p className="font-medium">My Wishlist</p>
            <p className="text-sm text-slate-500">Saved PGs</p>
          </div>
        </Link>

        {user.role === "owner" && (
          <Link
            to="/owner/dashboard"
            className="bg-white border rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <span className="text-2xl">🏠</span>
            <div>
              <p className="font-medium">Owner Dashboard</p>
              <p className="text-sm text-slate-500">Manage listings</p>
            </div>
          </Link>
        )}

        {user.role === "admin" && (
          <Link
            to="/admin/dashboard"
            className="bg-white border rounded-xl p-4 hover:shadow-md transition flex items-center gap-3"
          >
            <span className="text-2xl">⚙️</span>
            <div>
              <p className="font-medium">Admin Panel</p>
              <p className="text-sm text-slate-500">Manage platform</p>
            </div>
          </Link>
        )}
      </div>

      {/* Logout */}
      <div className="pt-6 border-t">
        <button
          onClick={logout}
          className="text-red-500 font-medium hover:text-red-700 transition"
        >
          Logout from account
        </button>
      </div>
    </div>
  );
};

export default Profile;
