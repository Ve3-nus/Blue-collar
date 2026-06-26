import api from "../api/axios";

export const applyToJob = async (jobId) => {
  const response = await api.post(
    "/job_applications",
    {
      job_id: jobId,
    }
  );

  return response.data;
};

export const getApplicants = async (jobId) => {
  const response = await api.get(
    `/jobs/${jobId}/applicants`
  );

  return response.data;
};

export const getMyApplications = async () => {
  const response = await api.get(
    "/my_applications"
  );

  return response.data;
};
export const getApplications = async () => {
    const response = await api.get("/applications");
    return response.data;
}

export const updateApplication = async (
  id,
  status
) => {
  const response = await api.patch(
    `/job_applications/${id}`,
    {
      status,
    }
  );

  return response.data;
};