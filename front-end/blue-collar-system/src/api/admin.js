import api from "./axios";

export const getUsers = () =>
  api.get("/admin/users");

export const getAdminJobs = () =>
  api.get("/admin/jobs");

export const getAdminApplications =
  () =>
    api.get(
      "/admin/applications"
    );

export const getAdminReviews =
  () =>
    api.get("/admin/reviews");

export const suspendUser = (
  id
) =>
  api.patch(
    `/admin/users/${id}/suspend`
  );

export const activateUser = (
  id
) =>
  api.patch(
    `/admin/users/${id}/activate`
  );

export const getAdminStats = () =>
  api.get("/admin/stats");