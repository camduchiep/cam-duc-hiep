import { defineMiddleware } from 'astro:middleware';
import { verifySession } from './lib/auth';

export const onRequest = defineMiddleware(async (context, next) => {
  const { pathname } = context.url;

  // Only guard /admin routes
  if (pathname.startsWith('/admin')) {
    const isLoginPage = pathname === '/admin/login';
    const sessionCookie = context.cookies.get('admin_session')?.value;
    const authSecret = context.locals.runtime?.env?.AUTH_SECRET;
    const isAuthenticated = await verifySession(sessionCookie, authSecret);

    if (!isAuthenticated && !isLoginPage) {
      return context.redirect('/admin/login');
    }

    if (isAuthenticated && isLoginPage) {
      return context.redirect('/admin');
    }
  }

  return next();
});
