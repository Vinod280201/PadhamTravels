<<<<<<< HEAD
const API_BASE = "https://padham-travels-api.onrender.com/api";
=======
const API_BASE = "https://padham-travels-api.onrender.com"; //http://localhost:3000
>>>>>>> 0c757cfde29f0cbf6dc57e282b86e72388a64d91

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

  // --- AUTH ERROR HANDLING (for ALL pages) ---
  if (res.status === 401 || res.status === 403) {
    // This key is what RequireAuth will check
    localStorage.removeItem("authUser");

    const message = msg || "Session expired. Please login again.";

    // Show message, then redirect to login
    alert(message);
    // Use your real login route (here: /login from App.jsx)
    window.location.assign("/login");

    throw new Error(message);
  }
  // -------------------------------------------

  // Other errors
  throw new Error(msg || `Request failed with status ${res.status}`);
}

export async function apiGet(path) {
  const res = await fetch(`${API_BASE}${path}`, {
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
