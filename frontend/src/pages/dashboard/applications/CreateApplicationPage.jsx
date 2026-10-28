import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';
import {
  BriefcaseBusiness,
  CheckCircle2,
  FileText,
  RefreshCw,
  Send,
  UserRound,
  Users,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  createApplication,
  getApplications,
  getJobs,
  getResumes,
  getUsers,
} from '@/services/api';

import {
  fadeUpItem,
  staggerContainer,
} from '@/lib/motion';

import { cn } from '@/lib/utils';

/* ==================================================
   HELPERS
================================================== */

function normalize(value) {
  return String(value ?? '').trim();
}

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

function getUserName(user) {
  if (!user) {
    return '';
  }

  const directName =
    user?.name ||
    user?.full_name ||
    user?.fullName ||
    user?.display_name ||
    user?.displayName ||
    user?.username;

  if (directName) {
    return normalize(directName);
  }

  const firstName =
    user?.first_name ||
    user?.firstName ||
    '';

  const lastName =
    user?.last_name ||
    user?.lastName ||
    '';

  return `${firstName} ${lastName}`.trim();
}

function getUserEmail(user) {
  return normalize(
    user?.email ||
      user?.email_address ||
      user?.emailAddress
  );
}

function getResumeUserId(resume) {
  return (
    resume?.user_id ??
    resume?.userId ??
    resume?.candidate_id ??
    resume?.candidateId ??
    resume?.user?.id ??
    resume?.candidate?.id ??
    null
  );
}

function getResumeName(resume) {
  return (
    normalize(
      resume?.file_name ||
        resume?.filename ||
        resume?.fileName ||
        resume?.name ||
        resume?.title
    ) || 'Unnamed Resume'
  );
}

function getJobTitle(job) {
  return (
    normalize(
      job?.title ||
        job?.name ||
        job?.job_title ||
        job?.jobTitle
    ) || `Job #${job?.id ?? ''}`
  );
}

function getApplicationUserId(application) {
  return (
    application?.user_id ??
    application?.userId ??
    application?.candidate_id ??
    application?.candidateId ??
    application?.applicant_id ??
    application?.applicantId ??
    application?.user?.id ??
    application?.candidate?.id ??
    application?.applicant?.id ??
    null
  );
}

function getApplicationResumeId(application) {
  return (
    application?.resume_id ??
    application?.resumeId ??
    application?.resume?.id ??
    null
  );
}

function getApplicationJobId(application) {
  return (
    application?.job_id ??
    application?.jobId ??
    application?.job?.id ??
    null
  );
}

function formatStatus(status) {
  const value = normalize(status).toLowerCase();

  if (!value) {
    return 'Applied';
  }

  return value.charAt(0).toUpperCase() + value.slice(1);
}

function statusClasses(status) {
  const value = normalize(status).toLowerCase();

  switch (value) {
    case 'shortlisted':
      return 'border-success/40 bg-success/10 text-success';

    case 'rejected':
      return 'border-destructive/40 bg-destructive/10 text-destructive';

    case 'interview':
    case 'interviewed':
      return 'border-warning/40 bg-warning/10 text-warning';

    case 'hired':
      return 'border-success/40 bg-success/10 text-success';

    default:
      return 'border-border bg-muted/40 text-muted-foreground';
  }
}

/* ==================================================
   APPLICATIONS PAGE
================================================== */

export function ApplicationsPage() {
  const [users, setUsers] = useState([]);
  const [resumes, setResumes] = useState([]);
  const [jobs, setJobs] = useState([]);
  const [applications, setApplications] = useState([]);

  const [loading, setLoading] = useState(true);
  const [creating, setCreating] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const [selectedUserId, setSelectedUserId] = useState('');
  const [selectedResumeId, setSelectedResumeId] = useState('');
  const [selectedJobId, setSelectedJobId] = useState('');
  const [status, setStatus] = useState('Applied');
  const [matchScore, setMatchScore] = useState('85');

  /* ==================================================
     LOAD DATA
  ================================================== */

  const loadData = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        usersData,
        resumesData,
        jobsData,
        applicationsData,
      ] = await Promise.all([
        getUsers(),
        getResumes(),
        getJobs(),
        getApplications(),
      ]);

      const userList = toArray(usersData);
      const resumeList = toArray(resumesData);
      const jobList = toArray(jobsData);
      const applicationList = toArray(applicationsData);

      setUsers(userList);
      setResumes(resumeList);
      setJobs(jobList);
      setApplications(applicationList);
    } catch (err) {
      console.error(
        'Failed to load application data:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to load application data.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadData();
  }, []);

  /* ==================================================
     SELECTED CANDIDATE
================================================== */

  const selectedUser = useMemo(() => {
    return users.find(
      (user) =>
        String(user?.id) ===
        String(selectedUserId)
    ) || null;
  }, [users, selectedUserId]);

  /* ==================================================
     FILTER RESUMES BY CANDIDATE
================================================== */

  const candidateResumes = useMemo(() => {
    if (!selectedUserId) {
      return [];
    }

    return resumes.filter((resume) => {
      const resumeUserId =
        getResumeUserId(resume);

      return (
        resumeUserId != null &&
        String(resumeUserId) ===
          String(selectedUserId)
      );
    });
  }, [resumes, selectedUserId]);

  /* ==================================================
     CHANGE CANDIDATE
================================================== */

  const handleCandidateChange = (event) => {
    const userId = event.target.value;

    setSelectedUserId(userId);

    /*
     * Reset resume whenever the candidate changes.
     * This prevents assigning another candidate's resume.
     */
    setSelectedResumeId('');
    setSuccess('');
    setError('');
  };

  /* ==================================================
     CREATE APPLICATION
================================================== */

  const handleCreateApplication = async (
    event
  ) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!selectedUserId) {
      setError('Please select a candidate.');
      return;
    }

    if (!selectedResumeId) {
      setError('Please select a resume.');
      return;
    }

    if (!selectedJobId) {
      setError('Please select a job.');
      return;
    }

    const numericScore = Number(matchScore);

    if (
      matchScore === '' ||
      !Number.isFinite(numericScore) ||
      numericScore < 0 ||
      numericScore > 100
    ) {
      setError(
        'Match score must be a number between 0 and 100.'
      );
      return;
    }

    /*
     * IMPORTANT:
     *
     * Candidate -> User
     * Resume -> Resume
     * Job -> Job
     *
     * These IDs are sent exactly as required by
     * the existing Application API.
     */
    const applicationData = {
      user_id: Number(selectedUserId),
      resume_id: Number(selectedResumeId),
      job_id: Number(selectedJobId),
      status,
      match_score: numericScore,
    };

    try {
      setCreating(true);

      await createApplication(
        applicationData
      );

      setSuccess(
        `Application created successfully for ${
          getUserName(selectedUser) ||
          'the selected candidate'
        }.`
      );

      /*
       * Reset only the application-specific fields.
       * Keep the candidate selected so the user can
       * easily create another application if needed.
       */
      setSelectedResumeId('');
      setSelectedJobId('');
      setStatus('Applied');
      setMatchScore('85');

      await loadData();
    } catch (err) {
      console.error(
        'Failed to create application:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create application.'
      );
    } finally {
      setCreating(false);
    }
  };

  /* ==================================================
     APPLICATION TABLE
================================================== */

  const applicationRows = useMemo(() => {
    return applications.map(
      (application) => {
        const userId =
          getApplicationUserId(application);

        const resumeId =
          getApplicationResumeId(application);

        const jobId =
          getApplicationJobId(application);

        const user =
          users.find(
            (item) =>
              String(item?.id) ===
              String(userId)
          ) || null;

        const resume =
          resumes.find(
            (item) =>
              String(item?.id) ===
              String(resumeId)
          ) || null;

        const job =
          jobs.find(
            (item) =>
              String(item?.id) ===
              String(jobId)
          ) || null;

        return {
          application,
          user,
          resume,
          job,
          candidateName:
            getUserName(user) ||
            normalize(
              application?.candidate_name ||
                application?.candidateName
            ) ||
            'Unknown Candidate',
          candidateEmail:
            getUserEmail(user) ||
            normalize(application?.email) ||
            '—',
          resumeName: resume
            ? getResumeName(resume)
            : 'Resume not found',
          jobTitle: job
            ? getJobTitle(job)
            : normalize(
                application?.job_title ||
                  application?.jobTitle
              ) || 'Job not found',
          status:
            normalize(application?.status)
              .toLowerCase() ||
            'applied',
          score:
            Number.isFinite(
              Number(
                application?.match_score ??
                  application?.matchScore
              )
            )
              ? Number(
                  application?.match_score ??
                    application?.matchScore
                )
              : null,
        };
      }
    );
  }, [
    applications,
    users,
    resumes,
    jobs,
  ]);

  /* ==================================================
     STATS
================================================== */

  const appliedCount =
    applicationRows.filter(
      (row) =>
        row.status === 'applied'
    ).length;

  const shortlistedCount =
    applicationRows.filter(
      (row) =>
        row.status === 'shortlisted'
    ).length;

  const interviewCount =
    applicationRows.filter(
      (row) =>
        row.status === 'interview' ||
        row.status === 'interviewed'
    ).length;

  /* ==================================================
     LOADING
================================================== */

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
            Applications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Loading applications...
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-28 animate-pulse rounded-xl border border-border bg-card"
              />
            )
          )}
        </div>

        <div className="h-96 animate-pulse rounded-xl border border-border bg-card" />
      </motion.div>
    );
  }

  /* ==================================================
     MAIN UI
================================================== */

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
        className="flex flex-col gap-4 sm:flex-row sm:items-end sm:justify-between"
      >
        <div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            Applications
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Assign candidates to jobs using their
            uploaded resumes.
          </p>
        </div>

        <Button
          variant="outline"
          onClick={loadData}
          disabled={loading || creating}
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

      {/* ALERTS */}

      {error && (
        <motion.div
          variants={fadeUpItem}
          className="rounded-xl border border-destructive/30 bg-destructive/10 p-4"
        >
          <p className="text-sm font-medium text-destructive">
            {error}
          </p>
        </motion.div>
      )}

      {success && (
        <motion.div
          variants={fadeUpItem}
          className="flex items-center gap-2 rounded-xl border border-success/30 bg-success/10 p-4"
        >
          <CheckCircle2 className="h-5 w-5 text-success" />

          <p className="text-sm font-medium text-success">
            {success}
          </p>
        </motion.div>
      )}

      {/* STATS */}

      <motion.div
        variants={staggerContainer}
        className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
      >
        <StatCard
          icon={Users}
          label="Total Applications"
          value={applications.length}
          description="All applications"
        />

        <StatCard
          icon={Send}
          label="Applied"
          value={appliedCount}
          description="Applications awaiting review"
        />

        <StatCard
          icon={CheckCircle2}
          label="Shortlisted"
          value={shortlistedCount}
          description="Candidates shortlisted"
        />

        <StatCard
          icon={BriefcaseBusiness}
          label="Interview Stage"
          value={interviewCount}
          description="Applications in interview stage"
        />
      </motion.div>

      {/* CREATE APPLICATION */}

      <motion.div variants={fadeUpItem}>
        <Card className="border-border bg-card">
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Create Application
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Select a candidate, their resume,
                and a job to create an application.
              </p>
            </div>
          </CardHeader>

          <CardContent>
            <form
              onSubmit={handleCreateApplication}
              className="space-y-5"
            >
              <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
                {/* CANDIDATE */}

                <div className="space-y-2">
                  <label
                    htmlFor="candidate"
                    className="text-sm font-medium text-foreground"
                  >
                    Candidate
                  </label>

                  <select
                    id="candidate"
                    value={selectedUserId}
                    onChange={
                      handleCandidateChange
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-red"
                  >
                    <option value="">
                      Select candidate
                    </option>

                    {users.map((user) => (
                      <option
                        key={user.id}
                        value={user.id}
                      >
                        {getUserName(user) ||
                          `User #${user.id}`}
                        {getUserEmail(user)
                          ? ` — ${getUserEmail(user)}`
                          : ''}
                      </option>
                    ))}
                  </select>
                </div>

                {/* RESUME */}

                <div className="space-y-2">
                  <label
                    htmlFor="resume"
                    className="text-sm font-medium text-foreground"
                  >
                    Resume
                  </label>

                  <select
                    id="resume"
                    value={selectedResumeId}
                    onChange={(event) =>
                      setSelectedResumeId(
                        event.target.value
                      )
                    }
                    disabled={
                      !selectedUserId ||
                      candidateResumes.length ===
                        0
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-red disabled:cursor-not-allowed disabled:opacity-50"
                  >
                    <option value="">
                      {!selectedUserId
                        ? 'Select candidate first'
                        : candidateResumes.length ===
                            0
                          ? 'No resumes for this candidate'
                          : 'Select resume'}
                    </option>

                    {candidateResumes.map(
                      (resume) => (
                        <option
                          key={resume.id}
                          value={resume.id}
                        >
                          {getResumeName(
                            resume
                          )}
                        </option>
                      )
                    )}
                  </select>

                  {selectedUserId &&
                    candidateResumes.length ===
                      0 && (
                      <p className="text-xs text-destructive">
                        This candidate does not
                        have an uploaded resume.
                      </p>
                    )}
                </div>

                {/* JOB */}

                <div className="space-y-2">
                  <label
                    htmlFor="job"
                    className="text-sm font-medium text-foreground"
                  >
                    Job
                  </label>

                  <select
                    id="job"
                    value={selectedJobId}
                    onChange={(event) =>
                      setSelectedJobId(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-red"
                  >
                    <option value="">
                      Select job
                    </option>

                    {jobs.map((job) => (
                      <option
                        key={job.id}
                        value={job.id}
                      >
                        {getJobTitle(job)}
                      </option>
                    ))}
                  </select>
                </div>

                {/* STATUS */}

                <div className="space-y-2">
                  <label
                    htmlFor="status"
                    className="text-sm font-medium text-foreground"
                  >
                    Status
                  </label>

                  <select
                    id="status"
                    value={status}
                    onChange={(event) =>
                      setStatus(
                        event.target.value
                      )
                    }
                    className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-red"
                  >
                    <option value="Applied">
                      Applied
                    </option>

                    <option value="Shortlisted">
                      Shortlisted
                    </option>

                    <option value="Interview">
                      Interview
                    </option>

                    <option value="Hired">
                      Hired
                    </option>

                    <option value="Rejected">
                      Rejected
                    </option>
                  </select>
                </div>

                {/* MATCH SCORE */}

                <div className="space-y-2">
                  <label
                    htmlFor="match-score"
                    className="text-sm font-medium text-foreground"
                  >
                    Match Score
                  </label>

                  <Input
                    id="match-score"
                    type="number"
                    min="0"
                    max="100"
                    value={matchScore}
                    onChange={(event) =>
                      setMatchScore(
                        event.target.value
                      )
                    }
                    placeholder="85"
                  />

                  <p className="text-xs text-muted-foreground">
                    Enter a score from 0 to 100.
                  </p>
                </div>
              </div>

              {/* SELECTED CANDIDATE SUMMARY */}

              {selectedUser && (
                <div className="rounded-lg border border-border bg-muted/20 p-4">
                  <div className="flex items-center gap-3">
                    <div className="flex h-10 w-10 items-center justify-center rounded-full bg-brand-red/10 text-brand-red">
                      <UserRound className="h-5 w-5" />
                    </div>

                    <div>
                      <p className="text-sm font-semibold text-foreground">
                        {getUserName(
                          selectedUser
                        ) ||
                          `User #${selectedUser.id}`}
                      </p>

                      <p className="text-xs text-muted-foreground">
                        {getUserEmail(
                          selectedUser
                        ) ||
                          'No email available'}
                      </p>
                    </div>
                  </div>
                </div>
              )}

              {/* SUBMIT */}

              <div className="flex justify-end">
                <Button
                  type="submit"
                  disabled={
                    creating ||
                    !selectedUserId ||
                    !selectedResumeId ||
                    !selectedJobId
                  }
                >
                  {creating ? (
                    <>
                      <RefreshCw className="mr-2 h-4 w-4 animate-spin" />
                      Creating...
                    </>
                  ) : (
                    <>
                      <Send className="mr-2 h-4 w-4" />
                      Create Application
                    </>
                  )}
                </Button>
              </div>
            </form>
          </CardContent>
        </Card>
      </motion.div>

      {/* EXISTING APPLICATIONS */}

      <motion.div variants={fadeUpItem}>
        <Card className="border-border bg-card">
          <CardHeader>
            <div>
              <h2 className="text-base font-semibold text-foreground">
                Applications
              </h2>

              <p className="mt-1 text-sm text-muted-foreground">
                Existing candidate applications.
              </p>
            </div>
          </CardHeader>

          <CardContent className="p-0">
            {applicationRows.length === 0 ? (
              <div className="flex min-h-[220px] flex-col items-center justify-center p-6 text-center">
                <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                  <FileText className="h-5 w-5 text-muted-foreground" />
                </div>

                <h3 className="mt-4 text-sm font-semibold text-foreground">
                  No applications yet
                </h3>

                <p className="mt-1 text-sm text-muted-foreground">
                  Create an application using the
                  form above.
                </p>
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[900px] text-sm">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Candidate
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Resume
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Job
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Status
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Match Score
                      </th>

                      <th className="px-6 py-3 text-left font-medium text-muted-foreground">
                        Application ID
                      </th>
                    </tr>
                  </thead>

                  <tbody>
                    {applicationRows.map(
                      (row) => (
                        <tr
                          key={
                            row.application?.id
                          }
                          className="border-b border-border last:border-0"
                        >
                          <td className="px-6 py-4">
                            <div className="flex items-center gap-3">
                              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-semibold text-brand-red">
                                {getUserName(
                                  row.user
                                )
                                  .slice(0, 2)
                                  .toUpperCase() ||
                                  'NA'}
                              </div>

                              <div>
                                <p className="font-medium text-foreground">
                                  {
                                    row.candidateName
                                  }
                                </p>

                                <p className="text-xs text-muted-foreground">
                                  {
                                    row.candidateEmail
                                  }
                                </p>
                              </div>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <FileText className="h-4 w-4 text-muted-foreground" />

                              <span className="max-w-[220px] truncate text-foreground">
                                {
                                  row.resumeName
                                }
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <div className="flex items-center gap-2">
                              <BriefcaseBusiness className="h-4 w-4 text-muted-foreground" />

                              <span className="text-foreground">
                                {
                                  row.jobTitle
                                }
                              </span>
                            </div>
                          </td>

                          <td className="px-6 py-4">
                            <Badge
                              variant="outline"
                              className={cn(
                                'border',
                                statusClasses(
                                  row.status
                                )
                              )}
                            >
                              {formatStatus(
                                row.status
                              )}
                            </Badge>
                          </td>

                          <td className="px-6 py-4">
                            {row.score != null ? (
                              <span className="font-semibold text-foreground">
                                {row.score}%
                              </span>
                            ) : (
                              <span className="text-muted-foreground">
                                —
                              </span>
                            )}
                          </td>

                          <td className="px-6 py-4 text-muted-foreground">
                            {row.application?.id ??
                              '—'}
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
    </motion.div>
  );
}

/* ==================================================
   STAT CARD
================================================== */

function StatCard({
  icon: Icon,
  label,
  value,
  description,
}) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="border-border bg-card">
        <CardContent className="p-5">
          <div className="flex items-start justify-between gap-3">
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

            <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl bg-brand-red/10">
              <Icon className="h-5 w-5 text-brand-red" />
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default ApplicationsPage;