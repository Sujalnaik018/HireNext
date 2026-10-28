import { Check, Circle } from 'lucide-react';

import { cn } from '@/lib/utils';

/**
 * Checklist of resume sections with a check/circle indicator.
 * `sections` is an array of { id, label, complete }.
 */
export function ResumeSectionStatus({ sections }) {
  return (
    <ul className="space-y-2">
      {sections.map((section) => (
        <li key={section.id} className="flex items-center gap-2.5">
          {section.complete ? (
            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-brand-red text-white">
              <Check className="h-3 w-3" />
            </span>
          ) : (
            <span className="flex h-5 w-5 items-center justify-center rounded-full border border-border text-muted-foreground">
              <Circle className="h-2.5 w-2.5" />
            </span>
          )}
          <span
            className={cn(
              'text-sm',
              section.complete ? 'text-foreground' : 'text-muted-foreground'
            )}
          >
            {section.label}
          </span>
        </li>
      ))}
</ul>
  );
}
