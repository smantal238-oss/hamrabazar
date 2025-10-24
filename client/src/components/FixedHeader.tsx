import { Link, useLocation } from 'wouter';
import { ArrowRight, Home, LogIn, LogOut, Moon, Sun, Globe, LayoutDashboard, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { useLanguage } from '@/contexts/LanguageContext';
import { useTheme } from '@/contexts/ThemeContext';
import { useAuth } from '@/contexts/AuthContext';

interface FixedHeaderProps {
  showBackButton?: boolean;
}

export default function FixedHeader({ showBackButton = false }: FixedHeaderProps) {
  const [location, navigate] = useLocation();
  const { language, setLanguage, t, dir } = useLanguage();
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();

  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-card/80 backdrop-blur-md border-b border-border shadow-sm">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between gap-4" style={{ direction: dir }}>
        <div className="flex items-center gap-3 order-1">
          {showBackButton && location !== '/' ? (
            <Button
              size="icon"
              variant="ghost"
              onClick={() => navigate('/')}
              data-testid="button-back"
              className="hover-elevate active-elevate-2"
            >
              <ArrowRight className={`w-5 h-5 ${dir === 'ltr' ? 'rotate-180' : ''}`} />
            </Button>
          ) : (
            <Link href="/">
              <Button
                size="icon"
                variant="ghost"
                data-testid="button-home"
                className="hover-elevate active-elevate-2"
              >
                <Home className="w-5 h-5" />
              </Button>
            </Link>
          )}
          <Link href="/">
            <h1 className="text-lg md:text-xl font-bold text-primary cursor-pointer hover-elevate px-2 py-1 rounded-md" data-testid="text-app-name">
              {t('appName')}
            </h1>
          </Link>
        </div>

        <div className="flex items-center gap-2 order-2">
          <Select value={language} onValueChange={(value) => setLanguage(value as any)}>
            <SelectTrigger className="w-[100px] md:w-[120px]" data-testid="select-language">
              <Globe className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="fa" data-testid="option-language-fa">فارسی</SelectItem>
              <SelectItem value="ps" data-testid="option-language-ps">پشتو</SelectItem>
              <SelectItem value="en" data-testid="option-language-en">English</SelectItem>
            </SelectContent>
          </Select>

          <Button
            size="icon"
            variant="ghost"
            onClick={toggleTheme}
            data-testid="button-theme-toggle"
            className="hover-elevate active-elevate-2"
          >
            {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
          </Button>

          {user ? (
            <>
              <Link href="/create-listing">
                <Button variant="default" size="sm" data-testid="button-create-listing" className="hidden md:flex font-semibold">
                  <Plus className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                  {language === 'fa' ? 'ثبت آگهی' : language === 'ps' ? 'اعلان ثبت' : 'Post Ad'}
                </Button>
              </Link>
              <Link href="/create-listing">
                <Button variant="default" size="icon" data-testid="button-create-listing-mobile" className="md:hidden">
                  <Plus className="w-5 h-5" />
                </Button>
              </Link>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" size="icon" className="rounded-full" data-testid="button-user-menu">
                    <Avatar className="w-8 h-8">
                      <AvatarFallback className="bg-primary text-primary-foreground">
                        {user.name.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align={dir === 'rtl' ? 'start' : 'end'} className="w-48">
                  <DropdownMenuItem onClick={() => navigate('/dashboard')} data-testid="menu-item-dashboard">
                    <LayoutDashboard className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {language === 'fa' ? 'آگهی‌های من' : language === 'ps' ? 'زما اعلانونه' : 'My Listings'}
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={logout} data-testid="menu-item-logout">
                    <LogOut className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                    {language === 'fa' ? 'خروج' : language === 'ps' ? 'وتل' : 'Logout'}
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          ) : (
            <>
              <Link href="/auth">
                <Button variant="default" size="default" data-testid="button-login" className="hidden md:flex px-6 font-semibold">
                  <LogIn className="w-4 h-4 ltr:mr-2 rtl:ml-2" />
                  {t('login')}
                </Button>
              </Link>
              <Link href="/auth">
                <Button variant="default" size="icon" data-testid="button-login-mobile" className="md:hidden">
                  <LogIn className="w-5 h-5" />
                </Button>
              </Link>
            </>
          )}
        </div>
      </div>
    </header>
  );
}
