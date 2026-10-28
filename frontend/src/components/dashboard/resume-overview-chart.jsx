import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';

import {
  getApplications,
  getResumes,
} from '@/services/api';

import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

function getMatchCategory(score) {
  if (score >= 80) return 'High Match';
  if (score >= 60) return 'Medium Match';
  if (score > 0) return 'Low Match';
  return 'Not Evaluated';
}

function getCategoryClass(category) {
  if (category === 'High Match') {
    return 'bg-success';
  }

  if (category === 'Medium Match') {
    return 'bg-warning';
  }

  if (category === 'Low Match') {
    return 'bg-destructive';
  }

  return 'bg-muted-foreground';
}

/**
 * Resume overview based on real application match scores.
 *
 * Match score source:
 * applications.match_score
 *
 * Total:
 * resumes.length
 */
export function ResumeOverviewChart() {
  const [resumes, setResumes] = useState([]);
  const [applications, setApplications] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        resumesData,
        applicationsData,
      ] = await Promise.all([
        getResumes(),
        getApplications(),
      ]);

      setResumes(
        Array.isArray(resumesData)
          ? resumesData
          : []
      );

      setApplications(
        Array.isArray(applicationsData)
          ? applicationsData
          : []
      );
    } catch (err) {
      console.error(
        'Failed to load resume overview:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load resume overview.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  const overview = useMemo(() => {
    const result = {
      'High Match': 0,
      'Medium Match': 0,
      'Low Match': 0,
      'Not Evaluated': 0,
    };

    const applicationByResume =
      new Map();

    applications.forEach(
      (application) => {
        const score = Number(
          application.match_score
        );

        if (
          application.resume_id == null
        ) {
          return;
        }

        if (
          !Number.isFinite(score)
        ) {
          return;
        }

        applicationByResume.set(
          application.resume_id,
          score
        );
      }
    );

    resumes.forEach((resume) => {
      const score =
        applicationByResume.get(
          resume.id
        );

      if (score == null) {
        result['Not Evaluated'] += 1;
        return;
      }

      result[getMatchCategory(score)] += 1;
    });

    return result;
  }, [resumes, applications]);

  const total = resumes.length;

  const high =
    overview['High Match'];

  const medium =
    overview['Medium Match'];

  const low =
    overview['Low Match'];

  const notEvaluated =
    overview['Not Evaluated'];

  const highPercent =
    total > 0
      ? (high / total) * 100
      : 0;

  const mediumPercent =
    total > 0
      ? (medium / total) * 100
      : 0;

  const lowPercent =
    total > 0
      ? (low / total) * 100
      : 0;

  const donutBackground =
    total > 0
      ? `conic-gradient(
          hsl(var(--success)) 0 ${highPercent}%,
          hsl(var(--warning)) ${highPercent}% ${highPercent + mediumPercent}%,
          hsl(var(--destructive)) ${highPercent + mediumPercent}% ${highPercent + mediumPercent + lowPercent}%,
          hsl(var(--muted)) ${highPercent + mediumPercent + lowPercent}% 100%
        )`
      : 'hsl(var(--muted))';

  const rows = [
    {
      name: 'High Match',
      value: high,
      category: 'High Match',
    },
    {
      name: 'Medium Match',
      value: medium,
      category: 'Medium Match',
    },
    {
      name: 'Low Match',
      value: low,
      category: 'Low Match',
    },
    {
      name: 'Not Evaluated',
      value: notEvaluated,
      category: 'Not Evaluated',
    },
  ];

  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Resume Overview
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              Match-level distribution across{' '}
              {total}{' '}
              {total === 1
                ? 'resume'
                : 'resumes'}
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={loadData}
            disabled={loading}
            aria-label="Refresh resume overview"
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
            <div className="flex h-72 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading resume data...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-72 flex-col items-center justify-center text-center">
              <p className="font-medium text-destructive">
                Unable to load resume data
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={loadData}
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading && !error && (
            <div className="space-y-8">
              <div className="flex justify-center">
                <div
                  className="relative h-48 w-48 rounded-full"
                  style={{
                    background:
                      donutBackground,
                  }}
                >
                  <div className="absolute inset-[28px] flex flex-col items-center justify-center rounded-full bg-card">
                    <span className="text-2xl font-semibold text-foreground">
                      {total}
                    </span>

                    <span className="text-xs text-muted-foreground">
                      Total
                    </span>
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-x-8 gap-y-5">
                {rows.map((row) => (
                  <div
                    key={row.name}
                    className="flex items-center justify-between gap-4"
                  >
                    <div className="flex items-center gap-2">
                      <span
                        className={cn(
                          'h-2.5 w-2.5 rounded-full',
                          getCategoryClass(
                            row.category
                          )
                        )}
                      />

                      <span className="text-xs text-muted-foreground">
                        {row.name}
                      </span>
                    </div>

                    <span className="text-xs font-semibold text-foreground">
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  );
}