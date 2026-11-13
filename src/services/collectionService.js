import { apiRequest } from "./api.js";
export const collectionService = {
  list: async () => (await apiRequest("collections")).items,
  detail: (id) => apiRequest(`collections/${id}`),
  create: (nombre) =>
    apiRequest("collections", { method: "POST", body: { nombre } }),
  update: (id, nombre) =>
    apiRequest(`collections/${id}`, { method: "PATCH", body: { nombre } }),
  remove: (id) => apiRequest(`collections/${id}`, { method: "DELETE" }),
  addItem: (id, contenidoId) =>
    apiRequest(`collections/${id}/items`, {
      method: "POST",
      body: { contenidoId },
    }),
  removeItem: (id, contenidoId) =>
    apiRequest(`collections/${id}/items/${contenidoId}`, { method: "DELETE" }),
};
