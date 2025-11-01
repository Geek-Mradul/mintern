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
import 'dotenv/config';
import express from 'express';
import type { Express, Request, Response } from 'express';
import cors from 'cors';

const projectRoutes = (await import('./routes/project.routes.ts')).default;
const app: Express = express();
const port = process.env.PORT || 8000;

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies

// --- API Routes ---
// Any request to /projects will be handled by projectRoutes
app.use('/projects', projectRoutes);

// --- Default Route ---
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Mintern Backend!');
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});