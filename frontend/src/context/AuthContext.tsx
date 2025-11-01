import { createContext, useContext, useState } from 'react';
import type { ReactNode } from 'react';

// Define the shape of the auth context
interface AuthContextType {
  token: string | null;
  setToken: (token: string | null) => void;
}

// Create the context
const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Create the provider component
export function AuthProvider({ children }: { children: ReactNode }) {
  // Load the token from localStorage on initial load
  const [token, setToken_] = useState<string | null>(() => {
    return localStorage.getItem('mintern_token');
  });

  // Create a function to set the token in both state and localStorage
  const setToken = (newToken: string | null) => {
    setToken_(newToken);
    if (newToken) {
      localStorage.setItem('mintern_token', newToken); // 
    } else {
      localStorage.removeItem('mintern_token');
    }
  };

  return (
    <AuthContext.Provider value={{ token, setToken }}>
      {children}
    </AuthContext.Provider>
  );
}

// Create a custom hook to easily use the context
export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}