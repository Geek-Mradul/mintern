/*
 * Mintern
 * Copyright (C) 2025  Mradul Purohit
 * ... (rest of your GPL header)
 */
// SPDX-License-Identifier: GPL-3.0-or-later

import express from 'express';
import type { Response } from 'express';
import { PrismaClient } from '@prisma/client';
import { protect } from '../middleware/auth.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';

const router = express.Router();
const prisma = new PrismaClient();

/**
 * [POST] /projects/:id/apply
 * Applies the logged-in user to a specific project.
 */
router.post('/projects/:id/apply', protect, async (req, res) => {
  const authReq = req as AuthRequest;
  const projectId = authReq.params.id;
  const applicantId = authReq.user?.userId;

  if (!applicantId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  if (!projectId) {
    return res.status(400).json({ message: 'Project id is required' });
  }

  try {
    // 1. Check if the project exists
    const project = await prisma.project.findUnique({ where: { id: projectId } });
    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }

    // 2. Check if user has already applied
    const existingApplication = await prisma.application.findUnique({
      where: {
        applicantId_projectId: {
          applicantId: applicantId,
          projectId: projectId,
        },
      },
    });

    if (existingApplication) {
      return res.status(409).json({ message: 'You have already applied to this project' });
    }

    // 3. Create the new application
    const newApplication = await prisma.application.create({
      data: {
        applicantId: applicantId,
        projectId: projectId as string,
        status: 'PENDING', // Default status is pending
      },
    });

    res.status(201).json({ message: 'Application submitted successfully', application: newApplication });
  } catch (error) {
    res.status(500).json({ message: 'Error submitting application', error });
  }
});

/**
 * [GET] /applications/me
 * Gets all applications submitted by the logged-in user.
 */
router.get('/applications/me', protect, async (req, res) => {
  const authReq = req as AuthRequest;
  const applicantId = authReq.user?.userId;

  if (!applicantId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const applications = await prisma.application.findMany({
      where: { applicantId: applicantId },
      include: {
        // Also fetch the project details for each application
        project: {
          select: {
            id: true,
            title: true,
            category: true,
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    res.json({ applications });
  } catch (error) {
    res.status(500).json({ message: 'Error fetching applications', error });
  }
});

export default router;