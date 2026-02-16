import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

export const useWishlist = () => {
  return useQuery({
    queryKey: ['wishlist'],
    queryFn: async () => {
      const { data } = await api.get('/wishlist');
      return data;
    },
  });
};

export const useAddToWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (pgId) => api.post(`/wishlist/${pgId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Added to wishlist');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add to wishlist');
    },
  });
};

export const useRemoveFromWishlist = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (pgId) => api.delete(`/wishlist/${pgId}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['wishlist'] });
      toast.success('Removed from wishlist');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to remove from wishlist');
    },
  });
};

export const useReviews = (pgId) => {
  return useQuery({
    queryKey: ['reviews', pgId],
    queryFn: async () => {
      const { data } = await api.get(`/reviews/pg/${pgId}`);
      return data;
    },
    enabled: !!pgId,
  });
};

export const useCreateReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ pgId, ...reviewData }) => api.post(`/reviews/pg/${pgId}`, reviewData),
    onSuccess: (_, { pgId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', pgId] });
      queryClient.invalidateQueries({ queryKey: ['pg', pgId] });
      toast.success('Review added successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to add review');
    },
  });
};

export const useDeleteReview = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ reviewId, pgId }) => api.delete(`/reviews/${reviewId}`),
    onSuccess: (_, { pgId }) => {
      queryClient.invalidateQueries({ queryKey: ['reviews', pgId] });
      queryClient.invalidateQueries({ queryKey: ['pg', pgId] });
      toast.success('Review deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete review');
    },
  });
};

export const useInquiries = () => {
  return useQuery({
    queryKey: ['inquiries'],
    queryFn: async () => {
      const { data } = await api.get('/inquiries');
      return data;
    },
  });
};

export const useCreateInquiry = () => {
  return useMutation({
    mutationFn: ({ pgId, ...inquiryData }) => api.post(`/inquiries/pg/${pgId}`, inquiryData),
    onSuccess: () => {
      toast.success('Inquiry sent successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to send inquiry');
    },
  });
};

export const useUpdateInquiryStatus = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, status }) => api.put(`/inquiries/${id}`, { status }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['inquiries'] });
      toast.success('Status updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update status');
    },
  });
};
