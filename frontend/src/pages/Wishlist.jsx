import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Link } from "react-router-dom";
import { fetchWishlist, toggleWishlist } from "../api/pgs.js";
import PGCard from "../components/PGCard.jsx";

const Wishlist = () => {
  const queryClient = useQueryClient();
  const { data: wishlist = [], isLoading } = useQuery({ 
    queryKey: ["wishlist"], 
    queryFn: fetchWishlist 
  });
  
  const mutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] })
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10">
      <div className="mb-6">
        <h1 className="text-2xl font-semibold text-slate-800">Your Wishlist</h1>
        <p className="text-slate-500 mt-1">PGs you've saved for later</p>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="animate-pulse">
              <div className="h-48 bg-slate-200 rounded-t-xl"></div>
              <div className="p-4 space-y-2 bg-white rounded-b-xl border">
                <div className="h-5 bg-slate-200 rounded w-3/4"></div>
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl">
          <svg className="w-20 h-20 mx-auto text-slate-300 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          <p className="text-slate-600 font-medium text-lg">Your wishlist is empty</p>
          <p className="text-slate-400 mt-1">Browse PGs and save your favorites</p>
          <Link to="/search" className="inline-block mt-6 bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700">
            Browse PGs
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((pg) => (
            <div key={pg._id} className="group relative">
              <PGCard pg={pg} />
              <button
                onClick={() => mutation.mutate(pg._id)}
                disabled={mutation.isPending}
                className="absolute top-3 right-3 bg-white/90 backdrop-blur text-red-500 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-white shadow-sm"
                title="Remove from wishlist"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
