
import api from "./axios";

export const getMessages = (
  jobId
) =>
  api.get(`/jobs/${jobId}/messages`);

export const sendMessage = (
  data
) =>
  api.post("/messages", data);

