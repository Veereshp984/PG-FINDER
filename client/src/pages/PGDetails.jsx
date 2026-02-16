import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { 
  FaMapMarkerAlt, FaPhone, FaEnvelope, FaStar, FaHeart, 
  FaBed, FaUser, FaChevronLeft, FaChevronRight, FaShareAlt,
  FaWifi, FaSnowflake, FaTv, FaUtensils, FaCar, FaBolt,
  FaShower, FaDumbbell, FaElevator, FaBroom, FaShieldAlt
} from 'react-icons/fa';
import { useAuth } from '../contexts/AuthContext';
import { usePG } from '../hooks/usePGs';
import { useReviews, useCreateReview, useDeleteReview, useCreateInquiry, useAddToWishlist, useRemoveFromWishlist, useWishlist } from '../hooks/useAuth';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';

const amenityIcons = {
  wifi: FaWifi,
  ac: FaSnowflake,
  tv: FaTv,
  fridge: FaUtensils,
  'washing-machine': FaBroom,
  geyser: FaShower,
  parking: FaCar,
  'power-backup': FaBolt,
  security: FaShieldAlt,
  meals: FaUtensils,
  gym: FaDumbbell,
  lift: FaElevator,
  housekeeping: FaBroom,
};

const reviewSchema = z.object({
  rating: z.number().min(1).max(5),
  comment: z.string().min(10, 'Comment must be at least 10 characters'),
});

const inquirySchema = z.object({
  name: z.string().min(2, 'Name is required'),
  phone: z.string().min(10, 'Valid phone number is required'),
  message: z.string().min(10, 'Message must be at least 10 characters'),
});

const PGDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [showContactModal, setShowContactModal] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);

  const { data: pg, isLoading: pgLoading } = usePG(id);
  const { data: reviews, isLoading: reviewsLoading } = useReviews(id);
  const { data: wishlistData } = useWishlist({ enabled: isAuthenticated });
  const createReview = useCreateReview();
  const deleteReview = useDeleteReview();
  const createInquiry = useCreateInquiry();
  const addToWishlist = useAddToWishlist();
  const removeFromWishlist = useRemoveFromWishlist();

  const isWishlisted = wishlistData?.some(w => w._id === id);

  const { register: registerReview, handleSubmit: handleSubmitReview, formState: { errors: reviewErrors } } = useForm({
    resolver: zodResolver(reviewSchema),
  });

  const { register: registerInquiry, handleSubmit: handleSubmitInquiry, formState: { errors: inquiryErrors }, reset: resetInquiry } = useForm({
    resolver: zodResolver(inquirySchema),
  });

  const onSubmitReview = (data) => {
    createReview.mutate({ pgId: id, ...data }, {
      onSuccess: () => setShowReviewModal(false),
    });
  };

  const onSubmitInquiry = (data) => {
    createInquiry.mutate({ pgId: id, ...data }, {
      onSuccess: () => {
        setShowContactModal(false);
        resetInquiry();
      },
    });
  };

  const handleWishlistToggle = () => {
    if (isWishlisted) {
      removeFromWishlist.mutate(id);
    } else {
      addToWishlist.mutate(id);
    }
  };

  if (pgLoading) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4">
          <div className="animate-pulse space-y-4">
            <div className="h-96 bg-gray-200 rounded-xl" />
            <div className="h-8 bg-gray-200 rounded w-1/2" />
            <div className="h-4 bg-gray-200 rounded w-1/3" />
          </div>
        </div>
      </div>
    );
  }

  if (!pg) {
    return (
      <div className="min-h-screen bg-gray-50 py-8">
        <div className="max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-2xl font-bold text-gray-900">PG not found</h1>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Image Gallery */}
      <div className="relative h-96 md:h-[500px]">
        <img
          src={pg.photos?.[activeImageIndex] || '/placeholder-pg.jpg'}
          alt={pg.title}
          className="w-full h-full object-cover"
        />
        
        {pg.photos?.length > 1 && (
          <>
            <button
              onClick={() => setActiveImageIndex(i => (i === 0 ? pg.photos.length - 1 : i - 1))}
              className="absolute left-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <FaChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={() => setActiveImageIndex(i => (i === pg.photos.length - 1 ? 0 : i + 1))}
              className="absolute right-4 top-1/2 -translate-y-1/2 bg-white/80 p-2 rounded-full hover:bg-white"
            >
              <FaChevronRight className="w-5 h-5" />
            </button>
          </>
        )}

        {/* Image Thumbnails */}
        <div className="absolute bottom-4 left-1/2 -translate-x-1/2 flex space-x-2">
          {pg.photos?.map((_, index) => (
            <button
              key={index}
              onClick={() => setActiveImageIndex(index)}
              className={`w-2 h-2 rounded-full ${
                index === activeImageIndex ? 'bg-white' : 'bg-white/50'
              }`}
            />
          ))}
        </div>

        {/* Top Actions */}
        <div className="absolute top-4 right-4 flex space-x-2">
          {isAuthenticated && (
            <button
              onClick={handleWishlistToggle}
              className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors"
            >
              <FaHeart className={`w-5 h-5 ${isWishlisted ? 'text-red-500 fill-red-500' : 'text-gray-600'}`} />
            </button>
          )}
          <button className="bg-white/90 p-3 rounded-full hover:bg-white transition-colors">
            <FaShareAlt className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-8">
            {/* Header */}
            <div>
              <div className="flex items-start justify-between">
                <div>
                  <h1 className="text-2xl md:text-3xl font-bold text-gray-900">{pg.title}</h1>
                  <div className="flex items-center text-gray-500 mt-2">
                    <FaMapMarkerAlt className="w-4 h-4 mr-1" />
                    <span>{pg.location?.address}, {pg.location?.city}</span>
                  </div>
                </div>
                <div className="flex items-center bg-primary-50 px-3 py-1 rounded-lg">
                  <FaStar className="w-5 h-5 text-yellow-400 mr-1" />
                  <span className="font-semibold">{pg.avgRating?.toFixed(1) || '0.0'}</span>
                  <span className="text-gray-500 text-sm ml-1">({pg.reviewCount || 0})</span>
                </div>
              </div>

              <div className="mt-4">
                <span className={`badge ${
                  pg.genderAllowed === 'male' ? 'bg-blue-100 text-blue-800' :
                  pg.genderAllowed === 'female' ? 'bg-pink-100 text-pink-800' :
                  'bg-purple-100 text-purple-800'
                }`}>
                  {pg.genderAllowed === 'unisex' ? 'Unisex' : 
                   pg.genderAllowed === 'male' ? 'Male Only' : 'Female Only'}
                </span>
              </div>
            </div>

            {/* Sharing Types */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Room Types & Pricing</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pg.sharingTypes?.map((sharing) => (
                  <div
                    key={sharing.type}
                    className={`p-4 rounded-lg border-2 ${
                      sharing.available ? 'border-primary-200 bg-primary-50' : 'border-gray-200 bg-gray-50'
                    }`}
                  >
                    <div className="flex items-center justify-center mb-2">
                      {sharing.type === 1 ? <FaUser className="w-6 h-6 text-primary-600" /> : <FaBed className="w-6 h-6 text-primary-600" />}
                    </div>
                    <p className="text-center font-medium">{sharing.type} Sharing</p>
                    <p className="text-center text-lg font-bold text-primary-600">
                      ₹{sharing.price?.toLocaleString()}
                    </p>
                    <p className="text-center text-sm text-gray-500">
                      {sharing.available ? 'Available' : 'Not Available'}
                    </p>
                  </div>
                ))}
              </div>
            </div>

            {/* Description */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">About this PG</h2>
              <p className="text-gray-600 whitespace-pre-line">{pg.description}</p>
            </div>

            {/* Amenities */}
            <div className="card p-6">
              <h2 className="text-xl font-semibold mb-4">Amenities</h2>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                {pg.amenities?.map((amenity) => {
                  const Icon = amenityIcons[amenity] || FaBolt;
                  return (
                    <div key={amenity} className="flex items-center space-x-2">
                      <Icon className="w-5 h-5 text-primary-600" />
                      <span className="text-gray-600 capitalize">{amenity.replace('-', ' ')}</span>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Reviews */}
            <div className="card p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-semibold">Reviews ({reviews?.length || 0})</h2>
                {isAuthenticated && (
                  <button
                    onClick={() => setShowReviewModal(true)}
                    className="btn-primary text-sm"
                  >
                    Write a Review
                  </button>
                )}
              </div>

              <div className="space-y-4">
                {reviews?.map((review) => (
                  <div key={review._id} className="border-b pb-4 last:border-0">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center">
                        <div className="w-10 h-10 bg-primary-100 rounded-full flex items-center justify-center">
                          <span className="font-semibold text-primary-600">
                            {review.userId?.name?.[0] || 'U'}
                          </span>
                        </div>
                        <div className="ml-3">
                          <p className="font-medium">{review.userId?.name}</p>
                          <div className="flex items-center">
                            {[...Array(5)].map((_, i) => (
                              <FaStar
                                key={i}
                                className={`w-4 h-4 ${i < review.rating ? 'text-yellow-400' : 'text-gray-300'}`}
                              />
                            ))}
                          </div>
                        </div>
                      </div>
                      {(user?.id === review.userId?._id || user?.role === 'admin') && (
                        <button
                          onClick={() => deleteReview.mutate({ reviewId: review._id, pgId: id })}
                          className="text-red-500 text-sm hover:underline"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                    <p className="text-gray-600 mt-2">{review.comment}</p>
                  </div>
                ))}

                {!reviews?.length && (
                  <p className="text-gray-500 text-center py-4">No reviews yet. Be the first to review!</p>
                )}
              </div>
            </div>
          </div>

          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="sticky top-24 space-y-4">
              {/* Contact Card */}
              <div className="card p-6">
                <h3 className="text-lg font-semibold mb-4">Contact Owner</h3>
                <div className="space-y-3 mb-4">
                  <div className="flex items-center space-x-3">
                    <FaUser className="w-5 h-5 text-gray-400" />
                    <span>{pg.ownerId?.name}</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <FaPhone className="w-5 h-5 text-gray-400" />
                    <span>{pg.ownerId?.phone || 'Not available'}</span>
                  </div>
                </div>
                {isAuthenticated ? (
                  <button
                    onClick={() => setShowContactModal(true)}
                    className="w-full btn-primary"
                  >
                    Send Inquiry
                  </button>
                ) : (
                  <button
                    onClick={() => navigate('/login', { state: { from: `/pg/${id}` } })}
                    className="w-full btn-primary"
                  >
                    Login to Contact
                  </button>
                )}
              </div>

              {/* Location Map */}
              <div className="card overflow-hidden">
                <div className="h-64 bg-gray-100">
                  <iframe
                    width="100%"
                    height="100%"
                    frameBorder="0"
                    style={{ border: 0 }}
                    src={`https://www.google.com/maps/embed/v1/place?key=${import.meta.env.VITE_GOOGLE_MAPS_API_KEY || ''}&q=${pg.location?.coordinates?.lat},${pg.location?.coordinates?.lng}`}
                    allowFullScreen
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Contact Modal */}
      {showContactModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Send Inquiry</h3>
            <form onSubmit={handleSubmitInquiry(onSubmitInquiry)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
                <input {...registerInquiry('name')} className="input" />
                {inquiryErrors.name && <p className="text-red-500 text-sm mt-1">{inquiryErrors.name.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Phone</label>
                <input {...registerInquiry('phone')} className="input" />
                {inquiryErrors.phone && <p className="text-red-500 text-sm mt-1">{inquiryErrors.phone.message}</p>}
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Message</label>
                <textarea {...registerInquiry('message')} rows={4} className="input" />
                {inquiryErrors.message && <p className="text-red-500 text-sm mt-1">{inquiryErrors.message.message}</p>}
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowContactModal(false)} className="flex-1 btn-outline">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Send
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Review Modal */}
      {showReviewModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50">
          <div className="bg-white rounded-xl max-w-md w-full p-6">
            <h3 className="text-xl font-semibold mb-4">Write a Review</h3>
            <form onSubmit={handleSubmitReview(onSubmitReview)} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Rating</label>
                <select {...registerReview('rating', { valueAsNumber: true })} className="input">
                  <option value="5">5 Stars</option>
                  <option value="4">4 Stars</option>
                  <option value="3">3 Stars</option>
                  <option value="2">2 Stars</option>
                  <option value="1">1 Star</option>
                </select>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Comment</label>
                <textarea {...registerReview('comment')} rows={4} className="input" />
                {reviewErrors.comment && <p className="text-red-500 text-sm mt-1">{reviewErrors.comment.message}</p>}
              </div>
              <div className="flex space-x-3">
                <button type="button" onClick={() => setShowReviewModal(false)} className="flex-1 btn-outline">
                  Cancel
                </button>
                <button type="submit" className="flex-1 btn-primary">
                  Submit
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default PGDetails;
