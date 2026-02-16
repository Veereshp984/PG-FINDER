import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchMyListings, deletePG } from "../../api/owner.js";
import RatingStars from "../../components/RatingStars.jsx";

const OwnerDashboard = () => {
  const queryClient = useQueryClient();
  const { data: listings = [], isLoading } = useQuery({
    queryKey: ["owner-listings"],
    queryFn: fetchMyListings
  });

  const deleteMutation = useMutation({
    mutationFn: deletePG,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["owner-listings"] })
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this listing?")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold">Owner Dashboard</h1>
          <p className="text-slate-500">Manage your PG listings and inquiries</p>
        </div>
        <Link
          to="/owner/create-pg"
          className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium text-center"
        >
          + Add New PG
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-slate-500">Total Listings</p>
          <p className="text-2xl font-bold">{listings.length}</p>
        </div>
        <div className="bg-white border rounded-xl p-4">
          <p className="text-sm text-slate-500">Active Listings</p>
          <p className="text-2xl font-bold">{listings.filter((pg) => pg.isActive).length}</p>
        </div>
        <Link to="/owner/inquiries" className="bg-emerald-50 border border-emerald-200 rounded-xl p-4 hover:bg-emerald-100 transition">
          <p className="text-sm text-emerald-600">View Inquiries →</p>
          <p className="text-2xl font-bold text-emerald-700">Manage</p>
        </Link>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold">Your Listings</h2>
        {isLoading ? (
          <div className="animate-pulse space-y-4">
            {[1, 2].map((i) => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="bg-slate-50 border rounded-xl p-8 text-center">
            <p className="text-slate-500 mb-4">You haven&apos;t added any PG listings yet.</p>
            <Link to="/owner/create-pg" className="text-emerald-600 font-medium">
              Create your first listing →
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {listings.map((pg) => (
              <div key={pg._id} className="bg-white border rounded-xl overflow-hidden hover:shadow-md transition">
                <div className="flex">
                  <img
                    src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400"}
                    alt={pg.title}
                    className="w-32 h-32 object-cover"
                  />
                  <div className="flex-1 p-4">
                    <div className="flex items-start justify-between">
                      <div>
                        <h3 className="font-semibold text-slate-900">{pg.title}</h3>
                        <p className="text-sm text-slate-500">{pg.location?.city}</p>
                        <div className="flex items-center gap-2 mt-1">
                          <RatingStars rating={pg.avgRating} />
                          <span className="text-xs text-slate-400">({pg.reviewCount})</span>
                        </div>
                      </div>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        pg.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                      }`}>
                        {pg.isActive ? "Active" : "Inactive"}
                      </span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <Link
                        to={`/owner/edit-pg/${pg._id}`}
                        className="text-sm text-emerald-600 font-medium hover:underline"
                      >
                        Edit
                      </Link>
                      <Link
                        to={`/pg/${pg._id}`}
                        className="text-sm text-slate-500 hover:text-slate-700"
                      >
                        View
                      </Link>
                      <button
                        onClick={() => handleDelete(pg._id)}
                        className="text-sm text-red-500 hover:text-red-700"
                        disabled={deleteMutation.isPending}
                      >
                        Delete
                      </button>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default OwnerDashboard;
