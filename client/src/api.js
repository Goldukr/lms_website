const DEFAULT_PRODUCTION_API = "https://lms-website-825t.onrender.com";

function resolveApiBase() {
  const envBase = import.meta.env.VITE_API_URL;
  if (envBase) {
    return envBase;
  }

  if (typeof window !== "undefined") {
    const host = window.location.hostname;
    const isLocalhost =
      host === "localhost" ||
      host === "127.0.0.1" ||
      host === "::1" ||
      host.endsWith(".local");

    if (!isLocalhost) {
      return DEFAULT_PRODUCTION_API;
    }
  }

  return "";
}

const rawApiBase = resolveApiBase();

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
