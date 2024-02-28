import axios from "axios";
import { BaseUrl } from "./BaseUrl";
export const axiosClient = axios.create({
  baseURL: BaseUrl,
  withCredentials: true,
});
axiosClient.interceptors.request.use((config) => {
  const authToken = localStorage.getItem("authToken");
  if (authToken) {
    config.headers.Authorization = `Bearer ${authToken}`;
  }
  return config;
});

