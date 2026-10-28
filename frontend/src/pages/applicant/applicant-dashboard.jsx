import { motion } from 'framer-motion';

import { ApplicantHeader } from '@/components/applicant/applicant-header';
import { ApplicantStats } from '@/components/applicant/applicant-stats';
import { RecentApplicationsTable } from '@/components/applicant/recent-applications-table';
import { RecommendedJobs } from '@/components/applicant/recommended-jobs';
import { ResumeProgress } from '@/components/applicant/resume-progress';
import { ResumeSuggestions } from '@/components/applicant/resume-suggestions';
import { UpcomingInterviews } from '@/components/applicant/upcoming-interviews';
import { staggerContainer } from '@/lib/motion';

/**
 * Applicant Dashboard page.
 * Composes stats, resume progress, applications, recommended jobs,
 * resume suggestions, and upcoming interviews.
 */
export function ApplicantDashboard() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <ApplicantHeader />
      <ApplicantStats />

      {/* Resume Progress + Upcoming Interviews */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        <div className="lg:col-span-1">
          <ResumeProgress />
        </div>
        <div className="lg:col-span-2">
          <UpcomingInterviews />
        </div>
      </div>

      {/* Recent Applications */}
      <RecentApplicationsTable />

      {/* Recommended Jobs */}
      <RecommendedJobs />

      {/* Resume Suggestions */}
      <ResumeSuggestions />
    </motion.div>
  );
}
