import express from 'express';
import type { Response } from 'express';
import { PrismaClient, ProjectStatus } from '@prisma/client';
import { protect } from '../middleware/auth.middleware.js';
import { adminProtect } from '../middleware/admin.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * [GET] /admin/projects
 * (Admin) Gets all projects from all users
 */
router.get('/projects', protect, adminProtect, async (req, res: Response) => {
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: { author: { select: { name: true, email: true } } },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all projects' });
  }
});

/**
 * [GET] /admin/applications
 * (Admin) Gets all applications from all users
 */
router.get('/applications', protect, adminProtect, async (req, res: Response) => {
  try {
    const applications = await prisma.application.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        applicant: { select: { name: true, email: true } },
        project: { select: { title: true } },
      },
    });
    res.json(applications);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching all applications' });
  }
});

/**
 * [PUT] /admin/projects/:id/status
 * (Admin) Approves or rejects a project [cite: 57]
 */
router.put('/projects/:id/status', protect, adminProtect, async (req, res: Response) => {
  const id = req.params.id as string;
  const { status } = req.body; // Expecting "APPROVED" or "REJECTED"

  if (status !== ProjectStatus.APPROVED && status !== ProjectStatus.REJECTED) {
    return res.status(400).json({ message: 'Invalid status. Must be APPROVED or REJECTED.' });
  }

  try {
    const updateData: any = { status };
    const updatedProject = await prisma.project.update({
      where: { id },
      data: updateData,
    });
    res.json({ message: 'Project status updated', project: updatedProject });
  } catch (error) {
    res.status(500).json({ message: 'Error updating project status' });
  }
});

export default router;