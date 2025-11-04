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
import fs from 'fs';
import path from 'path';
import { pathToFileURL, fileURLToPath } from 'url';
import passport from 'passport';
// Helper to load a route module trying .ts first (dev) then .js (built)
async function loadRoute(modulePathNoExt: string) {
  // Prefer the .ts source when it exists (dev with ts-node). Otherwise use .js (built runtime).
  const __dirname = path.dirname(fileURLToPath(import.meta.url));
  const tsPath = path.join(__dirname, `${modulePathNoExt}.ts`);
  const jsPath = path.join(__dirname, `${modulePathNoExt}.js`);

  if (fs.existsSync(tsPath)) {
    return (await import(pathToFileURL(tsPath).href)).default;
  }

  return (await import(pathToFileURL(jsPath).href)).default;
}

const authRoutes = await loadRoute('./routes/auth.routes');
const projectRoutes = await loadRoute('./routes/project.routes');
const applicationRoutes = await loadRoute('./routes/application.routes');
const userRoutes = await loadRoute('./routes/user.routes');
const adminRoutes = await loadRoute('./routes/admin.routes');
const debugRoutes = await loadRoute('./routes/debug.routes');
const app: Express = express();
const analyticsRoutes = await loadRoute('./routes/analytics.routes')
const port = process.env.PORT || 8000;

// --- Middleware ---
app.use(cors());
app.use(express.json()); // Middleware to parse JSON bodies
app.use(passport.initialize());

// --- API Routes ---
app.use('/auth', authRoutes);
app.use('/projects', projectRoutes);
app.use('/', applicationRoutes);
app.use('/users', userRoutes);
app.use('/admin', adminRoutes);
app.use('/debug', debugRoutes);
app.use('/analytics', analyticsRoutes);
// --- Default Route ---
app.get('/', (req: Request, res: Response) => {
  res.send('Welcome to Mintern Backend!');
});

// --- Server Start ---
app.listen(port, () => {
  console.log(`[server]: Server is running at http://localhost:${port}`);
});