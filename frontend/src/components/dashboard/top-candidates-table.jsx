import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { RefreshCw } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
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
  getResumes,
  getUsers,
} from '@/services/api';

import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

function getUserName(user) {
  if (!user) return 'Unknown Candidate';

  return (
    user.name ||
    user.full_name ||
    user.username ||
    user.email ||
    'Unknown Candidate'
  );
}

function getInitials(name) {
  if (!name) return '?';

  return name
    .split(' ')
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part.charAt(0).toUpperCase())
    .join('');
}

function getJobTitle(job) {
  return job?.title || 'Unknown Job';
}

function getSkills(resume, job) {
  if (resume?.structured_data?.skills) {
    const skills = resume.structured_data.skills;

    if (Array.isArray(skills)) {
      return skills.slice(0, 3).join(', ');
    }

    if (typeof skills === 'string') {
      return skills;
    }
  }

  if (job?.skills) {
    return String(job.skills)
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean)
      .slice(0, 3)
      .join(', ');
  }

  return 'Not available';
}

function getExperience(resume, job) {
  if (resume?.structured_data?.experience) {
    return String(resume.structured_data.experience);
  }

  if (resume?.structured_data?.years_of_experience != null) {
    return `${resume.structured_data.years_of_experience} yrs`;
  }

  if (job?.experience) {
    return String(job.experience);
  }

  return 'Not available';
}

function getScoreColor(score) {
  if (score >= 80) return 'text-success';
  if (score >= 60) return 'text-warning';
  return 'text-destructive';
}

/**
 * Top Matched Candidates
 *
 * Uses:
 * - Applications API
 * - Users API
 * - Jobs API
 * - Resumes API
 *
 * Application.user_id -> Users.id
 * Application.job_id -> Jobs.id
 * Application.resume_id -> Resumes.id
 */
export function TopCandidatesTable({ filters = {} }) {
  const [candidates, setCandidates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        applicationsData,
        usersData,
        jobsData,
        resumesData,
      ] = await Promise.all([
        getApplications(),
        getUsers(),
        getJobs(),
        getResumes(),
      ]);

      const applications = Array.isArray(applicationsData)
        ? applicationsData
        : [];

      const users = Array.isArray(usersData)
        ? usersData
        : [];

      const jobs = Array.isArray(jobsData)
        ? jobsData
        : [];

      const resumes = Array.isArray(resumesData)
        ? resumesData
        : [];

      const userMap = new Map(
        users.map((user) => [user.id, user])
      );

      const jobMap = new Map(
        jobs.map((job) => [job.id, job])
      );

      const resumeMap = new Map(
        resumes.map((resume) => [resume.id, resume])
      );

      const mappedCandidates = applications
        .map((application) => {
          const user = userMap.get(application.user_id);
          const job = jobMap.get(application.job_id);
          const resume = resumeMap.get(application.resume_id);

          const name = getUserName(user);

          const score = Number(application.match_score);

          return {
            id: application.id,
            userId: application.user_id,
            jobId: application.job_id,
            resumeId: application.resume_id,
            name,
            initials: getInitials(name),
            role: getJobTitle(job),
            matchScore: Number.isFinite(score) ? score : 0,
            skills: getSkills(resume, job),
            experience: getExperience(resume, job),
            status: application.status || 'Applied',
            user,
            job,
            resume,
          };
        })
        .filter((candidate) => {
          if (
            filters.job &&
            filters.job !== 'All Jobs' &&
            candidate.role !== filters.job
          ) {
            return false;
          }

          if (
            filters.skill &&
            filters.skill !== 'All Skills'
          ) {
            const candidateSkills =
              candidate.skills.toLowerCase();

            if (
              !candidateSkills.includes(
                filters.skill.toLowerCase()
              )
            ) {
              return false;
            }
          }

          if (
            filters.experience &&
            filters.experience !== 'Any Experience'
          ) {
            const experience = candidate.experience
              .toLowerCase()
              .replace(/\s/g, '');

            const range = filters.experience
              .toLowerCase()
              .replace(/\s/g, '');

            if (
              !experience.includes(
                range.replace('yrs', '')
              )
            ) {
              return false;
            }
          }

          return true;
        })
        .sort(
          (a, b) =>
            b.matchScore - a.matchScore
        )
        .slice(0, 5);

      setCandidates(mappedCandidates);
    } catch (err) {
      console.error(
        'Failed to load top candidates:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load candidates.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, [filters.job, filters.skill, filters.experience]);

  return (
    <motion.div variants={fadeUpItem}>
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight">
              Top Matched Candidates
            </h2>

            <p className="mt-0.5 text-xs text-muted-foreground">
              AI-ranked candidates for your active roles
            </p>
          </div>

          <Button
            variant="ghost"
            size="sm"
            onClick={loadCandidates}
            disabled={loading}
          >
            <RefreshCw
              className={cn(
                'mr-1.5 h-3.5 w-3.5',
                loading && 'animate-spin'
              )}
            />
            Refresh
          </Button>
        </CardHeader>

        <CardContent>
          {loading && (
            <div className="flex h-40 items-center justify-center">
              <p className="text-sm text-muted-foreground">
                Loading candidates...
              </p>
            </div>
          )}

          {!loading && error && (
            <div className="flex h-40 flex-col items-center justify-center text-center">
              <p className="font-medium text-destructive">
                Unable to load candidates
              </p>

              <p className="mt-1 text-sm text-muted-foreground">
                {error}
              </p>

              <Button
                variant="outline"
                size="sm"
                className="mt-3"
                onClick={loadCandidates}
              >
                Try Again
              </Button>
            </div>
          )}

          {!loading &&
            !error &&
            candidates.length === 0 && (
              <div className="flex h-40 items-center justify-center rounded-lg border border-dashed border-border">
                <p className="text-sm text-muted-foreground">
                  No matched candidates found.
                </p>
              </div>
            )}

          {!loading &&
            !error &&
            candidates.length > 0 && (
              <Table>
                <TableHeader>
                  <TableRow className="hover:bg-transparent">
                    <TableHead>Candidate</TableHead>
                    <TableHead>Job Title</TableHead>
                    <TableHead>Match Score</TableHead>
                    <TableHead>Skills</TableHead>
                    <TableHead>Experience</TableHead>
                    <TableHead className="text-right">
                      Action
                    </TableHead>
                  </TableRow>
                </TableHeader>

                <TableBody>
                  {candidates.map((candidate) => (
                    <TableRow key={candidate.id}>
                      <TableCell>
                        <div className="flex items-center gap-3">
                          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-semibold text-brand-red">
                            {candidate.initials}
                          </div>

                          <div>
                            <p className="font-medium text-foreground">
                              {candidate.name}
                            </p>

                            <p className="text-xs text-muted-foreground">
                              {candidate.status}
                            </p>
                          </div>
                        </div>
                      </TableCell>

                      <TableCell>
                        <span className="text-sm">
                          {candidate.role}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span
                          className={cn(
                            'font-semibold',
                            getScoreColor(
                              candidate.matchScore
                            )
                          )}
                        >
                          {candidate.matchScore}%
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {candidate.skills}
                        </span>
                      </TableCell>

                      <TableCell>
                        <span className="text-xs text-muted-foreground">
                          {candidate.experience}
                        </span>
                      </TableCell>

                      <TableCell className="text-right">
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => {
                            console.log(
                              'View candidate:',
                              candidate
                            );
                          }}
                        >
                          View Profile
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
        </CardContent>
      </Card>
    </motion.div>
  );
}