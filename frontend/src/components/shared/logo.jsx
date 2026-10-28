import { Link } from 'react-router-dom';

import { cn } from '@/lib/utils';

/**
 * HireNext brand logo.
 * @param {Object} props
 * @param {boolean} props.showText - Whether to show the wordmark.
 * @param {string} props.className - Additional classes.
 */
export function Logo({ showText = true, className }) {
  return (
    <Link to="/" className={cn('flex items-center gap-2', className)}>
      <span className="flex h-8 w-8 items-center justify-center rounded-md bg-brand-red text-white shadow-lg glow-red">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.2"
          className="h-5 w-5"
          aria-hidden="true"
        >
          <path d="M12 2l2.4 7.6H22l-6.2 4.5 2.4 7.6-6.2-4.5-6.2 4.5 2.4-7.6L2 9.6h7.6z" />
          <circle cx="12" cy="12" r="2" fill="currentColor" stroke="none" />
        </svg>
      </span>
      {showText && (
        <span className="text-lg font-bold tracking-tight text-foreground">
          Hire<span className="text-brand-red">Next</span>
        </span>
      )}
    </Link>
  );
}
