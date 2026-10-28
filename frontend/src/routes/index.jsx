import { createBrowserRouter } from 'react-router-dom';

import { AppShell } from '@/components/layout/app-shell';
import { PageTransition } from '@/components/layout/page-transition';
import { RootLayout } from '@/components/layout/root-layout';

import { applicantUser } from '@/data/applicant-dashboard';

// --------------------------------------------------
// Applicant pages
// --------------------------------------------------
import { ApplicantDashboard } from '@/pages/applicant/applicant-dashboard';
import { ApplicantPlaceholder } from '@/pages/applicant/applicant-placeholder';
import { AIResumeAssistantPage } from '@/pages/applicant/ai-resume-assistant-page';
import { ApplicantDashboardPage } from '@/pages/applicant-dashboard/applicant-dashboard-page';

// --------------------------------------------------
// Recruiter dashboard pages
// --------------------------------------------------
import { DashboardPage } from '@/pages/dashboard/dashboard-page';
import { DashboardPlaceholder } from '@/pages/dashboard/dashboard-placeholder';
import { JobsPage } from '@/pages/dashboard/jobs-page';
import { ResumesPage } from '@/pages/dashboard/resumes-page';
import { CandidatesPage } from '@/pages/dashboard/CandidatesPage';
import { ShortlistedPage } from '@/pages/dashboard/shortlisted-page';
import { InterviewsPage } from '@/pages/dashboard/interviews-page';
import { AnalyticsPage } from '@/pages/dashboard/analytics-page';

// --------------------------------------------------
// Other pages
// --------------------------------------------------
import { HomePage } from '@/pages/home/home-page';
import { ResumeBuilderPage } from '@/pages/resume-builder/resume-builder-page';
import { ResumeExportPage } from '@/pages/resume-export/resume-export-page';
import { TemplatesPage } from '@/pages/templates/templates-page';

/**
 * Application route tree.
 *
 * All pages are wrapped with PageTransition so
 * Framer Motion page transitions continue to work.
 */
export const router = createBrowserRouter([
  // ==================================================
  // HOME
  // ==================================================
  {
    path: '/',
    element: <RootLayout />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <HomePage />
          </PageTransition>
        ),
      },
    ],
  },

  // ==================================================
  // APPLICANT DASHBOARD
  // ==================================================
  {
    path: '/applicant',
    element: <AppShell user={applicantUser} />,
    children: [
      // /applicant
      {
        index: true,
        element: (
          <PageTransition>
            <ApplicantDashboard />
          </PageTransition>
        ),
      },

      // /applicant/dashboard
      {
        path: 'dashboard',
        element: (
          <PageTransition>
            <ApplicantDashboardPage />
          </PageTransition>
        ),
      },

      // /applicant/jobs
      {
        path: 'jobs',
        element: (
          <PageTransition>
            <ApplicantPlaceholder
              title="Find Jobs"
              description="Discover AI-matched job openings tailored to your profile."
            />
          </PageTransition>
        ),
      },

      // /applicant/applications
      {
        path: 'applications',
        element: (
          <PageTransition>
            <ApplicantPlaceholder
              title="My Applications"
              description="Track the status of all your job applications."
            />
          </PageTransition>
        ),
      },

      // /applicant/ai-resume-assistant
      {
        path: 'ai-resume-assistant',
        element: (
          <PageTransition>
            <AIResumeAssistantPage />
          </PageTransition>
        ),
      },

      // /applicant/interviews
      {
        path: 'interviews',
        element: (
          <PageTransition>
            <ApplicantPlaceholder
              title="Interviews"
              description="View and manage your upcoming interview rounds."
            />
          </PageTransition>
        ),
      },

      // /applicant/settings
      {
        path: 'settings',
        element: (
          <PageTransition>
            <ApplicantPlaceholder
              title="Settings"
              description="Manage your account and application preferences."
            />
          </PageTransition>
        ),
      },
    ],
  },

  // ==================================================
  // RESUME TEMPLATES
  // ==================================================
  {
    path: '/resume-templates',
    element: <AppShell user={applicantUser} />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <TemplatesPage />
          </PageTransition>
        ),
      },
    ],
  },

  // ==================================================
  // AI RESUME BUILDER
  // ==================================================
  {
    path: '/resume-builder',
    element: <AppShell user={applicantUser} />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <ResumeBuilderPage />
          </PageTransition>
        ),
      },
    ],
  },

  // ==================================================
  // TEMPLATES
  // ==================================================
  {
    path: '/templates',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <TemplatesPage />
          </PageTransition>
        ),
      },
    ],
  },

  // ==================================================
  // RESUME EXPORT
  // ==================================================
  {
    path: '/resume-export',
    element: <AppShell />,
    children: [
      {
        index: true,
        element: (
          <PageTransition>
            <ResumeExportPage />
          </PageTransition>
        ),
      },
    ],
  },

  // ==================================================
  // RECRUITER DASHBOARD
  // ==================================================
  {
    path: '/dashboard',
    element: <AppShell />,
    children: [
      // ------------------------------------------------
      // Dashboard
      // /dashboard
      // ------------------------------------------------
      {
        index: true,
        element: (
          <PageTransition>
            <DashboardPage />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Jobs
      // /dashboard/jobs
      // ------------------------------------------------
      {
        path: 'jobs',
        element: (
          <PageTransition>
            <JobsPage />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Resumes
      // /dashboard/resumes
      // ------------------------------------------------
      {
        path: 'resumes',
        element: (
          <PageTransition>
            <ResumesPage />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Candidates
      // /dashboard/candidates
      // ------------------------------------------------
      {
        path: 'candidates',
        element: (
          <PageTransition>
            <CandidatesPage />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Shortlisted
      // /dashboard/shortlisted
      // ------------------------------------------------
      {
        path: 'shortlisted',
        element: (
          <PageTransition>
            <ShortlistedPage />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Interviews
      // /dashboard/interviews
      // ------------------------------------------------
      {
        path: 'interviews',
        element: (
          <PageTransition>
            <InterviewsPage />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Analytics
      // /dashboard/analytics
      // ------------------------------------------------
      {
        path: 'analytics',
        element: (
          <PageTransition>
            <AnalyticsPage />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Templates
      // /dashboard/templates
      // ------------------------------------------------
      {
        path: 'templates',
        element: (
          <PageTransition>
            <DashboardPlaceholder
              title="Templates"
              description="Job description templates."
            />
          </PageTransition>
        ),
      },

      // ------------------------------------------------
      // Settings
      // /dashboard/settings
      // ------------------------------------------------
      {
        path: 'settings',
        element: (
          <PageTransition>
            <DashboardPlaceholder
              title="Settings"
              description="Account and workspace settings."
            />
          </PageTransition>
        ),
      },
    ],
  },
]);