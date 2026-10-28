import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, MapPin, Building2, Clock3, RefreshCw } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { getJobs } from '@/services/api';
import { fadeUpItem, staggerContainer } from '@/lib/motion';

const statusStyles = {
  active: 'text-success border-success/40 bg-success/10',
  paused: 'text-warning border-warning/40 bg-warning/10',
  closed: 'text-muted-foreground border-border bg-muted/40',
};

export function JobsPage() {
  const [jobs, setJobs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadJobs = async () => {
    try {
      setLoading(true);
      setError('');

      const data = await getJobs();
      setJobs(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error('Failed to load jobs:', err);
      setError(err.message || 'Failed to load jobs.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadJobs();
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
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Jobs
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Manage and view your job openings.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadJobs}
          disabled={loading}
        >
          <RefreshCw className="mr-2 h-4 w-4" />
          Refresh
        </Button>
      </motion.div>

      {/* Loading */}
      {loading && (
        <motion.div variants={fadeUpItem}>
          <Card className="border-border bg-card">
            <CardContent className="flex h-48 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading jobs...
              </p>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Error */}
      {!loading && error && (
        <motion.div variants={fadeUpItem}>
          <Card className="border-destructive/40 bg-card">
            <CardContent className="flex min-h-32 items-center justify-center">
              <div className="text-center">
                <p className="font-medium text-destructive">
                  Unable to load jobs
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {error}
                </p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={loadJobs}
                >
                  Try Again
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      )}

      {/* Jobs */}
      {!loading && !error && (
        <motion.div variants={fadeUpItem}>
          <Card className="border-border bg-card">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Briefcase className="h-5 w-5" />
                Job Openings
                <span className="text-sm font-normal text-muted-foreground">
                  ({jobs.length})
                </span>
              </CardTitle>
            </CardHeader>

            <CardContent>
              {jobs.length === 0 ? (
                <div className="flex h-48 items-center justify-center rounded-lg border border-dashed border-border">
                  <p className="text-sm text-muted-foreground">
                    No jobs found.
                  </p>
                </div>
              ) : (
                <div className="space-y-4">
                  {jobs.map((job) => {
                    const status =
                      String(job.status || '').toLowerCase();

                    return (
                      <div
                        key={job.id}
                        className="rounded-lg border border-border bg-background/40 p-4 transition-colors hover:bg-muted/20"
                      >
                        <div className="flex flex-col gap-4 lg:flex-row lg:items-start lg:justify-between">
                          <div className="space-y-3">
                            <div>
                              <h2 className="font-semibold text-foreground">
                                {job.title}
                              </h2>

                              <div className="mt-1 flex flex-wrap gap-x-4 gap-y-2 text-sm text-muted-foreground">
                                <span className="flex items-center gap-1.5">
                                  <Building2 className="h-4 w-4" />
                                  {job.company}
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <MapPin className="h-4 w-4" />
                                  {job.location}
                                </span>

                                <span className="flex items-center gap-1.5">
                                  <Clock3 className="h-4 w-4" />
                                  {job.employment_type}
                                </span>
                              </div>
                            </div>

                            <div className="flex flex-wrap gap-2">
                              {job.experience && (
                                <Badge variant="secondary">
                                  {job.experience}
                                </Badge>
                              )}

                              {job.salary_min != null &&
                                job.salary_max != null && (
                                  <Badge variant="secondary">
                                    ₹{Number(job.salary_min).toLocaleString()} -
                                    ₹{Number(job.salary_max).toLocaleString()}
                                  </Badge>
                                )}

                              {job.skills
                                ?.split(',')
                                .slice(0, 5)
                                .map((skill) => (
                                  <Badge
                                    key={skill.trim()}
                                    variant="outline"
                                  >
                                    {skill.trim()}
                                  </Badge>
                                ))}
                            </div>

                            {job.description && (
                              <p className="max-w-3xl text-sm leading-6 text-muted-foreground">
                                {job.description}
                              </p>
                            )}
                          </div>

                          <Badge
                            variant="outline"
                            className={
                              statusStyles[status] ||
                              'border-border bg-muted/40 text-muted-foreground'
                            }
                          >
                            {job.status}
                          </Badge>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      )}
    </motion.div>
  );
}