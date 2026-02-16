import { Link } from 'react-router-dom';
import { FaHeart, FaArrowLeft } from 'react-icons/fa';
import { useWishlist } from '../hooks/useAuth';
import PGCard from '../components/PGCard';

const Wishlist = () => {
  const { data: wishlist, isLoading } = useWishlist();

  return (
    <div className="page-container">
      {/* Header */}
      <div className="flex items-center space-x-4 mb-6">
        <Link to="/" className="text-gray-600 hover:text-gray-900">
          <FaArrowLeft className="w-5 h-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold text-gray-900">My Wishlist</h1>
          <p className="text-gray-600">
            {wishlist?.length || 0} saved PGs
          </p>
        </div>
      </div>

      {isLoading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[...Array(4)].map((_, i) => (
            <div key={i} className="card animate-pulse">
              <div className="aspect-[4/3] bg-gray-200" />
              <div className="p-4 space-y-3">
                <div className="h-4 bg-gray-200 rounded w-3/4" />
                <div className="h-3 bg-gray-200 rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : wishlist?.length === 0 ? (
        <div className="text-center py-16">
          <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <FaHeart className="w-10 h-10 text-gray-400" />
          </div>
          <h2 className="text-xl font-semibold text-gray-900 mb-2">
            Your wishlist is empty
          </h2>
          <p className="text-gray-600 mb-6">
            Save your favorite PGs to compare and contact later
          </p>
          <Link to="/search" className="btn-primary">
            Browse PGs
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {wishlist?.map((pg) => (
            <PGCard key={pg._id} pg={pg} isWishlisted={true} />
          ))}
        </div>
      )}
    </div>
  );
};

export default Wishlist;
