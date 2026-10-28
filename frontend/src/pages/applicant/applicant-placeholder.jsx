import { motion } from 'framer-motion';

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { fadeUpItem, staggerContainer } from '@/lib/motion';

/**
 * Placeholder page for applicant routes.
 * Renders a premium empty-state card in the existing red/black theme.
 * Will be replaced with real feature pages later.
 */
export function ApplicantPlaceholder({ title, description }) {
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
          <p className="mt-1 text-sm text-muted-foreground">{description}</p>
        )}
      </motion.div>

      <motion.div variants={fadeUpItem}>
        <Card className="border-border bg-card">
          <CardHeader>
            <CardTitle>{title}</CardTitle>
            <CardDescription>
              This section is coming soon. The full experience will be
              available shortly.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="flex h-64 items-center justify-center rounded-lg border border-dashed border-border text-sm text-muted-foreground">
              Coming soon
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}
