import express from 'express';
import type { Response } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const router = express.Router();

/**
 * [GET] /debug/token
 * Returns decoded token payload for debugging (protected)
 */
router.get('/token', protect, (req, res: Response) => {
  const authReq = req as AuthRequest;
  return res.json({ user: authReq.user || null });
});

export default router;
