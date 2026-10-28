import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CalendarDays,
  FileText,
  Star,
  UserPlus,
  Briefcase,
  RefreshCw,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

import {
  getApplications,
  getInterviews,
  getJobs,
  getResumes,
  getUsers,
} from '@/services/api';

import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

const typeConfig = {
  apply: {
    icon: UserPlus,
    color: 'text-brand-red bg-brand-red/10',
  },

  job: {
    icon: Briefcase,
    color: 'text-sky-400 bg-sky-400/10',
  },

  shortlist: {
    icon: Star,
    color: 'text-warning bg-warning/10',
  },

  interview: {
    icon: CalendarDays,
    color: 'text-success bg-success/10',
  },

  resume: {
    icon: FileText,
    color: 'text-muted-foreground bg-muted/40',
  },
};

function formatRelativeTime(dateValue) {
  if (!dateValue) {
    return 'Recently';
  }

  const date = new Date(dateValue);

  if (Number.isNaN(date.getTime())) {
    return 'Recently';
  }

  const diff =
    Date.now() - date.getTime();

  const seconds = Math.max(
    0,
    Math.floor(diff / 1000)
  );

  if (seconds < 60) {
    return `${seconds || 1} sec ago`;
  }

  const minutes = Math.floor(
    seconds / 60
  );

  if (minutes < 60) {
    return `${minutes} min ago`;
  }

  const hours = Math.floor(
    minutes / 60
  );

  if (hours < 24) {
    return `${hours} hr${hours === 1 ? '' : 's'} ago`;
  }

  const days = Math.floor(
    hours / 24
  );

  if (days < 7) {
    return `${days} day${days === 1 ? '' : 's'} ago`;
  }

  return date.toLocaleDateString();
}

function getUserName(user) {
  return (
    user?.name ||
    user?.full_name ||
    user?.username ||
    user?.email ||
    'Candidate'
  );
}

/**
 * Live recruiter activity feed.
 *
 * Builds activity from real:
 * - Applications
 * - Jobs
 * - Resumes
 * - Interviews
 * - Users
 */
export function ActivityFeed() {
  const [activities, setActivities] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadActivity = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        applicationsData,
        interviewsData,
        jobsData,
        resumesData,
        usersData,
      ] = await Promise.all([
        getApplications(),
        getInterviews(),
        getJobs(),
        getResumes(),
        getUsers(),
      ]);

      const applications = Array.isArray(
        applicationsData
      )
        ? applicationsData
        : [];

      const interviews = Array.isArray(
        interviewsData
      )
        ? interviewsData
        : [];

      const jobs = Array.isArray(jobsData)
        ? jobsData
        : [];

      const resumes = Array.isArray(
        resumesData
      )
        ? resumesData
        : [];

      const users = Array.isArray(usersData)
        ? usersData
        : [];

      const userMap = new Map(
        users.map((user) => [
          user.id,
          user,
        ])
      );

      const jobMap = new Map(
        jobs.map((job) => [
          job.id,
          job,
        ])
      );

      const resumeMap = new Map(
        resumes.map((resume) => [
          resume.id,
          resume,
        ])
      );

      const nextActivities = [];

      applications.forEach((application) => {
        const user = userMap.get(
          application.user_id
        );

        const job = jobMap.get(
          application.job_id
        );

        const candidateName =
          getUserName(user);

        const jobTitle =
          job?.title || 'a job';

        const createdAt =
          application.created_at ||
          application.updated_at;

        nextActivities.push({
          id: `application-${application.id}`,
          title: `${candidateName} applied to ${jobTitle}`,
          description: `Application submitted with ${
            application.match_score ?? 0
          }% match score.`,
          time: createdAt,
          type: 'apply',
        });

        if (
          String(
            application.status || ''
          ).toLowerCase() === 'shortlisted'
        ) {
          nextActivities.push({
            id: `shortlist-${application.id}`,
            title: 'Candidate shortlisted',
            description: `${candidateName} was shortlisted for ${jobTitle}.`,
            time:
              application.updated_at ||
              application.created_at,
            type: 'shortlist',
          });
        }
      });

      jobs.forEach((job) => {
        nextActivities.push({
          id: `job-${job.id}`,
          title: `Job posting created: ${job.title}`,
          description: [
            job.company,
            job.location,
          ]
            .filter(Boolean)
            .join(' · ') ||
            'New job posting created.',
          time:
            job.created_at ||
            job.updated_at,
          type: 'job',
        });
      });

      resumes.forEach((resume) => {
        const user = userMap.get(
          resume.user_id
        );

        const candidateName =
          getUserName(user);

        nextActivities.push({
          id: `resume-${resume.id}`,
          title: 'Resume added',
          description: `${candidateName}'s resume was added to the platform.`,
          time:
            resume.created_at ||
            resume.updated_at,
          type: 'resume',
        });
      });

      interviews.forEach((interview) => {
        const application =
          applications.find(
            (item) =>
              item.id ===
              interview.application_id
          );

        const user = application
          ? userMap.get(
              application.user_id
            )
          : null;

        const job = application
          ? jobMap.get(
              application.job_id
            )
          : null;

        const candidateName =
          getUserName(user);

        const interviewDate =
          interview.scheduled_at
            ? new Date(
                interview.scheduled_at
              ).toLocaleString()
            : 'scheduled';

        nextActivities.push({
          id: `interview-${interview.id}`,
          title: 'Interview scheduled',
          description: `${candidateName} interview scheduled for ${interviewDate}.`,
          time:
            interview.created_at ||
            interview.updated_at,
          type: 'interview',
        });
      });

      nextActivities.sort(
        (a, b) =>
          new Date(b.time || 0) -
          new Date(a.time || 0)
      );

      setActivities(
        nextActivities.slice(0, 8)
      );
    } catch (err) {
      console.error(
        'Failed to load activity:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load activity.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadActivity();
  }, []);

  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Activity
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Recent recruiter activities
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={loadActivity}
            disabled={loading}
            aria-label="Refresh activity"
          >
            <RefreshCw
              className={cn(
                'h-4 w-4',
                loading && 'animate-spin'
              )}
            />
          </Button>
        </CardHeader>

        <CardContent className="space-y-1">
          {loading && (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading activity...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="font-medium text-destructive">
                Unable to load activity
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={loadActivity}
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading &&
            !error &&
            activities.length === 0 && (
              <div className="flex h-40 items-center justify-center">
                <p className="text-sm text-muted-foreground">
                  No recent activity.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            activities.map(
              (activity, index) => {
                const config =
                  typeConfig[
                    activity.type
                  ] ||
                  typeConfig.resume;

                const Icon =
                  config.icon;

                const isLast =
                  index ===
                  activities.length - 1;

                return (
                  <div
                    key={activity.id}
                    className="flex gap-3"
                  >
                    <div className="flex flex-col items-center">
                      <div
                        className={`flex h-8 w-8 shrink-0 items-center justify-center rounded-full ${config.color}`}
                      >
                        <Icon className="h-3.5 w-3.5" />
                      </div>

                      {!isLast && (
                        <div className="my-1 w-px flex-1 bg-border" />
                      )}
                    </div>

                    <div className="pb-5">
                      <p className="text-sm font-medium leading-snug text-foreground">
                        {activity.title}
                      </p>

                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {activity.description}
                      </p>

                      <p className="mt-1 text-[11px] text-muted-foreground/60">
                        {formatRelativeTime(
                          activity.time
                        )}
                      </p>
                    </div>
                  </div>
                );
              }
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}