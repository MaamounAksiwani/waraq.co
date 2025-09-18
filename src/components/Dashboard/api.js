import axios from "axios";

const API_BASE = "http://51.20.91.71:8080/waraq/api/v1";

const getAuthHeaders = () => {
  const token = localStorage.getItem("jwtToken");
  return { Authorization: `${token}` };
};

export const fetchClients = async () => {
  const res = await axios.get(`${API_BASE}/admin/users?role=CLIENT`, { headers: getAuthHeaders() });
  return res.data.data;
};

export const fetchMembers = async () => {
  const res = await axios.get(`${API_BASE}/admin/users?role=TRANSLATOR`, { headers: getAuthHeaders() });
  return res.data.data;
};

export const uploadFile = async (file) => {
  const formData = new FormData();
  formData.append("file", file);
  const res = await axios.post(`${API_BASE}/media/upload`, formData, { headers: getAuthHeaders() });
  return res.data.data.id;
};

export const addUser = async (userData) => {
  const res = await axios.post(`${API_BASE}/admin/users`, userData, { headers: getAuthHeaders() });
  return res.data;
};

export const deleteUser = async (id) => {
  await axios.delete(`${API_BASE}/admin/users/${id}`, { headers: getAuthHeaders() });
};
