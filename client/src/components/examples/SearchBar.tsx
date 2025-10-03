import SearchBar from '../SearchBar';
import { LanguageProvider } from '@/contexts/LanguageContext';
import { ThemeProvider } from '@/contexts/ThemeContext';

export default function SearchBarExample() {
  return (
    <ThemeProvider>
      <LanguageProvider>
        <div className="p-8">
          <SearchBar onSearch={(q, cat, city) => console.log({ q, cat, city })} />
        </div>
      </LanguageProvider>
    </ThemeProvider>
  );
}
