import api from "./axios";

export const getWorkers = () =>
  api.get("/worker_profiles");

export const getWorker = (id) =>
  api.get(`/worker_profiles/${id}`);

export const createWorkerProfile = (data) =>
  api.post("/worker_profiles", data);

export const updateWorkerProfile = (id, data) =>
  api.put(`/worker_profiles/${id}`, data);

export const uploadProfilePhoto = (id, formData) =>
  api.post(`/worker_profiles/${id}/photo`, formData);

export const uploadCertification = (id, formData) =>
  api.post(`/worker_profiles/${id}/certification`, formData);

export const getWorkerRating = (id) =>
  api.get(`/worker_profiles/${id}/rating`);