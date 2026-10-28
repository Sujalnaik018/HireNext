import { Search } from 'lucide-react';

import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';

/**
 * Reusable search input with a leading search icon.
 * Used in the dashboard navbar.
 */
export function SearchInput({ className, placeholder = 'Search...', ...props }) {
  return (
    <div className={cn('relative w-full', className)}>
      <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        type="search"
        placeholder={placeholder}
        className="h-9 w-full bg-accent/40 pl-9 shadow-none focus-visible:bg-accent/60"
        {...props}
      />
    </div>
  );
}
