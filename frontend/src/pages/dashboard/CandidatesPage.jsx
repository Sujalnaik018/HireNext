import { useEffect, useMemo, useState } from 'react';
import { motion } from 'framer-motion';

import {
  RefreshCw,
  Search,
  Users,
  Star,
  UserCheck,
  BriefcaseBusiness,
  Mail,
  FileText,
  Award,
  CalendarDays,
  Phone,
  X,
  Upload,
  UserPlus,
  MapPin,
  Loader2,
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
  createUser,
  uploadResume,
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
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.items)) return data.items;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.results)) return data.results;
  return [];
}

/* ==================================================
   STRUCTURED RESUME DATA
================================================== */

function getStructuredData(resume) {
  const data = resume?.structured_data;

  if (data && typeof data === 'object') {
    return data;
  }

  if (typeof data === 'string') {
    try {
      const parsed = JSON.parse(data);
      return parsed && typeof parsed === 'object'
        ? parsed
        : {};
    } catch {
      return {};
    }
  }

  return {};
}

function getStructuredName(resume) {
  const data = getStructuredData(resume);

  return normalize(
    data?.name ||
      data?.full_name ||
      data?.fullName ||
      data?.candidate_name ||
      data?.candidateName
  );
}

function getStructuredEmail(resume) {
  const data = getStructuredData(resume);

  return normalize(
    data?.email ||
      data?.email_address ||
      data?.emailAddress
  );
}

function getStructuredPhone(resume) {
  const data = getStructuredData(resume);

  return normalize(
    data?.phone ||
      data?.phone_number ||
      data?.phoneNumber ||
      data?.mobile
  );
}

function getStructuredSkills(resume) {
  const data = getStructuredData(resume);

  const skills =
    data?.skills ||
    data?.technical_skills ||
    data?.technicalSkills ||
    [];

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => {
        if (
          typeof skill === 'object' &&
          skill !== null
        ) {
          return normalize(
            skill?.name ||
              skill?.title ||
              skill?.skill
          );
        }

        return normalize(skill);
      })
      .filter(Boolean);
  }

  if (typeof skills === 'string') {
    return skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

function getStructuredExperience(resume) {
  const data = getStructuredData(resume);

  const experience =
    data?.experience ||
    data?.experience_years ||
    data?.experienceYears ||
    data?.years_of_experience ||
    data?.yearsOfExperience;

  if (
    typeof experience === 'number' ||
    typeof experience === 'string'
  ) {
    return normalize(experience);
  }

  if (Array.isArray(experience)) {
    if (experience.length === 0) {
      return 'Not available';
    }

    return (
      experience
        .map((item) => {
          if (typeof item === 'string') {
            return normalize(item);
          }

          if (item && typeof item === 'object') {
            return normalize(
              item?.title ||
                item?.role ||
                item?.position ||
                item?.company ||
                item?.duration
            );
          }

          return '';
        })
        .filter(Boolean)
        .join(' • ') || 'Not available'
    );
  }

  const rawText = normalize(
    resume?.raw_text ||
      resume?.text ||
      resume?.extracted_text
  );

  const yearsMatch = rawText.match(
    /\b(\d+(?:\.\d+)?\+?)\s*years?\b/i
  );

  if (yearsMatch) {
    return `${yearsMatch[1]} years`;
  }

  return 'Not available';
}

function getStructuredProjects(resume) {
  const data = getStructuredData(resume);

  const projects =
    data?.projects ||
    data?.project ||
    [];

  if (Array.isArray(projects)) {
    return projects
      .map((project) => {
        if (typeof project === 'string') {
          return {
            title: project,
            description: '',
          };
        }

        if (
          typeof project === 'object' &&
          project !== null
        ) {
          return {
            title: normalize(
              project?.title ||
                project?.name ||
                project?.project_name ||
                'Project'
            ),
            description: normalize(
              project?.description ||
                project?.details ||
                ''
            ),
          };
        }

        return null;
      })
      .filter(Boolean);
  }

  if (typeof projects === 'string') {
    return [
      {
        title: 'Project',
        description: projects,
      },
    ];
  }

  return [];
}

/* ==================================================
   USER HELPERS
================================================== */

function getUserName(user) {
  if (!user) return '';

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

/* ==================================================
   APPLICATION USER ID
================================================== */

function getApplicationUserId(application) {
  if (!application) return null;

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

/* ==================================================
   RESUME USER ID
================================================== */

function getResumeUserId(resume) {
  if (!resume) return null;

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

/* ==================================================
   FIND RESUME
================================================== */

function findMatchingResume(application, resumes) {
  const applicationResumeId =
    application?.resume_id ??
    application?.resumeId ??
    application?.resume?.id;

  if (applicationResumeId != null) {
    const matchedResume = resumes.find(
      (resume) =>
        String(resume?.id) ===
        String(applicationResumeId)
    );

    if (matchedResume) {
      return matchedResume;
    }
  }

  const applicationUserId =
    getApplicationUserId(application);

  if (applicationUserId != null) {
    const matchedResume = resumes.find(
      (resume) => {
        const resumeUserId =
          getResumeUserId(resume);

        return (
          resumeUserId != null &&
          String(resumeUserId) ===
            String(applicationUserId)
        );
      }
    );

    if (matchedResume) {
      return matchedResume;
    }
  }

  if (
    application?.resume &&
    typeof application.resume === 'object'
  ) {
    return application.resume;
  }

  return null;
}

/* ==================================================
   CANDIDATE NAME
================================================== */

function getCandidateName(
  resume,
  application,
  user
) {
  const userName = getUserName(user);

  if (userName) {
    return userName;
  }

  const structuredName =
    getStructuredName(resume);

  if (structuredName) {
    return structuredName;
  }

  const directName =
    resume?.name ||
    resume?.full_name ||
    resume?.fullName ||
    resume?.candidate_name ||
    resume?.candidateName ||
    application?.candidate_name ||
    application?.candidateName ||
    application?.applicant_name ||
    application?.applicantName;

  if (directName) {
    return normalize(directName);
  }

  const firstName =
    resume?.first_name ||
    resume?.firstName ||
    application?.first_name ||
    application?.firstName ||
    '';

  const lastName =
    resume?.last_name ||
    resume?.lastName ||
    application?.last_name ||
    application?.lastName ||
    '';

  const combined =
    `${firstName} ${lastName}`.trim();

  return combined || 'Unknown Candidate';
}

/* ==================================================
   EMAIL
================================================== */

function getCandidateEmail(
  resume,
  application,
  user
) {
  return (
    getUserEmail(user) ||
    getStructuredEmail(resume) ||
    normalize(
      resume?.email ||
        resume?.candidate_email ||
        resume?.candidateEmail ||
        application?.candidate_email ||
        application?.candidateEmail ||
        application?.email
    ) ||
    '—'
  );
}

/* ==================================================
   PHONE
================================================== */

function getCandidatePhone(resume, user) {
  return (
    normalize(
      user?.phone
    ) ||
    getStructuredPhone(resume) ||
    normalize(
      resume?.phone ||
        resume?.phone_number ||
        resume?.phoneNumber
    ) ||
    'Not available'
  );
}

/* ==================================================
   SKILLS
================================================== */

function getSkills(
  resume,
  application,
  user
) {
  const structuredSkills =
    getStructuredSkills(resume);

  if (structuredSkills.length > 0) {
    return structuredSkills;
  }

  const skills =
    resume?.skills ??
    resume?.skill ??
    application?.skills ??
    application?.skill ??
    user?.skills ??
    user?.skill;

  if (Array.isArray(skills)) {
    return skills
      .map((skill) => {
        if (
          typeof skill === 'object' &&
          skill !== null
        ) {
          return normalize(
            skill?.name ||
              skill?.title ||
              skill?.skill
          );
        }

        return normalize(skill);
      })
      .filter(Boolean);
  }

  if (typeof skills === 'string') {
    return skills
      .split(',')
      .map((skill) => skill.trim())
      .filter(Boolean);
  }

  return [];
}

/* ==================================================
   EXPERIENCE
================================================== */

function getExperience(
  resume,
  application,
  user
) {
  const structuredExperience =
    getStructuredExperience(resume);

  if (
    structuredExperience !==
    'Not available'
  ) {
    return structuredExperience;
  }

  return (
    resume?.experience ??
    resume?.experience_years ??
    resume?.experienceYears ??
    resume?.years_of_experience ??
    resume?.yearsOfExperience ??
    application?.experience ??
    application?.experience_years ??
    application?.experienceYears ??
    user?.experience ??
    user?.experience_years ??
    'Not available'
  );
}

/* ==================================================
   MATCH SCORE
================================================== */

function getMatchScore(application) {
  const score = Number(
    application?.match_score ??
      application?.matchScore ??
      application?.score
  );

  return Number.isFinite(score)
    ? score
    : null;
}

/* ==================================================
   STATUS
================================================== */

function getStatus(application) {
  if (!application) {
    return 'not applied';
  }

  return (
    normalize(application?.status)
      .toLowerCase() ||
    'applied'
  );
}

function statusClasses(status) {
  switch (status) {
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

function formatStatus(status) {
  if (!status) return 'Applied';

  if (status === 'not applied') {
    return 'Not Applied';
  }

  return (
    status.charAt(0).toUpperCase() +
    status.slice(1)
  );
}

/* ==================================================
   INITIALS
================================================== */

function getInitials(name) {
  const words = normalize(name)
    .split(/\s+/)
    .filter(Boolean);

  if (words.length === 0) return 'NA';

  if (words.length === 1) {
    return words[0]
      .slice(0, 2)
      .toUpperCase();
  }

  return `${words[0][0]}${
    words[words.length - 1][0]
  }`.toUpperCase();
}

/* ==================================================
   JOB
================================================== */

function getJobTitle(
  application,
  jobs
) {
  const jobId =
    application?.job_id ??
    application?.jobId ??
    application?.job?.id;

  const job = jobs.find(
    (item) =>
      String(item?.id) ===
      String(jobId)
  );

  return (
    application?.job_title ||
    application?.jobTitle ||
    application?.job?.title ||
    job?.title ||
    job?.name ||
    'No job assigned'
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

/* ==================================================
   PROFILE ROW
================================================== */

function ProfileRow({
  icon: Icon,
  label,
  value,
}) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-border p-3">
      <Icon className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />

      <div className="min-w-0">
        <p className="text-xs text-muted-foreground">
          {label}
        </p>

        <p className="mt-1 break-words text-sm font-medium text-foreground">
          {value || 'Not available'}
        </p>
      </div>
    </div>
  );
}

/* ==================================================
   ADD CANDIDATE MODAL
================================================== */

function AddCandidateModal({
  open,
  onClose,
  onCreated,
}) {
  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [location, setLocation] = useState('');
  const [file, setFile] = useState(null);

  const [submitting, setSubmitting] =
    useState(false);

  const [error, setError] =
    useState('');

  const [success, setSuccess] =
    useState('');

  useEffect(() => {
    if (!open) {
      setName('');
      setEmail('');
      setPhone('');
      setLocation('');
      setFile(null);
      setError('');
      setSuccess('');
      setSubmitting(false);
    }
  }, [open]);

  if (!open) {
    return null;
  }

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!name.trim()) {
      setError('Candidate name is required.');
      return;
    }

    if (!email.trim()) {
      setError('Candidate email is required.');
      return;
    }

    if (!file) {
      setError('Please upload a PDF resume.');
      return;
    }

    if (
      file.type !==
      'application/pdf'
    ) {
      setError('Only PDF resumes are allowed.');
      return;
    }

    try {
      setSubmitting(true);

      /*
       * STEP 1
       * Create candidate/user.
       */

      const createdUser =
        await createUser({
          role: 'applicant',
          name: name.trim(),
          email: email.trim(),
          phone: phone.trim() || null,
          location:
            location.trim() || null,
        });

      const candidateId =
        createdUser?.id;

      if (!candidateId) {
        throw new Error(
          'Candidate was created but no candidate ID was returned.'
        );
      }

      /*
       * STEP 2
       * Upload resume for that candidate.
       */

      await uploadResume({
        userId: candidateId,
        file,
      });

      setSuccess(
        'Candidate and resume added successfully.'
      );

      /*
       * Refresh candidates page.
       */

      await onCreated();

      setTimeout(() => {
        onClose();
      }, 800);

    } catch (err) {
      console.error(
        'Failed to create candidate:',
        err
      );

      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create candidate.'
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center bg-black/70 p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="w-full max-w-lg overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        {/* HEADER */}

        <div className="flex items-center justify-between border-b border-border p-5">
          <div>
            <h2 className="text-lg font-semibold text-foreground">
              Add New Candidate
            </h2>

            <p className="mt-1 text-sm text-muted-foreground">
              Create a candidate and upload their resume.
            </p>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
            disabled={submitting}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        {/* FORM */}

        <form
          onSubmit={handleSubmit}
          className="space-y-5 p-5"
        >
          {error && (
            <div className="rounded-lg border border-destructive/30 bg-destructive/10 p-3">
              <p className="text-sm text-destructive">
                {error}
              </p>
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-success/30 bg-success/10 p-3">
              <p className="text-sm text-success">
                {success}
              </p>
            </div>
          )}

          {/* NAME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Candidate Name
            </label>

            <Input
              value={name}
              onChange={(event) =>
                setName(event.target.value)
              }
              placeholder="Enter candidate name"
              disabled={submitting}
            />
          </div>

          {/* EMAIL */}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Email
            </label>

            <Input
              type="email"
              value={email}
              onChange={(event) =>
                setEmail(event.target.value)
              }
              placeholder="candidate@example.com"
              disabled={submitting}
            />
          </div>

          {/* PHONE */}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Phone
            </label>

            <Input
              value={phone}
              onChange={(event) =>
                setPhone(event.target.value)
              }
              placeholder="+91 9876543210"
              disabled={submitting}
            />
          </div>

          {/* LOCATION */}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Location
            </label>

            <Input
              value={location}
              onChange={(event) =>
                setLocation(event.target.value)
              }
              placeholder="Mumbai, Maharashtra"
              disabled={submitting}
            />
          </div>

          {/* RESUME */}

          <div>
            <label className="mb-2 block text-sm font-medium text-foreground">
              Resume PDF
            </label>

            <label
              className={cn(
                'flex cursor-pointer flex-col items-center justify-center rounded-xl border-2 border-dashed border-border p-6 text-center transition',
                'hover:border-brand-red/50 hover:bg-brand-red/5',
                submitting &&
                  'pointer-events-none opacity-60'
              )}
            >
              <Upload className="h-8 w-8 text-brand-red" />

              {file ? (
                <>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    {file.name}
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </>
              ) : (
                <>
                  <p className="mt-3 text-sm font-medium text-foreground">
                    Click to upload resume
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    PDF files only
                  </p>
                </>
              )}

              <input
                type="file"
                accept=".pdf,application/pdf"
                className="hidden"
                disabled={submitting}
                onChange={(event) => {
                  const selectedFile =
                    event.target.files?.[0] ||
                    null;

                  setFile(selectedFile);
                  setError('');
                }}
              />
            </label>
          </div>

          {/* ACTIONS */}

          <div className="flex justify-end gap-3 border-t border-border pt-5">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={submitting}
            >
              Cancel
            </Button>

            <Button
              type="submit"
              className="bg-brand-red text-white hover:bg-brand-red/90"
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Adding...
                </>
              ) : (
                <>
                  <UserPlus className="mr-2 h-4 w-4" />
                  Add Candidate
                </>
              )}
            </Button>
          </div>
        </form>
      </motion.div>
    </div>
  );
}

/* ==================================================
   PROFILE MODAL
================================================== */

function CandidateProfileModal({
  candidate,
  onClose,
}) {
  if (!candidate) return null;

  const {
    name,
    email,
    phone,
    skills,
    experience,
    projects,
    score,
    status,
    jobTitle,
    resume,
    application,
    user,
  } = candidate;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/70 p-4">
      <motion.div
        initial={{
          opacity: 0,
          scale: 0.96,
        }}
        animate={{
          opacity: 1,
          scale: 1,
        }}
        className="flex max-h-[90vh] w-full max-w-4xl flex-col overflow-hidden rounded-xl border border-border bg-card shadow-2xl"
      >
        <div className="flex items-center justify-between border-b border-border p-5">
          <div className="flex min-w-0 items-center gap-3">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-brand-red/10 font-semibold text-brand-red">
              {getInitials(name)}
            </div>

            <div className="min-w-0">
              <h2 className="truncate text-lg font-semibold text-foreground">
                {name}
              </h2>

              <p className="truncate text-sm text-muted-foreground">
                {email}
              </p>
            </div>
          </div>

          <Button
            variant="ghost"
            size="icon"
            onClick={onClose}
          >
            <X className="h-5 w-5" />
          </Button>
        </div>

        <div className="overflow-y-auto p-5">
          <div className="space-y-6">
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
              <ProfileRow
                icon={BriefcaseBusiness}
                label="Job"
                value={jobTitle}
              />

              <ProfileRow
                icon={Star}
                label="Match Score"
                value={
                  score != null
                    ? `${score}%`
                    : 'Not available'
                }
              />

              <ProfileRow
                icon={UserCheck}
                label="Status"
                value={formatStatus(status)}
              />

              <ProfileRow
                icon={Phone}
                label="Phone"
                value={phone}
              />
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Candidate Information
              </h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ProfileRow
                  icon={Users}
                  label="Candidate"
                  value={name}
                />

                <ProfileRow
                  icon={Mail}
                  label="Email"
                  value={email}
                />

                <ProfileRow
                  icon={Phone}
                  label="Phone"
                  value={phone}
                />

                <ProfileRow
                  icon={BriefcaseBusiness}
                  label="Experience"
                  value={experience}
                />

                {user?.location && (
                  <ProfileRow
                    icon={MapPin}
                    label="Location"
                    value={user.location}
                  />
                )}
              </div>
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Skills
              </h3>

              {skills.length > 0 ? (
                <div className="flex flex-wrap gap-2">
                  {skills.map(
                    (skill, index) => (
                      <Badge
                        key={`${skill}-${index}`}
                        variant="secondary"
                      >
                        {skill}
                      </Badge>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No skills available.
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Projects
              </h3>

              {projects.length > 0 ? (
                <div className="space-y-3">
                  {projects.map(
                    (project, index) => (
                      <div
                        key={`${project.title}-${index}`}
                        className="rounded-lg border border-border p-4"
                      >
                        <p className="font-medium text-foreground">
                          {project.title}
                        </p>

                        {project.description && (
                          <p className="mt-1 text-sm text-muted-foreground">
                            {project.description}
                          </p>
                        )}
                      </div>
                    )
                  )}
                </div>
              ) : (
                <p className="text-sm text-muted-foreground">
                  No projects available.
                </p>
              )}
            </div>

            <div>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                Application
              </h3>

              <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                <ProfileRow
                  icon={FileText}
                  label="Application ID"
                  value={
                    application?.id != null
                      ? String(application.id)
                      : 'Not available'
                  }
                />

                <ProfileRow
                  icon={BriefcaseBusiness}
                  label="Job ID"
                  value={
                    application?.job_id != null
                      ? String(application.job_id)
                      : 'Not available'
                  }
                />

                <ProfileRow
                  icon={FileText}
                  label="Resume ID"
                  value={
                    application?.resume_id != null
                      ? String(application.resume_id)
                      : 'Not available'
                  }
                />

                <ProfileRow
                  icon={CalendarDays}
                  label="Application Date"
                  value={
                    application?.created_at
                      ? new Date(
                          application.created_at
                        ).toLocaleDateString()
                      : 'Not available'
                  }
                />
              </div>
            </div>

            {resume && (
              <div>
                <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-muted-foreground">
                  Resume
                </h3>

                <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
                  <ProfileRow
                    icon={FileText}
                    label="Resume File"
                    value={
                      resume?.file_name ||
                      resume?.filename ||
                      'Not available'
                    }
                  />

                  <ProfileRow
                    icon={Award}
                    label="Completion"
                    value={
                      resume?.completion != null
                        ? `${resume.completion}%`
                        : 'Not available'
                    }
                  />

                  <ProfileRow
                    icon={Award}
                    label="ATS Score"
                    value={
                      resume?.ats_score != null
                        ? `${resume.ats_score}%`
                        : 'Not available'
                    }
                  />

                  <ProfileRow
                    icon={FileText}
                    label="Template"
                    value={
                      resume?.template_name ||
                      'Not available'
                    }
                  />
                </div>
              </div>
            )}
          </div>
        </div>

        <div className="border-t border-border bg-card p-4">
          <div className="flex justify-end">
            <Button
              variant="outline"
              onClick={onClose}
            >
              Close
            </Button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}

/* ==================================================
   CANDIDATES PAGE
================================================== */

export function CandidatesPage() {
  const [candidates, setCandidates] =
    useState([]);

  const [jobs, setJobs] =
    useState([]);

  const [loading, setLoading] =
    useState(true);

  const [error, setError] =
    useState('');

  const [search, setSearch] =
    useState('');

  const [statusFilter, setStatusFilter] =
    useState('all');

  const [
    selectedCandidate,
    setSelectedCandidate,
  ] = useState(null);

  const [
    addCandidateOpen,
    setAddCandidateOpen,
  ] = useState(false);

  /* ==================================================
     LOAD CANDIDATES
  ================================================== */

  const loadCandidates = async () => {
    try {
      setLoading(true);
      setError('');

      const [
        usersData,
        resumesData,
        applicationsData,
        jobsData,
      ] = await Promise.all([
        getUsers(),
        getResumes(),
        getApplications(),
        getJobs(),
      ]);

      const users = toArray(usersData);
      const resumes = toArray(resumesData);
      const applications =
        toArray(applicationsData);
      const jobList = toArray(jobsData);

      setJobs(jobList);

      /*
       * Only applicants should appear as candidates.
       */
      const applicantUsers =
        users.filter(
          (user) =>
            !user?.role ||
            user.role === 'applicant'
        );

      const rows =
        applicantUsers.map((user) => {
          const userApplications =
            applications.filter(
              (application) => {
                const applicationUserId =
                  getApplicationUserId(
                    application
                  );

                return (
                  applicationUserId != null &&
                  String(
                    applicationUserId
                  ) === String(user?.id)
                );
              }
            );

          const statusPriority = {
            hired: 0,
            interview: 1,
            interviewed: 1,
            shortlisted: 2,
            selected: 2,
            applied: 3,
            rejected: 4,
          };

          const sortedApplications =
            [...userApplications].sort(
              (a, b) => {
                const aStatus =
                  getStatus(a);

                const bStatus =
                  getStatus(b);

                const aPriority =
                  statusPriority[
                    aStatus
                  ] ??
                  Object.keys(
                    statusPriority
                  ).length;

                const bPriority =
                  statusPriority[
                    bStatus
                  ] ??
                  Object.keys(
                    statusPriority
                  ).length;

                if (
                  aPriority !==
                  bPriority
                ) {
                  return (
                    aPriority -
                    bPriority
                  );
                }

                const aDate =
                  new Date(
                    a?.updated_at ||
                      a?.created_at ||
                      0
                  ).getTime();

                const bDate =
                  new Date(
                    b?.updated_at ||
                      b?.created_at ||
                      0
                  ).getTime();

                return bDate - aDate;
              }
            );

          const application =
            sortedApplications[0] ||
            null;

          let matchedResume =
            findMatchingResume(
              application,
              resumes
            );

          if (!matchedResume) {
            const userResumes =
              resumes.filter(
                (resume) => {
                  const resumeUserId =
                    getResumeUserId(
                      resume
                    );

                  return (
                    resumeUserId !=
                      null &&
                    String(
                      resumeUserId
                    ) ===
                      String(user?.id)
                  );
                }
              );

            matchedResume =
              [...userResumes].sort(
                (a, b) => {
                  const aDate =
                    new Date(
                      a?.updated_at ||
                        a?.created_at ||
                        0
                    ).getTime();

                  const bDate =
                    new Date(
                      b?.updated_at ||
                        b?.created_at ||
                        0
                    ).getTime();

                  return (
                    bDate - aDate
                  );
                }
              )[0] || null;
          }

          const name =
            getCandidateName(
              matchedResume,
              application,
              user
            );

          const email =
            getCandidateEmail(
              matchedResume,
              application,
              user
            );

          const phone =
            getCandidatePhone(
              matchedResume,
              user
            );

          const skills =
            getSkills(
              matchedResume,
              application,
              user
            );

          const experience =
            getExperience(
              matchedResume,
              application,
              user
            );

          const projects =
            getStructuredProjects(
              matchedResume
            );

          const score =
            getMatchScore(
              application
            );

          const status =
            application
              ? getStatus(application)
              : 'not applied';

          const jobTitle =
            application
              ? getJobTitle(
                  application,
                  jobList
                )
              : 'No job assigned';

          return {
            id: user?.id,

            name,
            email,
            phone,
            skills,
            experience,
            projects,
            score,
            status,
            jobTitle,

            resume: matchedResume,
            application,
            user,
          };
        });

      rows.sort((a, b) => {
        if (
          a.score == null &&
          b.score == null
        ) {
          return a.name.localeCompare(
            b.name
          );
        }

        if (a.score == null) return 1;
        if (b.score == null) return -1;

        return b.score - a.score;
      });

      setCandidates(rows);
    } catch (err) {
      console.error(
        'Failed to load candidates:',
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
  }, []);

  /* ==================================================
     FILTERING
  ================================================== */

  const filteredCandidates =
    useMemo(() => {
      const query =
        search.trim().toLowerCase();

      return candidates.filter(
        (candidate) => {
          const matchesSearch =
            !query ||
            candidate.name
              .toLowerCase()
              .includes(query) ||
            candidate.email
              .toLowerCase()
              .includes(query) ||
            candidate.jobTitle
              .toLowerCase()
              .includes(query) ||
            candidate.skills.some(
              (skill) =>
                skill
                  .toLowerCase()
                  .includes(query)
            );

          const matchesStatus =
            statusFilter === 'all' ||
            candidate.status ===
              statusFilter;

          return (
            matchesSearch &&
            matchesStatus
          );
        }
      );
    }, [
      candidates,
      search,
      statusFilter,
    ]);

  /* ==================================================
     STATISTICS
  ================================================== */

  const totalCandidates =
    candidates.length;

  const shortlistedCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status ===
        'shortlisted'
    ).length;

  const interviewedCandidates =
    candidates.filter(
      (candidate) =>
        candidate.status ===
          'interview' ||
        candidate.status ===
          'interviewed'
    ).length;

  const averageScore =
    useMemo(() => {
      const scores =
        candidates
          .map(
            (candidate) =>
              candidate.score
          )
          .filter(
            (score) =>
              score != null
          );

      if (scores.length === 0) {
        return '—';
      }

      return `${Math.round(
        scores.reduce(
          (total, score) =>
            total + score,
          0
        ) / scores.length
      )}%`;
    }, [candidates]);

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
            Candidates
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Loading candidate profiles...
          </p>
        </div>

        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
          {[1, 2, 3, 4].map(
            (item) => (
              <div
                key={item}
                className="h-32 animate-pulse rounded-xl border border-border bg-card"
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
    <>
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
              Candidates
            </h1>

            <p className="mt-1 text-sm text-muted-foreground">
              View candidate profiles,
              applications and AI match
              rankings.
            </p>
          </div>

          <div className="flex gap-2">
            <Button
              variant="outline"
              onClick={loadCandidates}
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
              onClick={() =>
                setAddCandidateOpen(true)
              }
              className="bg-brand-red text-white hover:bg-brand-red/90"
            >
              <UserPlus className="mr-2 h-4 w-4" />
              Add New Candidate
            </Button>
          </div>
        </motion.div>

        {/* ERROR */}

        {error && (
          <motion.div
            variants={fadeUpItem}
            className="rounded-xl border border-destructive/30 bg-destructive/10 p-4"
          >
            <p className="text-sm font-medium text-destructive">
              Failed to load candidates
            </p>

            <p className="mt-1 text-xs text-muted-foreground">
              {error}
            </p>

            <Button
              variant="outline"
              size="sm"
              className="mt-3"
              onClick={loadCandidates}
            >
              <RefreshCw className="mr-2 h-4 w-4" />
              Try Again
            </Button>
          </motion.div>
        )}

        {/* STATISTICS */}

        <motion.div
          variants={staggerContainer}
          className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4"
        >
          <StatCard
            icon={Users}
            label="Total Candidates"
            value={totalCandidates}
            description="All candidates in the system"
          />

          <StatCard
            icon={Star}
            label="Shortlisted"
            value={shortlistedCandidates}
            description="Candidates shortlisted for roles"
          />

          <StatCard
            icon={UserCheck}
            label="Interview Stage"
            value={interviewedCandidates}
            description="Candidates currently in interview stage"
          />

          <StatCard
            icon={BriefcaseBusiness}
            label="Average Match"
            value={averageScore}
            description="Average application match score"
          />
        </motion.div>

        {/* CANDIDATE TABLE */}

        <motion.div variants={fadeUpItem}>
          <Card className="border-border bg-card">
            <CardHeader>
              <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
                <div>
                  <h2 className="text-base font-semibold text-foreground">
                    Candidate Profiles
                  </h2>

                  <p className="mt-1 text-sm text-muted-foreground">
                    Candidates ranked using application match scores.
                  </p>
                </div>

                <div className="text-xs text-muted-foreground">
                  {filteredCandidates.length}{' '}
                  of{' '}
                  {candidates.length}{' '}
                  candidates
                </div>
              </div>

              <div className="mt-4 flex flex-col gap-3 sm:flex-row">
                <div className="relative flex-1">
                  <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                  <Input
                    value={search}
                    onChange={(event) =>
                      setSearch(
                        event.target.value
                      )
                    }
                    placeholder="Search candidates, skills or jobs..."
                    className="pl-9"
                  />
                </div>

                <select
                  value={statusFilter}
                  onChange={(event) =>
                    setStatusFilter(
                      event.target.value
                    )
                  }
                  className="h-10 rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none transition focus:border-brand-red"
                >
                  <option value="all">
                    All Statuses
                  </option>

                  <option value="not applied">
                    Not Applied
                  </option>

                  <option value="applied">
                    Applied
                  </option>

                  <option value="shortlisted">
                    Shortlisted
                  </option>

                  <option value="interview">
                    Interview
                  </option>

                  <option value="interviewed">
                    Interviewed
                  </option>

                  <option value="hired">
                    Hired
                  </option>

                  <option value="rejected">
                    Rejected
                  </option>
                </select>
              </div>
            </CardHeader>

            <CardContent className="p-0">
              {filteredCandidates.length ===
              0 ? (
                <div className="flex min-h-[260px] flex-col items-center justify-center p-6 text-center">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-muted">
                    <Users className="h-5 w-5 text-muted-foreground" />
                  </div>

                  <h3 className="mt-4 text-sm font-semibold text-foreground">
                    No candidates found
                  </h3>

                  <p className="mt-1 max-w-sm text-sm text-muted-foreground">
                    Add a new candidate or change your search/filter.
                  </p>

                  {(search ||
                    statusFilter !==
                      'all') && (
                    <Button
                      variant="outline"
                      size="sm"
                      className="mt-4"
                      onClick={() => {
                        setSearch('');
                        setStatusFilter(
                          'all'
                        );
                      }}
                    >
                      Clear Filters
                    </Button>
                  )}

                  {!search &&
                    statusFilter ===
                      'all' && (
                      <Button
                        className="mt-4 bg-brand-red text-white hover:bg-brand-red/90"
                        onClick={() =>
                          setAddCandidateOpen(
                            true
                          )
                        }
                      >
                        <UserPlus className="mr-2 h-4 w-4" />
                        Add First Candidate
                      </Button>
                    )}
                </div>
              ) : (
                <div className="overflow-x-auto">
                  <Table>
                    <TableHeader>
                      <TableRow>
                        <TableHead>
                          Candidate
                        </TableHead>

                        <TableHead>
                          Job
                        </TableHead>

                        <TableHead>
                          Match Score
                        </TableHead>

                        <TableHead>
                          Skills
                        </TableHead>

                        <TableHead>
                          Experience
                        </TableHead>

                        <TableHead>
                          Status
                        </TableHead>

                        <TableHead className="text-right">
                          Action
                        </TableHead>
                      </TableRow>
                    </TableHeader>

                    <TableBody>
                      {filteredCandidates.map(
                        (candidate) => (
                          <TableRow
                            key={
                              candidate.id
                            }
                          >
                            <TableCell>
                              <div className="flex items-center gap-3">
                                <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-brand-red/10 text-xs font-semibold text-brand-red">
                                  {getInitials(
                                    candidate.name
                                  )}
                                </div>

                                <div className="min-w-0">
                                  <p className="truncate font-medium text-foreground">
                                    {
                                      candidate.name
                                    }
                                  </p>

                                  <p className="max-w-[220px] truncate text-xs text-muted-foreground">
                                    {
                                      candidate.email
                                    }
                                  </p>
                                </div>
                              </div>
                            </TableCell>

                            <TableCell>
                              <span className="text-sm text-foreground">
                                {
                                  candidate.jobTitle
                                }
                              </span>
                            </TableCell>

                            <TableCell>
                              {candidate.score !=
                              null ? (
                                <div className="flex min-w-[120px] items-center gap-3">
                                  <div className="h-2 w-16 overflow-hidden rounded-full bg-muted">
                                    <div
                                      className="h-full rounded-full bg-brand-red"
                                      style={{
                                        width: `${Math.min(
                                          Math.max(
                                            candidate.score,
                                            0
                                          ),
                                          100
                                        )}%`,
                                      }}
                                    />
                                  </div>

                                  <span
                                    className={cn(
                                      'text-xs font-semibold',
                                      candidate.score >=
                                        80
                                        ? 'text-success'
                                        : candidate.score >=
                                            60
                                          ? 'text-warning'
                                          : 'text-muted-foreground'
                                    )}
                                  >
                                    {
                                      candidate.score
                                    }
                                    %
                                  </span>
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Not available
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              {candidate.skills
                                .length >
                              0 ? (
                                <div className="flex max-w-[260px] flex-wrap gap-1.5">
                                  {candidate.skills
                                    .slice(
                                      0,
                                      4
                                    )
                                    .map(
                                      (
                                        skill,
                                        index
                                      ) => (
                                        <Badge
                                          key={`${skill}-${index}`}
                                          variant="secondary"
                                          className="font-normal"
                                        >
                                          {
                                            skill
                                          }
                                        </Badge>
                                      )
                                    )}

                                  {candidate.skills
                                    .length >
                                    4 && (
                                    <Badge variant="outline">
                                      +
                                      {candidate
                                        .skills
                                        .length -
                                        4}
                                    </Badge>
                                  )}
                                </div>
                              ) : (
                                <span className="text-xs text-muted-foreground">
                                  Not available
                                </span>
                              )}
                            </TableCell>

                            <TableCell>
                              <span className="text-sm text-muted-foreground">
                                {
                                  candidate.experience
                                }
                              </span>
                            </TableCell>

                            <TableCell>
                              <Badge
                                variant="outline"
                                className={cn(
                                  'border',
                                  statusClasses(
                                    candidate.status
                                  )
                                )}
                              >
                                {formatStatus(
                                  candidate.status
                                )}
                              </Badge>
                            </TableCell>

                            <TableCell className="text-right">
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() =>
                                  setSelectedCandidate(
                                    candidate
                                  )
                                }
                              >
                                View Profile
                              </Button>
                            </TableCell>
                          </TableRow>
                        )
                      )}
                    </TableBody>
                  </Table>
                </div>
              )}
            </CardContent>
          </Card>
        </motion.div>
      </motion.div>

      {/* ADD CANDIDATE */}

      <AddCandidateModal
        open={addCandidateOpen}
        onClose={() =>
          setAddCandidateOpen(false)
        }
        onCreated={loadCandidates}
      />

      {/* PROFILE */}

      <CandidateProfileModal
        candidate={selectedCandidate}
        onClose={() =>
          setSelectedCandidate(null)
        }
      />
    </>
  );
}

export default CandidatesPage;