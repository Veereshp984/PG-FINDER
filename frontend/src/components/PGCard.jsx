import { Link } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";

const PGCard = ({ pg }) => {
  const getStartingPrice = () => {
    if (!pg.sharingTypes || pg.sharingTypes.length === 0) return null;
    const prices = pg.sharingTypes
      .filter(s => s.available && s.price)
      .map(s => s.price);
    return prices.length > 0 ? Math.min(...prices) : null;
  };

  const startingPrice = getStartingPrice();
  const availableTypes = pg.sharingTypes?.filter(s => s.available) || [];

  return (
    <Link to={`/pg/${pg._id}`} className="group bg-white rounded-xl shadow-sm overflow-hidden border border-slate-200 hover:shadow-lg hover:border-emerald-200 transition-all duration-200">
      <div className="relative">
        <img
          src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"}
          alt={pg.title}
          className="h-48 w-full object-cover group-hover:scale-105 transition-transform duration-200"
        />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium capitalize ${
            pg.genderAllowed === 'female' ? 'bg-pink-100 text-pink-700' :
            pg.genderAllowed === 'male' ? 'bg-blue-100 text-blue-700' :
            'bg-purple-100 text-purple-700'
          }`}>
            {pg.genderAllowed}
          </span>
        </div>
        {availableTypes.length === 0 && (
          <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
            <span className="text-white font-semibold px-3 py-1 bg-red-500 rounded-full text-sm">Fully Booked</span>
          </div>
        )}
      </div>
      
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-700 transition-colors">{pg.title}</h3>
          <p className="text-sm text-slate-500 flex items-center gap-1 mt-1">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
            </svg>
            {pg.location?.city}
          </p>
        </div>

        <div className="flex items-center gap-2">
          <RatingStars rating={pg.avgRating} />
          <span className="text-sm text-slate-500">({pg.reviewCount || 0})</span>
        </div>

        {pg.amenities && pg.amenities.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {pg.amenities.slice(0, 3).map((amenity) => (
              <span key={amenity} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {amenity}
              </span>
            ))}
            {pg.amenities.length > 3 && (
              <span className="text-xs text-slate-400 px-1">+{pg.amenities.length - 3}</span>
            )}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t border-slate-100">
          <div>
            {startingPrice ? (
              <>
                <span className="text-emerald-600 font-bold text-lg">₹{startingPrice}</span>
                <span className="text-slate-400 text-sm">/mo</span>
              </>
            ) : (
              <span className="text-slate-400 text-sm">Price on request</span>
            )}
          </div>
          <span className="text-xs text-slate-500">
            {availableTypes.length} option{availableTypes.length !== 1 ? 's' : ''} available
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PGCard;
