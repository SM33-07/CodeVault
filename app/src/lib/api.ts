export class ApiError extends Error {
  constructor(
    message: string,
    public readonly status: number
  ) {
    super(message);
    this.name = "ApiError";
  }
}

function getApiBaseUrl(): string {
  if (process.env.NEXT_PUBLIC_API_URL) {
    return process.env.NEXT_PUBLIC_API_URL.replace(/\/+$/, "");
  }

  if (typeof window !== "undefined") {
    const hostname = window.location.hostname;
    if (hostname === "localhost" || hostname === "127.0.0.1") {
      return "http://localhost:4001";
    }
    // On Vercel / deployed production, default to relative origin
    return "";
  }

  return process.env.NODE_ENV === "production" ? "" : "http://localhost:4001";
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

  const baseUrl = getApiBaseUrl();
  const url = `${baseUrl}${path}`;

  try {
    const response = await fetch(url, {
      method,
      headers,
      body: body ? JSON.stringify(body) : undefined,
    });

    if (!response.ok) {
      let message = "Something went wrong.";

      try {
        const error = await response.json();
        message = error.error ?? error.message ?? message;
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
  } catch (err: any) {
    if (err instanceof ApiError) {
      throw err;
    }
    throw new ApiError(
      err?.message || "Network request failed. Please check your connection.",
      500
    );
  }
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