import api from "./axios";

export const getAnalytics = () =>
  api.get("/analytics");

export const getTopSkills = () =>
  api.get("/analytics/top_skills");

export const getTopWorkers = () =>
  api.get("/analytics/top_workers");

export const getCompletionRate = () =>
  api.get(
    "/analytics/completion_rate"
  );