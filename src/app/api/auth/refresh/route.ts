import { cookies } from 'next/headers';
import ApiClient from '../../api';
import { LoginResponse } from '../login/route';
import { setAccessTokens } from '@/app/lib/helpers/auth';

export async function POST(request: Request) {
  const cookiesStore = await cookies();
  const apiClient = new ApiClient(cookiesStore);

  try {
    const oldRefreshToken = cookiesStore.get('refreshToken');

    const response = await apiClient.post<LoginResponse>('/auth/refresh', {
      refreshToken: oldRefreshToken?.value,
    });

    const accessToken = response.data?.accessToken;
    const refreshToken = response.data?.refreshToken;
    await setAccessTokens(accessToken, refreshToken);

    return new Response(JSON.stringify(response.data), {
      status: response.status,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error: any) {
    console.error('API Route Error:', error.message);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';
    return new Response(JSON.stringify({ error: message }), {
      status,
      headers: { 'Content-Type': 'application/json' },
    });
  }
}
