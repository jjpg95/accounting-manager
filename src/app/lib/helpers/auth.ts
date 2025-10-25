import { cookies } from 'next/headers';

export async function setAccessTokens(
  accessToken: string,
  refreshToken: string
) {
  const cookieStore = await cookies();
  console.log('Setting auth tokens in cookies:', {
    accessToken,
    refreshToken,
    processEnv: process.env.NODE_ENV,
  });
  cookieStore.set('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
  cookieStore.set('refreshToken', refreshToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
  });
}
