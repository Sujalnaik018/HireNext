import { motion } from 'framer-motion';
import { CheckCircle2, Circle } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { resumeProgress } from '@/data/applicant';
import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Resume Progress card.
 * Circular progress bar + completion percentage + "Complete Resume" button.
 */
export function ResumeProgress() {
  const { value, sections } = resumeProgress;
  const radius = 52;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference - (value / 100) * circumference;

  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full border-border bg-card">
        <CardHeader>
          <h2 className="text-base font-semibold tracking-tight">Resume Progress</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Complete your profile to boost match rates
          </p>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center">
            {/* Circular progress */}
            <div className="relative h-32 w-32">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#2C2C2C"
                  strokeWidth="8"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#E50914"
                  strokeWidth="8"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-2xl font-semibold text-foreground">
                  {value}%
                </span>
                <span className="text-[11px] text-muted-foreground">Complete</span>
              </div>
            </div>

            {/* Section checklist */}
            <div className="mt-5 w-full space-y-2">
              {sections.map((section) => (
                <div
                  key={section.name}
                  className="flex items-center justify-between rounded-md bg-muted/30 px-3 py-2"
                >
                  <span className="text-xs text-muted-foreground">
                    {section.name}
                  </span>
                  {section.complete ? (
                    <CheckCircle2 className="h-4 w-4 text-success" />
                  ) : (
                    <Circle className="h-4 w-4 text-muted-foreground/50" />
                  )}
                </div>
              ))}
            </div>

            <Button
              className={cn(
                'mt-5 w-full bg-brand-red text-white hover:bg-brand-red-dark'
              )}
            >
              Complete Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
