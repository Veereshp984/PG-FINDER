import { Link } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";

const genderColors = {
  male: "bg-blue-100 text-blue-700",
  female: "bg-pink-100 text-pink-700",
  unisex: "bg-purple-100 text-purple-700"
};

const genderLabels = {
  male: "Male",
  female: "Female",
  unisex: "Unisex"
};

const PGCard = ({ pg }) => {
  const minPrice = pg.sharingTypes?.length
    ? Math.min(...pg.sharingTypes.map((s) => s.price))
    : null;
  const maxPrice = pg.sharingTypes?.length
    ? Math.max(...pg.sharingTypes.map((s) => s.price))
    : null;

  const sharingTypes = pg.sharingTypes?.map((s) => s.type).sort() || [];

  return (
    <Link
      to={`/pg/${pg._id}`}
      className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-lg transition group"
    >
      <div className="relative">
        <img
          src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"}
          alt={pg.title}
          className="h-48 w-full object-cover group-hover:scale-105 transition duration-300"
        />
        <span className={`absolute top-3 right-3 px-2 py-1 rounded-full text-xs font-medium ${genderColors[pg.genderAllowed]}`}>
          {genderLabels[pg.genderAllowed]}
        </span>
      </div>
      <div className="p-4 space-y-3">
        <div>
          <h3 className="text-lg font-semibold text-slate-800 line-clamp-1 group-hover:text-emerald-600 transition">
            {pg.title}
          </h3>
          <p className="text-sm text-slate-500">{pg.location?.city}</p>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1">
            <RatingStars rating={pg.avgRating} />
            <span className="text-sm text-slate-500 ml-1">({pg.reviewCount})</span>
          </div>
        </div>

        {sharingTypes.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {sharingTypes.map((type) => (
              <span key={type} className="text-xs bg-slate-100 text-slate-600 px-2 py-1 rounded">
                {type} sharing
              </span>
            ))}
          </div>
        )}

        <div className="flex items-center justify-between pt-2 border-t">
          <div className="text-emerald-600 font-bold">
            {minPrice ? (
              <>
                ₹{minPrice.toLocaleString()}
                {maxPrice && maxPrice !== minPrice && ` - ₹${maxPrice.toLocaleString()}`}
                <span className="text-xs font-normal text-slate-500 ml-1">/mo</span>
              </>
            ) : (
              <span className="text-sm text-slate-400">Price on request</span>
            )}
          </div>
          <span className="text-xs text-emerald-600 font-medium group-hover:underline">
            View Details →
          </span>
        </div>
      </div>
    </Link>
  );
};

export default PGCard;
