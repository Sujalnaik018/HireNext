import { motion } from 'framer-motion';
import { LayoutTemplate } from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { fadeUpItem, staggerContainer } from '@/lib/motion';

import { TemplatesPage } from '@/pages/templates/templates-page';

/**
 * Dashboard placeholder.
 *
 * The Templates route previously displayed this placeholder.
 * When the route requests "Templates", render the real
 * resume template selection page instead.
 */
export function DashboardPlaceholder({ title, description }) {
  /*
   * If the dashboard route is "Templates",
   * render the real TemplatesPage.
   */
  if (title?.toLowerCase() === 'templates') {
    return <TemplatesPage />;
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <motion.div variants={fadeUpItem}>
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          {title}
        </h1>

        {description && (
          <p className="mt-1 text-sm text-muted-foreground">
            {description}
          </p>
        )}
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <Card className="border-border bg-card">
          <CardContent className="flex min-h-[300px] items-center justify-center">
            <div className="text-center">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10 text-brand-red">
                <LayoutTemplate className="h-6 w-6" />
              </div>

              <h2 className="mt-4 text-lg font-semibold text-foreground">
                {title}
              </h2>

              <p className="mt-2 text-sm text-muted-foreground">
                This section is under construction.
              </p>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}