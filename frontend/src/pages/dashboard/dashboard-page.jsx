import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';

import { ActivityFeed } from '@/components/dashboard/activity-feed';
import { QuickFilters } from '@/components/dashboard/quick-filters';
import { RecentJobsTable } from '@/components/dashboard/recent-jobs-table';
import { ResumeOverviewChart } from '@/components/dashboard/resume-overview-chart';
import { StatsCard } from '@/components/dashboard/stats-card';
import { TopCandidatesTable } from '@/components/dashboard/top-candidates-table';

import {
  getApplications,
  getInterviews,
  getJobs,
  getResumes,
} from '@/services/api';

import { stats as defaultStats } from '@/data/dashboard';
import {
  fadeUpItem,
  staggerContainer,
} from '@/lib/motion';

export function DashboardPage() {
  const [stats, setStats] =
    useState(defaultStats);

  const [loadingStats, setLoadingStats] =
    useState(true);

  const [filters, setFilters] =
    useState({
      job: 'All Jobs',
      experience: 'Any Experience',
      skill: 'All Skills',
    });

  useEffect(() => {
    const loadDashboardStats =
      async () => {
        try {
          setLoadingStats(true);

          const [
            jobsData,
            resumesData,
            applicationsData,
            interviewsData,
          ] = await Promise.all([
            getJobs(),
            getResumes(),
            getApplications(),
            getInterviews(),
          ]);

          const jobs =
            Array.isArray(jobsData)
              ? jobsData
              : [];

          const resumes =
            Array.isArray(
              resumesData
            )
              ? resumesData
              : [];

          const applications =
            Array.isArray(
              applicationsData
            )
              ? applicationsData
              : [];

          const interviews =
            Array.isArray(
              interviewsData
            )
              ? interviewsData
              : [];

          const shortlistedCount =
            applications.filter(
              (application) =>
                String(
                  application.status ||
                    ''
                ).toLowerCase() ===
                'shortlisted'
            ).length;

          setStats(
            (currentStats) =>
              currentStats.map(
                (stat) => {
                  if (
                    stat.id ===
                    'jobs'
                  ) {
                    return {
                      ...stat,
                      value:
                        jobs.length,
                      status:
                        'Live from database',
                      trend:
                        'neutral',
                    };
                  }

                  if (
                    stat.id ===
                    'resumes'
                  ) {
                    return {
                      ...stat,
                      value:
                        resumes.length,
                      status:
                        'Live from database',
                      trend:
                        'neutral',
                    };
                  }

                  if (
                    stat.id ===
                    'shortlisted'
                  ) {
                    return {
                      ...stat,
                      value:
                        shortlistedCount,
                      status:
                        'Live from database',
                      trend:
                        'neutral',
                    };
                  }

                  if (
                    stat.id ===
                    'interviews'
                  ) {
                    return {
                      ...stat,
                      value:
                        interviews.length,
                      status:
                        'Live from database',
                      trend:
                        'neutral',
                    };
                  }

                  return stat;
                }
              )
          );
        } catch (error) {
          console.error(
            'Failed to load dashboard statistics:',
            error
          );
        } finally {
          setLoadingStats(false);
        }
      };

    loadDashboardStats();
  }, []);

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* Header */}

      <motion.div
        variants={fadeUpItem}
      >
        <h1 className="text-2xl font-semibold tracking-tight text-foreground">
          Dashboard
        </h1>

        <p className="mt-1 text-sm text-muted-foreground">
          Overview of your recruitment activity
        </p>
      </motion.div>

      {/* Statistics */}

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        {stats.map(
          (stat, index) => (
            <StatsCard
              key={stat.id}
              stat={{
                ...stat,
                status:
                  loadingStats
                    ? 'Loading...'
                    : stat.status,
              }}
              index={index}
            />
          )
        )}
      </motion.div>

      {/* Quick Filters */}

      <QuickFilters
        onApply={setFilters}
      />

      {/* Jobs + Candidates */}

      <div className="grid grid-cols-1 gap-6 2xl:grid-cols-2">
        <RecentJobsTable
          filters={filters}
        />

        <TopCandidatesTable
          filters={filters}
        />
      </div>

      {/* Resume Overview + Activity */}

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        <ResumeOverviewChart />

        <ActivityFeed />
      </div>
    </motion.div>
  );
}