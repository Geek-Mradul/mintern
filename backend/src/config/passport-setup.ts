/*
 * Mintern
 * Copyright (C) 2025  Mradul Purohit
 * ... (rest of your GPL header)
 */
// SPDX-License-Identifier: GPL-3.0-or-later

import 'dotenv/config';
import passport from 'passport';
import { Strategy as GoogleStrategy } from 'passport-google-oauth20';
import { PrismaClient, UserRole } from '@prisma/client';

const prisma = new PrismaClient();

const BITS_EMAIL_DOMAIN = '@hyderabad.bits-pilani.ac.in';

passport.use(
  new GoogleStrategy(
    {
      clientID: process.env.GOOGLE_CLIENT_ID!,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET!,
      callbackURL: '/auth/google/callback', // Must match the one in Google Console
      scope: ['profile', 'email'],
    },
    async (accessToken, refreshToken, profile, done) => {
      try {
        const email = profile.emails?.[0]?.value;
        if (!email) {
          return done(new Error('No email found in Google profile.'), false);
        }

        // THE CORE LOGIC: Check for BITS email
        if (!email.endsWith(BITS_EMAIL_DOMAIN)) {
          return done(new Error('Invalid email domain. Only @hyderabad.bits-pilani.ac.in is allowed.'), false);
        }

        // User is a valid BITS student, find or create them
        const user = await prisma.user.upsert({
          where: { email: email },
          // Create a new user
          create: {
            email: email,
            name: profile.displayName,
            role: UserRole.INTERNAL, // Set their role!
          },
          // Update existing user (e.g., if they signed up with password first)
          update: {
            name: profile.displayName,
            role: UserRole.INTERNAL, // Ensure role is set
          },
        });

        // Success! Pass the user to the next step
        return done(null, user);
      } catch (error) {
        return done(error, false);
      }
    }
  )
);