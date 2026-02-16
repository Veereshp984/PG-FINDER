import { Link } from "react-router-dom";
import { useQuery } from "@tanstack/react-query";
import { fetchMyListings } from "../../api/owner.js";
import RatingStars from "../../components/RatingStars.jsx";

const OwnerDashboard = () => {
  const { data: listings = [], isLoading } = useQuery({ 
    queryKey: ["owner-listings"], 
    queryFn: fetchMyListings 
  });

  const activeListings = listings.filter(pg => pg.isActive);
  const totalReviews = listings.reduce((sum, pg) => sum + (pg.reviewCount || 0), 0);

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-semibold text-slate-800">Owner Dashboard</h1>
          <p className="text-slate-500 mt-1">Manage your PG listings and inquiries</p>
        </div>
        <Link to="/owner/create-pg" 
          className="inline-flex items-center justify-center gap-2 bg-emerald-600 text-white px-5 py-2.5 rounded-lg font-medium hover:bg-emerald-700 transition-colors">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
          </svg>
          Add New PG
        </Link>
      </div>

      {/* Stats */}
      <div className="grid sm:grid-cols-3 gap-4">
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-slate-500">Total Listings</p>
          <p className="text-3xl font-bold text-slate-800 mt-1">{listings.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-slate-500">Active Listings</p>
          <p className="text-3xl font-bold text-emerald-600 mt-1">{activeListings.length}</p>
        </div>
        <div className="bg-white rounded-xl border p-5">
          <p className="text-sm text-slate-500">Total Reviews</p>
          <p className="text-3xl font-bold text-amber-500 mt-1">{totalReviews}</p>
        </div>
      </div>

      {/* Quick Links */}
      <div className="flex gap-3">
        <Link to="/owner/inquiries" 
          className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 font-medium">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 10h.01M12 10h.01M16 10h.01M9 16H5a2 2 0 01-2-2V6a2 2 0 012-2h14a2 2 0 012 2v8a2 2 0 01-2 2h-5l-5 5v-5z" />
          </svg>
          View Inquiries
        </Link>
      </div>

      {/* Listings */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-slate-800">Your Listings</h2>
        
        {isLoading ? (
          <div className="animate-pulse space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-32 bg-slate-200 rounded-xl"></div>
            ))}
          </div>
        ) : listings.length === 0 ? (
          <div className="text-center py-12 bg-slate-50 rounded-xl border border-dashed">
            <svg className="w-16 h-16 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
            </svg>
            <p className="text-slate-600 font-medium">No listings yet</p>
            <p className="text-slate-400 text-sm mt-1">Add your first PG to get started</p>
            <Link to="/owner/create-pg" 
              className="inline-block mt-4 bg-emerald-600 text-white px-5 py-2 rounded-lg font-medium hover:bg-emerald-700">
              Add PG
            </Link>
          </div>
        ) : (
          <div className="grid md:grid-cols-2 gap-4">
            {listings.map((pg) => (
              <div key={pg._id} className="bg-white border border-slate-200 rounded-xl p-4 hover:shadow-md transition-shadow">
                <div className="flex gap-4">
                  <img 
                    src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=400"}
                    alt={pg.title}
                    className="w-24 h-24 object-cover rounded-lg flex-shrink-0"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <h3 className="font-semibold text-slate-800 truncate">{pg.title}</h3>
                      <span className={`text-xs px-2 py-1 rounded-full flex-shrink-0 ${
                        pg.isActive 
                          ? 'bg-emerald-100 text-emerald-700' 
                          : 'bg-slate-100 text-slate-600'
                      }`}>
                        {pg.isActive ? 'Active' : 'Inactive'}
                      </span>
                    </div>
                    <p className="text-sm text-slate-500 truncate">{pg.location?.city}</p>
                    <div className="flex items-center gap-2 mt-1">
                      <RatingStars rating={pg.avgRating} />
                      <span className="text-xs text-slate-400">({pg.reviewCount || 0})</span>
                    </div>
                    <div className="flex items-center gap-3 mt-3">
                      <Link to={`/owner/edit-pg/${pg._id}`} 
                        className="text-sm text-emerald-600 hover:text-emerald-700 font-medium">
                        Edit
                      </Link>
                      <Link to={`/pg/${pg._id}`} 
                        className="text-sm text-slate-500 hover:text-slate-700">
                        View
                      </Link>
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
