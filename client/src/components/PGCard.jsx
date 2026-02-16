import { Link } from 'react-router-dom';
import { FaHeart, FaMapMarkerAlt, FaStar, FaUser, FaUsers } from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { useAddToWishlist, useRemoveFromWishlist } from '../hooks/useAuth';

const PGCard = ({ pg, isWishlisted }) => {
  const { isAuthenticated } = useAuth();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const handleWishlistToggle = (e) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (isWishlisted) {
      removeFromWishlist.mutate(pg._id);
    } else {
      addToWishlist.mutate(pg._id);
    }
  };

  const getMinPrice = () => {
    if (!pg.sharingTypes || pg.sharingTypes.length === 0) return null;
    const prices = pg.sharingTypes
      .filter(st => st.available)
      .map(st => st.price);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const getSharingTypes = () => {
    if (!pg.sharingTypes) return [];
    return pg.sharingTypes
      .filter(st => st.available)
      .map(st => st.type)
      .sort((a, b) => a - b);
  };

  const minPrice = getMinPrice();
  const sharingTypes = getSharingTypes();

  return (
    <Link to={`/pg/${pg._id}`} className="card-hover group">
      <div className="relative aspect-[4/3] overflow-hidden">
        <img
          src={pg.photos?.[0] || '/placeholder-pg.jpg'}
          alt={pg.title}
          className="gallery-image group-hover:scale-105 transition-transform duration-300"
        />
        
        {/* Gender Badge */}
        <div className="absolute top-3 left-3">
          <span className={`badge ${
            pg.genderAllowed === 'male' ? 'bg-blue-100 text-blue-800' :
            pg.genderAllowed === 'female' ? 'bg-pink-100 text-pink-800' :
            'bg-purple-100 text-purple-800'
          }`}>
            {pg.genderAllowed === 'unisex' ? 'Unisex' : 
             pg.genderAllowed === 'male' ? 'Male Only' : 'Female Only'}
          </span>
        </div>

        {/* Wishlist Button */}
        {isAuthenticated && (
          <button
            onClick={handleWishlistToggle}
            className="absolute top-3 right-3 p-2 rounded-full bg-white/90 hover:bg-white transition-colors"
          >
            <FaHeart
              className={`w-5 h-5 ${
                isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-400'
              }`}
            />
          </button>
        )}

        {/* Price Badge */}
        {minPrice && (
          <div className="absolute bottom-3 left-3 bg-primary-600 text-white px-3 py-1 rounded-lg">
            <span className="text-sm font-medium">₹{minPrice.toLocaleString()}</span>
            <span className="text-xs opacity-90">/mo</span>
          </div>
        )}
      </div>

      <div className="p-4">
        <h3 className="text-lg font-semibold text-gray-900 mb-1 line-clamp-1">
          {pg.title}
        </h3>
        
        <div className="flex items-center text-gray-500 text-sm mb-2">
          <FaMapMarkerAlt className="w-4 h-4 mr-1" />
          <span className="line-clamp-1">{pg.location?.city}</span>
        </div>

        {/* Sharing Types */}
        <div className="flex items-center gap-2 mb-3">
          {sharingTypes.map(type => (
            <span key={type} className="flex items-center text-xs text-gray-600 bg-gray-100 px-2 py-1 rounded">
              {type === 1 ? <FaUser className="w-3 h-3 mr-1" /> : <FaUsers className="w-3 h-3 mr-1" />}
              {type} Sharing
            </span>
          ))}
        </div>

        {/* Rating */}
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <FaStar className="w-4 h-4 text-yellow-400 mr-1" />
            <span className="font-medium text-gray-900">{pg.avgRating?.toFixed(1) || '0.0'}</span>
            <span className="text-gray-500 text-sm ml-1">({pg.reviewCount || 0})</span>
          </div>
          
          {/* Amenities Preview */}
          {pg.amenities?.slice(0, 3).map(amenity => (
            <span key={amenity} className="text-xs text-gray-500 capitalize">
              {amenity.replace('-', ' ')}
            </span>
          ))}
        </div>
      </div>
    </Link>
  );
};

export default PGCard;
