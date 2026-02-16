import { useParams, Link } from "react-router-dom";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { fetchPG, fetchReviews, submitInquiry, toggleWishlist, submitReview } from "../api/pgs.js";
import MapView from "../components/MapView.jsx";
import RatingStars from "../components/RatingStars.jsx";
import { useAuth } from "../state/AuthContext.jsx";
import { useState } from "react";

const inquirySchema = z.object({
  name: z.string().min(1, "Name is required"),
  phone: z.string().min(6, "Phone is required"),
  message: z.string().optional()
});

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(3, "Comment must be at least 3 characters")
});

// Amenity icons mapping
const amenityIcons = {
  wifi: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.111 16.404a5.5 5.5 0 017.778 0M12 20h.01m-7.08-7.071c3.904-3.905 10.236-3.905 14.141 0M1.394 9.393c5.857-5.857 15.355-5.857 21.213 0" />
    </svg>
  ),
  ac: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
    </svg>
  ),
  tv: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
    </svg>
  ),
  food: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
    </svg>
  ),
  parking: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 10l7-7m0 0l7 7m-7-7v18" />
    </svg>
  ),
  gym: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16m-7 6h7" />
    </svg>
  ),
  laundry: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
    </svg>
  ),
  default: (
    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
    </svg>
  )
};

const getAmenityIcon = (amenity) => {
  const normalized = amenity.toLowerCase();
  if (normalized.includes("wifi")) return amenityIcons.wifi;
  if (normalized.includes("ac") || normalized.includes("air")) return amenityIcons.ac;
  if (normalized.includes("tv") || normalized.includes("television")) return amenityIcons.tv;
  if (normalized.includes("food") || normalized.includes("meal")) return amenityIcons.food;
  if (normalized.includes("parking")) return amenityIcons.parking;
  if (normalized.includes("gym") || normalized.includes("fitness")) return amenityIcons.gym;
  if (normalized.includes("laundry") || normalized.includes("washing")) return amenityIcons.laundry;
  return amenityIcons.default;
};

const PGDetail = () => {
  const { id } = useParams();
  const { user } = useAuth();
  const queryClient = useQueryClient();
  const isAuthenticated = Boolean(user);
  const [showReviewForm, setShowReviewForm] = useState(false);
  
  const { data: pg, isLoading: pgLoading } = useQuery({ 
    queryKey: ["pg", id], 
    queryFn: () => fetchPG(id) 
  });
  
  const { data: reviews = [], isLoading: reviewsLoading } = useQuery({ 
    queryKey: ["reviews", id], 
    queryFn: () => fetchReviews(id) 
  });

  const { register: registerInquiry, handleSubmit: handleSubmitInquiry, formState: { errors: inquiryErrors }, reset: resetInquiry } = useForm({
    resolver: zodResolver(inquirySchema)
  });

  const { register: registerReview, handleSubmit: handleSubmitReview, formState: { errors: reviewErrors }, reset: resetReview } = useForm({
    resolver: zodResolver(reviewSchema),
    defaultValues: { rating: 5 }
  });

  const inquiryMutation = useMutation({
    mutationFn: (payload) => submitInquiry(id, payload),
    onSuccess: () => {
      resetInquiry();
      alert("Inquiry sent successfully!");
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to send inquiry. Please try again.");
    }
  });

  const wishlistMutation = useMutation({
    mutationFn: () => toggleWishlist(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["wishlist"] });
    }
  });

  const reviewMutation = useMutation({
    mutationFn: (payload) => submitReview(id, payload),
    onSuccess: () => {
      resetReview();
      setShowReviewForm(false);
      queryClient.invalidateQueries({ queryKey: ["reviews", id] });
      queryClient.invalidateQueries({ queryKey: ["pg", id] });
    },
    onError: (error) => {
      alert(error.response?.data?.message || "Failed to submit review. Please try again.");
    }
  });

  if (pgLoading) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10">
        <div className="animate-pulse space-y-4">
          <div className="h-72 bg-slate-200 rounded-xl"></div>
          <div className="h-8 bg-slate-200 rounded w-1/3"></div>
          <div className="h-4 bg-slate-200 rounded w-1/2"></div>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="max-w-6xl mx-auto px-4 py-10 text-center">
        <p className="text-slate-500">PG listing not found.</p>
        <Link to="/search" className="text-emerald-600 hover:underline mt-2 inline-block">
          Browse other PGs
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto px-4 py-10 space-y-8">
      {/* Photo Gallery */}
      <div className="grid lg:grid-cols-2 gap-4">
        <div className="space-y-4">
          <img
            src={pg.photos?.[0] || "https://images.unsplash.com/photo-1505691938895-1758d7feb511?w=900"}
            alt={pg.title}
            className="w-full h-72 md:h-96 object-cover rounded-xl"
          />
          {pg.photos && pg.photos.length > 1 && (
            <div className="grid grid-cols-4 gap-2">
              {pg.photos.slice(1, 5).map((photo, idx) => (
                <img key={idx} src={photo} alt={`PG ${idx + 2}`} className="h-20 md:h-24 w-full object-cover rounded-lg" />
              ))}
            </div>
          )}
        </div>
        
        {/* Info Card */}
        <div className="space-y-6">
          <div className="flex items-start justify-between gap-3">
            <div>
              <h1 className="text-2xl md:text-3xl font-semibold text-slate-800">{pg.title}</h1>
              <p className="text-slate-500 mt-1">{pg.location?.address}, {pg.location?.city}</p>
            </div>
            <button
              className={`border px-4 py-2 rounded-lg text-sm font-medium transition-colors ${
                user 
                  ? "border-emerald-200 text-emerald-700 hover:bg-emerald-50" 
                  : "border-slate-200 text-slate-400 cursor-not-allowed"
              }`}
              onClick={() => wishlistMutation.mutate()}
              disabled={!user || wishlistMutation.isPending}
            >
              {user ? "♡ Save" : "Login to save"}
            </button>
          </div>

          <div className="flex items-center gap-3">
            <RatingStars rating={pg.avgRating} />
            <span className="text-sm text-slate-500">({pg.reviewCount} reviews)</span>
            <span className="px-3 py-1 bg-emerald-100 text-emerald-700 rounded-full text-sm font-medium capitalize">
              {pg.genderAllowed}
            </span>
          </div>

          <p className="text-slate-600 leading-relaxed">{pg.description}</p>

          {/* Amenities */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Amenities</h3>
            <div className="flex flex-wrap gap-2">
              {(pg.amenities || []).map((amenity) => (
                <span key={amenity} className="flex items-center gap-2 bg-slate-100 text-slate-700 px-3 py-2 rounded-lg text-sm">
                  {getAmenityIcon(amenity)}
                  <span className="capitalize">{amenity}</span>
                </span>
              ))}
            </div>
          </div>

          {/* Sharing Types */}
          <div>
            <h3 className="font-semibold text-slate-800 mb-3">Room Options</h3>
            <div className="grid sm:grid-cols-2 gap-3">
              {(pg.sharingTypes || []).map((share) => (
                <div key={share.type} className={`border rounded-lg p-4 ${share.available ? 'border-emerald-200 bg-emerald-50' : 'border-slate-200 bg-slate-50'}`}>
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-slate-800">{share.type} Sharing</span>
                    <span className={`text-xs px-2 py-1 rounded-full ${share.available ? 'bg-emerald-200 text-emerald-800' : 'bg-slate-200 text-slate-600'}`}>
                      {share.available ? "Available" : "Full"}
                    </span>
                  </div>
                  <p className="text-emerald-600 font-bold text-lg mt-1">₹{share.price}<span className="text-sm font-normal text-slate-500">/month</span></p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Location & Contact */}
      <section className="grid lg:grid-cols-2 gap-8">
        <div className="space-y-3">
          <h2 className="text-xl font-semibold text-slate-800">Location</h2>
          <MapView lat={pg.location?.coordinates?.lat} lng={pg.location?.coordinates?.lng} />
        </div>
        
        <div className="space-y-4">
          <h2 className="text-xl font-semibold text-slate-800">Contact Owner</h2>
          
          {pg.ownerId && (
            <div className="bg-slate-50 rounded-lg p-4 mb-4">
              <p className="font-medium text-slate-800">{pg.ownerId.name}</p>
              <p className="text-sm text-slate-500">{pg.ownerId.email}</p>
              {pg.ownerId.phone && <p className="text-sm text-slate-500">{pg.ownerId.phone}</p>}
            </div>
          )}

          {!isAuthenticated ? (
            <div className="bg-slate-50 rounded-lg p-6 text-center">
              <p className="text-slate-600 mb-3">Please login to contact the PG owner</p>
              <Link to="/login" className="inline-block bg-emerald-600 text-white px-6 py-2 rounded-lg font-medium hover:bg-emerald-700">
                Login
              </Link>
            </div>
          ) : (
            <form onSubmit={handleSubmitInquiry((data) => inquiryMutation.mutate(data))} className="space-y-3">
              <div>
                <input {...registerInquiry("name")} placeholder="Your name" 
                  className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                {inquiryErrors.name && <p className="text-sm text-red-500 mt-1">{inquiryErrors.name.message}</p>}
              </div>
              <div>
                <input {...registerInquiry("phone")} placeholder="Phone number" 
                  className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
                {inquiryErrors.phone && <p className="text-sm text-red-500 mt-1">{inquiryErrors.phone.message}</p>}
              </div>
              <div>
                <textarea {...registerInquiry("message")} placeholder="Your message (optional)" 
                  className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" rows="3" />
              </div>
              <button 
                type="submit" 
                disabled={inquiryMutation.isPending}
                className="w-full bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
              >
                {inquiryMutation.isPending ? "Sending..." : "Send Inquiry"}
              </button>
            </form>
          )}
        </div>
      </section>

      {/* Reviews */}
      <section className="space-y-4">
        <div className="flex items-center justify-between">
          <h2 className="text-xl font-semibold text-slate-800">Reviews ({pg.reviewCount})</h2>
          {isAuthenticated && (
            <button
              onClick={() => setShowReviewForm(!showReviewForm)}
              className="text-emerald-600 hover:text-emerald-700 font-medium"
            >
              {showReviewForm ? "Cancel" : "Write a Review"}
            </button>
          )}
        </div>

        {/* Review Form */}
        {showReviewForm && (
          <form onSubmit={handleSubmitReview((data) => reviewMutation.mutate(data))} className="bg-slate-50 rounded-lg p-4 space-y-3">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Rating</label>
              <select {...registerReview("rating", { valueAsNumber: true })} 
                className="border border-slate-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none">
                {[5, 4, 3, 2, 1].map(r => (
                  <option key={r} value={r}>{r} Star{r > 1 ? 's' : ''}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Comment</label>
              <textarea {...registerReview("comment")} placeholder="Share your experience..." rows="3"
                className="border border-slate-300 rounded-lg px-3 py-2 w-full focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 outline-none" />
              {reviewErrors.comment && <p className="text-sm text-red-500 mt-1">{reviewErrors.comment.message}</p>}
            </div>
            <button 
              type="submit" 
              disabled={reviewMutation.isPending}
              className="bg-emerald-600 text-white px-4 py-2 rounded-lg font-medium hover:bg-emerald-700 disabled:opacity-50"
            >
              {reviewMutation.isPending ? "Submitting..." : "Submit Review"}
            </button>
          </form>
        )}

        {/* Reviews List */}
        <div className="space-y-3">
          {reviewsLoading ? (
            <div className="animate-pulse space-y-3">
              {[1, 2, 3].map(i => (
                <div key={i} className="h-24 bg-slate-200 rounded-lg"></div>
              ))}
            </div>
          ) : reviews.length === 0 ? (
            <p className="text-slate-500 text-center py-8">No reviews yet. Be the first to review!</p>
          ) : (
            reviews.map((review) => (
              <div key={review._id} className="bg-white border border-slate-200 rounded-lg p-4">
                <div className="flex items-center justify-between mb-2">
                  <RatingStars rating={review.rating} />
                  <span className="text-xs text-slate-400">
                    {new Date(review.createdAt).toLocaleDateString()}
                  </span>
                </div>
                <p className="text-slate-600">{review.comment || "No comment provided."}</p>
              </div>
            ))
          )}
        </div>
      </section>
    </div>
  );
};

export default PGDetail;
