import { Link } from "react-router-dom";
import { useAuth } from "../state/AuthContext.jsx";

const roleLabels = {
  user: "Tenant",
  owner: "PG Owner", 
  admin: "Administrator"
};

const Profile = () => {
  const { user, logout } = useAuth();

  if (!user) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        <p className="text-slate-600 font-medium">Please login to view your profile</p>
        <Link to="/login" className="inline-block mt-4 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">
      <h1 className="text-2xl font-semibold text-slate-800 mb-6">Your Profile</h1>
      
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {/* Header */}
        <div className="bg-emerald-600 px-6 py-8">
          <div className="flex items-center gap-4">
            <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center text-3xl font-bold text-emerald-700">
              {user.name?.charAt(0).toUpperCase()}
            </div>
            <div className="text-white">
              <h2 className="text-xl font-semibold">{user.name}</h2>
              <span className="inline-block mt-1 px-2 py-0.5 bg-white/20 rounded text-sm">
                {roleLabels[user.role] || user.role}
              </span>
            </div>
          </div>
        </div>

        {/* Details */}
        <div className="p-6 space-y-4">
          <div className="grid sm:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-slate-500">Email</label>
              <p className="font-medium text-slate-800">{user.email}</p>
            </div>
            <div>
              <label className="text-sm text-slate-500">Phone</label>
              <p className="font-medium text-slate-800">{user.phone || "Not provided"}</p>
            </div>
          </div>

          {/* Role-specific links */}
          <div className="pt-4 border-t border-slate-200">
            <h3 className="font-medium text-slate-800 mb-3">Quick Links</h3>
            <div className="flex flex-wrap gap-2">
              <Link to="/wishlist" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                My Wishlist
              </Link>
              
              {user.role === "owner" && (
                <>
                  <Link to="/owner/dashboard" className="px-4 py-2 bg-emerald-100 text-emerald-700 rounded-lg hover:bg-emerald-200 transition-colors">
                    Owner Dashboard
                  </Link>
                  <Link to="/owner/inquiries" className="px-4 py-2 bg-slate-100 text-slate-700 rounded-lg hover:bg-slate-200 transition-colors">
                    My Inquiries
                  </Link>
                </>
              )}
              
              {user.role === "admin" && (
                <Link to="/admin/dashboard" className="px-4 py-2 bg-purple-100 text-purple-700 rounded-lg hover:bg-purple-200 transition-colors">
                  Admin Dashboard
                </Link>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="pt-4 border-t border-slate-200">
            <button 
              onClick={logout}
              className="text-red-600 hover:text-red-700 font-medium flex items-center gap-2"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              Logout
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
