import { apiRequest } from "./api.js";
import { music } from "./models.js";
export const libraryService = {
  list: async () => (await apiRequest("library")).items.map(music),
  add: (item) =>
    apiRequest("library", {
      method: "POST",
      body: { contenido: { spotify_id: item.spotify_id, tipo: item.tipo } },
    }),
  remove: (id) => apiRequest(`library/${id}`, { method: "DELETE" }),
  state: (id, estado) =>
    apiRequest(`library/${id}`, { method: "PATCH", body: { estado } }),
  favorite: (id, value) =>
    apiRequest(`favorites/${id}`, { method: value ? "POST" : "DELETE" }),
};
