import api from "./axios";

export const applyToJob = (data) =>
  api.post("/job_applications", data);

export const getApplications = () =>
  api.get("/job_applications");

export const getMyApplications = () =>
  api.get("/my_applications");

export const updateApplication = (id, status) =>
  api.put(`/job_applications/${id}`, {
    status,
  });