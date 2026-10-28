import { motion } from 'framer-motion';

import { fadeUpItem } from '@/lib/motion';

/**
 * Consistent section header for dashboard cards.
 */
export function SectionHeader({ title, description, action }) {
  return (
    <motion.div
      variants={fadeUpItem}
      className="flex flex-wrap items-center justify-between gap-2"
    >
      <div>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          {title}
        </h2>
        {description && (
          <p className="mt-0.5 text-xs text-muted-foreground">{description}</p>
        )}
      </div>
      {action}
    </motion.div>
  );
}
