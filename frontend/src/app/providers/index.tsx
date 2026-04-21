import React from 'react';
import { Toaster } from 'react-hot-toast';

/**
 * Global App Providers.
 * Wraps the app with necessary contexts (Auth, Theme, Toast, etc.)
 */

interface AppProvidersProps {
  children: React.ReactNode;
}

export const AppProviders = ({ children }: AppProvidersProps) => {
  return (
    <>
      {/* Toast notifications */}
      <Toaster position="top-right" reverseOrder={false} />
      
      {/* Other providers like AuthProvider, ThemeProvider can be added here */}
      {children}
    </>
  );
};
