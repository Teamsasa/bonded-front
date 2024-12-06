import axios from "axios";

const apiClient = axios.create({
  baseURL: "http://localhost:3000",
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
