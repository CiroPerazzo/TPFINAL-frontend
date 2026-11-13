import { apiRequest } from "./api.js";
export const reviewService = {
  get: (id) => apiRequest(`reviews/${id}`),
  save: (id, texto, exists) =>
    apiRequest(`reviews/${id}`, {
      method: exists ? "PATCH" : "POST",
      body: { texto },
    }),
  remove: (id) => apiRequest(`reviews/${id}`, { method: "DELETE" }),
};
