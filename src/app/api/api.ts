import axios, {
  AxiosInstance,
  AxiosRequestConfig,
  AxiosResponse,
  InternalAxiosRequestConfig,
} from 'axios';
import { ReadonlyRequestCookies } from 'next/dist/server/web/spec-extension/adapters/request-cookies';

type FailedQueueItem = {
  resolve: (value: any) => void;
  reject: (reason?: any) => void;
  config: InternalAxiosRequestConfig;
};

class ApiClient {
  private client: AxiosInstance;
  private cookiesStore: ReadonlyRequestCookies;

  private isRefreshing = false;
  private failedQueue: FailedQueueItem[] = [];

  constructor(cookiesStore: ReadonlyRequestCookies) {
    this.cookiesStore = cookiesStore;
    const baseURL = process.env.API_BASE_URL || 'http://localhost:3000';

    this.client = axios.create({
      baseURL,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    this.client.interceptors.request.use(
      (config: InternalAxiosRequestConfig) => {
        const accessToken = this.getAccessTokenSync();
        if (accessToken) {
          config.headers.Authorization = `Bearer ${accessToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    this.setupResponseInterceptor();
  }

  private getAccessTokenSync(): string | undefined {
    return this.cookiesStore.get('accessToken')?.value;
  }

  private getRefreshTokenSync(): string | undefined {
    return this.cookiesStore.get('refreshToken')?.value;
  }

  private processQueue(error: any | null, token: string | null = null): void {
    if (error) {
      this.failedQueue.forEach((prom) => prom.reject(error));
    } else if (token) {
      this.failedQueue.forEach((prom) => {
        prom.config.headers.Authorization = `Bearer ${token}`;
        prom.resolve(this.client(prom.config));
      });
    }
    this.failedQueue = [];
  }

  private setupResponseInterceptor() {
    this.client.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config as InternalAxiosRequestConfig & {
          _retry?: boolean;
        };

        if (
          error.response &&
          error.response.status === 401 &&
          !originalRequest._retry
        ) {
          const refreshToken = this.getRefreshTokenSync();

          if (!refreshToken) {
            return Promise.reject(error);
          }

          if (this.isRefreshing) {
            return new Promise((resolve, reject) => {
              this.failedQueue.push({
                resolve,
                reject,
                config: originalRequest,
              });
            });
          }

          this.isRefreshing = true;

          originalRequest._retry = true;

          try {
            const baseURL =
              this.client.defaults.baseURL || 'http://localhost:3000';
            const response = await axios.post(`${baseURL}/auth/refresh`, {
              token: refreshToken,
            });

            const newAccessToken = response.data.newAccessToken;
            this.processQueue(null, newAccessToken);
            originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
            return this.client(originalRequest);
          } catch (refreshError) {
            this.processQueue(refreshError);
            return Promise.reject(refreshError);
          } finally {
            this.isRefreshing = false;
          }
        }

        return Promise.reject(error);
      }
    );
  }

  public get<T>(
    url: string,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.get<T>(url, config);
  }

  public post<T>(
    url: string,
    data: any,
    config?: AxiosRequestConfig
  ): Promise<AxiosResponse<T>> {
    return this.client.post<T>(url, data, config);
  }
}

export const createApiClient = (cookiesStore: ReadonlyRequestCookies) => {
  return new ApiClient(cookiesStore);
};

export default ApiClient;
