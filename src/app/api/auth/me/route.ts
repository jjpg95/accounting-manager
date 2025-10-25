import { cookies } from 'next/headers';
import { createApiClient } from '../../api';

export async function GET() {
  const cookieStore = await cookies();
  const apiClient = createApiClient(cookieStore);

  try {
    const response = await apiClient.get('/auth/me');
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
