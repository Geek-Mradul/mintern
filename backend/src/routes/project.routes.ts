/*
 * Mintern
 * Copyright (C) 2025  Mradul Purohit
 *
 * This program is free software: you can redistribute it and/or modify
 * it under the terms of the GNU General Public License as published by
 * the Free Software Foundation, either version 3 of the License, or
 * (at your option) any later version.
 *
 * This program is distributed in the hope that it will be useful,
 * but WITHOUT ANY WARRANTY; without even the implied warranty of
 * MERCHANTABILITY or FITNESS FOR A PARTICULAR PURPOSE.  See the
 * GNU General Public License for more details.
 *
 * You should have received a copy of the GNU General Public License
 * along with this program.  If not, see <https://www.gnu.org/licenses/>.
 */
// SPDX-License-Identifier: GPL-3.0-or-later

import express from 'express';
import type { Request, Response } from 'express';
import { protect } from '../middleware/auth.middleware.js';
import type { AuthRequest } from '../middleware/auth.middleware.js';
import { PrismaClient } from '@prisma/client';

// Create a new router instance
const router = express.Router();
const prisma = new PrismaClient();


/**
 * [GET] /projects
 * Fetches all projects from the database
 */
router.get('/', async (req: Request, res: Response) => {
  // 4. REPLACE with this logic
  try {
    const projects = await prisma.project.findMany({
      orderBy: { createdAt: 'desc' },
      include: {
        author: {
          select: { name: true, role: true }, // Include author name and role
        },
      },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching projects' });
  }
});

/**
 * [GET] /projects/:id
 * Fetches a single project by its ID from the database
 */
router.get('/:id', async (req: Request, res: Response) => {
  // 5. REPLACE with this logic
  try {
    const { id } = req.params;
    if (!id) {
      return res.status(400).json({ message: 'Project id is required' });
    }
    const project = await prisma.project.findUnique({
      where: { id: id },
      include: {
        author: {
          select: { name: true, role: true, email: true },
        },
      },
    });

    if (!project) {
      return res.status(404).json({ message: 'Project not found' });
    }
    res.json(project);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching project' });
  }
});
/**
 * [GET] /projects/me
 * Fetches all projects posted by the logged-in user
 */
router.get('/me', protect, async (req: Request, res: Response) => {
  const authReq = req as AuthRequest;
  const authorId = authReq.user?.userId;

  if (!authorId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const projects = await prisma.project.findMany({
      where: { authorId: authorId },
      orderBy: { createdAt: 'desc' },
    });
    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching user projects' });
  }
});
/**
 * [POST] /projects
 * Creates a new project
 */
// 6. REPLACE your old POST route with this one
router.post('/', protect, async (req, res) => {
  const authReq = req as AuthRequest;
  const { title, description, category } = authReq.body;
  const authorId = authReq.user?.userId;

  if (!authorId) {
    return res.status(401).json({ message: 'User not authenticated' });
  }

  try {
    const newProject = await prisma.project.create({
      data: {
        title,
        description,
        category,
        authorId: authorId,
      },
    });
    res.status(201).json({ message: 'Project created successfully', project: newProject });
  } catch (error) {
    res.status(500).json({ message: 'Error creating project', error });
  }
});
export default router;