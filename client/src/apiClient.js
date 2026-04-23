const API_BASE = import.meta.env.VITE_API_BASE_URL || "http://localhost:3000/api";

console.log("🔌 API_BASE:", API_BASE);

async function handleResponse(res) {
  // Success → just return
  if (res.ok) return res;

  // Try to extract readable message
  let msg = "";
  try {
    const text = await res.text();
    if (text) {
      try {
        const json = JSON.parse(text);
        msg = json.message || JSON.stringify(json);
      } catch {
        msg = text;
      }
    }
  } catch {
    // ignore
  }

  // --- AUTH ERROR HANDLING (Modified) ---
  if (res.status === 401 || res.status === 403) {
    // 🛑 CRITICAL FIX:
    // If this error comes from "get-user", it just means "Guest Mode".
    // We should NOT alert or redirect. Just let the hook handle it.
    if (res.url.includes("/auth/get-user")) {
      throw new Error("Guest User"); // Throw silently so the hook catches it
    }

    // For other routes (like trying to book a flight without login), keep blocking:
    localStorage.removeItem("authUser");
    sessionStorage.clear();
    localStorage.removeItem("user_flight_search_pref");
    const message = msg || "Session expired. Please login again.";

    alert(message);
    window.location.assign("/login");
    throw new Error(message);
  }
  // -------------------------------------------

  // Other errors
  throw new Error(msg || `Request failed with status ${res.status}`);
}

export async function apiGet(path) {
  const fullUrl = `${API_BASE}${path}`;
  console.log(`📡 GET Request to: ${fullUrl}`);
  const res = await fetch(fullUrl, {
    credentials: "include",
  });
  return handleResponse(res);
}

export async function apiPost(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiPut(path, body) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    credentials: "include",
    body: JSON.stringify(body),
  });
  return handleResponse(res);
}

export async function apiDelete(path) {
  const res = await fetch(`${API_BASE}${path}`, {
    method: "DELETE",
    credentials: "include",
  });
  return handleResponse(res);
}
