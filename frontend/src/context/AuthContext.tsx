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

import { createContext, useContext, useState} from 'react';
import type { ReactNode } from 'react';
import { jwtDecode } from 'jwt-decode';

// 1. Define the shape of the decoded token
interface DecodedToken {
  userId: string;
  email: string;
  role: string;
}

// 2. Define the shape of the context's value
interface AuthContextType {
  token: string | null;
  role: string | null;
  setToken: (token: string | null) => void;
}

// 3. Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// 4. Create the Provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // --- STATE ---
  
  // State for the token, initialized from localStorage
  const [token, setToken_] = useState<string | null>(() => {
    return localStorage.getItem('mintern_token');
  });

  // State for the role, initialized by decoding the stored token
  const [role, setRole] = useState<string | null>(() => {
    const storedToken = localStorage.getItem('mintern_token');
    if (storedToken) {
      try {
        const decoded = jwtDecode<DecodedToken>(storedToken);
        return decoded.role;
      } catch (error) {
        console.error("Failed to decode token on init:", error);
        return null;
      }
    }
    return null;
  });

  // --- LOGIC ---

  /**
   * Main function to set the token.
   * This handles both LOGIN (with a token) and LOGOUT (with null).
   * It updates state and syncs with localStorage.
   */
  const setToken = (newToken: string | null) => {
    setToken_(newToken);

    if (newToken) {
      // --- Login logic ---
      localStorage.setItem('mintern_token', newToken);
      try {
        // Decode the new token to set the role
        const decoded = jwtDecode<DecodedToken>(newToken);
        setRole(decoded.role);
      } catch (error) {
        console.error("Failed to decode new token:", error);
        setRole(null);
      }
    } else {
      // --- Logout logic ---
      localStorage.removeItem('mintern_token');
      setRole(null);
    }
  };

  // The value to be passed to all consuming components
  const contextValue = { token, role, setToken };

  return (
    <AuthContext.Provider value={contextValue}>
      {children}
    </AuthContext.Provider>
  );
}

// 5. Create the custom hook for easy access
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}