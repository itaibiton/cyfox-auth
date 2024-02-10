// pages/app/_middleware.ts

import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

export async function middleware(req: NextRequest) {
    const token = await getToken({ req, secret: process.env.NEXTAUTH_SECRET });
    console.log('token', token);

    const { pathname } = req.nextUrl;

    // Redirect to dashboard if the user is already authenticated and is trying to access the login page


    // Allow the requests if the following is true...
    // 1. It's a request for next-auth session & provider fetching
    // 2. The token exists
    // if (pathname.includes('/api/auth') || token) {
    //     return NextResponse.next();
    // }

    // Redirect them to login if they are accessing a protected route and not authenticated
    if (!token && ['/dashboard', '/settings', '/'].includes(pathname)) {
        const url = req.nextUrl.clone();
        url.pathname = '/login';
        return NextResponse.redirect(url);
    }

    if (token && (pathname.includes('login') || pathname.includes('register'))) {
        const url = req.nextUrl.clone();
        url.pathname = '/dashboard';
        return NextResponse.redirect(url);
    }

    return NextResponse.next();
}
