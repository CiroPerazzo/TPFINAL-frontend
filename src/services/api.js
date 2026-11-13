const baseUrl = import.meta.env?.VITE_API_URL || "/api";
export async function apiRequest(path, options = {}) {
  const { body, ...rest } = options;
  let response;
  try {
    response = await fetch(
      `${baseUrl.replace(/\/$/, "")}/${path.replace(/^\//, "")}`,
      {
        ...rest,
        credentials: "include",
        headers: {
          ...(body !== undefined ? { "Content-Type": "application/json" } : {}),
          ...rest.headers,
        },
        ...(body !== undefined ? { body: JSON.stringify(body) } : {}),
      },
    );
  } catch (error) {
    if (error.name === "AbortError") throw error;
    throw new Error(
      "No se pudo conectar con el servidor. Verificá que el backend está iniciado.",
    );
  }
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  if (!response.ok || payload?.success === false) {
    const error = new Error(
      payload?.error?.message || `Error del servidor (${response.status})`,
    );
    error.status = response.status;
    error.code = payload?.error?.code;
    if (response.status === 401 && !path.startsWith("auth/"))
      globalThis.dispatchEvent?.(new Event("session-expired"));
    throw error;
  }
  if (!payload || !("data" in payload))
    throw new Error(
      "Respuesta inválida del servidor. Revisá la URL de la API.",
    );
  return payload.data;
}
