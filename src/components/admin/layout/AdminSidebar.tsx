import React from 'react';
import { useTranslation } from 'react-i18next';
import { NavLink, Link } from 'react-router-dom';
import { BotMessageSquare, Home, Users, FileText, CreditCard, Cpu, Settings, FileEdit, TicketPercent, Lightbulb } from 'lucide-react';
import { cn } from '@/lib/utils';

const navItems = [
  { to: '/admin', icon: Home, label: 'dashboard' },
  { to: '/admin/users', icon: Users, label: 'users' },
  { to: '/admin/content', icon: FileText, label: 'content' },
  { to: '/admin/strategies', icon: Lightbulb, label: 'Strategies' }, // New Item
  { to: '/admin/billing', icon: CreditCard, label: 'billing' },
  { to: '/admin/marketing', icon: TicketPercent, label: 'marketing' },
  { to: '/admin/ai-settings', icon: Cpu, label: 'ai_settings' },
  { to: '/admin/system', icon: Settings, label: 'system' },
  { to: '/admin/site-content', icon: FileEdit, label: 'site_content' },
];

export const AdminSidebar: React.FC = () => {
  const { t } = useTranslation('translation', { keyPrefix: 'admin' });

  return (
    <div className="hidden border-e bg-muted/40 md:block">
      <div className="flex h-full max-h-screen flex-col gap-2">
        <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
          <Link to="/" className="flex items-center gap-2 font-semibold">
            <BotMessageSquare className="h-6 w-6" />
            <span>Marketing AI</span>
          </Link>
        </div>
        <div className="flex-1">
          <nav className="grid items-start px-2 text-sm font-medium lg:px-4">
            {navItems.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/admin'}
                className={({ isActive }) =>
                  cn(
                    'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
                    isActive && 'bg-muted text-primary'
                  )
                }
              >
                <item.icon className="h-4 w-4" />
                {item.label === 'Strategies' ? 'Strategies' : t(item.label)}
              </NavLink>
            ))}
          </nav>
        </div>
      </div>
    </div>
  );
};
