import axios from "axios";

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
});

apiClient.interceptors.request.use((config) => {
  const accessToken = sessionStorage.getItem("access_token");
  const idToken = sessionStorage.getItem("id_token");

  if (accessToken && idToken) {
    config.headers["Authorization"] = `Bearer ${accessToken}`;
    config.headers["X-Id-Token"] = `Bearer ${idToken}`;
  }

  return config;
});

export default apiClient;
