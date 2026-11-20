import { apiGetWithAxios, apiRequest } from "./api.js";
import { music } from "./models.js";
export const musicService = {
  search: async (q, tipo = "both", signal) => {
    if (!q.trim()) return [];
    const data = await apiGetWithAxios("catalog/search", {
      params: { q, tipo },
      signal,
      timeout: 15_000,
    });
    const invalidResponse =
      "El catálogo devolvió resultados inválidos. Intentá buscar de nuevo.";
    if (!Array.isArray(data?.tracks) || !Array.isArray(data?.albums))
      throw new Error(invalidResponse);

    const items = [...data.tracks, ...data.albums];
    if (
      items.some(
        (item) =>
          typeof item?.titulo !== "string" ||
          (item.artista != null && typeof item.artista !== "string"),
      )
    )
      throw new Error(invalidResponse);

    return items.map(music);
  },
  detail: async (id, tipo) =>
    music(
      (await apiRequest(`catalog/${encodeURIComponent(id)}?tipo=${tipo}`))
        .contenido,
    ),
};
