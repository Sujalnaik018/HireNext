import { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  FileText,
  Mail,
  Phone,
  Upload,
  UserPlus,
  XCircle,
} from 'lucide-react';

import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';

import {
  createCandidate,
  getCandidates,
  uploadResume,
} from '@/services/api';

import { cn } from '@/lib/utils';

export function UploadResumePage({
  onSuccess,
}) {
  const [candidates, setCandidates] =
    useState([]);

  const [mode, setMode] =
    useState('new');

  const [selectedCandidateId, setSelectedCandidateId] =
    useState('');

  const [name, setName] =
    useState('');

  const [email, setEmail] =
    useState('');

  const [phone, setPhone] =
    useState('');

  const [file, setFile] =
    useState(null);

  const [templateName, setTemplateName] =
    useState('');

  const [completion, setCompletion] =
    useState('');

  const [atsScore, setAtsScore] =
    useState('');

  const [loading, setLoading] =
    useState(false);

  const [loadingCandidates, setLoadingCandidates] =
    useState(true);

  const [success, setSuccess] =
    useState('');

  const [error, setError] =
    useState('');

  /* =======================================================
     LOAD CANDIDATES
  ======================================================= */

  const loadCandidates = async () => {
    try {
      setLoadingCandidates(true);

      const data =
        await getCandidates();

      setCandidates(
        Array.isArray(data)
          ? data
          : []
      );
    } catch (err) {
      console.error(
        'LOAD CANDIDATES ERROR:',
        err
      );
    } finally {
      setLoadingCandidates(false);
    }
  };

  useEffect(() => {
    loadCandidates();
  }, []);

  /* =======================================================
     RESET
  ======================================================= */

  const resetForm = () => {
    setName('');
    setEmail('');
    setPhone('');
    setFile(null);
    setTemplateName('');
    setCompletion('');
    setAtsScore('');
    setSelectedCandidateId('');

    const fileInput =
      document.getElementById(
        'resume-file'
      );

    if (fileInput) {
      fileInput.value = '';
    }
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit = async (event) => {
    event.preventDefault();

    setError('');
    setSuccess('');

    if (!file) {
      setError(
        'Please select a PDF resume.'
      );
      return;
    }

    if (
      file.type !==
      'application/pdf'
    ) {
      setError(
        'Only PDF resumes are supported.'
      );
      return;
    }

    try {
      setLoading(true);

      let candidateId =
        selectedCandidateId;

      /* -----------------------------------------------
         CREATE NEW CANDIDATE
      ------------------------------------------------ */

      if (mode === 'new') {
        if (!name.trim()) {
          throw new Error(
            'Candidate name is required.'
          );
        }

        if (!email.trim()) {
          throw new Error(
            'Candidate email is required.'
          );
        }

        const candidate =
          await createCandidate({
            name: name.trim(),
            email: email.trim(),
            phone: phone.trim() || null,
          });

        candidateId =
          candidate?.id;

        if (!candidateId) {
          throw new Error(
            'Candidate was created but no candidate ID was returned.'
          );
        }
      }

      /* -----------------------------------------------
         UPLOAD RESUME
      ------------------------------------------------ */

      await uploadResume({
        userId: candidateId,
        file,
        templateName:
          templateName.trim() || null,
        completion:
          completion !== ''
            ? completion
            : null,
        atsScore:
          atsScore !== ''
            ? atsScore
            : null,
      });

      setSuccess(
        mode === 'new'
          ? 'Candidate created and resume uploaded successfully.'
          : 'Resume uploaded successfully.'
      );

      resetForm();

      await loadCandidates();

      if (onSuccess) {
        onSuccess();
      }
    } catch (err) {
      console.error(
        'UPLOAD RESUME ERROR:',
        err
      );

      setError(
        err?.message ||
        'Unable to create candidate or upload resume.'
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <motion.div
      initial={{
        opacity: 0,
        y: 10,
      }}
      animate={{
        opacity: 1,
        y: 0,
      }}
      className="w-full"
    >
      <Card className="border-brand-red/30 bg-card">
        <CardHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-brand-red/10">
              <Upload className="h-6 w-6 text-brand-red" />
            </div>

            <div>
              <CardTitle>
                Upload Resume
              </CardTitle>

              <p className="mt-1 text-sm text-muted-foreground">
                Create a candidate and upload their resume.
              </p>
            </div>
          </div>
        </CardHeader>

        <CardContent>
          {/* =================================================
              MODE
          ================================================= */}

          <div className="mb-6 grid grid-cols-1 gap-3 sm:grid-cols-2">
            <button
              type="button"
              onClick={() => {
                setMode('new');
                setError('');
                setSuccess('');
              }}
              className={cn(
                'rounded-lg border p-4 text-left transition',
                mode === 'new'
                  ? 'border-brand-red bg-brand-red/10'
                  : 'border-border hover:border-brand-red/40'
              )}
            >
              <div className="flex items-center gap-3">
                <UserPlus className="h-5 w-5 text-brand-red" />

                <div>
                  <p className="font-medium">
                    New Candidate
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Create candidate first
                  </p>
                </div>
              </div>
            </button>

            <button
              type="button"
              onClick={() => {
                setMode('existing');
                setError('');
                setSuccess('');
              }}
              className={cn(
                'rounded-lg border p-4 text-left transition',
                mode === 'existing'
                  ? 'border-brand-red bg-brand-red/10'
                  : 'border-border hover:border-brand-red/40'
              )}
            >
              <div className="flex items-center gap-3">
                <FileText className="h-5 w-5 text-brand-red" />

                <div>
                  <p className="font-medium">
                    Existing Candidate
                  </p>

                  <p className="text-xs text-muted-foreground">
                    Upload to an existing candidate
                  </p>
                </div>
              </div>
            </button>
          </div>

          {/* =================================================
              FORM
          ================================================= */}

          <form
            onSubmit={handleSubmit}
            className="space-y-6"
          >
            {/* NEW CANDIDATE */}

            {mode === 'new' && (
              <div className="space-y-5">
                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Candidate Name
                  </label>

                  <Input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Amit Kumar"
                  />
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Email
                  </label>

                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      type="email"
                      value={email}
                      onChange={(event) =>
                        setEmail(
                          event.target.value
                        )
                      }
                      placeholder="amit@example.com"
                      className="pl-9"
                    />
                  </div>
                </div>

                <div>
                  <label className="mb-2 block text-sm font-medium">
                    Phone
                  </label>

                  <div className="relative">
                    <Phone className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />

                    <Input
                      value={phone}
                      onChange={(event) =>
                        setPhone(
                          event.target.value
                        )
                      }
                      placeholder="+91 9876543210"
                      className="pl-9"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* EXISTING CANDIDATE */}

            {mode === 'existing' && (
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Candidate
                </label>

                <select
                  value={
                    selectedCandidateId
                  }
                  onChange={(event) =>
                    setSelectedCandidateId(
                      event.target.value
                    )
                  }
                  className="h-10 w-full rounded-md border border-border bg-background px-3 text-sm text-foreground outline-none focus:border-brand-red"
                >
                  <option value="">
                    Select candidate
                  </option>

                  {candidates.map(
                    (candidate) => (
                      <option
                        key={candidate.id}
                        value={candidate.id}
                      >
                        {candidate.name ||
                          candidate.email ||
                          `Candidate #${candidate.id}`}
                      </option>
                    )
                  )}
                </select>

                {loadingCandidates && (
                  <p className="mt-2 text-xs text-muted-foreground">
                    Loading candidates...
                  </p>
                )}
              </div>
            )}

            {/* FILE */}

            <div>
              <label className="mb-2 block text-sm font-medium">
                Resume PDF
              </label>

              <div className="rounded-lg border border-dashed border-border p-5">
                <input
                  id="resume-file"
                  type="file"
                  accept=".pdf,application/pdf"
                  onChange={(event) => {
                    const selectedFile =
                      event.target.files?.[0] ||
                      null;

                    setFile(selectedFile);
                    setError('');
                  }}
                  className="block w-full text-sm text-muted-foreground file:mr-4 file:rounded-md file:border-0 file:bg-brand-red file:px-4 file:py-2 file:text-sm file:font-medium file:text-white hover:file:opacity-90"
                />

                {file && (
                  <div className="mt-3 flex items-center gap-2 text-sm text-green-400">
                    <CheckCircle2 className="h-4 w-4" />

                    {file.name}
                  </div>
                )}
              </div>
            </div>

            {/* OPTIONAL DETAILS */}

            <div className="grid grid-cols-1 gap-5 sm:grid-cols-3">
              <div>
                <label className="mb-2 block text-sm font-medium">
                  Template
                </label>

                <Input
                  value={templateName}
                  onChange={(event) =>
                    setTemplateName(
                      event.target.value
                    )
                  }
                  placeholder="Modern Professional"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
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
                  placeholder="90"
                />
              </div>

              <div>
                <label className="mb-2 block text-sm font-medium">
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
                  placeholder="85"
                />
              </div>
            </div>

            {/* ERROR */}

            {error && (
              <div className="flex items-start gap-2 rounded-lg border border-red-500/30 bg-red-500/10 p-4 text-sm text-red-400">
                <XCircle className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{error}</span>
              </div>
            )}

            {/* SUCCESS */}

            {success && (
              <div className="flex items-start gap-2 rounded-lg border border-green-500/30 bg-green-500/10 p-4 text-sm text-green-400">
                <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0" />

                <span>{success}</span>
              </div>
            )}

            {/* SUBMIT */}

            <Button
              type="submit"
              disabled={loading}
              className="w-full gap-2 bg-brand-red hover:bg-brand-red/90 sm:w-auto"
            >
              {loading ? (
                <>
                  <Upload className="h-4 w-4 animate-pulse" />
                  Creating & Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-4 w-4" />
                  {mode === 'new'
                    ? 'Create Candidate & Upload Resume'
                    : 'Upload Resume'}
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </motion.div>
  );
}

export default UploadResumePage;