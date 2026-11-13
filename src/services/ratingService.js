import { apiRequest } from "./api.js";
export const ratingService = {
  set: (id, puntuacion) =>
    apiRequest(`ratings/${id}`, { method: "PUT", body: { puntuacion } }),
  clear: (id) => apiRequest(`ratings/${id}`, { method: "DELETE" }),
};
