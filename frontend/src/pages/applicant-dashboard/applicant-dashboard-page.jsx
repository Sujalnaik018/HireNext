import { motion } from 'framer-motion';

import { AIResumeAssistant } from '@/components/applicant-dashboard/ai-resume-assistant';
import { ApplicantWelcome } from '@/components/applicant-dashboard/applicant-welcome';
import { ApplicationsTable } from '@/components/applicant-dashboard/applications-table';
import { QuickActions } from '@/components/applicant-dashboard/quick-actions';
import { RecommendedJobs } from '@/components/applicant-dashboard/recommended-jobs';
import { ResumeStatusCard } from '@/components/applicant-dashboard/resume-status-card';
import { UpcomingInterviews } from '@/components/applicant-dashboard/upcoming-interviews';
import { staggerContainer } from '@/lib/motion';

/**
 * Applicant Dashboard page (/applicant/dashboard).
 * Composes the welcome header, AI assistant, resume status, recommended jobs,
 * applications table, upcoming interviews, and quick actions.
 */
export function ApplicantDashboardPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Welcome */}
      <ApplicantWelcome />

      {/* AI Resume Assistant */}
      <AIResumeAssistant />

      {/* Resume status + upcoming interviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ResumeStatusCard />
        </div>
        <div className="lg:col-span-2">
          <UpcomingInterviews />
        </div>
      </div>

      {/* My Applications */}
      <ApplicationsTable />

      {/* Recommended Jobs */}
      <RecommendedJobs />

      {/* Quick Actions */}
      <QuickActions />
    </motion.div>
  );
}
