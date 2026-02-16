import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMyListings } from "../../api/owner.js";

const OwnerDashboard = () => {
  const { data: listings = [] } = useQuery({ queryKey: ["owner-listings"], queryFn: fetchMyListings });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
        <Link to="/owner/create-pg" className="bg-emerald-600 text-white px-4 py-2 rounded-lg">Add PG</Link>
      </div>
      <div className="grid md:grid-cols-2 gap-4">
        {listings.map((pg) => (
          <div key={pg._id} className="bg-white border rounded-xl p-4 space-y-2">
            <h3 className="font-semibold">{pg.title}</h3>
            <p className="text-sm text-slate-500">{pg.location?.city}</p>
            <Link to={`/owner/edit-pg/${pg._id}`} className="text-emerald-600 text-sm">Edit listing</Link>
          </div>
        ))}
      </div>
      <Link to="/owner/inquiries" className="text-emerald-600 text-sm">View inquiries</Link>
    </div>
  );
};

export default OwnerDashboard;
