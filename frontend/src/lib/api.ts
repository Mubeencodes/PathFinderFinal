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

export const registerUser = (data: { username: string; email: string; password: string; fullname?: string; bio?: string }) =>
  instance.post("/api/register", data);

export const loginUser = async (data: { email: string; password: string }) => {
  const res = await instance.post("/api/login", data);
  if (res.data.token) {
    localStorage.setItem("token", res.data.token);
  }
  return res;
};

export const logoutUser = () => {
  localStorage.removeItem("token");
};
