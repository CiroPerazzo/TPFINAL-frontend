import { apiRequest } from "./api.js";
import { music } from "./models.js";
export const musicService = {
  search: async (q, tipo = "both", signal) => {
    if (!q.trim()) return [];
    const data = await apiRequest(
      `catalog/search?${new URLSearchParams({ q, tipo })}`,
      { signal },
    );
    return [...data.tracks, ...data.albums].map(music);
  },
  detail: async (id, tipo) =>
    music(
      (await apiRequest(`catalog/${encodeURIComponent(id)}?tipo=${tipo}`))
        .contenido,
    ),
};
