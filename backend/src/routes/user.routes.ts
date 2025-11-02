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
 * [GET] /users/me
 * Returns the profile of the currently logged-in user
 */
router.get('/me', protect, async (req, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.userId;

  try {
    if (!userId) {
      return res.status(401).json({ message: 'Unauthorized' });
    }

    const user = await prisma.user.findUnique({
      where: { id: userId },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        skills: true,
        role: true,
      },
    });

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (error) {
    console.error('Error fetching user profile', error);
    res.status(500).json({ message: 'Error fetching profile' });
  }
});

/**
 * [PUT] /users/me
 * Updates the profile of the currently logged-in user
 */
router.put('/me', protect, async (req, res: Response) => {
  const authReq = req as AuthRequest;
  const userId = authReq.user?.userId;
  const { bio, skills } = req.body;

  if (!userId) {
    return res.status(401).json({ message: 'Unauthorized' });
  }

  try {
    const updatedUser = await prisma.user.update({
      where: { id: userId },
      data: {
        bio: bio,
        // Skills are stored as a string array
        skills: Array.isArray(skills) ? skills : [],
      },
      select: {
        id: true,
        email: true,
        name: true,
        bio: true,
        skills: true,
        role: true,
      },
    });

    res.json({ message: 'Profile updated successfully', user: updatedUser });
  } catch (error) {
    console.error('Error updating user profile', error);
    res.status(500).json({ message: 'Error updating profile' });
  }
});

export default router;