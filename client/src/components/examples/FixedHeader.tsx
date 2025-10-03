import FixedHeader from '../FixedHeader';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function FixedHeaderExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="min-h-screen">
          <FixedHeader />
          <div className="pt-20 p-4">
            <p>Header Example - Scroll to see sticky behavior</p>
          </div>
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
