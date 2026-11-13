import { apiRequest } from "./api.js";
export const statisticsService = {
  get: () => apiRequest("statistics"),
  activity: async () => (await apiRequest("activity")).items,
};
