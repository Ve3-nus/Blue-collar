import api from "./axios";

export const registerUser = async (data) => {
  const response = await api.post(
    "/register",
    data
  );

  return response.data;
};

export const loginUser = async (data) => {
  const response = await api.post(
    "/login",
    data
  );

  return response.data;
};

export const getCurrentUser = async () => {
  const response = await api.get("/me");

  return response.data;
};