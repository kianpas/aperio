// API 클라이언트 기본 설정
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
    this.name = 'ApiError';
  }
}

// 공통 fetch 래퍼
export const apiClient = {
  // 클라이언트 사이드 요청 (credentials 포함)
  async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      credentials: 'include', // 세션 쿠키 포함
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      // 응답이 JSON이 아닌 경우 처리
      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        if (!response.ok) {
          throw new ApiError(
            `HTTP ${response.status}: ${response.statusText}`,
            response.status
          );
        }
        return {} as T; // 빈 응답인 경우
      }

      const data = await response.json();

      if (!response.ok) {
        throw new ApiError(
          data.message || data.error || '요청 처리 실패',
          response.status,
          data.code
        );
      }

      return data;
    } catch (error) {
      if (error instanceof ApiError) {
        throw error;
      }
      
      if (error instanceof TypeError && error.message.includes('fetch')) {
        throw new ApiError('서버에 연결할 수 없습니다. 네트워크를 확인해주세요.');
      }
      
      throw new ApiError('알 수 없는 오류가 발생했습니다.');
    }
  },

  // 서버 사이드 요청 (credentials 없음)
  async serverRequest<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const url = process.env.INTERNAL_API_URL 
      ? `${process.env.INTERNAL_API_URL}${endpoint}`
      : `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      // 서버에서는 credentials 제외
      ...options,
    };

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        console.error(`Server API Error: ${response.status} ${response.statusText}`);
        throw new ApiError(
          `Server request failed: ${response.status}`,
          response.status
        );
      }

      const contentType = response.headers.get('content-type');
      if (!contentType?.includes('application/json')) {
        return {} as T;
      }

      return response.json();
    } catch (error) {
      console.error('Server API request failed:', error);
      throw error instanceof ApiError ? error : new ApiError('Server request failed');
    }
  },

  // GET 요청
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'GET', ...options });
  },

  // POST 요청
  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  // PUT 요청
  put<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, {
      method: 'PUT',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },

  // DELETE 요청
  delete<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return this.request<T>(endpoint, { method: 'DELETE', ...options });
  },
};

// 서버 컴포넌트용 클라이언트
export const serverApiClient = {
  get<T>(endpoint: string, options?: RequestInit): Promise<T> {
    return apiClient.serverRequest<T>(endpoint, { method: 'GET', ...options });
  },

  post<T>(endpoint: string, data?: unknown, options?: RequestInit): Promise<T> {
    return apiClient.serverRequest<T>(endpoint, {
      method: 'POST',
      body: data ? JSON.stringify(data) : undefined,
      ...options,
    });
  },
};