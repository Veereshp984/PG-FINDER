import { Link } from "react-router-dom";
import RatingStars from "./RatingStars.jsx";

const PGCard = ({ pg }) => {
  return (
    <Link to={`/pg/${pg._id}`} className="bg-white rounded-xl shadow-sm overflow-hidden border hover:shadow-md transition">
      <img
        src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=800"}
        alt={pg.title}
        className="h-44 w-full object-cover"
      />
      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-slate-800">{pg.title}</h3>
        <p className="text-sm text-slate-500">{pg.location?.city}</p>
        <div className="flex items-center justify-between">
          <RatingStars rating={pg.avgRating} />
          <span className="text-sm text-slate-600">{pg.reviewCount} reviews</span>
        </div>
        <div className="text-emerald-600 font-semibold text-sm">
          {pg.sharingTypes?.[0]?.price ? `From ₹${pg.sharingTypes[0].price}` : "Price on request"}
        </div>
      </div>
    </Link>
  );
};

export default PGCard;
