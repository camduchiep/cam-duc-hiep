import type { APIRoute } from 'astro';
import { signSession } from '../../../lib/auth';

export const prerender = false;

export const POST: APIRoute = async ({ request, cookies, locals }) => {
  const formData = await request.formData();
  const username = formData.get('username')?.toString().trim();
  const password = formData.get('password')?.toString();

  // Default admin password or environment variable ADMIN_PASSWORD
  const env = locals.runtime?.env;
  const configuredPassword = env?.ADMIN_PASSWORD || 'camduchiep@2026';

  if (!username || !password) {
    return new Response(JSON.stringify({ error: 'Vui lòng nhập đầy đủ tên đăng nhập và mật khẩu.' }), {
      status: 400,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Simple and secure check:
  // Can check username 'admin' and password
  const isValidUser = (username.toLowerCase() === 'admin' || username.toLowerCase() === 'camduchiep') && password === configuredPassword;

  if (!isValidUser) {
    return new Response(JSON.stringify({ error: 'Tên đăng nhập hoặc mật khẩu không chính xác.' }), {
      status: 401,
      headers: { 'Content-Type': 'application/json' }
    });
  }

  // Create signed session token
  const sessionToken = await signSession(username);

  // Set HTTP-only Cookie (7 days)
  cookies.set('admin_session', sessionToken, {
    path: '/',
    httpOnly: true,
    secure: true,
    sameSite: 'lax',
    maxAge: 60 * 60 * 24 * 7 // 7 days
  });

  return new Response(JSON.stringify({ success: true, redirect: '/admin' }), {
    status: 200,
    headers: { 'Content-Type': 'application/json' }
  });
};
