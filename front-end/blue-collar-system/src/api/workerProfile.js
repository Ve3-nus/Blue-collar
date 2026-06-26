import api from "./axios";

export const getWorkerProfile = async (id) => {
  const response = await api.get(`/worker_profiles/${id}`);
  return response.data;
};

export const updateWorkerProfile = async (id, data) => {
  const response = await api.put(`/worker_profiles/${id}`, data);
  return response.data;
};

export const uploadPhoto = async (file) => {
  const formData = new FormData();

  formData.append("photo", file);

  const response = await api.patch(
    "/worker_profiles/upload_photo",
    formData
  );

  return response.data;
};

export const uploadCertification = async (file) => {
  const formData = new FormData();

  formData.append("certification", file);

  const response = await api.patch(
    "/worker_profiles/upload_certification",
    formData
  );

  return response.data;
};

export const getRating = async (id) => {
  const response = await api.get(
    `/worker_profiles/${id}/rating`
  );

  return response.data;
};