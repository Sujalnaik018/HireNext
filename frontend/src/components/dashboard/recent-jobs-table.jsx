import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  MoreHorizontal,
  RefreshCw,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';

import {
  getApplications,
  getJobs,
} from '@/services/api';

import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

const statusColor = {
  active:
    'text-success border-success/40 bg-success/10',

  paused:
    'text-warning border-warning/40 bg-warning/10',

  closed:
    'text-muted-foreground border-border bg-muted/40',
};

function formatStatus(status) {
  if (!status) return 'Unknown';

  const value = String(status);

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function calculateJobStats(
  job,
  applications
) {
  const jobApplications =
    applications.filter(
      (application) =>
        application.job_id ===
        job.id
    );

  const applicationCount =
    jobApplications.length;

  const shortlistedCount =
    jobApplications.filter(
      (application) =>
        String(
          application.status || ''
        ).toLowerCase() ===
        'shortlisted'
    ).length;

  const scores =
    jobApplications
      .map((application) =>
        Number(
          application.match_score
        )
      )
      .filter((score) =>
        Number.isFinite(score)
      );

  const matchRate =
    scores.length > 0
      ? Math.round(
          scores.reduce(
            (total, score) =>
              total + score,
            0
          ) /
            scores.length
        )
      : null;

  return {
    applications:
      applicationCount,

    shortlisted:
      shortlistedCount,

    matchRate,
  };
}

/**
 * Recent Job Postings
 *
 * Fully database-driven.
 */
export function RecentJobsTable({
  filters = {},
}) {
  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        jobsData,
        applicationsData,
      ] = await Promise.all([
        getJobs(),
        getApplications(),
      ]);

      const jobList =
        Array.isArray(jobsData)
          ? jobsData
          : [];

      const applicationList =
        Array.isArray(
          applicationsData
        )
          ? applicationsData
          : [];

      const jobsWithStats =
        jobList
          .filter((job) => {
            if (
              filters.job &&
              filters.job !==
                'All Jobs' &&
              job.title !==
                filters.job
            ) {
              return false;
            }

            if (
              filters.experience &&
              filters.experience !==
                'Any Experience' &&
              job.experience !==
                filters.experience
            ) {
              return false;
            }

            if (
              filters.skill &&
              filters.skill !==
                'All Skills'
            ) {
              const skills =
                String(
                  job.skills || ''
                ).toLowerCase();

              if (
                !skills.includes(
                  filters.skill.toLowerCase()
                )
              ) {
                return false;
              }
            }

            return true;
          })
          .slice(0, 5)
          .map((job) => {
            const stats =
              calculateJobStats(
                job,
                applicationList
              );

            return {
              ...job,

              applications:
                stats.applications,

              shortlisted:
                stats.shortlisted,

              match_rate:
                stats.matchRate,
            };
          });

      setJobs(
        jobsWithStats
      );
    } catch (err) {
      console.error(
        'Failed to load recent jobs:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load jobs.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
  }, [
    filters.job,
    filters.experience,
    filters.skill,
  ]);

  return (
    <motion.div
      variants={fadeUpItem}
    >
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Recent Job Postings
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Latest job openings and their application status
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={loadJobs}
            disabled={loading}
            aria-label="Refresh jobs"
          >
            <RefreshCw
              className={cn(
                'h-4 w-4',
                loading &&
                  'animate-spin'
              )}
            />
          </Button>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading jobs...
              </p>
            </div>
          )}

          {!loading &&
            error && (
              <div className="flex h-40 flex-col items-center justify-center text-center">
                <p className="font-medium text-destructive">
                  Unable to load jobs
                </p>

                <p className="mt-1 text-sm text-muted-foreground">
                  {error}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-3"
                  onClick={loadJobs}
                >
                  Try Again
                </Button>
              </div>
            )}

          {!loading &&
            !error &&
            jobs.length === 0 && (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  No jobs found.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            jobs.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>
                      Job Title
                    </TableHead>

                    <TableHead className="text-right">
                      Applications
                    </TableHead>

                    <TableHead className="text-right">
                      Shortlisted
                    </TableHead>

                    <TableHead>
                      Match Rate
                    </TableHead>

                    <TableHead>
                      Status
                    </TableHead>

                    <TableHead className="text-right">
                      Actions
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {jobs.map(
                    (job) => {
                      const rawStatus =
                        String(
                          job.status ||
                            ''
                        ).toLowerCase();

                      return (
                        <TableRow
                          key={
                            job.id
                          }
                        >
                          <TableCell>
                            <div>
                              <p className="font-medium text-foreground">
                                {job.title}
                              </p>

                              <p className="mt-0.5 text-xs text-muted-foreground">
                                {job.company ||
                                  '—'}
                              </p>
                            </div>
                          </TableCell>

                          <TableCell className="text-right text-muted-foreground">
                            {
                              job.applications
                            }
                          </TableCell>

                          <TableCell className="text-right text-muted-foreground">
                            {
                              job.shortlisted
                            }
                          </TableCell>

                          <TableCell>
                            {job.match_rate !=
                            null ? (
                              <div className="flex items-center gap-2">
                                <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
                                  <div
                                    className="h-full rounded-full bg-brand-red"
                                    style={{
                                      width: `${Math.min(
                                        Number(
                                          job.match_rate
                                        ),
                                        100
                                      )}%`,
                                    }}
                                  />
                                </div>

                                <span className="text-xs font-medium">
                                  {
                                    job.match_rate
                                  }
                                  %
                                </span>
                              </div>
                            ) : (
                              <span className="text-xs text-muted-foreground">
                                —
                              </span>
                            )}
                          </TableCell>

                          <TableCell>
                            <Badge
                              variant="outline"
                              className={cn(
                                'border',
                                statusColor[
                                  rawStatus
                                ] ||
                                  'border-border bg-muted/40 text-muted-foreground'
                              )}
                            >
                              {formatStatus(
                                job.status
                              )}
                            </Badge>
                          </TableCell>

                          <TableCell className="text-right">
                            <Button
                              variant="ghost"
                              size="icon"
                              aria-label={`Actions for ${job.title}`}
                              onClick={() =>
                                console.log(
                                  'Job:',
                                  job
                                )
                              }
                            >
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </TableCell>
                        </TableRow>
                      );
                    }
                  )}
                </TableBody>
              </Table>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}