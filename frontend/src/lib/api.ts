import axios from "axios";

const api = import.meta.env.VITE_API_URL;

const instance = axios.create({
  baseURL: api,
});

// Attach token to every request if available
instance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

export const registerUser = (data: {
  username: string;
  email: string;
  password: string;
  fullname?: string;
  bio?: string;
}) => instance.post("/api/register", data);

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await instance.post("/api/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
};

export const fetchProfile = () => instance.get("/api/profile");
export const updateProfile = (data: { fullname?: string; bio?: string }) =>
  instance.put("/api/profile", data);

export const listReports = () => instance.get("/api/reports");
export const createReport = (data: { title: string; content?: string }) =>
  instance.post("/api/reports", data);
export const updateReport = (
  id: string,
  data: { title?: string; content?: string }
) => instance.put(`/api/reports/${id}`, data);
export const deleteReport = (id: string) =>
  instance.delete(`/api/reports/${id}`);

export const listSessions = () => instance.get("/api/sessions");
export const createSession = (data: { status?: string }) =>
  instance.post("/api/sessions", data);
export const updateSession = (
  id: string,
  data: { status?: string; ended_at?: string }
) => instance.put(`/api/sessions/${id}`, data);
export const deleteSession = (id: string) =>
  instance.delete(`/api/sessions/${id}`);

export const logoutUser = () => {
  localStorage.removeItem("token");
};
