import { useTranslation } from 'react-i18next';
import { BotMessageSquare } from 'lucide-react';

export function Footer() {
  const { t } = useTranslation();

  return (
    <footer className="border-t">
      <div className="container mx-auto max-w-screen-2xl px-4 py-8 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
          <div>
            <div className="flex items-center space-x-2 rtl:space-x-reverse">
              <BotMessageSquare className="h-6 w-6" />
              <span className="font-bold">Marketing AI</span>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">{t('hero.subtitle')}</p>
          </div>
          <div className="grid grid-cols-2 gap-8 lg:col-span-2 lg:grid-cols-4">
            <div>
              <p className="font-medium">{t('footer.product')}</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                <a href="#features" className="hover:text-foreground">{t('nav.features')}</a>
                <a href="#pricing" className="hover:text-foreground">{t('nav.pricing')}</a>
              </nav>
            </div>
            <div>
              <p className="font-medium">{t('footer.company')}</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground">{t('footer.about')}</a>
                <a href="#" className="hover:text-foreground">{t('footer.contact')}</a>
              </nav>
            </div>
            <div>
              <p className="font-medium">{t('footer.legal')}</p>
              <nav className="mt-4 flex flex-col space-y-2 text-sm text-muted-foreground">
                <a href="#" className="hover:text-foreground">{t('footer.privacy')}</a>
                <a href="#" className="hover:text-foreground">{t('footer.terms')}</a>
              </nav>
            </div>
          </div>
        </div>
        <div className="mt-8 border-t pt-8">
          <p className="text-center text-sm text-muted-foreground">{t('footer.copyright')}</p>
        </div>
      </div>
    </footer>
  );
}
