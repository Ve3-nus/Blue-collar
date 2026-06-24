  import api from "./axios";

export const getReviews = () =>
  api.get("/reviews");

export const getReview = (id) =>
  api.get(`/reviews/${id}`);

export const createReview = (data) =>
  api.post("/reviews", data);