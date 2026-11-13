import { apiRequest } from "./api.js";
export const authService = {
  me: () => apiRequest("auth/me"),
  login: (body) => apiRequest("auth/login", { method: "POST", body }),
  register: (body) => apiRequest("auth/register", { method: "POST", body }),
  logout: () => apiRequest("auth/logout", { method: "POST" }),
  update: (body) => apiRequest("users/me", { method: "PATCH", body }),
};
