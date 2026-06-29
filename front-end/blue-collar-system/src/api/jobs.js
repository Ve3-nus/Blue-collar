import api from "../api/axios";

export const getJobs = async () => {
  const response = await api.get("/jobs");
  return response.data;
};

export const getMyJobs = async () => {
  const response = await api.get("/my_jobs");
  return response.data;
};
export const getApplicants = async (id) => {
  const response = await api.get(`/jobs/${id}/applicants`);
  return response.data;
};

export const createJob = async (data) => {
  const response = await api.post("/jobs", data);
  return response.data;
};
export const getJobMatches = async (id) => {
  const response = await api.get(`/jobs/${id}/matches`);
  return response.data;
};

export const getJob = async (id) => {
  const response = await api.get(`/jobs/${id}`);
  return response.data;
};