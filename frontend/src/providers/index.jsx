import { ResumeProvider } from '@/context/ResumeContext';
import { ThemeProvider } from '@/providers/theme-provider';

/**
 * Root application providers.
 * Add new providers here (e.g. AuthProvider, QueryProvider) as they're built.
 */
export function AppProviders({ children }) {
  return (
    <ThemeProvider>
      <ResumeProvider>{children}</ResumeProvider>
    </ThemeProvider>
  );
}
