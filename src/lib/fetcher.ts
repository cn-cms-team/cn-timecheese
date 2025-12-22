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

export interface EMSApiResponse<T = unknown> {
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
