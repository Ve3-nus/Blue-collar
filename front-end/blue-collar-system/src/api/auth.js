import api from "./axios";

export const registerUser = (data) =>
  api.post("/register", data);

export const loginUser = async (data) => {
  const response = await api.post("/login", data);

  console.log("LOGIN RESPONSE", response.data);

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/me");
  return response.data;
};