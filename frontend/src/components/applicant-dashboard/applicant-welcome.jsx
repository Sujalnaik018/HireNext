import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { applicantProfile } from '@/data/applicant-dashboard';
import { fadeUpItem } from '@/lib/motion';

/**
 * Welcome section for the Applicant Dashboard.
 * Greets the applicant and provides a prominent "AI Resume Assistant" CTA
 * that routes to the existing Resume Builder.
 */
export function ApplicantWelcome() {
  const navigate = useNavigate();

  const initials = applicantProfile.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <motion.div
      variants={fadeUpItem}
      className="flex flex-col gap-5 sm:flex-row sm:items-center sm:justify-between"
    >
      <div className="flex items-center gap-4">
        <Avatar className="h-14 w-14 border border-border">
          <AvatarFallback className="bg-brand-red/15 text-base font-semibold text-brand-red">
            {initials}
          </AvatarFallback>
        </Avatar>
        <div>
          <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
            Welcome back, {applicantProfile.firstName}
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage your resume, applications and job search from one place.
          </p>
        </div>
      </div>

      <Button
        size="lg"
        className="bg-brand-red text-white hover:bg-brand-red-dark"
        onClick={() => navigate('/resume-builder')}
      >
        <Sparkles className="h-4 w-4" />
        AI Resume Assistant
      </Button>
    </motion.div>
  );
}
