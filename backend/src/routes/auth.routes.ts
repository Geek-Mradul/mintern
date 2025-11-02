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
import { PrismaClient } from '@prisma/client';
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import passport from 'passport';
// Load passport configuration (try TS source in dev, otherwise compiled JS)
try {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await import('../config/passport-setup.ts');
} catch (e) {
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  await import('../config/passport-setup.js');
}

const router = express.Router();
const prisma = new PrismaClient();
const JWT_SECRET = process.env.JWT_SECRET || 'fallback_secret';

/**
 * [POST] /auth/signup
 * Creates a new user
 */
router.post('/signup', async (req: Request, res: Response) => {
  try {
    const { email, password, name } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ message: 'Email, password, and name are required' });
    }

    // Check if user already exists
    const existingUser = await prisma.user.findUnique({ where: { email } });
    if (existingUser) {
      return res.status(409).json({ message: 'Email already in use' });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create user
    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
      },
    });

    // Omit password from response
    const { password: _, ...userWithoutPassword } = user;
    res.status(201).json({ message: 'User created successfully', user: userWithoutPassword });
  } catch (error) {
    res.status(500).json({ message: 'Error creating user', error });
  }
});

/**
 * [POST] /auth/login
 * Logs in a user and returns a JWT
 */
router.post('/login', async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    if (!email || !password) {
      return res.status(400).json({ message: 'Email and password are required' });
    }

    // Find user
    const user = await prisma.user.findUnique({ where: { email } });
    if (!user) {
      return res.status(404).json({ message: 'Invalid credentials' });
    }

    // Check password
    if (!user.password) {
      return res.status(500).json({ message: 'User has no password set' });
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT
    const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },// This is the 'payload'
      JWT_SECRET,
      { expiresIn: '1d' } // Token expires in 1 day
    );

    res.json({ message: 'Login successful', token });
  } catch (error) {
    res.status(500).json({ message: 'Error logging in', error });
  }
});
/**
 * [GET] /auth/google
 * The route that starts the Google login flow
 */
router.get('/google', passport.authenticate('google'));

/**
 * [GET] /auth/google/callback
 * The route Google redirects to.
 * We'll have passport handle it, turn off sessions, and on success,
 * we'll get the 'user' object attached to req.
 */
router.get(
  '/google/callback',
  passport.authenticate('google', {
    session: false, // We are using JWTs, not sessions
    failureRedirect: '/auth/google/failure',
  }),
  (req: Request, res: Response) => {
    // --- Successful Authentication ---
    // req.user is the user object from our passport logic
    // We need to cast it since req.user is generic
    const user = req.user as { id: string; email: string; role: string };

    if (!user) {
      return res.status(400).json({ message: 'User not found after auth' });
    }

    // Generate a JWT, just like in the regular login route
    const token = jwt.sign(
    { userId: user.id, email: user.email, role: user.role },
      JWT_SECRET,
      { expiresIn: '1d' }
    );

    // NOTE: In a real app, you'd redirect to your frontend with the token.
    // For testing, we'll just send the token as JSON.
    res.json({ message: 'Google login successful', token });
  }
);

/**
 * [GET] /auth/google/failure
 * Route to hit if the Google login fails (e.g., wrong email domain)
 */
router.get('/google/failure', (req: Request, res: Response) => {
  res.status(401).json({ message: 'Google Auth Failed. Only @hyderabad.bits-pilani.ac.in emails are allowed.' });
});
export default router;