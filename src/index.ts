/**
 * @creadev.org/api
 *
 * API client - fetch wrapper with retry, error handling.
 */

// ============================================================================
// TYPES
// ============================================================================

export interface ApiOptions {
  /** Base URL */
  baseUrl?: string;
  /** Default headers */
  headers?: Record<string, string>;
  /** Timeout in ms */
  timeout?: number;
  /** Max retries */
  retries?: number;
  /** Retry delay in ms */
  retryDelay?: number;
}

export interface ApiRequest {
  method?: string;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  ok: boolean;
  status: number;
  data?: T;
  error?: string;
}

// ============================================================================
// API CLIENT
// ============================================================================

export class ApiClient {
  private baseUrl: string;
  private defaultHeaders: Record<string, string>;
  private timeout: number;
  private retries: number;
  private retryDelay: number;

  constructor(options: ApiOptions = {}) {
    this.baseUrl = options.baseUrl ?? '';
    this.defaultHeaders = options.headers ?? {};
    this.timeout = options.timeout ?? 30000;
    this.retries = options.retries ?? 3;
    this.retryDelay = options.retryDelay ?? 1000;
  }

  /** Make request */
  async request<T>(req: ApiRequest): Promise<ApiResponse<T>> {
    const url = req.path.startsWith('http') ? req.path : `${this.baseUrl}${req.path}`;
    const headers = { ...this.defaultHeaders, ...req.headers };

    // Add JSON body
    if (req.body && !headers['Content-Type']) {
      headers['Content-Type'] = 'application/json';
    }

    let lastError: Error | undefined;

    for (let attempt = 0; attempt <= this.retries; attempt++) {
      try {
        const controller = new AbortController();
        const timeoutId = setTimeout(() => controller.abort(), this.timeout);

        const response = await fetch(url, {
          method: req.method ?? 'GET',
          headers,
          body: req.body ? JSON.stringify(req.body) : undefined,
          signal: controller.signal,
        });

        clearTimeout(timeoutId);

        const data = await response.json().catch(() => undefined);

        return {
          ok: response.ok,
          status: response.status,
          data: data as T,
        };
      } catch (err) {
        lastError = err as Error;

        if (attempt < this.retries) {
          await this.sleep(this.retryDelay * Math.pow(2, attempt));
        }
      }
    }

    return {
      ok: false,
      status: 0,
      error: lastError?.message,
    };
  }

  /** GET */
  async get<T>(path: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'GET', path, headers });
  }

  /** POST */
  async post<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'POST', path, body, headers });
  }

  /** PUT */
  async put<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PUT', path, body, headers });
  }

  /** DELETE */
  async delete<T>(path: string, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'DELETE', path, headers });
  }

  /** PATCH */
  async patch<T>(path: string, body: unknown, headers?: Record<string, string>): Promise<ApiResponse<T>> {
    return this.request<T>({ method: 'PATCH', path, body, headers });
  }

  private sleep(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// ============================================================================
// FACTORY
// ============================================================================

export function createApi(options?: ApiOptions): ApiClient {
  return new ApiClient(options);
}

// ============================================================================
// DEFAULT CLIENT
// ============================================================================

const defaultClient = new ApiClient();

/** GET request */
export async function get<T>(path: string, options?: ApiOptions): Promise<ApiResponse<T>> {
  const client = options?.baseUrl ? createApi(options) : defaultClient;
  return client.get<T>(path);
}

/** POST request */
export async function post<T>(path: string, body: unknown, options?: ApiOptions): Promise<ApiResponse<T>> {
  const client = options?.baseUrl ? createApi(options) : defaultClient;
  return client.post<T>(path, body);
}

/** PUT request */
export async function put<T>(path: string, body: unknown, options?: ApiOptions): Promise<ApiResponse<T>> {
  const client = options?.baseUrl ? createApi(options) : defaultClient;
  return client.put<T>(path, body);
}

/** DELETE request */
export async function del<T>(path: string, options?: ApiOptions): Promise<ApiResponse<T>> {
  const client = options?.baseUrl ? createApi(options) : defaultClient;
  return client.delete<T>(path);
}