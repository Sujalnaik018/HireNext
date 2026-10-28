import { motion } from 'framer-motion';
import { Award, PenLine, Sparkles, Target } from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { resumeSuggestions } from '@/data/applicant';
import { fadeUpItem } from '@/lib/motion';

const iconMap = {
  Sparkles,
  PenLine,
  Award,
  Target,
};

/**
 * Resume Suggestions card.
 * AI-powered suggestions to improve the applicant's resume.
 */
export function ResumeSuggestions() {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full border-border bg-card">
        <CardHeader>
          <h2 className="text-base font-semibold tracking-tight">Resume Suggestions</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            AI-powered tips to improve your resume
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {resumeSuggestions.map((suggestion) => {
            const Icon = iconMap[suggestion.icon] || Sparkles;

            return (
              <motion.div
                key={suggestion.id}
                variants={fadeUpItem}
                whileHover={{ x: 4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="flex gap-3 rounded-lg border border-border bg-background/40 p-3 transition-colors hover:border-brand-red/40"
              >
                <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                  <Icon className="h-4 w-4" />
                </div>
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {suggestion.title}
                  </p>
                  <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                    {suggestion.description}
                  </p>
                </div>
              </motion.div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
