import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '../services/api';
import toast from 'react-hot-toast';

const fetchPGs = async (params) => {
  const { data } = await api.get('/pgs', { params });
  return data;
};

const fetchPG = async (id) => {
  const { data } = await api.get(`/pgs/${id}`);
  return data;
};

const fetchMyListings = async () => {
  const { data } = await api.get('/pgs/my-listings');
  return data;
};

export const usePGs = (params = {}) => {
  return useQuery({
    queryKey: ['pgs', params],
    queryFn: () => fetchPGs(params),
  });
};

export const usePG = (id) => {
  return useQuery({
    queryKey: ['pg', id],
    queryFn: () => fetchPG(id),
    enabled: !!id,
  });
};

export const useMyListings = () => {
  return useQuery({
    queryKey: ['my-listings'],
    queryFn: fetchMyListings,
  });
};

export const useCreatePG = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (formData) => api.post('/pgs', formData),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pgs'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      toast.success('PG listing created successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to create PG');
    },
  });
};

export const useUpdatePG = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: ({ id, formData }) => api.put(`/pgs/${id}`, formData),
    onSuccess: (_, { id }) => {
      queryClient.invalidateQueries({ queryKey: ['pgs'] });
      queryClient.invalidateQueries({ queryKey: ['pg', id] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      toast.success('PG listing updated successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update PG');
    },
  });
};

export const useDeletePG = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: (id) => api.delete(`/pgs/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['pgs'] });
      queryClient.invalidateQueries({ queryKey: ['my-listings'] });
      toast.success('PG listing deleted successfully');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to delete PG');
    },
  });
};
