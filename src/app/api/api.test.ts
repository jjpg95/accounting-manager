import axios, { AxiosInstance, AxiosResponse } from 'axios';
import ApiClient from './api';

jest.mock('axios');
const mockedAxios = axios as jest.Mocked<typeof axios>;

describe('ApiClient', () => {
  let apiClient: ApiClient;
  let mockAxiosInstance: jest.Mocked<AxiosInstance>;

  beforeEach(() => {
    mockAxiosInstance = {
      get: jest.fn(),
      post: jest.fn(),
      // @ts-ignore
      interceptors: {
        request: { use: jest.fn() },
        response: { use: jest.fn() },
      },
      defaults: {},
    } as unknown as jest.Mocked<AxiosInstance>;

    mockedAxios.create.mockReturnValue(mockAxiosInstance);
    apiClient = new ApiClient();
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should initialize axios with correct baseURL and headers', () => {
    expect(mockedAxios.create).toHaveBeenCalledWith({
      baseURL: process.env.API_BASE_URL || 'http://localhost:3000',
      headers: { 'Content-Type': 'application/json' },
    });
  });

  it('should perform GET requests', async () => {
    const response = { data: { foo: 'bar' } } as AxiosResponse;
    mockAxiosInstance.get.mockResolvedValue(response);

    const result = await apiClient.get<{ foo: string }>('/test');

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', undefined);
    expect(result).toBe(response);
  });

  it('should perform GET requests with config', async () => {
    const response = { data: { foo: 'bar' } } as AxiosResponse;
    const config = { params: { q: 1 } };
    mockAxiosInstance.get.mockResolvedValue(response);

    const result = await apiClient.get<{ foo: string }>('/test', config);

    expect(mockAxiosInstance.get).toHaveBeenCalledWith('/test', config);
    expect(result).toBe(response);
  });

  it('should perform POST requests', async () => {
    const response = { data: { id: 1 } } as AxiosResponse;
    mockAxiosInstance.post.mockResolvedValue(response);

    const result = await apiClient.post<{ id: number }>('/test', {
      name: 'test',
    });

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/test',
      { name: 'test' },
      undefined
    );
    expect(result).toBe(response);
  });

  it('should perform POST requests with config', async () => {
    const response = { data: { id: 2 } } as AxiosResponse;
    const config = { headers: { Authorization: 'Bearer token' } };
    mockAxiosInstance.post.mockResolvedValue(response);

    const result = await apiClient.post<{ id: number }>(
      '/test',
      { name: 'test' },
      config
    );

    expect(mockAxiosInstance.post).toHaveBeenCalledWith(
      '/test',
      { name: 'test' },
      config
    );
    expect(result).toBe(response);
  });
});
