import api from "../api/axios";

// Worker: apply to a job
export const applyToJob = async (jobId) => {
  const response = await api.post("/job_applications", { job_id: jobId });
  return response.data;
};

// Worker: get all of my own applications  →  GET /api/v1/my_applications
export const getMyApplications = async () => {
  const response = await api.get("/my_applications");
  return response.data;
};

// Customer: get all applicants for a specific job  →  GET /api/v1/jobs/:id/applicants
// Exported as both names so existing pages keep working.
export const getApplicants = async (jobId) => {
  const response = await api.get(`/jobs/${jobId}/applicants`);
  return response.data;
};
export const getApplicantsForJob = getApplicants;

// Customer: get applicants across ALL their jobs
// (no single /applications route exists, so we fetch all jobs first
//  then pull applicants per job and flatten)
export const getApplications = async () => {
  const jobsRes  = await api.get("/my_jobs");
  const jobs     = jobsRes.data || [];

  const nested = await Promise.all(
    jobs.map((job) =>
      api
        .get(`/jobs/${job.id}/applicants`)
        .then((r) =>
          (r.data || []).map((app) => ({
            ...app,
            job, // attach job info so the page can render it
          }))
        )
        .catch(() => [])
    )
  );

  return nested.flat();
};

// Accept or reject an application  →  PATCH /api/v1/job_applications/:id
export const updateApplication = async (id, status) => {
  const response = await api.patch(`/job_applications/${id}`, { status });
  return response.data;
};
