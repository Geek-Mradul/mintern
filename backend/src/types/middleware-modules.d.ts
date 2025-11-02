declare module '../middleware/auth.middleware' {
  import type { RequestHandler } from 'express';
  export const protect: RequestHandler;
  export type AuthRequest = any;
}

declare module './auth.middleware' {
  import type { RequestHandler } from 'express';
  export const protect: RequestHandler;
  export type AuthRequest = any;
}

declare module '../middleware/admin.middleware' {
  import type { RequestHandler } from 'express';
  export const adminProtect: RequestHandler;
}

declare module './admin.middleware' {
  import type { RequestHandler } from 'express';
  export const adminProtect: RequestHandler;
}
