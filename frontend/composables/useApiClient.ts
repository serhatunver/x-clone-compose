export const useApiClient = () => {
  const config = useRuntimeConfig();
  const { token } = useAuth();

  const apiBase = config.public.apiBase;

  const getHeaders = (customHeaders: HeadersInit = {}) => {
    return {
      Accept: 'application/json',
      ...(token.value ? { Authorization: token.value } : {}),
      ...customHeaders,
    };
  };

  const request = async <T>(
    endpoint: string,
    options: RequestInit = {},
  ): Promise<T> => {
    const res = await fetch(`${apiBase}${endpoint}`, {
      ...options,
      headers: getHeaders(options.headers || {}),
    });

    if (!res.ok) {
      const errorData = await res.json().catch(() => null);

      throw new Error(
        errorData?.error || errorData?.message || 'Request failed',
      );
    }

    if (res.status === 204) {
      return undefined as T;
    }

    return res.json();
  };

  const get = <T>(endpoint: string, options: RequestInit = {}) =>
    request<T>(endpoint, { ...options, method: 'GET' });

  const post = <T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {},
  ) =>
    request<T>(endpoint, {
      ...options,
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  const patch = <T>(
    endpoint: string,
    body?: unknown,
    options: RequestInit = {},
  ) =>
    request<T>(endpoint, {
      ...options,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        ...(options.headers || {}),
      },
      body: body ? JSON.stringify(body) : undefined,
    });

  const del = <T>(endpoint: string, options: RequestInit = {}) =>
    request<T>(endpoint, { ...options, method: 'DELETE' });

  return {
    request,
    get,
    post,
    patch,
    del,
  };
};
