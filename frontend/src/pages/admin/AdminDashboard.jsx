import { Link } from "react-router-dom";

const AdminDashboard = () => {
  return (
    <div className="max-w-5xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Admin Dashboard</h1>
      <div className="grid md:grid-cols-2 gap-4">
        <Link to="/admin/pgs" className="bg-white border rounded-xl p-6 hover:shadow">Manage PG listings</Link>
        <Link to="/admin/users" className="bg-white border rounded-xl p-6 hover:shadow">Manage users</Link>
      </div>
    </div>
  );
};

export default AdminDashboard;
