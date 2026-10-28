import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import {
  CheckCircle2,
  FileText,
  Mail,
  RefreshCw,
  Search,
  Star,
  UserRound,
  Upload,
  X,
} from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

import {
  getApplications,
  getResumes,
  getUsers,
  uploadResume,
} from '@/services/api';

import { cn } from '@/lib/utils';

/* =========================================================
   HELPERS
========================================================= */

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

function getInitials(name) {
  if (!name) {
    return 'U';
  }

  const parts = String(name)
    .trim()
    .split(/\s+/)
    .filter(Boolean);

  if (parts.length === 1) {
    return parts[0]
      .substring(0, 2)
      .toUpperCase();
  }

  return (
    parts[0][0] +
    parts[parts.length - 1][0]
  ).toUpperCase();
}

function formatFileSize(bytes) {
  const value = Number(bytes);

  if (!Number.isFinite(value) || value <= 0) {
    return '—';
  }

  if (value < 1024) {
    return `${value} B`;
  }

  if (value < 1024 * 1024) {
    return `${Math.round(value / 1024)} KB`;
  }

  return `${(value / (1024 * 1024)).toFixed(1)} MB`;
}

function formatDate(value) {
  if (!value) {
    return '—';
  }

  const date = new Date(value);

  if (Number.isNaN(date.getTime())) {
    return '—';
  }

  return date.toLocaleDateString(
    undefined,
    {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    }
  );
}

function getAtsClass(score) {
  const value = Number(score);

  if (value >= 90) {
    return 'border-green-500/30 bg-green-500/10 text-green-400';
  }

  if (value >= 75) {
    return 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400';
  }

  return 'border-border bg-muted text-muted-foreground';
}

function getCompletionClass(completion) {
  const value = Number(completion);

  if (value >= 90) {
    return 'text-green-400';
  }

  if (value >= 70) {
    return 'text-yellow-400';
  }

  return 'text-muted-foreground';
}

/* =========================================================
   APPLICATION MATCHING
========================================================= */

function findMatchingApplication(
  resume,
  applications
) {
  if (!resume || !applications.length) {
    return null;
  }

  const resumeId =
    resume?.id ?? null;

  const resumeUserId =
    resume?.user_id ??
    resume?.userId ??
    resume?.user?.id ??
    resume?.candidate_id ??
    resume?.candidateId ??
    resume?.candidate?.id ??
    null;

  /* -------------------------------------------------------
     1. DIRECT RESUME ID MATCH
  ------------------------------------------------------- */

  if (resumeId != null) {
    const byResumeId =
      applications.find(
        (application) => {
          const applicationResumeId =
            application?.resume_id ??
            application?.resumeId ??
            application?.resume?.id ??
            null;

          return (
            applicationResumeId != null &&
            String(applicationResumeId) ===
              String(resumeId)
          );
        }
      );

    if (byResumeId) {
      return byResumeId;
    }
  }

  /* -------------------------------------------------------
     2. USER ID MATCH
  ------------------------------------------------------- */

  if (resumeUserId != null) {
    const byUserId =
      applications.find(
        (application) => {
          const applicationUserId =
            application?.user_id ??
            application?.userId ??
            application?.candidate_id ??
            application?.candidateId ??
            application?.applicant_id ??
            application?.applicantId ??
            application?.user?.id ??
            application?.candidate?.id ??
            application?.applicant?.id ??
            null;

          return (
            applicationUserId != null &&
            String(applicationUserId) ===
              String(resumeUserId)
          );
        }
      );

    if (byUserId) {
      return byUserId;
    }
  }

  return null;
}

/* =========================================================
   RESUME CARD
========================================================= */

function ResumeCard({
  resume,
}) {
  const candidateName =
    resume?.user?.name ||
    resume?.user?.full_name ||
    resume?.user?.fullName ||
    resume?.name ||
    resume?.full_name ||
    resume?.fullName ||
    `Candidate #${resume?.user_id ?? '—'}`;

  const email =
    resume?.user?.email ||
    resume?.email ||
    '';

  const initials =
    getInitials(candidateName);

  const atsScore =
    resume?.ats_score !== null &&
    resume?.ats_score !== undefined
      ? Number(resume.ats_score)
      : null;

  const completion =
    resume?.completion !== null &&
    resume?.completion !== undefined
      ? Number(resume.completion)
      : null;

  const application =
    resume?.application || null;

  const applicationStatus =
    application?.status || null;

  const handleViewResume = () => {
    if (!resume?.file_path) {
      alert(
        'No resume file is available.'
      );

      return;
    }

    const apiUrl =
      import.meta.env.VITE_API_URL ||
      'http://127.0.0.1:8000';

    const filePath = String(
      resume.file_path
    )
      .replace(/\\/g, '/')
      .replace(/^\/+/, '');

    const resumeUrl =
      `${apiUrl}/${filePath}`;

    window.open(
      resumeUrl,
      '_blank',
      'noopener,noreferrer'
    );
  };

  return (
    <Card
      className={cn(
        'border-border bg-card transition-all',
        application
          ? 'hover:border-green-500/40'
          : 'hover:border-brand-red/40'
      )}
    >
      <CardContent className="p-5">

        {/* HEADER */}

        <div className="flex items-start justify-between gap-4">

          <div className="flex min-w-0 items-center gap-3">

            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/10 font-semibold text-brand-red">
              {initials}
            </div>

            <div className="min-w-0">

              <h3 className="truncate text-base font-semibold text-foreground">
                {candidateName}
              </h3>

              <div className="mt-1 flex min-w-0 items-center gap-2 text-xs text-muted-foreground">

                <FileText className="h-3.5 w-3.5 shrink-0" />

                <span className="truncate">
                  {resume?.file_name ||
                    'Resume'}
                </span>

              </div>

            </div>

          </div>

          {atsScore !== null &&
            Number.isFinite(atsScore) && (
              <Badge
                variant="outline"
                className={cn(
                  'shrink-0',
                  getAtsClass(atsScore)
                )}
              >
                <Star className="mr-1 h-3.5 w-3.5" />
                ATS {atsScore}
              </Badge>
            )}

        </div>

        {/* DETAILS */}

        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2">

          <div className="flex items-center gap-2 text-xs text-muted-foreground">

            <FileText className="h-4 w-4" />

            <span>
              Template:{' '}

              <span className="text-foreground">
                {resume?.template_name ||
                  '—'}
              </span>
            </span>

          </div>

          <div className="flex items-center gap-2 text-xs text-muted-foreground">

            <CheckCircle2 className="h-4 w-4" />

            <span>
              Completion:{' '}

              <span
                className={cn(
                  'font-medium',
                  getCompletionClass(
                    completion
                  )
                )}
              >
                {completion !== null &&
                Number.isFinite(completion)
                  ? `${completion}%`
                  : '—'}
              </span>
            </span>

          </div>

          {email && (
            <div className="flex min-w-0 items-center gap-2 text-xs text-muted-foreground">

              <Mail className="h-4 w-4 shrink-0" />

              <span className="truncate">
                {email}
              </span>

            </div>
          )}

          <div className="flex items-center gap-2 text-xs text-muted-foreground">

            <FileText className="h-4 w-4" />

            <span>
              Size:{' '}

              <span className="text-foreground">
                {formatFileSize(
                  resume?.file_size
                )}
              </span>
            </span>

          </div>

        </div>

        {/* COMPLETION */}

        {completion !== null &&
          Number.isFinite(completion) && (
            <div className="mt-5">

              <div className="mb-1.5 flex items-center justify-between">

                <span className="text-[11px] text-muted-foreground">
                  Resume completion
                </span>

                <span className="text-[11px] font-medium">
                  {completion}%
                </span>

              </div>

              <div className="h-1.5 overflow-hidden rounded-full bg-muted">

                <div
                  className={cn(
                    'h-full rounded-full',
                    completion >= 90
                      ? 'bg-green-500'
                      : completion >= 70
                        ? 'bg-yellow-500'
                        : 'bg-gray-500'
                  )}
                  style={{
                    width: `${Math.min(
                      Math.max(
                        completion,
                        0
                      ),
                      100
                    )}%`,
                  }}
                />

              </div>

            </div>
          )}

        {/* APPLICATION */}

        <div className="mt-5 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">

          <div className="flex items-center gap-2 text-xs text-muted-foreground">

            <UserRound className="h-3.5 w-3.5" />

            {application ? (
              <span>
                Application #
                {application?.id ??
                  '—'}
              </span>
            ) : (
              <span>
                No application linked
              </span>
            )}

          </div>

          {applicationStatus ? (
            <Badge
              variant="outline"
              className={cn(
                'w-fit',
                String(
                  applicationStatus
                ).toLowerCase() ===
                  'shortlisted'
                  ? 'border-green-500/30 bg-green-500/10 text-green-400'
                  : String(
                        applicationStatus
                      ).toLowerCase() ===
                      'hired'
                    ? 'border-green-500/30 bg-green-500/10 text-green-400'
                    : String(
                          applicationStatus
                        ).toLowerCase() ===
                        'rejected'
                      ? 'border-red-500/30 bg-red-500/10 text-red-400'
                      : String(
                            applicationStatus
                          ).toLowerCase() ===
                          'interview'
                        ? 'border-yellow-500/30 bg-yellow-500/10 text-yellow-400'
                        : 'border-border bg-muted text-muted-foreground'
              )}
            >
              {String(
                applicationStatus
              )
                .charAt(0)
                .toUpperCase() +
                String(
                  applicationStatus
                ).slice(1)}
            </Badge>
          ) : (
            <Badge
              variant="outline"
              className="w-fit border-border bg-muted text-muted-foreground"
            >
              Not Applied
            </Badge>
          )}

        </div>

        {/* JOB INFORMATION */}

        {application && (
          <div className="mt-3 rounded-lg border border-border bg-muted/20 p-3">

            <div className="grid grid-cols-1 gap-2 text-xs sm:grid-cols-2">

              <div>
                <span className="text-muted-foreground">
                  Job ID:{' '}
                </span>

                <span className="text-foreground">
                  {application?.job_id ??
                    application?.jobId ??
                    application?.job?.id ??
                    '—'}
                </span>
              </div>

              <div>
                <span className="text-muted-foreground">
                  Resume ID:{' '}
                </span>

                <span className="text-foreground">
                  {application?.resume_id ??
                    application?.resumeId ??
                    application?.resume?.id ??
                    '—'}
                </span>
              </div>

            </div>

          </div>
        )}

        {/* FOOTER */}

        <div className="mt-4 flex flex-col gap-3 border-t border-border pt-4 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-[11px] text-muted-foreground">
            Uploaded{' '}
            {formatDate(
              resume?.created_at
            )}
          </p>

          {resume?.file_path && (
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={
                handleViewResume
              }
              className="w-fit gap-2"
            >
              <FileText className="h-4 w-4" />
              View Resume
            </Button>
          )}

        </div>

      </CardContent>
    </Card>
  );
}

/* =========================================================
   UPLOAD RESUME MODAL
========================================================= */

function UploadResumeModal({
  open,
  onClose,
  users,
  onUploaded,
}) {
  const [selectedUserId, setSelectedUserId] =
    useState('');

  const [selectedFile, setSelectedFile] =
    useState(null);

  const [templateName, setTemplateName] =
    useState('Modern Professional');

  const [completion, setCompletion] =
    useState('90');

  const [atsScore, setAtsScore] =
    useState('85');

  const [uploading, setUploading] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  useEffect(() => {
    if (!open) {
      setSelectedUserId('');
      setSelectedFile(null);
      setTemplateName(
        'Modern Professional'
      );
      setCompletion('90');
      setAtsScore('85');
      setUploading(false);
      setError('');
      setSuccess('');
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleFileChange = (
    event
  ) => {
    const file =
      event.target.files?.[0] ||
      null;

    setError('');
    setSuccess('');

    if (!file) {
      setSelectedFile(null);
      return;
    }

    if (
      file.type !==
      'application/pdf'
    ) {
      setSelectedFile(null);
      setError(
        'Only PDF resumes are allowed.'
      );

      event.target.value = '';
      return;
    }

    setSelectedFile(file);
  };

  const handleUpload = async () => {
    setError('');
    setSuccess('');

    if (!selectedUserId) {
      setError(
        'Please select a candidate.'
      );
      return;
    }

    if (!selectedFile) {
      setError(
        'Please select a PDF resume.'
      );
      return;
    }

    try {
      setUploading(true);

      await uploadResume({
        userId: selectedUserId,
        file: selectedFile,
        templateName,
        completion,
        atsScore,
      });

      setSuccess(
        'Resume uploaded successfully.'
      );

      await onUploaded();

      setTimeout(() => {
        onClose();
      }, 800);
    } catch (err) {
      console.error(
        'UPLOAD RESUME ERROR:',
        err
      );

      setError(
        err?.message ||
          'Unable to upload resume.'
      );
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm">

      <div className="w-full max-w-lg rounded-xl border border-border bg-card shadow-2xl">

        {/* MODAL HEADER */}

        <div className="flex items-center justify-between border-b border-border p-5">

          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Upload Resume
            </h2>

            <p className="mt-1 text-xs text-muted-foreground">
              Add a candidate resume to HireNext.
            </p>
          </div>

          <Button
            type="button"
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={uploading}
          >
            <X className="h-5 w-5" />
          </Button>

        </div>

        {/* MODAL BODY */}

        <div className="space-y-5 p-5">

          {/* CANDIDATE */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-foreground">
              Candidate
            </label>

            <select
              value={selectedUserId}
              onChange={(event) =>
                setSelectedUserId(
                  event.target.value
                )
              }
              disabled={uploading}
              className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-brand-red"
            >
              <option value="">
                Select candidate
              </option>

              {users.map((user) => (
                <option
                  key={user.id}
                  value={user.id}
                >
                  {user?.name ||
                    user?.full_name ||
                    user?.fullName ||
                    `Candidate #${user.id}`}
                  {user?.email
                    ? ` — ${user.email}`
                    : ''}
                </option>
              ))}

            </select>

            {users.length === 0 && (
              <p className="text-xs text-yellow-400">
                No candidates found. Create a candidate first.
              </p>
            )}

          </div>

          {/* PDF */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-foreground">
              Resume PDF
            </label>

            <label
              htmlFor="resume-upload-input"
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-lg border border-dashed border-border bg-background p-6 text-center transition hover:border-brand-red/60',
                uploading &&
                  'pointer-events-none opacity-50'
              )}
            >

              <Upload className="h-8 w-8 text-brand-red" />

              <span className="mt-2 text-sm font-medium text-foreground">
                {selectedFile
                  ? selectedFile.name
                  : 'Choose PDF resume'}
              </span>

              <span className="mt-1 text-xs text-muted-foreground">
                PDF files only
              </span>

              <input
                id="resume-upload-input"
                type="file"
                accept=".pdf,application/pdf"
                onChange={
                  handleFileChange
                }
                className="hidden"
                disabled={uploading}
              />

            </label>

          </div>

          {/* TEMPLATE */}

          <div className="space-y-2">

            <label className="text-sm font-medium text-foreground">
              Template Name
            </label>

            <Input
              value={templateName}
              onChange={(event) =>
                setTemplateName(
                  event.target.value
                )
              }
              placeholder="Modern Professional"
              disabled={uploading}
            />

          </div>

          {/* COMPLETION + ATS */}

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">

            <div className="space-y-2">

              <label className="text-sm font-medium text-foreground">
                Completion %
              </label>

              <Input
                type="number"
                min="0"
                max="100"
                value={completion}
                onChange={(event) =>
                  setCompletion(
                    event.target.value
                  )
                }
                disabled={uploading}
              />

            </div>

            <div className="space-y-2">

              <label className="text-sm font-medium text-foreground">
                ATS Score
              </label>

              <Input
                type="number"
                min="0"
                max="100"
                value={atsScore}
                onChange={(event) =>
                  setAtsScore(
                    event.target.value
                  )
                }
                disabled={uploading}
              />

            </div>

          </div>

          {/* ERROR */}

          {error && (
            <div className="rounded-lg border border-red-500/30 bg-red-500/10 p-3 text-sm text-red-400">
              {error}
            </div>
          )}

          {/* SUCCESS */}

          {success && (
            <div className="rounded-lg border border-green-500/30 bg-green-500/10 p-3 text-sm text-green-400">
              {success}
            </div>
          )}

        </div>

        {/* MODAL FOOTER */}

        <div className="flex items-center justify-end gap-2 border-t border-border p-5">

          <Button
            type="button"
            variant="outline"
            onClick={onClose}
            disabled={uploading}
          >
            Cancel
          </Button>

          <Button
            type="button"
            onClick={handleUpload}
            disabled={
              uploading ||
              !selectedUserId ||
              !selectedFile
            }
            className="gap-2 bg-brand-red text-white hover:bg-brand-red/90"
          >

            {uploading ? (
              <>
                <RefreshCw className="h-4 w-4 animate-spin" />
                Uploading...
              </>
            ) : (
              <>
                <Upload className="h-4 w-4" />
                Upload Resume
              </>
            )}

          </Button>

        </div>

      </div>

    </div>
  );
}

/* =========================================================
   MAIN PAGE
========================================================= */

export function ResumesPage() {
  const [resumes, setResumes] =
    useState([]);

  const [users, setUsers] =
    useState([]);

  const [applications, setApplications] =
    useState([]);

  const [search, setSearch] =
    useState('');

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [showUpload, setShowUpload] =
    useState(false);

  /* =======================================================
     LOAD
  ======================================================= */

  const loadResumes = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        resumesData,
        usersData,
        applicationsData,
      ] = await Promise.all([
        getResumes(),
        getUsers(),
        getApplications(),
      ]);

      const resumeList =
        toArray(resumesData);

      const userList =
        toArray(usersData);

      const applicationList =
        toArray(
          applicationsData
        );

      console.log(
        'RESUME DATA:',
        resumeList
      );

      console.log(
        'APPLICATION DATA:',
        applicationList
      );

      /* ---------------------------------------------------
         JOIN RESUMES → USERS → APPLICATIONS
      --------------------------------------------------- */

      const enriched =
        resumeList.map(
          (resume) => {

            const resumeUserId =
              resume?.user_id ??
              resume?.userId ??
              resume?.user?.id ??
              resume?.candidate_id ??
              resume?.candidateId ??
              resume?.candidate?.id ??
              null;

            const user =
              userList.find(
                (item) =>
                  resumeUserId != null &&
                  item?.id != null &&
                  String(item.id) ===
                    String(
                      resumeUserId
                    )
              ) || null;

            const application =
              findMatchingApplication(
                resume,
                applicationList
              );

            console.log(
              'RESUME MATCH:',
              {
                resumeId:
                  resume?.id,
                resumeUserId,
                applicationId:
                  application?.id,
                applicationResumeId:
                  application?.resume_id ??
                  application?.resumeId,
                applicationUserId:
                  application?.user_id ??
                  application?.userId ??
                  application?.candidate_id ??
                  application?.candidateId,
              }
            );

            return {
              ...resume,
              user,
              application,
            };
          }
        );

      setResumes(enriched);
      setUsers(userList);
      setApplications(
        applicationList
      );

    } catch (err) {
      console.error(
        'RESUMES ERROR:',
        err
      );

      setError(
        err?.message ||
          'Unable to load resumes.'
      );
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadResumes();
  }, []);

  /* =======================================================
     SEARCH
  ======================================================= */

  const filteredResumes =
    useMemo(() => {

      const query =
        search
          .trim()
          .toLowerCase();

      if (!query) {
        return resumes;
      }

      return resumes.filter(
        (resume) => {

          const values = [
            resume?.file_name,
            resume?.template_name,
            resume?.user?.name,
            resume?.user?.full_name,
            resume?.user?.email,
            resume?.user?.phone,
            resume?.application
              ?.status,
            resume?.application
              ?.job_id,
            resume?.application
              ?.job?.title,
          ];

          return values
            .filter(Boolean)
            .join(' ')
            .toLowerCase()
            .includes(query);
        }
      );

    }, [
      resumes,
      search,
    ]);

  /* =======================================================
     STATS
  ======================================================= */

  const averageAtsScore =
    useMemo(() => {

      const scores =
        resumes
          .map((resume) =>
            Number(
              resume?.ats_score
            )
          )
          .filter((score) =>
            Number.isFinite(
              score
            )
          );

      if (!scores.length) {
        return 0;
      }

      return Math.round(
        scores.reduce(
          (sum, score) =>
            sum + score,
          0
        ) / scores.length
      );

    }, [resumes]);

  const shortlistedResumes =
    resumes.filter(
      (resume) =>
        String(
          resume?.application
            ?.status || ''
        ).toLowerCase() ===
        'shortlisted'
    ).length;

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <>
      <motion.div
        initial={{
          opacity: 0,
          y: 10,
        }}
        animate={{
          opacity: 1,
          y: 0,
        }}
        className="w-full space-y-6"
      >

        {/* HEADER */}

        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">

          <div>

            <h1 className="text-2xl font-semibold text-foreground">
              Resumes
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              Review candidate resumes, ATS scores, and applications.
            </p>

          </div>

          <div className="flex flex-wrap items-center gap-2">

            <Button
              type="button"
              variant="outline"
              onClick={loadResumes}
              disabled={loading}
            >
              <RefreshCw
                className={cn(
                  'mr-2 h-4 w-4',
                  loading &&
                    'animate-spin'
                )}
              />

              Refresh
            </Button>

            <Button
              type="button"
              onClick={() =>
                setShowUpload(true)
              }
              className="gap-2 bg-brand-red text-white hover:bg-brand-red/90"
            >
              <Upload className="h-4 w-4" />

              Upload Resume
            </Button>

          </div>

        </div>

        {/* STATS */}

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">

          <Card>
            <CardContent className="p-5">

              <p className="text-sm text-muted-foreground">
                Total Resumes
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {loading
                  ? '—'
                  : resumes.length}
              </p>

              <FileText className="mt-4 h-6 w-6 text-brand-red" />

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">

              <p className="text-sm text-muted-foreground">
                Candidates
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {loading
                  ? '—'
                  : users.length}
              </p>

              <UserRound className="mt-4 h-6 w-6 text-blue-400" />

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">

              <p className="text-sm text-muted-foreground">
                Average ATS Score
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {loading
                  ? '—'
                  : averageAtsScore}
              </p>

              <Star className="mt-4 h-6 w-6 text-green-400" />

            </CardContent>
          </Card>

          <Card>
            <CardContent className="p-5">

              <p className="text-sm text-muted-foreground">
                Shortlisted
              </p>

              <p className="mt-2 text-3xl font-semibold">
                {loading
                  ? '—'
                  : shortlistedResumes}
              </p>

              <Star className="mt-4 h-6 w-6 text-yellow-400" />

            </CardContent>
          </Card>

        </div>

        {/* RESUMES */}

        <Card>

          <CardHeader className="space-y-4">

            <div>

              <CardTitle>
                Candidate Resumes
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                All resumes currently stored in your backend.
              </p>

            </div>

            <div className="relative max-w-md">

              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

              <Input
                value={search}
                onChange={(event) =>
                  setSearch(
                    event.target.value
                  )
                }
                placeholder="Search resumes or candidates..."
                className="bg-background pl-9"
              />

            </div>

          </CardHeader>

          <CardContent>

            {loading && (
              <div className="flex min-h-[300px] flex-col items-center justify-center">

                <RefreshCw className="h-7 w-7 animate-spin text-brand-red" />

                <p className="mt-3 text-sm text-muted-foreground">
                  Loading resumes...
                </p>

              </div>
            )}

            {!loading && error && (
              <div className="flex min-h-[300px] flex-col items-center justify-center text-center">

                <FileText className="h-10 w-10 text-red-400" />

                <h3 className="mt-4 font-semibold">
                  Unable to load resumes
                </h3>

                <p className="mt-2 max-w-lg text-sm text-muted-foreground">
                  {error}
                </p>

                <Button
                  type="button"
                  variant="outline"
                  className="mt-4"
                  onClick={
                    loadResumes
                  }
                >
                  <RefreshCw className="mr-2 h-4 w-4" />
                  Try Again
                </Button>

              </div>
            )}

            {!loading &&
              !error &&
              filteredResumes.length ===
                0 && (
                <div className="flex min-h-[300px] flex-col items-center justify-center rounded-lg border border-dashed border-border text-center">

                  <FileText className="h-10 w-10 text-brand-red" />

                  <h3 className="mt-4 font-semibold">
                    {search
                      ? 'No matching resumes'
                      : 'No resumes found'}
                  </h3>

                  <p className="mt-2 text-sm text-muted-foreground">
                    {search
                      ? 'Try another search.'
                      : 'Uploaded resumes will appear here.'}
                  </p>

                </div>
              )}

            {!loading &&
              !error &&
              filteredResumes.length >
                0 && (
                <div className="grid grid-cols-1 gap-4 xl:grid-cols-2">

                  {filteredResumes.map(
                    (resume) => (
                      <ResumeCard
                        key={
                          resume.id
                        }
                        resume={
                          resume
                        }
                      />
                    )
                  )}

                </div>
              )}

          </CardContent>

        </Card>

      </motion.div>

      {/* UPLOAD MODAL */}

      <UploadResumeModal
        open={showUpload}
        onClose={() =>
          setShowUpload(false)
        }
        users={users}
        onUploaded={loadResumes}
      />

    </>
  );
}

export default ResumesPage;