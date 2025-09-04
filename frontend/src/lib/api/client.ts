// API base URL
const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080";

export interface ApiResponse<T = unknown> {
  data?: T;
  message?: string;
  error?: string;
}

export class ApiError extends Error {
  constructor(
    message: string,
    public status?: number,
    public code?: string
  ) {
    super(message);
    this.name = "ApiError";
  }
}

// Cookie helper (browser only)
function getCookie(name: string): string | null {
  if (typeof document === "undefined") return null;
  const match = document.cookie.match(new RegExp("(?:^|; )" + name + "=([^;]*)"));
  return match ? decodeURIComponent(match[1]) : null;
}

// Ensure XSRF-TOKEN cookie is issued by backend
async function ensureCsrfCookie(): Promise<void> {
  if (typeof window === "undefined") return;
  const hasToken = document.cookie.includes("XSRF-TOKEN=");
  if (hasToken) return;
  try {
    await fetch(`${API_BASE_URL}/api/csrf`, {
      method: "GET",
      credentials: "include",
      headers: { Accept: "application/json" },
    });
  } catch {
    // swallow; downstream request will still surface a meaningful error
  }
}

export const apiClient = {
  // Browser request with credentials
  async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    const method = (options.method || "GET").toString().toUpperCase();

    const headers: Record<string, string> = {
      "Content-Type": "application/json",
      Accept: "application/json",
      ...(options.headers as Record<string, string> | undefined),
    };

    // Attach CSRF header for write methods
    if (
      typeof window !== "undefined" &&
      ["POST", "PUT", "PATCH", "DELETE"].includes(method)
    ) {
      if (!document.cookie.includes("XSRF-TOKEN=")) {
        await ensureCsrfCookie();
      }
      const xsrf = getCookie("XSRF-TOKEN");
      if (xsrf) {
        headers["X-XSRF-TOKEN"] = xsrf;
      }
      headers["X-Requested-With"] = headers["X-Requested-With"] || "XMLHttpRequest";
    }

    const config: RequestInit = {
      credentials: "include", // include session cookie
      ...options,
      method,
      headers,
    };

    try {
      const response = await fetch(url, config);

      // Non-JSON response handling
      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          );
        }
        return {} as T; // empty success body
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          (data && (data.message || data.error)) || "Request failed",
          response.status,
          data?.code
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) throw error;
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new ApiError("네트워크 오류가 발생했습니다. 연결을 확인해주세요.");
      }
      throw new ApiError("알 수 없는 오류가 발생했습니다.");
    }
  },

  // Server-side request (no credentials)
  async serverRequest<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = process.env.INTERNAL_API_URL
      ? `${process.env.INTERNAL_API_URL}${endpoint}`
      : `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      headers: {
        "Content-Type": "application/json",
        ...(options.headers || {}),
      },
      ...options,
    };

    try {
      const response = await fetch(url, config);
      if (!response.ok) {
        // eslint-disable-next-line no-console
        console.error(`Server API Error: ${response.status} ${response.statusText}`);
        throw new ApiError(`Server request failed: ${response.status}`, response.status);
      }

      const contentType = response.headers.get("content-type");
      if (!contentType?.includes("application/json")) {
        return {} as T;
      }
      return response.json();
    } catch (error) {
      // eslint-disable-next-line no-console
      console.error("Server API request failed:", error);
      throw error instanceof ApiError ? error : new ApiError("Server request failed");
    }
  },

  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: "GET", ...options });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: "PUT",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: "DELETE", ...options });
  },
};

export const serverApiClient = {
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiClient.serverRequest<T>(endpoint, { method: "GET", ...options });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return apiClient.serverRequest<T>(endpoint, {
      method: "POST",
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },
};
