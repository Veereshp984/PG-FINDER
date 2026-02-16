import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAdminPGs } from "../../api/admin.js";
import { deletePG } from "../../api/owner.js";
import RatingStars from "../../components/RatingStars.jsx";

const AdminPGs = () => {
  const queryClient = useQueryClient();
  const { data: pgs = [], isLoading } = useQuery({
    queryKey: ["admin-pgs"],
    queryFn: fetchAdminPGs
  });

  const deleteMutation = useMutation({
    mutationFn: deletePG,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["admin-pgs"] })
  });

  const handleDelete = (id) => {
    if (confirm("Are you sure you want to delete this PG? This action cannot be undone.")) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">All PG Listings</h1>
          <p className="text-slate-500">{pgs.length} total listings</p>
        </div>
        <Link to="/admin/dashboard" className="text-emerald-600 font-medium">
          ← Back to Dashboard
        </Link>
      </div>

      {isLoading ? (
        <div className="animate-pulse space-y-4">
          {[1, 2, 3].map((i) => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      ) : pgs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-500">No PG listings found.</p>
        </div>
      ) : (
        <div className="space-y-3">
          {pgs.map((pg) => (
            <div key={pg._id} className="bg-white border rounded-xl p-4 flex flex-col md:flex-row md:items-center gap-4">
              <img
                src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=200"}
                alt={pg.title}
                className="w-full md:w-24 h-24 object-cover rounded-lg"
              />
              <div className="flex-1">
                <div className="flex items-start justify-between">
                  <div>
                    <h3 className="font-semibold">{pg.title}</h3>
                    <p className="text-sm text-slate-500">{pg.location?.city}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={pg.avgRating} />
                      <span className="text-xs text-slate-400">({pg.reviewCount} reviews)</span>
                    </div>
                  </div>
                  <span className={`text-xs px-2 py-1 rounded-full ${
                    pg.isActive ? "bg-emerald-100 text-emerald-700" : "bg-slate-100 text-slate-600"
                  }`}>
                    {pg.isActive ? "Active" : "Inactive"}
                  </span>
                </div>
                <p className="text-xs text-slate-400 mt-2">Owner ID: {pg.ownerId}</p>
              </div>
              <div className="flex items-center gap-3">
                <Link
                  to={`/pg/${pg._id}`}
                  className="text-sm text-emerald-600 font-medium hover:underline"
                >
                  View
                </Link>
                <Link
                  to={`/owner/edit-pg/${pg._id}`}
                  className="text-sm text-slate-600 hover:text-slate-800"
                >
                  Edit
                </Link>
                <button
                  onClick={() => handleDelete(pg._id)}
                  disabled={deleteMutation.isPending}
                  className="text-sm text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default AdminPGs;
