import { Link } from 'react-router-dom';
import { Menu, Plus } from 'lucide-react';

import { NotificationBell } from '@/components/shared/notification-bell';
import { SearchInput } from '@/components/shared/search-input';
import { UserMenu } from '@/components/shared/user-menu';
import { Button } from '@/components/ui/button';

/**
 * Top navbar for the dashboard shell.
 * Contains: mobile menu toggle, search bar, notifications, profile, + New Job.
 * Accepts an optional `user` config to render the correct profile identity.
 */
export function DashboardNavbar({ onMenuClick, user }) {
  return (
    <header className="sticky top-0 z-30 flex h-16 shrink-0 items-center gap-4 border-b border-border bg-background/80 px-4 backdrop-blur-md sm:px-6">
      {/* Mobile menu toggle */}
      <Button
        variant="ghost"
        size="icon"
        className="lg:hidden"
        onClick={onMenuClick}
        aria-label="Toggle menu"
      >
        <Menu className="h-5 w-5" />
      </Button>

      {/* Search bar */}
      <div className="flex-1">
        <SearchInput
          placeholder="Search candidates, jobs, resumes..."
          className="max-w-md"
        />
      </div>

      {/* Right actions */}
      <div className="flex items-center gap-2">
        <Button asChild className="hidden sm:inline-flex">
          <Link to="/dashboard/jobs/new">
            <Plus className="h-4 w-4" />
            New Job
          </Link>
</Button>

        <NotificationBell count={3} />
        <UserMenu user={user} />
      </div>
    </header>
  );
}
