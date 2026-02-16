import api from "./client";

export const fetchPGs = async (params = {}) => {
  const { data } = await api.get("/api/pgs", { params });
  return data;
};

export const fetchPG = async (id) => {
  const { data } = await api.get(`/api/pgs/${id}`);
  return data;
};

export const fetchReviews = async (id) => {
  const { data } = await api.get(`/api/pgs/${id}/reviews`);
  return data;
};

export const toggleWishlist = async (id) => {
  const { data } = await api.post(`/api/wishlist/${id}`);
  return data;
};

export const fetchWishlist = async () => {
  const { data } = await api.get("/api/wishlist");
  return data;
};

export const submitInquiry = async (id, payload) => {
  const { data } = await api.post(`/api/pgs/${id}/inquiry`, payload);
  return data;
};
