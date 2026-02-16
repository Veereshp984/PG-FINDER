import api from "./client";

export const fetchMyListings = async () => {
  const { data } = await api.get("/api/pgs/my-listings");
  return data;
};

export const createPG = async (payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await api.post("/api/pgs", payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
  });
  return data;
};

export const updatePG = async (id, payload) => {
  const isFormData = payload instanceof FormData;
  const { data } = await api.put(`/api/pgs/${id}`, payload, {
    headers: isFormData ? { "Content-Type": "multipart/form-data" } : {}
  });
  return data;
};

export const deletePG = async (id) => {
  const { data } = await api.delete(`/api/pgs/${id}`);
  return data;
};

export const fetchInquiries = async () => {
  const { data } = await api.get("/api/inquiries");
  return data;
};
