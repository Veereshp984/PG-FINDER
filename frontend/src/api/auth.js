import api from "./client";

export const loginUser = async (payload) => {
  const { data } = await api.post("/api/auth/login", payload);
  return data;
};

export const registerUser = async (payload) => {
  const { data } = await api.post("/api/auth/register", payload);
  return data;
};
