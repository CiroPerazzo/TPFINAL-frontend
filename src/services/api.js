const baseUrl = import.meta.env.VITE_API_URL;

export async function apiRequest(path, options = {}) {
  if (!baseUrl) throw new Error("Configurá VITE_API_URL para conectar el backend.");
  const response = await fetch(baseUrl.replace(/\/$/, "") + "/" + path.replace(/^\//, ""), options);
  if (!response.ok) throw new Error("Error de API: " + response.status);
  if (response.status === 204) return null;
  return response.json();
}
