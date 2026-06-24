import api from "./axios";

export const getJobs = () =>
  api.get("/jobs");

export const getJob = (id) =>
  api.get(`/jobs/${id}`);

export const createJob = (data) =>
  api.post("/jobs", data);

export const getMyJobs = () =>
  api.get("/my_jobs");

export const getApplicants = (jobId) =>
  api.get(`/jobs/${jobId}/applicants`);

export const getJobMatches = (jobId) =>
  api.get(`/jobs/${jobId}/matches`);

export const uploadJobImages = (
  jobId,
  formData
) =>
  api.patch(
    `/jobs/${jobId}/upload_images`,
    formData
  );