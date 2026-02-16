import api from "./client";

export const fetchAdminPGs = async () => {
  const { data } = await api.get("/api/admin/pgs");
  return data;
};

export const fetchAdminUsers = async () => {
  const { data } = await api.get("/api/admin/users");
  return data;
};

export const updateUserRole = async (id, role) => {
  const { data } = await api.put(`/api/admin/users/${id}/role`, { role });
  return data;
};
