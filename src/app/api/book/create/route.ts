import ApiClient from '../../api';

const apiClient = new ApiClient();

export async function POST(request: Request) {
  try {
    const { name, userId } = await request.json();

    const response = await apiClient.post('/book', {
      name,
      userId,
    });

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
