import api from "../api/axios";

export const getWorkers = () =>
  api.get("/worker_profiles");

export const getWorker = (id) =>
  api.get(`/worker_profiles/${id}`);

export const createWorkerProfile = (
  data
) =>
  api.post("/worker_profiles", data);

export const updateWorkerProfile = (
  data
) =>
  api.put("/worker_profiles/1", data);

export const getWorkerRating = (
  workerId
) =>
  api.get(
    `/worker_profiles/${workerId}/rating`
  );

export const uploadProfilePhoto = (
  formData
) =>
  api.patch(
    "/worker_profiles/upload_photo",
    formData
  );

export const uploadCertification = (
  formData
) =>
  api.patch(
    "/worker_profiles/upload_certification",
    formData
  );

