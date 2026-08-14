const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_URL ?? "http://localhost:4001";

export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

type RequestOptions = {
  method?: string;
  body?: unknown;
  token?: string;
};

export async function apiFetch<T>(
  path: string,
  options: RequestOptions = {}
): Promise<T> {
  const { method = "GET", body, token } = options;

  const headers: HeadersInit = {
    "Content-Type": "application/json",
  };

  if (token) {
    headers.Authorization = `Bearer ${token}`;
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method,
    headers,
    body: body ? JSON.stringify(body) : undefined,
  });

  if (!response.ok) {
    let message = "Something went wrong.";

    try {
      const error = await response.json();
      message = error.error ?? message;
    } catch {
      // Ignore malformed error bodies.
    }

    throw new ApiError(message, response.status);
  }

  // Handle 204 No Content
  if (response.status === 204) {
    return undefined as T;
  }

  return response.json() as Promise<T>;
}

export function apiGet<T>(path: string, token?: string) {
  return apiFetch<T>(path, {
    method: "GET",
    token,
  });
}

export function apiPost<T>(
  path: string,
  body?: unknown,
  token?: string
) {
  return apiFetch<T>(path, {
    method: "POST",
    body,
    token,
  });
}

export function apiPut<T>(
  path: string,
  body?: unknown,
  token?: string
) {
  return apiFetch<T>(path, {
    method: "PUT",
    body,
    token,
  });
}

export function apiDelete<T>(
  path: string,
  token?: string
) {
  return apiFetch<T>(path, {
    method: "DELETE",
    token,
  });
}