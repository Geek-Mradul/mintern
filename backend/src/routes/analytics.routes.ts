import express from 'express';
import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth.middleware.js';
import { adminProtect } from '../middleware/admin.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * [GET] /analytics/stats
 * (Admin) Gets basic platform-wide stats.
 */
router.get('/stats', protect, adminProtect, async (req, res: Response) => {
  try {
    const userCount = await prisma.user.count();
    const projectCount = await prisma.project.count();
    const appCount = await prisma.application.count();

    const projectsByStatus = await prisma.project.groupBy({
      by: ['status'],
      _count: { _all: true },
    });

    res.json({
      userCount,
      projectCount,
      appCount,
      projectsByStatus,
    });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching platform stats' });
  }
});

/**
 * [GET] /analytics/categories
 * (Admin) Gets a count of applications per category.
 */
router.get('/categories', protect, adminProtect, async (req, res: Response) => {
  try {
    const categoryStats = await prisma.project.groupBy({
      by: ['category'],
      _count: {
        id: true,
      },
      orderBy: {
        _count: {
          id: 'desc',
        },
      },
      where: {
        category: {
          not: null,
        },
      },
    });

    // Format for Recharts (e.g., { name: 'Web Dev', count: 5 })
    const formattedStats = categoryStats.map(stat => ({
      name: stat.category,
      count: stat._count.id,
    }));

    res.json(formattedStats);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category stats' });
  }
});

export default router;