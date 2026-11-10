export const API_BASE_URL = "http://localhost:5000";
const API = `${API_BASE_URL}/api`;

export function token() {
  return localStorage.getItem("tk_token") || "";
}

export function getFullImageUrl(url: string | undefined): string {
  if (!url) return "";
  if (url.startsWith("http://") || url.startsWith("https://") || url.startsWith("data:")) {
    return url;
  }
  return `${API_BASE_URL}${url.startsWith("/") ? "" : "/"}${url}`;
}

export async function api<T>(path: string, options: RequestInit = {}): Promise<T> {
  const response = await fetch(`${API}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
      ...options.headers,
    },
  });
  const data = await response.json();
  if (!response.ok) throw new Error(data.pesan || "Permintaan gagal");
  return data as T;
}

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("image", file);

  const response = await fetch(`${API}/upload`, {
    method: "POST",
    headers: {
      ...(token() ? { Authorization: `Bearer ${token()}` } : {}),
    },
    body: formData,
  });

  const data = await response.json();
  if (!response.ok) throw new Error(data.pesan || "Upload gambar gagal");
  return data.url; // e.g. /uploads/123456.jpg
}
