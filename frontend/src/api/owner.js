import api from "./client";

export const fetchMyListings = async () => {
  const { data } = await api.get("/api/pgs/my-listings");
  return data;
};

export const createPG = async (formData) => {
  const { data } = await api.post("/api/pgs", formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};

export const updatePG = async (id, formData) => {
  const { data } = await api.put(`/api/pgs/${id}`, formData, {
    headers: {
      "Content-Type": "multipart/form-data"
    }
  });
  return data;
};

export const fetchInquiries = async () => {
  const { data } = await api.get("/api/inquiries");
  return data;
};

export const deletePG = async (id) => {
  const { data } = await api.delete(`/api/pgs/${id}`);
  return data;
};
