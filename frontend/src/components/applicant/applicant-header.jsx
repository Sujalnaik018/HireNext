import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { applicantInfo } from '@/data/applicant';
import { fadeUpItem } from '@/lib/motion';

/**
 * Applicant dashboard header.
 * Greets the applicant and shows a quick CTA.
 */
export function ApplicantHeader() {
  const initials = applicantInfo.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      variants={fadeUpItem}
      className="flex flex-wrap items-center justify-between gap-4"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-12 w-12 border border-border">
          <AvatarFallback className="bg-brand-red/15 text-sm font-semibold text-brand-red">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Welcome back, {applicantInfo.firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Track your career progress
          </p>
        </div>
      </div>

      <div className="flex items-center gap-2 rounded-full border border-brand-red/30 bg-brand-red/10 px-3 py-1.5 text-xs font-medium text-brand-red">
        <Sparkles className="h-3.5 w-3.5" />
        AI-powered career insights
      </div>
    </motion.div>
  );
}
