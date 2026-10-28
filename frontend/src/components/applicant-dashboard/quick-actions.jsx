import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Briefcase, FilePlus2, Send, Upload } from 'lucide-react';

import { Card } from '@/components/ui/card';
import { quickActions } from '@/data/applicant-dashboard';
import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

const iconMap = {
  FilePlus2,
  Upload,
  Briefcase,
  Send,
};

/**
 * Quick Actions grid.
 * Four shortcut buttons for common applicant tasks with Lucide icons.
 */
export function QuickActions() {
  const navigate = useNavigate();

  return (
    <motion.div variants={fadeUpItem}>
      <h2 className="mb-3 text-base font-semibold tracking-tight text-foreground">
        Quick Actions
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {quickActions.map((action) => {
          const Icon = iconMap[action.icon] || Briefcase;

          return (
            <motion.div key={action.id} variants={fadeUpItem}>
              <button
                type="button"
                onClick={() => navigate(action.to)}
                className={cn(
                  'group flex h-full w-full flex-col items-start gap-3 rounded-lg',
                  'border border-border bg-card p-4 text-left transition-all',
                  'hover:border-brand-red/40 hover:bg-background/40'
                )}
              >
                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red transition-colors group-hover:bg-brand-red/20">
                  <Icon className="h-5 w-5" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {action.label}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {action.description}
                  </p>
                </div>
              </button>
            </motion.div>
          );
        })}
      </div>
    </motion.div>
  );
}
