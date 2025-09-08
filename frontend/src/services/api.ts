export const API_BASE_URL =
  process.env.NEXT_PUBLIC_SERVER_URL || "http://localhost:3000";

type HttpMethod = "GET" | "POST" | "PUT" | "PATCH" | "DELETE";

export async function http<T = unknown>(
  path: string,
  options: {
    method?: HttpMethod;
    headers?: Record<string, string>;
    body?: any;
    authToken?: string | null;
  } = {},
): Promise<T> {
  const url = path.startsWith("http") ? path : `${API_BASE_URL}${path}`;
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
    ...(options.headers || {}),
  };
  if (options.authToken) {
    headers.Authorization = `Bearer ${options.authToken}`;
  }

  const res = await fetch(url, {
    method: options.method || "GET",
    headers,
    body: options.body ? JSON.stringify(options.body) : undefined,
  });

  const contentType = res.headers.get("content-type") || "";
  const data = contentType.includes("application/json")
    ? await res.json()
    : ((await res.text()) as unknown as T);

  if (!res.ok) {
    const message = (data as any)?.message || `Request failed: ${res.status}`;
    throw new Error(message);
  }
  return data as T;
}


