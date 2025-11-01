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
import type { AuthRequest } from '../middleware/auth.middleware.js';
// Dynamically load middleware implementation so ts-node's ESM loader resolves the .ts file correctly
const { protect } = (await import('../middleware/auth.middleware.ts'));

// Create a new router instance
const router = express.Router();

// --- Sample Data ---
const sampleProjects = [
  { id: '1', title: 'Build a Note-Taking App', category: 'Web Development' },
  { id: '2', title: 'Thermodynamics Problem Set', category: 'Academics' },
];

/**
 * [GET] /projects
 * Fetches all projects
 */
router.get('/', (req: Request, res: Response) => {
  res.json(sampleProjects);
});

/**
 * [GET] /projects/:id
 * Fetches a single project by its ID
 */
router.get('/:id', (req: Request, res: Response) => {
  const { id } = req.params;
  const project = sampleProjects.find((p) => p.id === id);

  if (!project) {
    return res.status(404).json({ message: 'Project not found' });
  }

  res.json(project);
});

/**
 * [POST] /projects
 * Creates a new project
 */
router.post('/', protect, (req: AuthRequest, res: Response) => {
  console.log('Post created by user:', req.user?.email);

  console.log('Received data:', req.body);
  
  res.status(201).json({
    message: 'Project created successfully',
    project: {
      id: '3',
      ...req.body,
      authorEmail: req.user?.email,
    },
  });
});
export default router;