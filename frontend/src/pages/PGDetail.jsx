import { useParams } from "react-router-dom";
import { useMutation, useQuery } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchPG, fetchReviews, submitInquiry, toggleWishlist } from "../api/pgs.js";
import MapView from "../components/MapView.jsx";
import RatingStars from "../components/RatingStars.jsx";
import { useAuth } from "../state/AuthContext.jsx";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone is required"),
  message: z.string().optional()
});

const PGDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const isAuthenticated = Boolean(user);
  const { data: pg, isLoading } = useQuery({ queryKey: ["pg", id], queryFn: () => fetchPG(id) });
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews", id], queryFn: () => fetchReviews(id) });

  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    resolver: zodResolver(inquirySchema)
  });

  const inquiryMutation = useMutation({
    mutationFn: (payload) => submitInquiry(id, payload),
    onSuccess: () => reset()
  });

  const wishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(id)
  });

  if (isLoading || !pg) {
    return <div className="max-w-6xl mx-auto px-4 py-10">Loading...</div>;
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-4">
          <img
            src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900"}
            alt={pg.title}
            className="w-full h-72 object-cover rounded-xl"
          />
          <div className="grid grid-cols-3 gap-3">
            {(pg.photos || []).slice(1, 4).map((photo) => (
              <img key={photo} src={photo} alt="PG" className="h-24 w-full object-cover rounded-lg" />
            ))}
          </div>
        </div>
        <div className="space-y-4">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl font-semibold">{pg.title}</h1>
              <p className="text-slate-500">{pg.location?.address}</p>
            </div>
            <button
              className="border px-3 py-2 rounded-lg text-sm text-emerald-700"
              onClick={() => wishlistMutation.mutate()}
              disabled={!user}
            >
              {user ? "Save" : "Login to save"}
            </button>
          </div>
          <div className="flex items-center gap-3">
            <RatingStars rating={pg.avgRating} />
            <span className="text-sm text-slate-500">{pg.reviewCount} reviews</span>
          </div>
          <div className="flex flex-wrap gap-2">
            {(pg.amenities || []).map((amenity) => (
              <span key={amenity} className="bg-emerald-50 text-emerald-700 px-3 py-1 rounded-full text-xs">
                {amenity}
              </span>
            ))}
          </div>
          <p className="text-slate-600">{pg.description}</p>
          <div className="grid sm:grid-cols-2 gap-3">
            {(pg.sharingTypes || []).map((share) => (
              <div key={share.type} className="border rounded-lg p-3 text-sm">
                <p className="font-semibold">{share.type} Sharing</p>
                <p className="text-emerald-600">₹{share.price}</p>
                <p className="text-slate-500">{share.available ? "Available" : "Full"}</p>
              </div>
            ))}
          </div>
        </div>
      </div>

      <section className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Location</h2>
          <MapView lat={pg.location?.coordinates?.lat} lng={pg.location?.coordinates?.lng} />
        </div>
        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact owner</h2>
          {!isAuthenticated && (
            <p className="text-sm text-slate-500">Login to contact the PG owner.</p>
          )}
          <form onSubmit={handleSubmit((data) => inquiryMutation.mutate(data))} className="space-y-3">
            <input {...register("name")} placeholder="Your name" className="border rounded-lg px-3 py-2 w-full" disabled={!isAuthenticated} />
            {errors.name && <p className="text-sm text-red-500">{errors.name.message}</p>}
            <input {...register("phone")} placeholder="Phone number" className="border rounded-lg px-3 py-2 w-full" disabled={!isAuthenticated} />
            {errors.phone && <p className="text-sm text-red-500">{errors.phone.message}</p>}
            <textarea {...register("message")} placeholder="Message (optional)" className="border rounded-lg px-3 py-2 w-full" rows="4" disabled={!isAuthenticated} />
            <button type="submit" className="bg-emerald-600 text-white px-4 py-2 rounded-lg" disabled={!isAuthenticated}>Send inquiry</button>
          </form>
        </div>
      </section>

      <section className="space-y-4">
        <h2 className="text-xl font-semibold">Reviews</h2>
        <div className="space-y-3">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border rounded-lg p-4">
              <RatingStars rating={review.rating} />
              <p className="text-slate-600 mt-2">{review.comment || "No comment provided."}</p>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default PGDetail;
