export type HttpMethod = 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH' | 'OPTIONS';

export interface FetcherOptions<T = unknown> {
  method?: HttpMethod;
  body?: T;
  headers?: Record<string, string>;
}

export interface ApiResponse<T = unknown> {
  data: T;
  status?: number;
  success?: boolean;
}

export interface TCApiResponse<T = unknown> {
  success: boolean;
  message?: string;
  data: T;
}

export async function fetcher<TResponse, TBody = unknown>(
  url: string,
  options: FetcherOptions<TBody> = {}
): Promise<TResponse> {
  const { method = 'GET', body, headers = {} } = options;

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Error ${response.status}: ${errorText}`);
  }

  const result: ApiResponse<TResponse> = await response.json();

  if (result.status !== 200) {
    throw new Error(`API Error: ${result.status}`);
  }

  return result.data;
}

export async function fetcherWithTimeout<TResponse, TBody = unknown>(
  url: string,
  options: FetcherOptions<TBody> = {},
  timeout?: number
): Promise<TCApiResponse> {
  const { method = 'GET', body, headers = {} } = options;
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout ?? 600000);

  const config: RequestInit = {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...headers,
    },
    signal: controller.signal,
  };

  if (body) {
    config.body = JSON.stringify(body);
  }

  const response = await fetch(url, config)
    .then(async (res) => {
      clearTimeout(timeoutId);
      return res.json();
    })
    .catch((error) => {
      if (error.name === 'AbortError') {
        console.error('Request timeout');
      } else {
        console.error('Fetch error:', error);
      }
    });

  const result: TCApiResponse<TResponse> = await response;

  if (!result.success) {
    throw new Error(`API Error: ${result.message}`);
  }
  return result;
}
