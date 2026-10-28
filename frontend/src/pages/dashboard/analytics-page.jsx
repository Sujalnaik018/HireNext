import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  FileText,
  Users,
  UserCheck,
  Video,
  TrendingUp,
  RefreshCw,
  BarChart3,
} from 'lucide-react';

import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';

import {
  getApplications,
  getInterviews,
  getJobs,
  getResumes,
} from '@/services/api';

import { fadeUpItem, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

function toArray(data) {
  if (Array.isArray(data)) {
    return data;
  }

  if (Array.isArray(data?.items)) {
    return data.items;
  }

  if (Array.isArray(data?.data)) {
    return data.data;
  }

  if (Array.isArray(data?.results)) {
    return data.results;
  }

  return [];
}

function getScore(application) {
  const value =
    application?.match_score ??
    application?.matchScore ??
    application?.score;

  const score = Number(value);

  return Number.isFinite(score) ? score : null;
}

function getJobId(application) {
  return (
    application?.job_id ??
    application?.job?.id ??
    null
  );
}

function getJobTitle(application, jobs) {
  const jobId = getJobId(application);

  const job = jobs.find(
    (item) => String(item?.id) === String(jobId)
  );

  return (
    application?.job_title ||
    application?.job?.title ||
    job?.title ||
    job?.name ||
    'Unknown Job'
  );
}

function isShortlisted(application) {
  return (
    String(application?.status || '').toLowerCase() ===
    'shortlisted'
  );
}

export function AnalyticsPage() {
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] = useState([]);
  const [interviews, setInterviews] = useState([]);

  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [error, setError] = useState('');

  const loadAnalytics = async (refresh = false) => {
    try {
      if (refresh) {
        setRefreshing(true);
      } else {
        setLoading(true);
      }

      setError('');

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

      setJobs(toArray(jobsData));
      setResumes(toArray(resumesData));
      setApplications(toArray(applicationsData));
      setInterviews(toArray(interviewsData));
    } catch (err) {
      console.error(
        'Failed to load analytics:',
        err
      );

      setError(
        err?.message ||
          'Unable to load analytics data.'
      );
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadAnalytics();
  }, []);

  const shortlistedCount = useMemo(
    () =>
      applications.filter(isShortlisted).length,
    [applications]
  );

  const scoredApplications = useMemo(
    () =>
      applications
        .map((application) => ({
          application,
          score: getScore(application),
        }))
        .filter((item) => item.score !== null),
    [applications]
  );

  const averageMatch = useMemo(() => {
    if (!scoredApplications.length) {
      return 0;
    }

    const total = scoredApplications.reduce(
      (sum, item) => sum + item.score,
      0
    );

    return Math.round(
      total / scoredApplications.length
    );
  }, [scoredApplications]);

  const highMatchCount = useMemo(
    () =>
      scoredApplications.filter(
        (item) => item.score >= 80
      ).length,
    [scoredApplications]
  );

  const shortlistRate =
    applications.length > 0
      ? Math.round(
          (shortlistedCount /
            applications.length) *
            100
        )
      : 0;

  const jobAnalytics = useMemo(() => {
    return jobs.map((job) => {
      const jobApplications =
        applications.filter(
          (application) =>
            String(getJobId(application)) ===
            String(job?.id)
        );

      const shortlisted =
        jobApplications.filter(
          isShortlisted
        ).length;

      const scores = jobApplications
        .map(getScore)
        .filter(
          (score) => score !== null
        );

      const averageScore =
        scores.length > 0
          ? Math.round(
              scores.reduce(
                (sum, score) =>
                  sum + score,
                0
              ) / scores.length
            )
          : 0;

      return {
        id: job?.id,
        title:
          job?.title ||
          job?.name ||
          'Untitled Job',
        status:
          job?.status ||
          job?.job_status ||
          'Unknown',
        applications:
          jobApplications.length,
        shortlisted,
        averageScore,
      };
    });
  }, [jobs, applications]);

  const scoreDistribution = useMemo(() => {
    const ranges = [
      {
        label: '90–100%',
        min: 90,
        max: 100,
      },
      {
        label: '80–89%',
        min: 80,
        max: 89,
      },
      {
        label: '70–79%',
        min: 70,
        max: 79,
      },
      {
        label: '60–69%',
        min: 60,
        max: 69,
      },
      {
        label: '<60%',
        min: 0,
        max: 59,
      },
    ];

    return ranges.map((range) => ({
      ...range,
      count: scoredApplications.filter(
        (item) =>
          item.score >= range.min &&
          item.score <= range.max
      ).length,
    }));
  }, [scoredApplications]);

  const maxApplications = Math.max(
    ...jobAnalytics.map(
      (job) => job.applications
    ),
    1
  );

  const maxScoreCount = Math.max(
    ...scoreDistribution.map(
      (item) => item.count
    ),
    1
  );

  if (loading) {
    return (
      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="space-y-6"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Analyze your recruitment performance.
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-5">
          {[1, 2, 3, 4, 5].map((item) => (
            <div
              key={item}
              className="h-32 animate-pulse rounded-xl border border-border bg-card"
            />
          ))}
        </div>

        <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
          <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
          <div className="h-80 animate-pulse rounded-xl border border-border bg-card" />
        </div>
      </motion.div>
    );
  }

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* HEADER */}
      <motion.div
        variants={fadeUpItem}
        className="flex flex-col justify-between gap-4 sm:flex-row sm:items-end"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Analytics
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Analyze your recruitment performance
            using live database data.
          </p>
        </div>

        <button
          type="button"
          onClick={() => loadAnalytics(true)}
          disabled={refreshing}
          className="inline-flex h-10 items-center justify-center gap-2 rounded-lg border border-border bg-card px-4 text-sm font-medium text-foreground transition hover:bg-accent disabled:cursor-not-allowed disabled:opacity-60"
        >
          <RefreshCw
            size={16}
            className={cn(
              refreshing && 'animate-spin'
            )}
          />

          {refreshing
            ? 'Refreshing...'
            : 'Refresh'}
        </button>
      </motion.div>

      {/* ERROR */}
      {error && (
        <motion.div
          variants={fadeUpItem}
          className="rounded-xl border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-300"
        >
          <p className="font-medium">
            Unable to load analytics
          </p>

          <p className="mt-1 opacity-80">
            {error}
          </p>
        </motion.div>
      )}

      {/* STATISTICS */}
      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5"
      >
        <AnalyticsStat
          icon={BriefcaseBusiness}
          label="Total Jobs"
          value={jobs.length}
        />

        <AnalyticsStat
          icon={FileText}
          label="Total Resumes"
          value={resumes.length}
        />

        <AnalyticsStat
          icon={Users}
          label="Applications"
          value={applications.length}
        />

        <AnalyticsStat
          icon={UserCheck}
          label="Shortlisted"
          value={shortlistedCount}
        />

        <AnalyticsStat
          icon={Video}
          label="Interviews"
          value={interviews.length}
        />
      </motion.div>

      {/* PERFORMANCE CARDS */}
      <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
        <PerformanceCard
          title="Average Match Score"
          value={`${averageMatch}%`}
          description="Average AI matching score"
          icon={TrendingUp}
        />

        <PerformanceCard
          title="Shortlist Rate"
          value={`${shortlistRate}%`}
          description="Applications reaching shortlist"
          icon={UserCheck}
        />

        <PerformanceCard
          title="High Match Candidates"
          value={highMatchCount}
          description="Candidates scoring 80% or higher"
          icon={StarIcon}
        />
      </div>

      {/* CHARTS */}
      <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
        {/* APPLICATIONS BY JOB */}
        <motion.div variants={fadeUpItem}>
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Applications by Job
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Application volume across your
                  current jobs.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {jobAnalytics.length === 0 ? (
                <EmptyState
                  icon={BarChart3}
                  text="No job data available."
                />
              ) : (
                <div className="space-y-5">
                  {jobAnalytics.map((job) => (
                    <div key={job.id}>
                      <div className="mb-2 flex items-center justify-between gap-4">
                        <div className="min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {job.title}
                          </p>

                          <p className="text-xs text-muted-foreground">
                            {job.shortlisted}{' '}
                            shortlisted
                          </p>
                        </div>

                        <span className="text-sm font-semibold text-foreground">
                          {job.applications}
                        </span>
                      </div>

                      <div className="h-2 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.max(
                              (job.applications /
                                maxApplications) *
                                100,
                              job.applications
                                ? 5
                                : 0
                            )}%`,
                          }}
                        />
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>

        {/* MATCH SCORE DISTRIBUTION */}
        <motion.div variants={fadeUpItem}>
          <Card>
            <CardHeader>
              <div>
                <h2 className="text-base font-semibold text-foreground">
                  Match Score Distribution
                </h2>

                <p className="mt-1 text-sm text-muted-foreground">
                  Candidate distribution based on
                  AI match scores.
                </p>
              </div>
            </CardHeader>

            <CardContent>
              {scoredApplications.length === 0 ? (
                <EmptyState
                  icon={BarChart3}
                  text="No match scores available."
                />
              ) : (
                <div className="space-y-5">
                  {scoreDistribution.map(
                    (item) => (
                      <div key={item.label}>
                        <div className="mb-2 flex items-center justify-between">
                          <span className="text-sm text-muted-foreground">
                            {item.label}
                          </span>

                          <span className="text-sm font-semibold text-foreground">
                            {item.count}
                          </span>
                        </div>

                        <div className="h-2 overflow-hidden rounded-full bg-muted">
                          <div
                            className="h-full rounded-full bg-primary"
                            style={{
                              width: `${
                                (item.count /
                                  maxScoreCount) *
                                100
                              }%`,
                            }}
                          />
                        </div>
                      </div>
                    )
                  )}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* JOB PERFORMANCE TABLE */}
      <motion.div variants={fadeUpItem}>
        <Card>
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Job Performance
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Compare applications, shortlisted
                candidates and match rates.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {jobAnalytics.length === 0 ? (
              <div className="p-6">
                <EmptyState
                  icon={BriefcaseBusiness}
                  text="No jobs available."
                />
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[700px]">
                  <thead>
                    <tr className="border-b border-border text-left text-xs uppercase tracking-wide text-muted-foreground">
                      <th className="px-6 py-4 font-medium">
                        Job
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Status
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Applications
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Shortlisted
                      </th>

                      <th className="px-6 py-4 font-medium">
                        Avg. Match
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {jobAnalytics.map(
                      (job) => (
                        <tr
                          key={job.id}
                          className="border-b border-border last:border-0 transition hover:bg-muted/30"
                        >
                          <td className="px-6 py-4">
                            <span className="font-medium text-foreground">
                              {job.title}
                            </span>
                          </td>

                          <td className="px-6 py-4">
                            <Badge variant="outline">
                              {String(
                                job.status
                              )}
                            </Badge>
                          </td>

                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {job.applications}
                          </td>

                          <td className="px-6 py-4 text-sm text-muted-foreground">
                            {job.shortlisted}
                          </td>

                          <td className="px-6 py-4">
                            {job.averageScore >
                            0 ? (
                              <span className="font-semibold text-primary">
                                {
                                  job.averageScore
                                }
                                %
                              </span>
                            ) : (
                              <span className="text-sm text-muted-foreground">
                                Not available
                              </span>
                            )}
                          </td>
                        </tr>
                      )
                    )}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </motion.div>

      {/* SUMMARY */}
      <motion.div variants={fadeUpItem}>
        <Card>
          <CardContent className="p-6">
            <div className="flex items-start gap-4">
              <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-primary">
                <BarChart3 size={20} />
              </div>

              <div>
                <h3 className="font-semibold text-foreground">
                  Recruitment Overview
                </h3>

                <p className="mt-1 text-sm leading-6 text-muted-foreground">
                  HireNext currently has{' '}
                  <span className="font-medium text-foreground">
                    {jobs.length}
                  </span>{' '}
                  jobs,{' '}
                  <span className="font-medium text-foreground">
                    {applications.length}
                  </span>{' '}
                  applications and{' '}
                  <span className="font-medium text-foreground">
                    {shortlistedCount}
                  </span>{' '}
                  shortlisted candidates.
                  {scoredApplications.length >
                    0 && (
                    <>
                      {' '}
                      The average AI match score
                      is{' '}
                      <span className="font-medium text-primary">
                        {averageMatch}%
                      </span>
                      .
                    </>
                  )}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

/* ==================================================
   STAT CARD
================================================== */

function AnalyticsStat({
  icon: Icon,
  label,
  value,
}) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full">
        <CardContent className="flex items-center justify-between p-5">
          <div>
            <p className="text-sm text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-2xl font-semibold text-foreground">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              Live from database
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
            <Icon size={19} />
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ==================================================
   PERFORMANCE CARD
================================================== */

function PerformanceCard({
  title,
  value,
  description,
  icon: Icon,
}) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card>
        <CardContent className="p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {title}
              </p>

              <p className="mt-2 text-2xl font-semibold text-foreground">
                {value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 text-primary">
              <Icon size={19} />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* ==================================================
   EMPTY STATE
================================================== */

function EmptyState({
  icon: Icon,
  text,
}) {
  return (
    <div className="flex min-h-[180px] flex-col items-center justify-center text-center">
      <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
        <Icon
          size={21}
          className="text-muted-foreground"
        />
      </div>

      <p className="mt-3 text-sm text-muted-foreground">
        {text}
      </p>
    </div>
  );
}

/* ==================================================
   STAR ICON
================================================== */

function StarIcon(props) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      {...props}
    >
      <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
    </svg>
  );
}