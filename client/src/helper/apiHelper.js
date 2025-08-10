import axios from "axios";

const API_URL = "http://localhost:4000/api";

const axiosInstance = axios.create();

axiosInstance.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Auth token management helpers
export const setToken = (token) => localStorage.setItem("token", token);
export const getToken = () => localStorage.getItem("token");
export const removeToken = () => localStorage.removeItem("token");

// Auth APIs
export const registerUser = (data) =>
  axios.post(`${API_URL}/users/register`, data);
export const loginUser = (data) => axios.post(`${API_URL}/users/login`, data);

// Todo APIs
export const fetchTodos = () => axiosInstance.get(`${API_URL}/todos`);
export const addTodo = (title) =>
  axiosInstance.post(`${API_URL}/todos`, { title });
export const updateTodo = (id, updatedFields) =>
  axiosInstance.put(`${API_URL}/todos/${id}`, updatedFields);
export const deleteTodo = (id) =>
  axiosInstance.delete(`${API_URL}/todos/${id}`);
