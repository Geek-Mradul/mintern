import type { Response, NextFunction, RequestHandler } from 'express';
import { UserRole } from '@prisma/client';
import type { AuthRequest } from './auth.middleware.js';

export const adminProtect: RequestHandler = (req, res, next) => {
  const authReq = req as AuthRequest;
  if (authReq.user?.role !== UserRole.ADMIN) {
    return res.status(403).json({ message: 'Forbidden: Admin access required' });
  }
  next();
};