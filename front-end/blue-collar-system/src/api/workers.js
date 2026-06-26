import api from "./axios";

export const getWorkers = async () => {
  const response = await api.get("/worker_profiles");
  return response.data;
};

export const getWorker = async (id) => {
  const response = await api.get(`/worker_profiles/${id}`);
  return response.data;
};