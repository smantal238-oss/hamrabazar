import AuthPage from '../AuthPage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function AuthPageExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <AuthPage />
      </LanguageProvider>
    </ThemeProvider>
  );
}
