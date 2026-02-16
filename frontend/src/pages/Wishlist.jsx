import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { fetchWishlist, toggleWishlist } from "../api/pgs.js";
import PGCard from "../components/PGCard.jsx";

const Wishlist = () => {
  const queryClient = useQueryClient();
  const { data: wishlist = [] } = useQuery({ queryKey: ["wishlist"], queryFn: fetchWishlist });
  const mutation = useMutation({
    mutationFn: toggleWishlist,
    onSuccess: () => queryClient.invalidateQueries({ queryKey: ["wishlist"] })
  });

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-4">
      <h1 className="text-2xl font-semibold">Wishlist</h1>
      {wishlist.length === 0 ? (
        <p className="text-slate-500">No favorites yet.</p>
      ) : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist.map((pg) => (
            <div key={pg._id} className="space-y-2">
              <PGCard pg={pg} />
              <button
                onClick={() => mutation.mutate(pg._id)}
                className="text-sm text-red-500"
              >
                Remove
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
