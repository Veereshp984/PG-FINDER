import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchAdminPGs, deleteAdminPG } from "../../api/admin.js";
import RatingStars from "../../components/RatingStars.jsx";

const AdminPGs = () => {
  const queryClient = useQueryClient();
  const { data: pgs = [], isLoading } = useQuery({ 
    queryKey: ["admin-pgs"], 
    queryFn: fetchAdminPGs 
  });

  const deleteMutation = useMutation({
    mutationFn: deleteAdminPG,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["admin-pgs"] });
    }
  });

  const handleDelete = (id, title) => {
    if (window.confirm(`Are you sure you want to delete "${title}"? This action cannot be undone.`)) {
      deleteMutation.mutate(id);
    }
  };

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center gap-2">
        <Link to="/admin/dashboard" className="text-slate-500 hover:text-emerald-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
          </svg>
        </Link>
        <h1 className="text-2xl font-semibold text-slate-800">All PG Listings</h1>
      </div>
      
      {isLoading ? (
        <div className="animate-pulse space-y-3">
          {[1, 2, 3, 4].map(i => (
            <div key={i} className="h-24 bg-slate-200 rounded-xl"></div>
          ))}
        </div>
      ) : pgs.length === 0 ? (
        <div className="text-center py-12 bg-slate-50 rounded-xl">
          <p className="text-slate-500">No PG listings found</p>
        </div>
      ) : (
        <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50 border-b border-slate-200">
                <tr>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">PG</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Location</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Rating</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Status</th>
                  <th className="text-left px-4 py-3 text-sm font-medium text-slate-600">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-200">
                {pgs.map((pg) => (
                  <tr key={pg._id} className="hover:bg-slate-50">
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <img 
                          src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=100"}
                          alt={pg.title}
                          className="w-12 h-12 object-cover rounded-lg"
                        />
                        <div>
                          <p className="font-medium text-slate-800">{pg.title}</p>
                          <p className="text-xs text-slate-500 capitalize">{pg.genderAllowed}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-4 py-4 text-sm text-slate-600">
                      {pg.location?.city}
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-2">
                        <RatingStars rating={pg.avgRating} />
                        <span className="text-xs text-slate-400">({pg.reviewCount || 0})</span>
                      </div>
                    </td>
                    <td className="px-4 py-4">
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        pg.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {pg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-4">
                      <div className="flex items-center gap-3">
                        <Link to={`/pg/${pg._id}`} className="text-emerald-600 hover:underline text-sm">
                          View
                        </Link>
                        <button
                          onClick={() => handleDelete(pg._id, pg.title)}
                          disabled={deleteMutation.isPending}
                          className="text-red-600 hover:text-red-700 text-sm"
                        >
                          Delete
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdminPGs;
