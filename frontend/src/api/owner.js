import api from "./client";

export const fetchMyListings = async () => {
  const { data } = await api.get("/api/pgs/my-listings");
  return data;
};

export const createPG = async (payload) => {
  const { data } = await api.post("/api/pgs", payload);
  return data;
};

export const updatePG = async (id, payload) => {
  const { data } = await api.put(`/api/pgs/${id}`, payload);
  return data;
};

export const fetchInquiries = async () => {
  const { data } = await api.get("/api/inquiries");
  return data;
};
