const API_BASE_URL = process.env.NEXT_PUBLIC_API_BASE_URL || "";

async function request(path, options = {}) {
  const url = API_BASE_URL ? `${API_BASE_URL}${path}` : path;

  const token = typeof window !== "undefined" ? localStorage.getItem("token") : null;

  let response;
  try {
    response = await fetch(url, {
      ...options,
      headers: {
        "Content-Type": "application/json",
        ...(token ? { "Authorization": `Bearer ${token}` } : {}),
        ...(options.headers || {}),
      },
    });
  } catch (error) {
    if (API_BASE_URL) {
      throw new Error(`Cannot reach backend at ${API_BASE_URL}. Is the backend running?`);
    }
    throw new Error("Network request failed.");
  }

  if (!response.ok) {
    let errorMessage = "Request failed";
    try {
      const payload = await response.json();
      if (payload?.message) {
        errorMessage = payload.message;
      }
    } catch (error) {
      // Ignore parser errors and keep generic message.
    }
    throw new Error(errorMessage);
  }

  return response.json();
}

export { API_BASE_URL, request };
