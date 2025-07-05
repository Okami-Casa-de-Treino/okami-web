import axios, { AxiosInstance, AxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';

// ============================================================================
// TYPES AND INTERFACES
// ============================================================================

export interface HttpClientConfig {
  baseURL?: string;
  timeout?: number;
  headers?: Record<string, string>;
}

export interface ApiError {
  message: string;
  status?: number;
  code?: string;
  details?: unknown;
}

class ApiErrorInstance extends Error {
  public status?: number;
  public code?: string;
  public details?: unknown;

  constructor(message: string, status?: number, code?: string, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.code = code;
    this.details = details;
  }
}

export interface RequestConfig extends AxiosRequestConfig {
  skipAuth?: boolean;
  skipErrorHandling?: boolean;
}

// Extend Axios request config to include our custom properties
declare module 'axios' {
  interface AxiosRequestConfig {
    skipAuth?: boolean;
    skipErrorHandling?: boolean;
  }
}

// ============================================================================
// HTTP CLIENT IMPLEMENTATION
// ============================================================================

class HttpClient {
  private client: AxiosInstance;
  private readonly TOKEN_KEY = 'auth_token';
  private readonly REFRESH_TOKEN_KEY = 'refresh_token';

  constructor(config: HttpClientConfig = {}) {
    this.client = axios.create({
      baseURL: config.baseURL || 'http://localhost:3000/api',
      timeout: config.timeout || 10000,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    // Request interceptor for auth token
    this.client.interceptors.request.use(
      (config) => {
        const token = this.getToken();
        
        if (token && !config.skipAuth) {
          config.headers.Authorization = `Bearer ${token}`;
        } 
        
        return config;
      },
      (error) => Promise.reject(this.handleError(error))
    );

    // Response interceptor for error handling
    this.client.interceptors.response.use(
      (response) => response,
      async (error: AxiosError) => {
        
        // Just return the error without any automatic redirects
        // Let the calling component/store handle the error appropriately
        return Promise.reject(this.handleError(error));
      }
    );
  }

  private handleError(error: AxiosError): ApiErrorInstance {
    let message = 'An unexpected error occurred';
    let status = error.response?.status;
    const code = error.code;
    const details = error.response?.data;

    if (error.response) {
      // Server responded with error status
      const data = error.response.data as { message?: string; error?: string };
      message = data?.message || data?.error || `HTTP ${error.response.status}`;
      status = error.response.status;
    } else if (error.request) {
      // Request was made but no response received
      message = 'Network error - please check your connection';
    } else {
      // Something else happened
      message = error.message || 'Request failed';
    }

    return new ApiErrorInstance(message, status, code, details);
  }

  // ============================================================================
  // TOKEN MANAGEMENT
  // ============================================================================

  public setToken(token: string): void {
    localStorage.setItem(this.TOKEN_KEY, token);
  }

  public getToken(): string | null {
    const token = localStorage.getItem(this.TOKEN_KEY);
    return token;
  }

  public setRefreshToken(token: string): void {
    localStorage.setItem(this.REFRESH_TOKEN_KEY, token);
  }

  public getRefreshToken(): string | null {
    return localStorage.getItem(this.REFRESH_TOKEN_KEY);
  }

  public clearTokens(): void {
    localStorage.removeItem(this.TOKEN_KEY);
    localStorage.removeItem(this.REFRESH_TOKEN_KEY);
  }

  // ============================================================================
  // HTTP METHODS
  // ============================================================================

  public async get<T = unknown>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public async post<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }

  public async put<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.client.put<T>(url, data, config);
  }

  public async patch<T = unknown>(url: string, data?: unknown, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.client.patch<T>(url, data, config);
  }

  public async delete<T = unknown>(url: string, config?: RequestConfig): Promise<AxiosResponse<T>> {
    return this.client.delete<T>(url, config);
  }

  // ============================================================================
  // UTILITY METHODS
  // ============================================================================

  public async upload<T = unknown>(url: string, file: File, onProgress?: (progress: number) => void): Promise<AxiosResponse<T>> {
    const formData = new FormData();
    formData.append('file', file);

    return this.client.post<T>(url, formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
      onUploadProgress: (progressEvent) => {
        if (onProgress && progressEvent.total) {
          const progress = Math.round((progressEvent.loaded * 100) / progressEvent.total);
          onProgress(progress);
        }
      },
    });
  }

  public async download(url: string, filename?: string): Promise<void> {
    const response = await this.client.get(url, {
      responseType: 'blob',
    });

    const blob = new Blob([response.data]);
    const downloadUrl = window.URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = downloadUrl;
    link.download = filename || 'download';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    window.URL.revokeObjectURL(downloadUrl);
  }

  public setBaseURL(baseURL: string): void {
    this.client.defaults.baseURL = baseURL;
  }

  public setDefaultHeader(key: string, value: string): void {
    this.client.defaults.headers.common[key] = value;
  }

  public removeDefaultHeader(key: string): void {
    delete this.client.defaults.headers.common[key];
  }
}

// ============================================================================
// SINGLETON EXPORT
// ============================================================================

export const httpClient = new HttpClient();
export { HttpClient, ApiErrorInstance }; 