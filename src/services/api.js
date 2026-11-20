import axios from "axios";

const baseUrl = import.meta.env?.VITE_API_URL || "/api";
const axiosClient = axios.create({
  baseURL: baseUrl,
  withCredentials: true,
  validateStatus: () => true,
});

function connectionError() {
  return new Error(
    "No se pudo conectar con el servidor. Verificá que el backend está iniciado.",
  );
}

export async function apiGetWithAxios(path, { params, signal, timeout } = {}) {
  let response;
  try {
    response = await axiosClient.get(path, { params, signal, timeout });
  } catch (error) {
    if (axios.isCancel(error)) throw error;
    if (error.code === "ECONNABORTED")
      throw new Error(
        "El catálogo tardó demasiado en responder. Intentá buscar de nuevo.",
      );
    throw connectionError();
  }
  return readPayload(path, response.status, response.data);
}

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
    throw connectionError();
  }
  if (response.status === 204) return null;
  const payload = await response.json().catch(() => null);
  return readPayload(path, response.status, payload);
}

function readPayload(path, status, payload) {
  if (status === 204) return null;
  if (status < 200 || status >= 300 || payload?.success === false) {
    const error = new Error(
      payload?.error?.message || `Error del servidor (${status})`,
    );
    error.status = status;
    error.code = payload?.error?.code;
    if (status === 401 && !path.startsWith("auth/"))
      globalThis.dispatchEvent?.(new Event("session-expired"));
    throw error;
  }
  if (!payload || typeof payload !== "object" || !("data" in payload))
    throw new Error(
      "Respuesta inválida del servidor. Revisá la URL de la API.",
    );
  return payload.data;
}
