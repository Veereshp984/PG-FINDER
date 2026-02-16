import { Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWishlist, toggleWishlist } from "../api/pgs.js";
import PGCard from "../components/PGCard.jsx";
import { useAuth } from "../state/AuthContext.jsx";

const Wishlist = () => {
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const { data: wishlist = [], isLoading } = useQuery({
    queryKey: ["wishlist"],
    queryFn: fetchWishlist,
    enabled: !!user
  });

  const mutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] })
  });

  if (!user) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-16 text-center">
        <div className="text-6xl mb-4">🔒</div>
        <h1 className="text-2xl font-semibold mb-2">Login to view your wishlist</h1>
        <p className="text-slate-500 mb-6">Save your favorite PGs and access them anytime</p>
        <Link to="/login" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">
          Login
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold">My Wishlist</h1>
          <p className="text-slate-500">{wishlist.length} {wishlist.length === 1 ? "PG" : "PGs"} saved</p>
        </div>
        <Link to="/search" className="text-emerald-600 font-medium hover:underline">
          Browse more →
        </Link>
      </div>

      {isLoading ? (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((i) => (
            <div key={i} className="bg-white rounded-xl shadow-sm overflow-hidden border">
              <div className="h-44 bg-slate-200 animate-pulse"></div>
              <div className="p-4 space-y-3">
                <div className="h-5 bg-slate-200 rounded w-3/4 animate-pulse"></div>
                <div className="h-4 bg-slate-200 rounded w-1/2 animate-pulse"></div>
              </div>
            </div>
          ))}
        </div>
      ) : wishlist.length === 0 ? (
        <div className="text-center py-16 bg-slate-50 rounded-xl border border-dashed">
          <div className="text-6xl mb-4">♡</div>
          <h3 className="text-lg font-semibold text-slate-700">No favorites yet</h3>
          <p className="text-slate-500 mt-1 mb-6">Start exploring and save PGs you like</p>
          <Link to="/search" className="bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium">
            Explore PGs
          </Link>
        </div>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((pg) => (
            <div key={pg._id} className="group">
              <PGCard pg={pg} />
              <button
                onClick={() => mutation.mutate(pg._id)}
                disabled={mutation.isPending}
                className="mt-2 text-sm text-red-500 hover:text-red-700 flex items-center gap-1 transition"
              >
                <span>♥</span> Remove from wishlist
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
