import api from "./axios";

// Register
export const registerUser = async (data) => {
  const response = await api.post("/register", data);
  return response.data;
};

// Login
export const loginUser = async (data) => {
  const response = await api.post("/login", data);
  return response.data;
};

// Get current logged-in user
export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data;
};