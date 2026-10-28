import { useState } from 'react';
import { Outlet } from 'react-router-dom';

import { DashboardNavbar } from '@/components/layout/dashboard-navbar';
import { MobileSidebar, Sidebar } from '@/components/layout/sidebar';

/**
 * Reusable application shell for the dashboard.
 * Layout: Left Sidebar + Top Navbar + Main Content Area.
 * Responsive: sidebar becomes a slide-in drawer on mobile.
 * Accepts an optional `user` config passed to the navbar for the profile identity.
 */
export function AppShell({ user }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-background">
      {/* Desktop sidebar */}
      <Sidebar />

      {/* Mobile drawer sidebar */}
      <MobileSidebar open={sidebarOpen} onClose={() => setSidebarOpen(false)} />

<div className="flex min-w-0 flex-1 flex-col">
        <DashboardNavbar onMenuClick={() => setSidebarOpen(true)} user={user} />

        <main className="flex-1 overflow-y-auto">
          <div className="mx-auto w-full max-w-7xl p-4 sm:p-6 lg:p-8">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
