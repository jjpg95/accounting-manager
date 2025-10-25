import axios from 'axios';
import ApiClient, { createApiClient } from './api';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

mockedAxios.post = jest.fn();
mockedAxios.get = jest.fn();

mockedAxios.create = jest.fn();

describe('ApiClient', () => {
  let cookiesStore: jest.Mocked<ReadonlyRequestCookies>;
  let apiClient: ApiClient;

  beforeEach(() => {
    cookiesStore = {
      get: jest.fn(),
      getAll: jest.fn(),
      has: jest.fn(),
      [Symbol.iterator]: jest.fn(),
      size: 0,
      clear: jest.fn(),
      delete: jest.fn(),
    } as any as jest.Mocked<ReadonlyRequestCookies>;

    const mockClient = jest.fn() as any;
    mockClient.interceptors = {
      request: { use: jest.fn() },
      response: { use: jest.fn() },
    };
    mockClient.get = jest.fn();
    mockClient.post = jest.fn();
    mockClient.defaults = { baseURL: 'http://localhost:3000' };
    mockClient.request = jest.fn();

    mockedAxios.create.mockReturnValue(mockClient);

    delete process.env.API_BASE_URL;

    apiClient = createApiClient(cookiesStore);
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should expose createApiClient function and return ApiClient instance', () => {
    const instance = createApiClient(cookiesStore);
    expect(instance).toBeInstanceOf(ApiClient);
  });

  it('should use API_BASE_URL environment variable if provided', () => {
    process.env.API_BASE_URL = 'https://custom-api.com';

    createApiClient(cookiesStore);

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'https://custom-api.com',
      })
    );
    delete process.env.API_BASE_URL;
  });

  it('should use default baseURL if API_BASE_URL is missing', () => {
    createApiClient(cookiesStore);

    expect(mockedAxios.create).toHaveBeenCalledWith(
      expect.objectContaining({
        baseURL: 'http://localhost:3000',
      })
    );
  });

  it('should set Authorization header if accessToken exists', async () => {
    const fakeToken = 'abc123';
    cookiesStore.get.mockImplementation((name) =>
      name === 'accessToken' ? ({ value: fakeToken } as any) : undefined
    );

    const client = mockedAxios.create.mock.results[0].value;
    const requestInterceptorOnFulfilled =
      client.interceptors.request.use.mock.calls[0][0];

    const config: any = { headers: {} };
    const result = await requestInterceptorOnFulfilled(config);

    expect(result.headers.Authorization).toBe(`Bearer ${fakeToken}`);
  });

  it('should NOT set Authorization header if accessToken is missing (L.42)', async () => {
    cookiesStore.get.mockImplementation((name) =>
      name === 'accessToken' ? undefined : undefined
    );

    const client = mockedAxios.create.mock.results[0].value;
    const requestInterceptorOnFulfilled =
      client.interceptors.request.use.mock.calls[0][0];

    const config: any = { headers: {} };
    const result = await requestInterceptorOnFulfilled(config);

    expect(result.headers.Authorization).toBeUndefined();
  });

  it('request interceptor rejects on error (L.50)', async () => {
    const client = mockedAxios.create.mock.results[0].value;
    const requestInterceptorOnRejected =
      client.interceptors.request.use.mock.calls[0][1];
    const error = new Error('Request failed');

    await expect(requestInterceptorOnRejected(error)).rejects.toThrow(
      'Request failed'
    );
  });

  it('should call get with correct params', async () => {
    const response = { data: { foo: 'bar' } };
    (apiClient as any).client.get = jest.fn().mockResolvedValue(response);

    const result = await apiClient.get<{ foo: string }>('/test');
    expect((apiClient as any).client.get).toHaveBeenCalledWith(
      '/test',
      undefined
    );
    expect(result).toBe(response);
  });

  it('should call post with correct params', async () => {
    const response = { data: { foo: 'bar' } };
    (apiClient as any).client.post = jest.fn().mockResolvedValue(response);

    const result = await apiClient.post<{ foo: string }>('/test', { a: 1 });
    expect((apiClient as any).client.post).toHaveBeenCalledWith(
      '/test',
      { a: 1 },
      undefined
    );
    expect(result).toBe(response);
  });

  it('should reject error immediately if response status is not 401', async () => {
    const non401Error = {
      response: { status: 500, data: 'Server error' },
      config: { headers: {}, url: '/fail' },
    };

    const client = (apiClient as any).client;
    const responseInterceptor =
      client.interceptors.response.use.mock.calls[0][1];

    await expect(responseInterceptor(non401Error)).rejects.toBe(non401Error);

    expect(mockedAxios.post).not.toHaveBeenCalled();
  });

  it('response interceptor should return response on success (L.69)', async () => {
    const client = (apiClient as any).client;
    const responseInterceptorOnFulfilled =
      client.interceptors.response.use.mock.calls[0][0];

    const mockResponse = { data: 'ok', status: 200 } as any;

    const result = responseInterceptorOnFulfilled(mockResponse);

    expect(result).toBe(mockResponse);
  });

  describe('refresh token flow', () => {
    let client: any;

    beforeEach(() => {
      client = jest.fn() as any;
      client.interceptors = {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      };
      client.get = jest.fn();
      client.post = jest.fn();
      client.defaults = { baseURL: 'http://localhost:3000' };
      client.request = jest.fn();

      mockedAxios.create.mockReturnValue(client);
      apiClient = createApiClient(cookiesStore);
    });

    it('should clear the failedQueue when processQueue is called with nulls (L.73)', () => {
      (apiClient as any).failedQueue.push({
        resolve: jest.fn(),
        reject: jest.fn(),
        config: {},
      } as any);

      (apiClient as any).processQueue(null, null);

      expect((apiClient as any).failedQueue.length).toBe(0);
    });

    it('should use fallback baseURL when client.defaults.baseURL is missing (L.99)', async () => {
      const refreshToken = 'refresh123';
      const newAccessToken = 'newToken456';

      cookiesStore.get.mockImplementation((name) =>
        name === 'refreshToken' ? ({ value: refreshToken } as any) : undefined
      );

      const error = {
        response: { status: 401 },
        config: { headers: {}, url: '/test' },
      };

      (apiClient as any).client.defaults.baseURL = undefined;

      mockedAxios.post.mockResolvedValue({
        data: { newAccessToken: newAccessToken },
      });
      (apiClient as any).client.mockResolvedValue({ data: 'ok' });

      const responseInterceptor = (apiClient as any).client.interceptors
        .response.use.mock.calls[0][1];

      await responseInterceptor(error);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3000/auth/refresh',
        { token: refreshToken }
      );
    });

    it('should reject if no refresh token on 401', async () => {
      cookiesStore.get.mockReturnValue(undefined);

      const error = { response: { status: 401 }, config: {} };

      const responseInterceptor =
        client.interceptors.response.use.mock.calls[0][1];
      await expect(responseInterceptor(error)).rejects.toBe(error);
    });

    it('should refresh token and retry original request on 401', async () => {
      const refreshToken = 'refresh123';
      const newAccessToken = 'newToken456';
      cookiesStore.get.mockImplementation((name) =>
        name === 'refreshToken' ? ({ value: refreshToken } as any) : undefined
      );

      const error = {
        response: { status: 401 },
        config: { headers: {}, url: '/foo' },
      };

      mockedAxios.post.mockResolvedValue({
        data: { newAccessToken: newAccessToken },
      });
      client.mockResolvedValue({ data: 'ok' });

      const responseInterceptor =
        client.interceptors.response.use.mock.calls[0][1];
      const result = await responseInterceptor(error);

      expect(mockedAxios.post).toHaveBeenCalledWith(
        'http://localhost:3000/auth/refresh',
        { token: refreshToken }
      );
      expect(client).toHaveBeenCalledTimes(1);
      expect(result).toEqual({ data: 'ok' });
    });

    it('should reject all queued requests if refresh fails', async () => {
      const refreshToken = 'refresh123';
      cookiesStore.get.mockImplementation((name) =>
        name === 'refreshToken' ? ({ value: refreshToken } as any) : undefined
      );

      const error = {
        response: { status: 401 },
        config: { headers: {}, url: '/foo' },
      };
      mockedAxios.post.mockRejectedValue(new Error('refresh failed'));

      const responseInterceptor =
        client.interceptors.response.use.mock.calls[0][1];
      await expect(responseInterceptor(error)).rejects.toThrow(
        'refresh failed'
      );
    });

    it('should reject queued requests if refresh fails (concurrency check)', async () => {
      const refreshToken = 'refresh123';
      cookiesStore.get.mockImplementation((name) =>
        name === 'refreshToken' ? ({ value: refreshToken } as any) : undefined
      );

      const error401_init = {
        response: { status: 401 },
        config: { headers: {}, url: '/init-fail', _retry: false },
      };
      const error401_queue = {
        response: { status: 401 },
        config: { headers: {}, url: '/queue-fail', _retry: false },
      };
      const refreshError = new Error('Refresh token API failed');
      const interceptor = client.interceptors.response.use.mock.calls[0][1];

      mockedAxios.post.mockRejectedValue(refreshError);

      const initPromise = interceptor(error401_init);
      const queuedPromise = interceptor(error401_queue);

      await expect(initPromise).rejects.toThrow('Refresh token API failed');
      await expect(queuedPromise).rejects.toThrow('Refresh token API failed');

      expect((apiClient as any).isRefreshing).toBe(false);
      expect((apiClient as any).failedQueue.length).toBe(0);
    });

    it('should process and retry all queued requests on successful refresh', async () => {
      const refreshToken = 'refresh123';
      const newAccessToken = 'newToken456';

      cookiesStore.get.mockImplementation((name) =>
        name === 'refreshToken' ? ({ value: refreshToken } as any) : undefined
      );

      const error401_init = {
        response: { status: 401 },
        config: { headers: {}, url: '/data1', _retry: false },
      };
      const error401_queue = {
        response: { status: 401 },
        config: { headers: {}, url: '/data2', _retry: false },
      };

      let resolveRefresh: any;
      const refreshPromise = new Promise((resolve) => {
        resolveRefresh = resolve;
      });
      mockedAxios.post.mockReturnValue(refreshPromise);

      const interceptor = client.interceptors.response.use.mock.calls[0][1];

      const p1_init = interceptor(error401_init);
      const p2_queued = interceptor(error401_queue);

      client
        .mockResolvedValueOnce({ data: 'ok_queue' })
        .mockResolvedValueOnce({ data: 'ok_init' });

      resolveRefresh({ data: { newAccessToken: newAccessToken } });

      const [result1, result2] = await Promise.all([p1_init, p2_queued]);

      expect(mockedAxios.post).toHaveBeenCalledTimes(1);
      expect(client).toHaveBeenCalledTimes(2);

      expect(result1.data).toBe('ok_init');
      expect(result2.data).toBe('ok_queue');

      expect((apiClient as any).isRefreshing).toBe(false);
      expect((apiClient as any).failedQueue.length).toBe(0);
    });
  });
});
