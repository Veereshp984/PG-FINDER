import { Link } from "react-router-dom";

const adminLinks = [
  { to: "/admin/pgs", title: "Manage PG Listings", desc: "View and manage all PG listings", icon: "🏠" },
  { to: "/admin/users", title: "Manage Users", desc: "View users and update roles", icon: "👥" },
  { to: "/search", title: "Browse Public View", desc: "See how users view the site", icon: "🔍" }
];

const AdminDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-6">
      <div>
        <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
        <p className="text-slate-500">Manage the PG Finder platform</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {adminLinks.map((link) => (
          <Link
            key={link.to}
            to={link.to}
            className="bg-white border rounded-xl p-6 hover:shadow-md hover:border-emerald-200 transition group"
          >
            <span className="text-3xl mb-3 block">{link.icon}</span>
            <h3 className="font-semibold group-hover:text-emerald-600 transition">{link.title}</h3>
            <p className="text-sm text-slate-500 mt-1">{link.desc}</p>
          </Link>
        ))}
      </div>

      <div className="bg-amber-50 border border-amber-200 rounded-xl p-4">
        <p className="text-sm text-amber-800">
          <strong>Admin Tip:</strong> As an administrator, you have full access to manage all listings,
          users, and reviews. Use these powers responsibly.
        </p>
      </div>
    </div>
  );
};

export default AdminDashboard;
