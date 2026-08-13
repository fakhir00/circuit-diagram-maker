import { defineMiddleware } from 'astro:middleware';

export const onRequest = defineMiddleware((context, next) => {
  const { pathname, search } = context.url;

  if (pathname === '/' || pathname.endsWith('/')) {
    return next();
  }

  if (/\.[a-zA-Z0-9]{1,8}$/.test(pathname)) {
    return next();
  }

  return context.redirect(`${pathname}/${search}`, 308);
});