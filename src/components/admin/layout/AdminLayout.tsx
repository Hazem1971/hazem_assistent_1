import React, { useState } from 'react';
import { AdminSidebar } from './AdminSidebar';
import { AdminHeader } from './AdminHeader';
import { Sheet, SheetContent } from '@/components/ui/sheet';
import { BotMessageSquare, Home, Users, FileText, CreditCard, Cpu, Settings, FileEdit } from 'lucide-react';
import { NavLink, Link } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: Home, label: 'dashboard' },
  { to: '/admin/users', icon: Users, label: 'users' },
  { to: '/admin/content', icon: FileText, label: 'content' },
  { to: '/admin/billing', icon: CreditCard, label: 'billing' },
  { to: '/admin/ai-settings', icon: Cpu, label: 'ai_settings' },
  { to: '/admin/system', icon: Settings, label: 'system' },
  { to: '/admin/site-content', icon: FileEdit, label: 'site_content' },
];

interface AdminLayoutProps {
  children: React.ReactNode;
}

export function AdminLayout({ children }: AdminLayoutProps) {
  const [isSheetOpen, setSheetOpen] = useState(false);
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <AdminSidebar />
      <div className="flex flex-col">
        <Sheet open={isSheetOpen} onOpenChange={setSheetOpen}>
          <AdminHeader onMenuClick={() => setSheetOpen(true)} />
          <SheetContent side="left" className="flex flex-col">
             <nav className="grid gap-2 text-lg font-medium">
                <Link to="/" className="flex items-center gap-2 text-lg font-semibold mb-4">
                  <BotMessageSquare className="h-6 w-6" />
                  <span>Marketing AI</span>
                </Link>
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    end={item.to === '/admin'}
                    onClick={() => setSheetOpen(false)}
                    className={({ isActive }) =>
                      cn(
                        'flex items-center gap-4 rounded-xl px-3 py-2 text-muted-foreground hover:text-foreground',
                        isActive && 'bg-muted text-foreground'
                      )
                    }
                  >
                    <item.icon className="h-5 w-5" />
                    {t(item.label)}
                  </NavLink>
                ))}
              </nav>
          </SheetContent>
        </Sheet>
        <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
