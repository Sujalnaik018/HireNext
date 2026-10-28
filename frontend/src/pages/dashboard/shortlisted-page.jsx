import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle2,
  Eye,
  FileText,
  RefreshCw,
  Search,
  Star,
} from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  getApplications,
  getJobs,
  getResumes,
  getUsers,
} from '@/services/api';

import { fadeUpItem, staggerContainer } from '@/lib/motion';
import { cn } from '@/lib/utils';

/* =========================================================
   HELPERS
========================================================= */

function getValue(object, keys, fallback = null) {
  if (!object) {
    return fallback;
  }

  for (const key of keys) {
    const value = object[key];

    if (
      value !== undefined &&
      value !== null &&
      String(value).trim() !== ''
    ) {
      return value;
    }
  }

  return fallback;
}

function findById(list, id) {
  if (!Array.isArray(list) || id === null || id === undefined) {
    return null;
  }

  return (
    list.find(
      (item) =>
        String(item?.id) === String(id)
    ) || null
  );
}

function getInitials(name) {
  if (!name) {
    return 'C';
  }

  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return (
    `${parts[0][0]}${parts[parts.length - 1][0]}`
  ).toUpperCase();
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString('en-IN', {
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  });
}

function formatStatus(status) {
  if (!status) {
    return 'Unknown';
  }

  const value = String(status);

  return (
    value.charAt(0).toUpperCase() +
    value.slice(1)
  );
}

function getScoreClass(score) {
  const value = Number(score);

  if (!Number.isFinite(value)) {
    return 'text-muted-foreground';
  }

  if (value >= 80) {
    return 'text-success';
  }

  if (value >= 60) {
    return 'text-warning';
  }

  return 'text-destructive';
}

function getScoreBadgeClass(score) {
  const value = Number(score);

  if (!Number.isFinite(value)) {
    return 'border-border bg-muted/40 text-muted-foreground';
  }

  if (value >= 80) {
    return 'border-success/40 bg-success/10 text-success';
  }

  if (value >= 60) {
    return 'border-warning/40 bg-warning/10 text-warning';
  }

  return 'border-destructive/40 bg-destructive/10 text-destructive';
}

function getResumeFileUrl(resume) {
  const filePath = resume?.file_path;

  if (!filePath) {
    return null;
  }

  const value = String(filePath).trim();

  if (!value) {
    return null;
  }

  if (
    value.startsWith('http://') ||
    value.startsWith('https://')
  ) {
    return value;
  }

  const baseUrl =
    import.meta.env.VITE_API_URL ||
    'http://127.0.0.1:8000';

  const normalizedBaseUrl =
    String(baseUrl).replace(/\/+$/, '');

  const normalizedPath =
    value.replace(/^\/+/, '');

  return `${normalizedBaseUrl}/${normalizedPath}`;
}

/* =========================================================
   CANDIDATE NAME RESOLVER
========================================================= */

function getCandidateName({
  application,
  resume,
  user,
}) {
  /*
   * 1. If application already contains candidate data,
   *    use that first.
   */
  const applicationName = getValue(
    application,
    [
      'candidate_name',
      'applicant_name',
      'full_name',
      'candidateName',
      'applicantName',
      'name',
    ],
    null
  );

  if (applicationName) {
    return String(applicationName);
  }

  /*
   * 2. Check nested application candidate/user.
   */
  const nestedApplicationName =
    getValue(
      application?.candidate,
      [
        'name',
        'full_name',
        'fullName',
      ],
      null
    ) ||
    getValue(
      application?.user,
      [
        'name',
        'full_name',
        'fullName',
      ],
      null
    );

  if (nestedApplicationName) {
    return String(nestedApplicationName);
  }

  /*
   * 3. Resume may contain candidate/user.
   */
  const resumeName = getValue(
    resume,
    [
      'candidate_name',
      'applicant_name',
      'full_name',
      'candidateName',
      'name',
    ],
    null
  );

  if (resumeName) {
    return String(resumeName);
  }

  /*
   * 4. Check nested resume user.
   */
  const nestedResumeName =
    getValue(
      resume?.user,
      [
        'name',
        'full_name',
        'fullName',
      ],
      null
    ) ||
    getValue(
      resume?.candidate,
      [
        'name',
        'full_name',
        'fullName',
      ],
      null
    );

  if (nestedResumeName) {
    return String(nestedResumeName);
  }

  /*
   * 5. IMPORTANT:
   *    Resolve resume.user_id -> users table.
   */
  const userName = getValue(
    user,
    [
      'name',
      'full_name',
      'fullName',
      'username',
    ],
    null
  );

  if (userName) {
    return String(userName);
  }

  return 'Unknown Candidate';
}

/* =========================================================
   CANDIDATE CELL
========================================================= */

function CandidateCell({ candidate }) {
  const name =
    candidate?.candidateName ||
    'Unknown Candidate';

  const initials = getInitials(name);

  const email =
    candidate?.candidateEmail || '';

  return (
    <div className="flex min-w-[240px] items-center gap-3">
      <Avatar className="h-10 w-10 shrink-0">
        <AvatarFallback className="bg-brand-red/10 text-xs font-semibold text-brand-red">
          {initials}
        </AvatarFallback>
      </Avatar>

      <div className="min-w-0">
        <p className="truncate font-medium text-foreground">
          {name}
        </p>

        {email ? (
          <p className="mt-0.5 truncate text-xs text-muted-foreground">
            {email}
          </p>
        ) : (
          <p className="mt-0.5 text-xs text-muted-foreground">
            Shortlisted candidate
          </p>
        )}
      </div>
    </div>
  );
}

/* =========================================================
   SCORE CELL
========================================================= */

function ScoreCell({ score }) {
  const numericScore = Number(score);

  if (!Number.isFinite(numericScore)) {
    return (
      <span className="text-sm text-muted-foreground">
        —
      </span>
    );
  }

  const percentage = Math.min(
    Math.max(numericScore, 0),
    100
  );

  return (
    <div className="flex min-w-[120px] items-center gap-2">
      <div className="h-1.5 w-16 overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-brand-red"
          style={{
            width: `${percentage}%`,
          }}
        />
      </div>

      <span
        className={cn(
          'text-sm font-semibold',
          getScoreClass(numericScore)
        )}
      >
        {numericScore}%
      </span>
    </div>
  );
}

/* =========================================================
   STAT CARD
========================================================= */

function StatCard({
  label,
  value,
  description,
  icon: Icon,
}) {
  return (
    <Card className="border-border bg-card">
      <CardContent className="p-5">
        <div className="flex items-start justify-between">
          <div>
            <p className="text-sm text-muted-foreground">
              {label}
            </p>

            <p className="mt-2 text-2xl font-semibold text-foreground">
              {value}
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {description}
            </p>
          </div>

          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10">
            <Icon className="h-5 w-5 text-brand-red" />
          </div>
        </div>
      </CardContent>
    </Card>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export function ShortlistedPage() {
  const [applications, setApplications] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [users, setUsers] = useState([]);

  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');

  /* =======================================================
     LOAD DATA
  ======================================================= */

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      /*
       * IMPORTANT:
       * We now load USERS too.
       *
       * This allows:
       *
       * application.resume_id
       *        ↓
       * resume.user_id
       *        ↓
       * user.name
       *
       * which fixes "Unknown Candidate".
       */

      const [
        applicationsData,
        jobsData,
        resumesData,
        usersData,
      ] = await Promise.all([
        getApplications(),
        getJobs(),
        getResumes(),
        getUsers(),
      ]);

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

      setResumes(
        Array.isArray(resumesData)
          ? resumesData
          : []
      );

      setUsers(
        Array.isArray(usersData)
          ? usersData
          : []
      );

      console.log(
        'SHORTLISTED DATA:',
        {
          applications: applicationsData,
          jobs: jobsData,
          resumes: resumesData,
          users: usersData,
        }
      );
    } catch (err) {
      console.error(
        'Failed to load shortlisted candidates:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load shortlisted candidates.'
      );
    } finally {
      setLoading(false);
    }
  };

  /* =======================================================
     INITIAL LOAD
  ======================================================= */

  useEffect(() => {
    loadData();
  }, []);

  /* =======================================================
     SHORTLISTED APPLICATIONS
  ======================================================= */

  const shortlistedApplications = useMemo(() => {
    return applications.filter(
      (application) =>
        String(
          application?.status || ''
        ).toLowerCase() === 'shortlisted'
    );
  }, [applications]);

  /* =======================================================
     BUILD ROWS
  ======================================================= */

  const rows = useMemo(() => {
    return shortlistedApplications.map(
      (application) => {
        /* -----------------------------------------------
           IDs
        ------------------------------------------------ */

        const jobId = getValue(
          application,
          [
            'job_id',
            'jobId',
          ],
          null
        );

        const resumeId = getValue(
          application,
          [
            'resume_id',
            'resumeId',
          ],
          null
        );

        const userId = getValue(
          application,
          [
            'user_id',
            'userId',
          ],
          null
        );

        /* -----------------------------------------------
           Find related records
        ------------------------------------------------ */

        const job = findById(
          jobs,
          jobId
        );

        const resume = findById(
          resumes,
          resumeId
        );

        /*
         * User can be obtained from:
         *
         * application.user_id
         *
         * OR
         *
         * resume.user_id
         */

        const resumeUserId =
          getValue(
            resume,
            [
              'user_id',
              'userId',
            ],
            null
          );

        const resolvedUserId =
          userId ??
          resumeUserId;

        const user = findById(
          users,
          resolvedUserId
        );

        /* -----------------------------------------------
           Candidate
        ------------------------------------------------ */

        const candidateName =
          getCandidateName({
            application,
            resume,
            user,
          });

        const candidateEmail =
          getValue(
            application,
            [
              'candidate_email',
              'applicant_email',
              'email',
            ],
            null
          ) ||
          getValue(
            resume,
            [
              'email',
            ],
            null
          ) ||
          getValue(
            user,
            [
              'email',
            ],
            ''
          );

        /* -----------------------------------------------
           Job
        ------------------------------------------------ */

        const jobTitle =
          getValue(
            application,
            [
              'job_title',
              'title',
            ],
            null
          ) ||
          getValue(
            job,
            [
              'title',
              'job_title',
              'name',
            ],
            'Unknown Job'
          );

        const company =
          getValue(
            application,
            [
              'company',
              'company_name',
            ],
            null
          ) ||
          getValue(
            job,
            [
              'company',
              'company_name',
              'employer',
            ],
            '—'
          );

        /* -----------------------------------------------
           Match score
        ------------------------------------------------ */

        const matchScore =
          getValue(
            application,
            [
              'match_score',
              'matchScore',
              'score',
            ],
            null
          );

        /* -----------------------------------------------
           Skills
        ------------------------------------------------ */

        const skills =
          getValue(
            application,
            [
              'candidate_skills',
              'skills',
            ],
            null
          ) ||
          getValue(
            resume,
            [
              'candidate_skills',
              'skills',
            ],
            null
          ) ||
          getValue(
            user,
            [
              'skills',
            ],
            null
          );

        /* -----------------------------------------------
           Experience
        ------------------------------------------------ */

        const experience =
          getValue(
            application,
            [
              'experience',
              'experience_years',
            ],
            null
          ) ||
          getValue(
            resume,
            [
              'experience',
              'experience_years',
            ],
            null
          ) ||
          getValue(
            user,
            [
              'experience',
              'experience_years',
            ],
            null
          );

        /* -----------------------------------------------
           Applied date
        ------------------------------------------------ */

        const appliedAt =
          getValue(
            application,
            [
              'created_at',
              'applied_at',
              'application_date',
            ],
            null
          );

        return {
          application,
          job,
          resume,
          user,

          candidateName,
          candidateEmail,

          jobTitle,
          company,

          matchScore,
          skills,
          experience,
          appliedAt,
        };
      }
    );
  }, [
    shortlistedApplications,
    jobs,
    resumes,
    users,
  ]);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredRows = useMemo(() => {
    const query = search
      .trim()
      .toLowerCase();

    if (!query) {
      return rows;
    }

    return rows.filter((row) => {
      return [
        row.candidateName,
        row.candidateEmail,
        row.jobTitle,
        row.company,
        row.skills,
        row.experience,
      ]
        .filter(
          (value) =>
            value !== null &&
            value !== undefined
        )
        .some((value) =>
          String(value)
            .toLowerCase()
            .includes(query)
        );
    });
  }, [rows, search]);

  /* =======================================================
     STATISTICS
  ======================================================= */

  const averageScore = useMemo(() => {
    const scores = rows
      .map((row) =>
        Number(row.matchScore)
      )
      .filter((score) =>
        Number.isFinite(score)
      );

    if (!scores.length) {
      return null;
    }

    return Math.round(
      scores.reduce(
        (total, score) =>
          total + score,
        0
      ) / scores.length
    );
  }, [rows]);

  const highMatchCount = useMemo(() => {
    return rows.filter((row) => {
      const score = Number(
        row.matchScore
      );

      return (
        Number.isFinite(score) &&
        score >= 80
      );
    }).length;
  }, [rows]);

  const resumeCount = useMemo(() => {
    return rows.filter(
      (row) => Boolean(row.resume)
    ).length;
  }, [rows]);

  /* =======================================================
     VIEW RESUME
  ======================================================= */

  const handleViewResume = (resume) => {
    const url =
      getResumeFileUrl(resume);

    if (!url) {
      alert(
        'No resume file is available for this candidate.'
      );

      return;
    }

    window.open(
      url,
      '_blank',
      'noopener,noreferrer'
    );
  };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* =================================================
          HEADER
      ================================================= */}

      <motion.div
        variants={fadeUpItem}
        className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between"
      >
        <div>
          <div className="flex items-center gap-2">
            <Star className="h-5 w-5 text-brand-red" />

            <h1 className="text-2xl font-semibold tracking-tight text-foreground">
              Shortlisted Candidates
            </h1>
          </div>

          <p className="mt-1 text-sm text-muted-foreground">
            Review candidates selected for the
            next stage of your hiring process.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadData}
          disabled={loading}
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

      {/* =================================================
          STATISTICS
      ================================================= */}

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          label="Shortlisted"
          value={rows.length}
          description="Candidates currently shortlisted"
          icon={Star}
        />

        <StatCard
          label="High Match"
          value={highMatchCount}
          description="Candidates with 80%+ match"
          icon={CheckCircle2}
        />

        <StatCard
          label="With Resume"
          value={resumeCount}
          description="Shortlisted candidates with resumes"
          icon={FileText}
        />

        <StatCard
          label="Average Match"
          value={
            averageScore !== null
              ? `${averageScore}%`
              : '—'
          }
          description="Average AI match score"
          icon={CheckCircle2}
        />
      </motion.div>

      {/* =================================================
          MAIN CARD
      ================================================= */}

      <motion.div variants={fadeUpItem}>
        <Card className="border-border bg-card">
          <CardHeader>
            <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
              <div>
                <h2 className="text-base font-semibold tracking-tight text-foreground">
                  Shortlisted Candidates
                </h2>

                <p className="mt-0.5 text-xs text-muted-foreground">
                  Candidates with a shortlisted application status
                </p>
              </div>

              <div className="relative w-full lg:w-80">
                <Search className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                <Input
                  value={search}
                  onChange={(event) =>
                    setSearch(
                      event.target.value
                    )
                  }
                  placeholder="Search candidates..."
                  className="pl-9"
                />
              </div>
            </div>
          </CardHeader>

          <CardContent>
            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (
              <div className="flex h-52 items-center justify-center">
                <div className="text-center">
                  <RefreshCw className="mx-auto h-6 w-6 animate-spin text-brand-red" />

                  <p className="mt-3 text-sm text-muted-foreground">
                    Loading shortlisted candidates...
                  </p>
                </div>
              </div>
            )}

            {/* =================================================
                ERROR
            ================================================= */}

            {!loading && error && (
              <div className="flex min-h-52 flex-col items-center justify-center text-center">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-destructive/10">
                  <AlertCircle className="h-5 w-5 text-destructive" />
                </div>

                <p className="mt-3 font-medium text-destructive">
                  Unable to load shortlisted candidates
                </p>

                <p className="mt-1 max-w-md text-sm text-muted-foreground">
                  {error}
                </p>

                <Button
                  variant="outline"
                  size="sm"
                  className="mt-4"
                  onClick={loadData}
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>
              </div>
            )}

            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
              !error &&
              filteredRows.length === 0 && (
                <div className="flex min-h-52 flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">
                  <div className="flex h-10 w-10 items-center justify-center rounded-full bg-muted">
                    <Star className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <p className="mt-3 font-medium text-foreground">
                    {search
                      ? 'No matching candidates'
                      : 'No shortlisted candidates'}
                  </p>

                  <p className="mt-1 text-sm text-muted-foreground">
                    {search
                      ? 'Try a different search term.'
                      : 'Candidates will appear here when their application status is shortlisted.'}
                  </p>
                </div>
              )}

            {/* =================================================
                TABLE
            ================================================= */}

            {!loading &&
              !error &&
              filteredRows.length > 0 && (
                <div className="overflow-x-auto">
                  <table className="w-full min-w-[1100px]">
                    <thead>
                      <tr className="border-b border-border">
                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                          Candidate
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                          Job
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                          Match Score
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                          Skills
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                          Experience
                        </th>

                        <th className="px-3 py-3 text-left text-xs font-medium text-muted-foreground">
                          Applied
                        </th>

                        <th className="px-3 py-3 text-right text-xs font-medium text-muted-foreground">
                          Action
                        </th>
                      </tr>
                    </thead>

                    <tbody>
                      {filteredRows.map(
                        (row, index) => {
                          const applicationId =
                            row.application?.id ??
                            `${row.candidateName}-${row.jobTitle}-${index}`;

                          return (
                            <tr
                              key={applicationId}
                              className="border-b border-border last:border-0"
                            >
                              {/* CANDIDATE */}

                              <td className="px-3 py-4">
                                <CandidateCell
                                  candidate={row}
                                />
                              </td>

                              {/* JOB */}

                              <td className="px-3 py-4">
                                <div>
                                  <p className="font-medium text-foreground">
                                    {row.jobTitle}
                                  </p>

                                  <p className="mt-0.5 text-xs text-muted-foreground">
                                    {row.company}
                                  </p>
                                </div>
                              </td>

                              {/* SCORE */}

                              <td className="px-3 py-4">
                                <ScoreCell
                                  score={
                                    row.matchScore
                                  }
                                />
                              </td>

                              {/* SKILLS */}

                              <td className="max-w-[220px] px-3 py-4">
                                {row.skills ? (
                                  <span className="text-sm text-foreground">
                                    {Array.isArray(
                                      row.skills
                                    )
                                      ? row.skills.join(
                                          ', '
                                        )
                                      : String(
                                          row.skills
                                        )}
                                  </span>
                                ) : (
                                  <span className="text-sm text-muted-foreground">
                                    Not available
                                  </span>
                                )}
                              </td>

                              {/* EXPERIENCE */}

                              <td className="px-3 py-4">
                                <span className="text-sm text-foreground">
                                  {row.experience
                                    ? String(
                                        row.experience
                                      )
                                    : 'Not available'}
                                </span>
                              </td>

                              {/* APPLIED */}

                              <td className="px-3 py-4">
                                <span className="text-sm text-muted-foreground">
                                  {formatDate(
                                    row.appliedAt
                                  )}
                                </span>
                              </td>

                              {/* ACTION */}

                              <td className="px-3 py-4 text-right">
                                <div className="flex justify-end gap-2">
                                  {row.resume && (
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      onClick={() =>
                                        handleViewResume(
                                          row.resume
                                        )
                                      }
                                      disabled={
                                        !getResumeFileUrl(
                                          row.resume
                                        )
                                      }
                                    >
                                      <Eye className="mr-2 h-4 w-4" />
                                      View Resume
                                    </Button>
                                  )}

                                  <Badge
                                    variant="outline"
                                    className={cn(
                                      'border',
                                      getScoreBadgeClass(
                                        row.matchScore
                                      )
                                    )}
                                  >
                                    {formatStatus(
                                      row
                                        .application
                                        ?.status
                                    )}
                                  </Badge>
                                </div>
                              </td>
                            </tr>
                          );
                        }
                      )}
                    </tbody>
                  </table>
                </div>
              )}
          </CardContent>
        </Card>
      </motion.div>
    </motion.div>
  );
}

export default ShortlistedPage;