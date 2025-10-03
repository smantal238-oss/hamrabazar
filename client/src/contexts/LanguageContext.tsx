import { createContext, useContext, useState, useEffect, ReactNode } from 'react';

type Language = 'fa' | 'ps' | 'en';

interface LanguageContextType {
  language: Language;
  setLanguage: (lang: Language) => void;
  t: (key: string) => string;
  dir: 'rtl' | 'ltr';
}

const translations = {
  fa: {
    appName: 'بازار افغانستان',
    home: 'خانه',
    login: 'ورود',
    register: 'ثبت‌نام',
    logout: 'خروج',
    search: 'جستجو',
    searchPlaceholder: 'چی می‌گردی؟',
    allCategories: 'همه دسته‌بندی‌ها',
    afghanCities: 'شهرهای افغانستان',
    recentListings: 'آخرین آگهی‌های منتشر شده',
    selectCategory: 'انتخاب دسته‌بندی',
    selectCity: 'انتخاب شهر',
    postAd: 'ثبت آگهی',
    myDashboard: 'داشبورد من',
    contactSeller: 'تماس با فروشنده',
    price: 'قیمت',
    description: 'توضیحات',
    details: 'جزئیات',
    back: 'بازگشت',
    phoneNumber: 'شماره تماس',
    password: 'رمز عبور',
    name: 'نام',
    title: 'عنوان',
    category: 'دسته‌بندی',
    city: 'شهر',
    submit: 'ثبت',
    cancel: 'لغو',
    loading: 'در حال بارگذاری...',
    noResults: 'نتیجه‌ای یافت نشد',
    afghani: 'افغانی',
  },
  ps: {
    appName: 'د افغانستان بازار',
    home: 'کور',
    login: 'ننوتل',
    register: 'نوم لیکنه',
    logout: 'وتل',
    search: 'لټون',
    searchPlaceholder: 'څه لټوی؟',
    allCategories: 'ټولې کټګورۍ',
    afghanCities: 'د افغانستان ښارونه',
    recentListings: 'وروستي اعلانونه',
    selectCategory: 'کټګوري غوره کړئ',
    selectCity: 'ښار غوره کړئ',
    postAd: 'اعلان خپور کړئ',
    myDashboard: 'زما ډشبورډ',
    contactSeller: 'پلورونکی سره اړیکه',
    price: 'بیه',
    description: 'تفصیل',
    details: 'جزئیات',
    back: 'شاته',
    phoneNumber: 'د تلیفون شمیره',
    password: 'پټ نوم',
    name: 'نوم',
    title: 'سرلیک',
    category: 'کټګوري',
    city: 'ښار',
    submit: 'ثبت',
    cancel: 'لغوه',
    loading: 'بارېدل...',
    noResults: 'پایله ونه موندل شوه',
    afghani: 'افغانۍ',
  },
  en: {
    appName: 'Afghan Bazaar',
    home: 'Home',
    login: 'Login',
    register: 'Register',
    logout: 'Logout',
    search: 'Search',
    searchPlaceholder: 'What are you looking for?',
    allCategories: 'All Categories',
    afghanCities: 'Afghan Cities',
    recentListings: 'Recent Listings',
    selectCategory: 'Select Category',
    selectCity: 'Select City',
    postAd: 'Post Ad',
    myDashboard: 'My Dashboard',
    contactSeller: 'Contact Seller',
    price: 'Price',
    description: 'Description',
    details: 'Details',
    back: 'Back',
    phoneNumber: 'Phone Number',
    password: 'Password',
    name: 'Name',
    title: 'Title',
    category: 'Category',
    city: 'City',
    submit: 'Submit',
    cancel: 'Cancel',
    loading: 'Loading...',
    noResults: 'No results found',
    afghani: 'AFN',
  },
};

const LanguageContext = createContext<LanguageContextType | undefined>(undefined);

export function LanguageProvider({ children }: { children: ReactNode }) {
  const [language, setLanguageState] = useState<Language>(() => {
    const saved = localStorage.getItem('language');
    return (saved as Language) || 'fa';
  });

  const setLanguage = (lang: Language) => {
    setLanguageState(lang);
    localStorage.setItem('language', lang);
    
    const html = document.documentElement;
    html.lang = lang;
    html.dir = lang === 'en' ? 'ltr' : 'rtl';
  };

  useEffect(() => {
    const html = document.documentElement;
    html.lang = language;
    html.dir = language === 'en' ? 'ltr' : 'rtl';
  }, [language]);

  const t = (key: string) => {
    return translations[language][key as keyof typeof translations['fa']] || key;
  };

  const dir = language === 'en' ? 'ltr' : 'rtl';

  return (
    <LanguageContext.Provider value={{ language, setLanguage, t, dir }}>
      {children}
    </LanguageContext.Provider>
  );
}

export function useLanguage() {
  const context = useContext(LanguageContext);
  if (!context) {
    throw new Error('useLanguage must be used within LanguageProvider');
  }
  return context;
}
