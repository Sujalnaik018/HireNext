import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  Clock3,
  RefreshCw,
  Video,
  MapPin,
  CheckCircle2,
  XCircle,
  AlertCircle,
  UserRound,
  BriefcaseBusiness,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

import {
  getApplications,
  getInterviews,
  getJobs,
} from '@/services/api';

import { fadeUpItem, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/* --------------------------------------------------
 * Helpers
 * -------------------------------------------------- */

function formatInterviewType(type) {
  if (!type) return 'Interview';

  const value = String(type).toLowerCase();

  if (value === 'video') return 'Video';
  if (value === 'phone') return 'Phone';
  if (value === 'onsite') return 'On-site';
  if (value === 'in-person') return 'In-person';

  return (
    String(type).charAt(0).toUpperCase() +
    String(type).slice(1)
  );
}

function formatStatus(status) {
  if (!status) return 'Unknown';

  return (
    String(status).charAt(0).toUpperCase() +
    String(status).slice(1)
  );
}

function getStatusKey(status) {
  return String(status || '').trim().toLowerCase();
}

function getStatusIcon(status) {
  const key = getStatusKey(status);

  if (
    key === 'completed' ||
    key === 'complete' ||
    key === 'passed'
  ) {
    return CheckCircle2;
  }

  if (
    key === 'cancelled' ||
    key === 'canceled' ||
    key === 'rejected'
  ) {
    return XCircle;
  }

  if (
    key === 'scheduled' ||
    key === 'confirmed'
  ) {
    return CalendarDays;
  }

  return AlertCircle;
}

function getStatusClass(status) {
  const key = getStatusKey(status);

  if (
    key === 'completed' ||
    key === 'complete' ||
    key === 'passed'
  ) {
    return 'border-success/40 bg-success/10 text-success';
  }

  if (
    key === 'cancelled' ||
    key === 'canceled' ||
    key === 'rejected'
  ) {
    return 'border-destructive/40 bg-destructive/10 text-destructive';
  }

  if (
    key === 'scheduled' ||
    key === 'confirmed'
  ) {
    return 'border-brand-red/40 bg-brand-red/10 text-brand-red';
  }

  return 'border-warning/40 bg-warning/10 text-warning';
}

function formatDate(dateValue) {
  if (!dateValue) return 'Date not available';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return String(dateValue);
  }

  return new Intl.DateTimeFormat('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).format(date);
}

function formatTime(dateValue) {
  if (!dateValue) return 'Time not available';

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return '';
  }

  return new Intl.DateTimeFormat('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  }).format(date);
}

function getDateTimeValue(interview) {
  return (
    interview?.scheduled_at ||
    interview?.scheduledAt ||
    interview?.date ||
    interview?.start_time ||
    interview?.startTime ||
    null
  );
}

function getApplicationId(interview) {
  return (
    interview?.application_id ??
    interview?.applicationId ??
    null
  );
}

function getJobForApplication(application, jobs) {
  if (!application) return null;

  const jobId =
    application.job_id ??
    application.jobId;

  if (jobId == null) return null;

  return (
    jobs.find(
      (job) => String(job.id) === String(jobId)
    ) || null
  );
}

function getCandidateName(application) {
  if (!application) {
    return 'Candidate';
  }

  if (application.name) {
    return application.name;
  }

  if (application.candidate_name) {
    return application.candidate_name;
  }

  if (application.candidateName) {
    return application.candidateName;
  }

  if (application.user_name) {
    return application.user_name;
  }

  if (application.userName) {
    return application.userName;
  }

  if (application.user?.name) {
    return application.user.name;
  }

  if (application.applicant?.name) {
    return application.applicant.name;
  }

  if (application.user_id != null) {
    return `Candidate #${application.user_id}`;
  }

  return 'Candidate';
}

function getCandidateInitials(name) {
  if (!name) return 'C';

  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0].slice(0, 2).toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

/* --------------------------------------------------
 * Stat card
 * -------------------------------------------------- */

function InterviewStatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="flex items-start justify-between">
            <div>
              <p className="text-sm text-muted-foreground">
                {label}
              </p>

              <p className="mt-2 text-3xl font-semibold text-foreground">
                {value}
              </p>

              <p className="mt-1 text-xs text-muted-foreground">
                {description}
              </p>
            </div>

            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-brand-red/10">
              <Icon className="h-5 w-5 text-brand-red" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

/* --------------------------------------------------
 * Main page
 * -------------------------------------------------- */

export function InterviewsPage() {
  const [interviews, setInterviews] = useState([]);
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);

  const [statusFilter, setStatusFilter] =
    useState('all');

  const [typeFilter, setTypeFilter] =
    useState('all');

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadInterviews = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        interviewsData,
        applicationsData,
        jobsData,
      ] = await Promise.all([
        getInterviews(),
        getApplications(),
        getJobs(),
      ]);

      setInterviews(
        Array.isArray(interviewsData)
          ? interviewsData
          : []
      );

      setApplications(
        Array.isArray(applicationsData)
          ? applicationsData
          : []
      );

      setJobs(
        Array.isArray(jobsData)
          ? jobsData
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load interviews:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load interviews.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadInterviews();
  }, []);

  /* --------------------------------------------------
   * Enrich interviews with application/job information
   * -------------------------------------------------- */

  const enrichedInterviews = useMemo(() => {
    return interviews.map((interview) => {
      const applicationId =
        getApplicationId(interview);

      const application =
        applications.find(
          (item) =>
            String(item.id) ===
            String(applicationId)
        ) || null;

      const job = getJobForApplication(
        application,
        jobs
      );

      const candidateName =
        getCandidateName(application);

      return {
        ...interview,
        application,
        job,
        candidateName,
        candidateInitials:
          getCandidateInitials(candidateName),
        interviewType:
          formatInterviewType(
            interview.interview_type ||
              interview.interviewType
          ),
        dateTime:
          getDateTimeValue(interview),
      };
    });
  }, [
    interviews,
    applications,
    jobs,
  ]);

  /* --------------------------------------------------
   * Filter options
   * -------------------------------------------------- */

  const statusOptions = useMemo(() => {
    const values = enrichedInterviews
      .map((interview) =>
        getStatusKey(interview.status)
      )
      .filter(Boolean);

    return [...new Set(values)];
  }, [enrichedInterviews]);

  const typeOptions = useMemo(() => {
    const values = enrichedInterviews
      .map((interview) =>
        String(
          interview.interview_type ||
            interview.interviewType ||
            ''
        )
          .trim()
          .toLowerCase()
      )
      .filter(Boolean);

    return [...new Set(values)];
  }, [enrichedInterviews]);

  /* --------------------------------------------------
   * Filtered list
   * -------------------------------------------------- */

  const filteredInterviews = useMemo(() => {
    return enrichedInterviews.filter(
      (interview) => {
        const interviewStatus =
          getStatusKey(interview.status);

        const interviewType =
          String(
            interview.interview_type ||
              interview.interviewType ||
              ''
          )
            .trim()
            .toLowerCase();

        const statusMatches =
          statusFilter === 'all' ||
          interviewStatus === statusFilter;

        const typeMatches =
          typeFilter === 'all' ||
          interviewType === typeFilter;

        return (
          statusMatches &&
          typeMatches
        );
      }
    );
  }, [
    enrichedInterviews,
    statusFilter,
    typeFilter,
  ]);

  /* --------------------------------------------------
   * Statistics
   * -------------------------------------------------- */

  const scheduledCount = enrichedInterviews.filter(
    (interview) => {
      const status =
        getStatusKey(interview.status);

      return (
        status === 'scheduled' ||
        status === 'confirmed'
      );
    }
  ).length;

  const completedCount = enrichedInterviews.filter(
    (interview) => {
      const status =
        getStatusKey(interview.status);

      return (
        status === 'completed' ||
        status === 'complete' ||
        status === 'passed'
      );
    }
  ).length;

  const cancelledCount = enrichedInterviews.filter(
    (interview) => {
      const status =
        getStatusKey(interview.status);

      return (
        status === 'cancelled' ||
        status === 'canceled'
      );
    }
  ).length;

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* ------------------------------------------------
       * Header
       * ------------------------------------------------ */}

      <motion.div
        variants={fadeUpItem}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Interviews
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Schedule and manage candidate interviews.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadInterviews}
          disabled={loading}
          className="w-full sm:w-auto"
        >
          <RefreshCw
            className={cn(
              'mr-2 h-4 w-4',
              loading && 'animate-spin'
            )}
          />

          Refresh
        </Button>
      </motion.div>

      {/* ------------------------------------------------
       * Statistics
       * ------------------------------------------------ */}

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <InterviewStatCard
          icon={CalendarDays}
          label="Total Interviews"
          value={
            loading
              ? '—'
              : enrichedInterviews.length
          }
          description="All interview records"
        />

        <InterviewStatCard
          icon={Clock3}
          label="Scheduled"
          value={
            loading
              ? '—'
              : scheduledCount
          }
          description="Upcoming scheduled interviews"
        />

        <InterviewStatCard
          icon={CheckCircle2}
          label="Completed"
          value={
            loading
              ? '—'
              : completedCount
          }
          description="Completed interview rounds"
        />

        <InterviewStatCard
          icon={XCircle}
          label="Cancelled"
          value={
            loading
              ? '—'
              : cancelledCount
          }
          description="Cancelled interviews"
        />
      </motion.div>

      {/* ------------------------------------------------
       * Filters
       * ------------------------------------------------ */}

      <motion.div variants={fadeUpItem}>
        <Card className="border-border bg-card">
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Interview Filters
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                Filter interviews by status and interview type.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Status
                </label>

                <Select
                  value={statusFilter}
                  onValueChange={setStatusFilter}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="All statuses" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All Statuses
                    </SelectItem>

                    {statusOptions.map(
                      (status) => (
                        <SelectItem
                          key={status}
                          value={status}
                        >
                          {formatStatus(status)}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-medium text-muted-foreground">
                  Interview Type
                </label>

                <Select
                  value={typeFilter}
                  onValueChange={setTypeFilter}
                >
                  <SelectTrigger className="w-full bg-background">
                    <SelectValue placeholder="All types" />
                  </SelectTrigger>

                  <SelectContent>
                    <SelectItem value="all">
                      All Types
                    </SelectItem>

                    {typeOptions.map(
                      (type) => (
                        <SelectItem
                          key={type}
                          value={type}
                        >
                          {formatInterviewType(
                            type
                          )}
                        </SelectItem>
                      )
                    )}
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* ------------------------------------------------
       * Interviews list
       * ------------------------------------------------ */}

      <motion.div variants={fadeUpItem}>
        <Card className="border-border bg-card">
          <CardHeader className="flex-row items-center justify-between space-y-0">
            <div>
              <h2 className="text-base font-semibold tracking-tight">
                Interview Schedule
              </h2>

              <p className="mt-0.5 text-xs text-muted-foreground">
                {loading
                  ? 'Loading interview records...'
                  : `${filteredInterviews.length} interview${
                      filteredInterviews.length === 1
                        ? ''
                        : 's'
                    } shown`}
              </p>
            </div>

            {!loading &&
              enrichedInterviews.length > 0 && (
                <Badge
                  variant="outline"
                  className="border-border bg-muted/40"
                >
                  {enrichedInterviews.length} Total
                </Badge>
              )}
          </CardHeader>

          <CardContent>
            {/* Loading */}
            {loading && (
              <div className="flex min-h-[280px] items-center justify-center">
                <div className="flex flex-col items-center gap-3 text-center">
                  <RefreshCw className="h-6 w-6 animate-spin text-brand-red" />

                  <p className="text-sm text-muted-foreground">
                    Loading interviews...
                  </p>
                </div>
              </div>
            )}

            {/* Error */}
            {!loading && error && (
              <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-6 w-6 text-destructive" />
                </div>

                <p className="mt-4 font-medium text-foreground">
                  Unable to load interviews
                </p>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  {error}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={loadInterviews}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}

            {/* No interviews */}
            {!loading &&
              !error &&
              enrichedInterviews.length === 0 && (
                <div className="flex min-h-[320px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                  <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-red/10">
                    <CalendarDays className="h-7 w-7 text-brand-red" />
                  </div>

                  <h3 className="mt-4 text-base font-semibold text-foreground">
                    No interviews scheduled
                  </h3>

                  <p className="mt-1 max-w-md text-sm text-muted-foreground">
                    There are currently no interview records in the database.
                    Once an interview is created, it will appear here.
                  </p>
                </div>
              )}

            {/* Filter produced no results */}
            {!loading &&
              !error &&
              enrichedInterviews.length > 0 &&
              filteredInterviews.length === 0 && (
                <div className="flex min-h-[280px] flex-col items-center justify-center text-center">
                  <AlertCircle className="h-8 w-8 text-muted-foreground" />

                  <p className="mt-3 font-medium text-foreground">
                    No matching interviews
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Try changing your filters.
                  </p>

                  <Button
                    variant="outline"
                    size="sm"
                    className="mt-4"
                    onClick={() => {
                      setStatusFilter('all');
                      setTypeFilter('all');
                    }}
                  >
                    Clear Filters
                  </Button>
                </div>
              )}

            {/* Interview cards */}
            {!loading &&
              !error &&
              filteredInterviews.length > 0 && (
                <div className="space-y-3">
                  {filteredInterviews.map(
                    (interview) => {
                      const status =
                        formatStatus(
                          interview.status
                        );

                      const StatusIcon =
                        getStatusIcon(
                          interview.status
                        );

                      const application =
                        interview.application;

                      const job =
                        interview.job;

                      const scheduledAt =
                        interview.dateTime;

                      return (
                        <div
                          key={interview.id}
                          className="rounded-xl border border-border bg-background/40 p-4 transition-colors hover:bg-background/70"
                        >
                          <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                            {/* Candidate */}
                            <div className="flex min-w-0 items-start gap-3">
                              <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-sm font-semibold text-brand-red">
                                {
                                  interview.candidateInitials
                                }
                              </div>

                              <div className="min-w-0">
                                <div className="flex flex-wrap items-center gap-2">
                                  <h3 className="font-semibold text-foreground">
                                    {
                                      interview.candidateName
                                    }
                                  </h3>

                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'border',
                                      getStatusClass(
                                        interview.status
                                      )
                                    )}
                                  >
                                    <StatusIcon className="mr-1 h-3 w-3" />

                                    {status}
                                  </Badge>
                                </div>

                                <div className="mt-1 flex flex-wrap items-center gap-x-4 gap-y-1 text-xs text-muted-foreground">
                                  <span className="flex items-center gap-1">
                                    <BriefcaseBusiness className="h-3.5 w-3.5" />

                                    {job?.title ||
                                      'Job not available'}
                                  </span>

                                  {application?.id !=
                                    null && (
                                    <span className="flex items-center gap-1">
                                      <UserRound className="h-3.5 w-3.5" />

                                      Application #
                                      {
                                        application.id
                                      }
                                    </span>
                                  )}
                                </div>
                              </div>
                            </div>

                            {/* Interview details */}
                            <div className="grid grid-cols-1 gap-3 sm:grid-cols-3 lg:min-w-[500px]">
                              <div className="rounded-lg border border-border bg-card p-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <CalendarDays className="h-4 w-4" />
                                  Date
                                </div>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                  {formatDate(
                                    scheduledAt
                                  )}
                                </p>
                              </div>

                              <div className="rounded-lg border border-border bg-card p-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  <Clock3 className="h-4 w-4" />
                                  Time
                                </div>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                  {formatTime(
                                    scheduledAt
                                  ) || '—'}
                                </p>
                              </div>

                              <div className="rounded-lg border border-border bg-card p-3">
                                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                                  {String(
                                    interview.interviewType
                                  ).toLowerCase() ===
                                  'video' ? (
                                    <Video className="h-4 w-4" />
                                  ) : (
                                    <MapPin className="h-4 w-4" />
                                  )}

                                  Type
                                </div>

                                <p className="mt-1 text-sm font-medium text-foreground">
                                  {
                                    interview.interviewType
                                  }
                                </p>
                              </div>
                            </div>
                          </div>
                        </div>
                      );
                    }
                  )}
                </div>
              )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}