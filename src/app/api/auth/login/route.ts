// src/app/api/auth/login/route.ts

import { NextResponse } from 'next/server';
import ApiClient from '../../api';
import { cookies } from 'next/headers';

interface LoginResponse {
  accessToken: string;
  refreshToken: string;
}

const apiClient = new ApiClient();

export async function POST(request: Request) {
  try {
    const { email, pass } = await request.json();

    const response = await apiClient.post<LoginResponse>('/auth/login', {
      email,
      pass,
    });

    const accessToken = response.data?.accessToken;
    const refreshToken = response.data?.refreshToken;
    if (accessToken && refreshToken) {
      (await cookies())
        .set('accessToken', accessToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        })
        .set('refreshToken', refreshToken, {
          httpOnly: true,
          secure: process.env.NODE_ENV === 'production',
          sameSite: 'lax',
        });
    }

    return NextResponse.json(response.data, { status: response.status });
  } catch (error: any) {
    console.error('API Route Error:', error.message);

    const status = error.response?.status || 500;
    const message = error.response?.data?.message || 'Internal Server Error';

    return NextResponse.json({ error: message }, { status });
  }
}
