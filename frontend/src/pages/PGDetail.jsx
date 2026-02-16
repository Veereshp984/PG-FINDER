import { useState } from "react";
import { useParams } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchPG, fetchReviews, submitInquiry, toggleWishlist, submitReview } from "../api/pgs.js";
import MapView from "../components/MapView.jsx";
import RatingStars from "../components/RatingStars.jsx";
import { useAuth } from "../state/AuthContext.jsx";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone is required"),
  message: z.string().optional()
});

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters")
});

const amenityIcons = {
  "WiFi": "📶",
  "AC": "❄️",
  "TV": "📺",
  "Washing Machine": "🧺",
  "Refrigerator": "🧊",
  "Power Backup": "🔋",
  "Security": "🔒",
  "Housekeeping": "🧹",
  "Parking": "🚗",
  "Gym": "💪",
  "Food": "🍽️",
  "Hot Water": "🚿"
};

const PGDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const [activeImage, setActiveImage] = useState(0);
  const isAuthenticated = Boolean(user);

  const { data: pg, isLoading } = useQuery({ queryKey: ["pg", id], queryFn: () => fetchPG(id) });
  const { data: reviews = [] } = useQuery({ queryKey: ["reviews", id], queryFn: () => fetchReviews(id) });

  const inquiryForm = useForm({
    resolver: zodResolver(inquirySchema),
    defaultValues: { name: user?.name || "", phone: "", message: "" }
  });

  const reviewForm = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5, comment: "" }
  });

  const inquiryMutation = useMutation({
    mutationFn: (payload) => submitInquiry(id, payload),
    onSuccess: () => {
      inquiryForm.reset();
      alert("Inquiry sent successfully!");
    }
  });

  const wishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
      alert("Wishlist updated!");
    }
  });

  const reviewMutation = useMutation({
    mutationFn: (payload) => submitReview(id, payload),
    onSuccess: () => {
      reviewForm.reset();
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["pg", id] });
    }
  });

  if (isLoading || !pg) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-72 bg-slate-200 rounded-xl"></div>
          <div className="h-8 bg-slate-200 rounded w-1/2"></div>
          <div className="h-4 bg-slate-200 rounded w-1/3"></div>
        </div>
      </div>
    );
  }

  const photos = pg.photos?.length > 0 ? pg.photos : [
    "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900",
    "https://images.unsplash.com/photo-1522708323590-d24dbb6b0267?w=400",
    "https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?w=400"
  ];

  return (
    <div className="max-w-6xl mx-auto px-4 py-8 space-y-8">
      {/* Photo Gallery */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <img
            src={photos[activeImage]}
            alt={pg.title}
            className="w-full h-80 object-cover rounded-xl"
          />
          <div className="flex gap-2 overflow-x-auto pb-2">
            {photos.map((photo, index) => (
              <button
                key={index}
                onClick={() => setActiveImage(index)}
                className={`flex-shrink-0 rounded-lg overflow-hidden border-2 ${activeImage === index ? "border-emerald-500" : "border-transparent"}`}
              >
                <img src={photo} alt={`Thumbnail ${index + 1}`} className="h-20 w-28 object-cover" />
              </button>
            ))}
          </div>
        </div>

        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-900">{pg.title}</h1>
              <p className="text-slate-500 mt-1">{pg.location?.address}, {pg.location?.city}</p>
            </div>
            <button
              className={`border px-4 py-2 rounded-lg text-sm font-medium transition ${
                user ? "text-emerald-700 hover:bg-emerald-50 border-emerald-200" : "text-slate-400"
              }`}
              onClick={() => wishlistMutation.mutate()}
              disabled={!user || wishlistMutation.isPending}
            >
              {user ? "♥ Save" : "Login to save"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <RatingStars rating={pg.avgRating} />
            <span className="text-slate-600 font-medium">{pg.avgRating?.toFixed(1) || "0.0"}</span>
            <span className="text-slate-400">•</span>
            <span className="text-slate-500">{pg.reviewCount} reviews</span>
            <span className="text-slate-400">•</span>
            <span className={`px-2 py-1 rounded-full text-xs font-medium ${
              pg.genderAllowed === "male" ? "bg-blue-100 text-blue-700" :
              pg.genderAllowed === "female" ? "bg-pink-100 text-pink-700" :
              "bg-purple-100 text-purple-700"
            }`}>
              {pg.genderAllowed?.charAt(0).toUpperCase() + pg.genderAllowed?.slice(1)}
            </span>
          </div>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {(pg.amenities || []).map((amenity) => (
                <span key={amenity} className="bg-slate-100 text-slate-700 px-3 py-1.5 rounded-lg text-sm flex items-center gap-1.5">
                  <span>{amenityIcons[amenity] || "✓"}</span>
                  {amenity}
                </span>
              ))}
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="font-semibold mb-2">About this PG</h3>
            <p className="text-slate-600 leading-relaxed">{pg.description}</p>
          </div>

          {/* Room Types */}
          <div>
            <h3 className="font-semibold mb-3">Room Types</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(pg.sharingTypes || []).map((share) => (
                <div key={share.type} className="border rounded-xl p-4 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-slate-800">{share.type} Sharing</p>
                    <p className={`text-sm ${share.available ? "text-emerald-600" : "text-red-500"}`}>
                      {share.available ? "✓ Available" : "✗ Full"}
                    </p>
                  </div>
                  <div className="text-right">
                    <p className="text-xl font-bold text-emerald-600">₹{share.price}</p>
                    <p className="text-xs text-slate-500">per month</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <div className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold">Location</h2>
          <MapView lat={pg.location?.coordinates?.lat} lng={pg.location?.coordinates?.lng} />
        </div>

        <div className="space-y-4">
          <h2 className="text-xl font-semibold">Contact Owner</h2>
          {!isAuthenticated && (
            <div className="bg-amber-50 border border-amber-200 rounded-lg p-4 text-sm text-amber-800">
              💡 <strong>Tip:</strong> Login to save this PG to your wishlist and manage your inquiries.
            </div>
          )}
          <form onSubmit={inquiryForm.handleSubmit((data) => inquiryMutation.mutate(data))} className="space-y-4 bg-white border rounded-xl p-6">
            <div>
              <label className="block text-sm font-medium mb-1">Your Name</label>
              <input
                {...inquiryForm.register("name")}
                placeholder="Enter your name"
                className="border rounded-lg px-3 py-2 w-full"
              />
              {inquiryForm.formState.errors.name && (
                <p className="text-sm text-red-500 mt-1">{inquiryForm.formState.errors.name.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Phone Number</label>
              <input
                {...inquiryForm.register("phone")}
                placeholder="Enter your phone number"
                className="border rounded-lg px-3 py-2 w-full"
              />
              {inquiryForm.formState.errors.phone && (
                <p className="text-sm text-red-500 mt-1">{inquiryForm.formState.errors.phone.message}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium mb-1">Message (Optional)</label>
              <textarea
                {...inquiryForm.register("message")}
                placeholder="Any specific requirements or questions?"
                className="border rounded-lg px-3 py-2 w-full"
                rows="3"
              />
            </div>
            <button
              type="submit"
              disabled={inquiryMutation.isPending}
              className="bg-emerald-600 text-white px-6 py-3 rounded-lg font-medium w-full disabled:opacity-50"
            >
              {inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
            </button>
          </form>
        </div>
      </div>

      {/* Reviews Section */}
      <section className="space-y-6">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold">Reviews ({reviews.length})</h2>
          {pg.avgRating > 0 && (
            <div className="flex items-center gap-2">
              <span className="text-3xl font-bold text-slate-900">{pg.avgRating.toFixed(1)}</span>
              <div>
                <RatingStars rating={pg.avgRating} />
                <p className="text-sm text-slate-500">out of 5</p>
              </div>
            </div>
          )}
        </div>

        {/* Add Review */}
        {isAuthenticated && (
          <div className="bg-white border rounded-xl p-6">
            <h3 className="font-medium mb-4">Write a Review</h3>
            <form onSubmit={reviewForm.handleSubmit((data) => reviewMutation.mutate(data))} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Rating</label>
                <select {...reviewForm.register("rating", { valueAsNumber: true })} className="border rounded-lg px-3 py-2">
                  {[5, 4, 3, 2, 1].map((r) => (
                    <option key={r} value={r}>{r} Star{r > 1 ? "s" : ""}</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Your Review</label>
                <textarea
                  {...reviewForm.register("comment")}
                  placeholder="Share your experience..."
                  className="border rounded-lg px-3 py-2 w-full"
                  rows="3"
                />
                {reviewForm.formState.errors.comment && (
                  <p className="text-sm text-red-500 mt-1">{reviewForm.formState.errors.comment.message}</p>
                )}
              </div>
              <button
                type="submit"
                disabled={reviewMutation.isPending}
                className="bg-emerald-600 text-white px-4 py-2 rounded-lg disabled:opacity-50"
              >
                {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
              </button>
            </form>
          </div>
        )}

        {/* Review List */}
        <div className="grid md:grid-cols-2 gap-4">
          {reviews.map((review) => (
            <div key={review._id} className="bg-white border rounded-xl p-4 space-y-2">
              <div className="flex items-center justify-between">
                <RatingStars rating={review.rating} />
                <span className="text-xs text-slate-400">
                  {new Date(review.createdAt).toLocaleDateString()}
                </span>
              </div>
              <p className="text-slate-600">{review.comment || "No comment provided."}</p>
            </div>
          ))}
        </div>

        {reviews.length === 0 && (
          <p className="text-slate-500 text-center py-8">No reviews yet. Be the first to review!</p>
        )}
      </section>
    </div>
  );
};

export default PGDetail;
