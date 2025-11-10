import { useTranslation } from 'react-i18next';
import { Link, useNavigate } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Globe, BotMessageSquare, LayoutDashboard, LogOut } from 'lucide-react';
import { useAuth } from '@/hooks/use-auth';

export function Header() {
  const { t, i18n } = useTranslation();
  const { user, signOut } = useAuth();
  const navigate = useNavigate();
  const currentLang = i18n.language;

  const toggleLanguage = () => {
    const newLang = currentLang === 'en' ? 'ar' : 'en';
    i18n.changeLanguage(newLang);
  };

  const handleSignOut = () => {
    signOut();
    navigate('/');
  };

  const navLinks = [
    { href: '#features', label: t('nav.features') },
    { href: '#pricing', label: t('nav.pricing') },
    { href: '#testimonials', label: t('nav.testimonials') },
  ];

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border/40 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-14 max-w-screen-2xl items-center">
        <div className="mr-4 hidden md:flex">
          <Link to="/" className="mr-6 flex items-center space-x-2 rtl:space-x-reverse">
            <BotMessageSquare className="h-6 w-6" />
            <span className="hidden font-bold sm:inline-block">Marketing AI</span>
          </Link>
          <nav className="flex items-center gap-6 text-sm">
            {navLinks.map((link) => (
              <a key={link.href} href={link.href} className="transition-colors hover:text-foreground/80 text-foreground/60">
                {link.label}
              </a>
            ))}
          </nav>
        </div>
        <div className="flex flex-1 items-center justify-between space-x-2 md:justify-end rtl:space-x-reverse">
          <Button variant="ghost" size="icon" onClick={toggleLanguage}>
            <Globe className="h-5 w-5" />
            <span className="sr-only">Toggle language</span>
          </Button>
          <nav className="flex items-center gap-2">
            {user ? (
              <>
                <Button variant="outline" size="sm" asChild>
                  <Link to="/dashboard">
                    <LayoutDashboard className="me-2 h-4 w-4" />
                    Dashboard
                  </Link>
                </Button>
                <Button variant="ghost" size="sm" onClick={handleSignOut}>
                  <LogOut className="me-2 h-4 w-4" />
                  {t('nav.login')}
                </Button>
              </>
            ) : (
              <>
                <Button variant="ghost" asChild>
                  <Link to="/login">{t('nav.login')}</Link>
                </Button>
                <Button asChild>
                  <Link to="/signup">{t('nav.signup')}</Link>
                </Button>
              </>
            )}
          </nav>
        </div>
      </div>
    </header>
  );
}
