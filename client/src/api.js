const rawApiBase = import.meta.env.VITE_API_URL || "";

export const API_BASE = rawApiBase.replace(/\/+$/, "");

export function apiUrl(path) {
  if (!path.startsWith("/")) {
    throw new Error(`API path must start with '/': ${path}`);
  }

  return `${API_BASE}${path}`;
}

export async function parseJsonResponse(response) {
  const text = await response.text();

  if (!text) {
    return null;
  }

  try {
    return JSON.parse(text);
  } catch (_error) {
    return {
      error: response.ok ? "Unexpected server response." : "Request failed. Check backend URL and deployment.",
      raw: text,
    };
  }
}

export default API_BASE;
