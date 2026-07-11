import axios from "axios";

export const api = axios.create({
  baseURL: "/",
  withCredentials: true,
});

api.interceptors.request.use((config) => {
  // Pega o token salvo temporariamente no localStorage
  const token = localStorage.getItem("temp_access_token"); 

  if (token) {
    config.headers["Authorization"] = `Bearer ${token}`; 
  }
  console.log(token)

  return config;
}, (error) => {
  return Promise.reject(error);
});