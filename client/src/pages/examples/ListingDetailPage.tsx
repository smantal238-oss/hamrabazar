import ListingDetailPage from '../ListingDetailPage';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function ListingDetailPageExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <ListingDetailPage />
      </LanguageProvider>
    </ThemeProvider>
  );
}
