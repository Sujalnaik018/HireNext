import { Link, NavLink, useLocation } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  FileText,
  LayoutDashboard,
  LayoutTemplate,
  LogOut,
  Settings,
  Sparkles,
  Star,
  User,
  Users,
} from 'lucide-react';

import { Logo } from '@/components/shared/logo';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

const iconMap = {
  LayoutDashboard,
  Briefcase,
  FileText,
  Users,
  Star,
  CalendarDays,
  BarChart3,
  LayoutTemplate,
  Settings,
  LogOut,
  Sparkles,
  User,
};

function NavItem({ item, onNavigate }) {
  const Icon = iconMap[item.icon] || LayoutDashboard;
  const isLogout = item.path === '/logout';

  return (
    <NavLink
      to={item.path}
      onClick={onNavigate}
      end={
        item.path === '/dashboard' ||
        item.path === '/applicant/dashboard' ||
        item.path === '/resume-builder' ||
        item.path === '/resume-templates'
      }
      className={({ isActive }) =>
        cn(
          'sidebar-link group',
          isActive && 'sidebar-link-active'
        )
      }
    >
      {({ isActive }) => (
        <>
          <Icon
            className={cn(
              'h-4 w-4 shrink-0 transition-colors',
              isActive
                ? 'text-brand-red'
                : 'text-muted-foreground group-hover:text-foreground'
            )}
          />
          <span className="flex-1">{item.label}</span>
          {isActive && (
            <motion.span
              layoutId="sidebar-active-indicator"
              className="absolute right-0 h-5 w-1 rounded-l bg-brand-red"
            />
          )}
        </>
      )}
    </NavLink>
  );
}

function SidebarContent({ onNavigate }) {
  const { pathname } = useLocation();
  const isApplicant = pathname.startsWith('/applicant');
  const { main, bottom } = isApplicant
    ? siteConfig.applicant.nav
    : siteConfig.recruiter.nav;

  return (
    <div className="flex h-full flex-col">
      {/* Brand */}
      <div className="flex h-16 shrink-0 items-center border-b border-border px-6">
        <Logo />
      </div>

      <ScrollArea className="flex-1">
        <nav className="relative flex flex-col gap-1 p-3">
          {main.map((item) => (
            <NavItem key={item.path} item={item} onNavigate={onNavigate} />
          ))}
        </nav>
      </ScrollArea>

      <Separator className="my-2" />

      <div className="p-3 pt-0">
        {bottom.map((item) => (
          <NavItem key={item.path} item={item} onNavigate={onNavigate} />
        ))}
      </div>
    </div>
  );
}

/**
 * Premium dashboard sidebar (#111111).
 * Responsive: hidden on mobile (drawer is used instead via AppShell).
 */
export function Sidebar() {
  return (
    <aside className="hidden w-64 shrink-0 border-r border-border bg-sidebar lg:block">
      <SidebarContent />
    </aside>
  );
}

/**
 * Mobile drawer sidebar using the Sheet component.
 */
export function MobileSidebar({ open, onClose }) {
  return (
    <div
      className={cn(
        'fixed inset-0 z-50 lg:hidden',
        open ? 'pointer-events-auto' : 'pointer-events-none'
      )}
    >
      {/* Backdrop */}
      <div
        className={cn(
          'absolute inset-0 bg-black/70 transition-opacity duration-200',
          open ? 'opacity-100' : 'opacity-0'
        )}
        onClick={onClose}
      />
      {/* Panel */}
      <motion.aside
        initial={{ x: '-100%' }}
        animate={{ x: open ? 0 : '-100%' }}
        transition={{ type: 'tween', duration: 0.28, ease: 'easeOut' }}
        className="absolute inset-y-0 left-0 w-72 max-w-[80vw] bg-sidebar shadow-2xl"
      >
        <SidebarContent onNavigate={onClose} />
      </motion.aside>
    </div>
  );
}

export { SidebarContent };
