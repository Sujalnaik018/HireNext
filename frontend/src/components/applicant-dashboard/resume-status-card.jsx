import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { CalendarClock, FileText, Gauge, Pencil, Eye } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { resumeStatus } from '@/data/applicant-dashboard';
import { fadeUpItem } from '@/lib/motion';

/**
 * Resume Status card.
 * Shows completion percentage, current template name, last updated date,
 * and an ATS score placeholder. Buttons route to Resume Builder / Export.
 */
export function ResumeStatusCard() {
  const navigate = useNavigate();

  const radius = 48;
  const circumference = 2 * Math.PI * radius;
  const offset =
    circumference - (resumeStatus.completion / 100) * circumference;

  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full border-border bg-card">
        <CardHeader>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            Resume Status
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your profile &amp; resume health at a glance
          </p>
        </CardHeader>

        <CardContent className="space-y-5">
          {/* Completion ring */}
          <div className="flex items-center gap-5">
            <div className="relative h-28 w-28 shrink-0">
              <svg className="h-full w-full -rotate-90" viewBox="0 0 120 120">
                <circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#2C2C2C"
                  strokeWidth="9"
                />
                <motion.circle
                  cx="60"
                  cy="60"
                  r={radius}
                  fill="none"
                  stroke="#E50914"
                  strokeWidth="9"
                  strokeLinecap="round"
                  strokeDasharray={circumference}
                  initial={{ strokeDashoffset: circumference }}
                  animate={{ strokeDashoffset: offset }}
                  transition={{ duration: 1.2, ease: 'easeOut' }}
                />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                <span className="text-xl font-semibold text-foreground">
                  {resumeStatus.completion}%
                </span>
                <span className="text-[11px] text-muted-foreground">complete</span>
              </div>
            </div>

            <div className="min-w-0 flex-1 space-y-2 text-sm">
              <div className="flex items-center gap-2">
                <FileText className="h-3.5 w-3.5 text-brand-red" />
                <span className="text-xs text-muted-foreground">Template</span>
              </div>
              <p className="font-medium text-foreground">
                {resumeStatus.templateName}
              </p>

              <div className="mt-2 flex items-center gap-2">
                <CalendarClock className="h-3.5 w-3.5 text-muted-foreground" />
                <span className="text-xs text-muted-foreground">Updated</span>
              </div>
              <p className="text-sm text-muted-foreground">
                {resumeStatus.lastUpdated}
              </p>
            </div>
          </div>

          {/* ATS score placeholder */}
          <div className="flex items-center justify-between rounded-lg border border-border bg-muted/30 px-4 py-3">
            <div className="flex items-center gap-2">
              <Gauge className="h-4 w-4 text-brand-red" />
              <span className="text-sm text-foreground">ATS Score</span>
            </div>
            <div className="flex items-center gap-2">
              <span className="text-lg font-semibold text-brand-red">
                {resumeStatus.atsScore}
              </span>
              <span className="text-xs text-muted-foreground">/ 100</span>
            </div>
          </div>

          {/* Actions */}
          <div className="grid grid-cols-2 gap-3">
            <Button
              variant="outline"
              size="sm"
              onClick={() => navigate('/resume-builder')}
            >
              <Pencil className="h-4 w-4" />
              Edit Resume
            </Button>
            <Button
              size="sm"
              className="bg-brand-red text-white hover:bg-brand-red-dark"
              onClick={() => navigate('/resume-export')}
            >
              <Eye className="h-4 w-4" />
              View Resume
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
