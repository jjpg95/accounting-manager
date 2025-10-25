// middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const AUTH_TOKEN_NAME = 'accessToken';
const REFRESH_TOKEN_NAME = 'refreshToken';

const protectedRoutes = ['/profile', '/settings'];

const LOGIN_URL = '/login';

export function middleware(request: NextRequest) {
  const accessToken = request.cookies.get(AUTH_TOKEN_NAME)?.value;
  const refreshToken = request.cookies.get(REFRESH_TOKEN_NAME)?.value;
  const { pathname } = request.nextUrl;

  const isProtectedRoute = protectedRoutes.some((route) =>
    pathname.startsWith(route)
  );

  if (isProtectedRoute) {
    if (!accessToken) {
      const url = request.nextUrl.clone();
      url.pathname = LOGIN_URL;

      url.searchParams.set('redirect', pathname);
      return NextResponse.redirect(url);
    }

    if (isTokenExpired(accessToken) && refreshToken) {
      if (pathname.startsWith('/api')) {
        // Reescribir /api/user/data -> /api/auth/refresh
        // El Route Handler de refresh actualiza las cookies y devuelve un 200/401
        return NextResponse.rewrite(new URL('/api/auth/refresh', request.url));
      }

      // Para Server Components, generalmente se deja que el Server Component
      // falle con 401 y llame al Route Handler de refresh desde allí,
      // o se usa una lógica de "reescritura pasiva".
    }

    return NextResponse.next();
  }

  if ((pathname === LOGIN_URL || pathname === '/register') && accessToken) {
    return NextResponse.redirect(new URL('/dashboard', request.url));
  }

  return NextResponse.next();
}

const isTokenExpired = (token: string): boolean => {
  try {
    const payloadBase64 = token.split('.')[1];
    const payloadJson = Buffer.from(payloadBase64, 'base64').toString('utf-8');
    const payload = JSON.parse(payloadJson);
    const currentTime = Math.floor(Date.now() / 1000);
    return payload.exp < currentTime;
  } catch (error) {
    console.error('Error decoding token:', error);
    return true;
  }
};

// 5. Configuración opcional: define para qué rutas se ejecuta el middleware
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/profile/:path*',
    '/settings/:path*',
    '/login',
    '/register',
    '/api/:path*',
  ],
};
