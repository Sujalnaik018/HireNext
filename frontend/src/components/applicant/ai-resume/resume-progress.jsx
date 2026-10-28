import { motion } from 'framer-motion';

import { ResumeSectionStatus } from '@/components/applicant/ai-resume/resume-section-status';
import { Card, CardContent, CardHeader } from '@/components/ui/card';

/**
 * Right panel — Resume Progress card.
 * Shows overall completion percentage, a progress bar, and the section
 * checklist that updates as the applicant answers in the chat.
 */
export function ResumeProgress({ progress, sections }) {
  return (
    <Card className="border-border bg-card">
      <CardHeader>
        <h2 className="text-base font-semibold tracking-tight text-foreground">
          Resume Completion
        </h2>
        <p className="mt-0.5 text-xs text-muted-foreground">
          Your resume builds live as you chat
        </p>
      </CardHeader>
      <CardContent className="space-y-5">
        {/* Progress bar */}
        <div>
          <div className="mb-1.5 flex items-center justify-between text-sm">
            <span className="text-muted-foreground">Resume Progress</span>
            <span className="font-semibold text-brand-red">{progress}%</span>
          </div>
          <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
            <motion.div
              className="h-full rounded-full bg-brand-red"
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>
        </div>

        {/* Section checklist */}
        <ResumeSectionStatus sections={sections} />
      </CardContent>
</Card>
  );
}
