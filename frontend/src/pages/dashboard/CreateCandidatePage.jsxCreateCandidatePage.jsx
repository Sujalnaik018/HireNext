import {
  useEffect,
  useState,
} from 'react';

import {
  ArrowLeft,
  CheckCircle2,
  FileText,
  Loader2,
  Upload,
  UserPlus,
} from 'lucide-react';

import { useNavigate } from 'react-router-dom';

import {
  createUser,
  uploadResume,
} from '@/services/api';

import { Button } from '@/components/ui/button';

import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';

import { Input } from '@/components/ui/input';

/* =========================================================
   MAIN PAGE
========================================================= */

export default function CreateCandidatePage() {

  const navigate =
    useNavigate();

  /* =======================================================
     CANDIDATE FORM
  ======================================================= */

  const [
    name,
    setName,
  ] = useState('');

  const [
    email,
    setEmail,
  ] = useState('');

  const [
    phone,
    setPhone,
  ] = useState('');

  const [
    location,
    setLocation,
  ] = useState('');

  /* =======================================================
     RESUME
  ======================================================= */

  const [
    file,
    setFile,
  ] = useState(null);

  const [
    templateName,
    setTemplateName,
  ] = useState('');

  const [
    completion,
    setCompletion,
  ] = useState('');

  const [
    atsScore,
    setAtsScore,
  ] = useState('');

  /* =======================================================
     UI
  ======================================================= */

  const [
    loading,
    setLoading,
  ] = useState(false);

  const [
    error,
    setError,
  ] = useState('');

  const [
    success,
    setSuccess,
  ] = useState(false);

  /* =======================================================
     FILE HANDLER
  ======================================================= */

  const handleFileChange = (
    event
  ) => {

    const selectedFile =
      event.target.files?.[0];

    setError('');

    if (!selectedFile) {
      setFile(null);
      return;
    }

    /*
     * Check PDF.
     */

    const isPdf =
      selectedFile.type ===
        'application/pdf' ||
      selectedFile.name
        .toLowerCase()
        .endsWith('.pdf');

    if (!isPdf) {

      setError(
        'Please select a PDF resume.'
      );

      event.target.value = '';

      setFile(null);

      return;
    }

    setFile(
      selectedFile
    );
  };

  /* =======================================================
     SUBMIT
  ======================================================= */

  const handleSubmit =
    async (event) => {

      event.preventDefault();

      setError('');

      setSuccess(false);

      /* -----------------------------------------------
         VALIDATION
      ------------------------------------------------ */

      const cleanName =
        name.trim();

      const cleanEmail =
        email.trim();

      if (!cleanName) {

        setError(
          'Candidate name is required.'
        );

        return;
      }

      if (!cleanEmail) {

        setError(
          'Candidate email is required.'
        );

        return;
      }

      if (!file) {

        setError(
          'Please select a resume PDF.'
        );

        return;
      }

      /* -----------------------------------------------
         START
      ------------------------------------------------ */

      try {

        setLoading(true);

        /*
         * STEP 1
         *
         * Create the candidate/user.
         */

        const createdUser =
          await createUser({

            name:
              cleanName,

            email:
              cleanEmail,

            phone:
              phone.trim() ||
              null,

            location:
              location.trim() ||
              null,

          });

        /*
         * Different backends may return:
         *
         * { id: 1, ... }
         *
         * or:
         *
         * { user: { id: 1 } }
         */

        const newUserId =
          createdUser?.id ||
          createdUser?.user?.id ||
          createdUser?.data?.id;

        if (!newUserId) {

          throw new Error(
            'Candidate was created, but the API did not return a candidate ID.'
          );
        }

        /*
         * STEP 2
         *
         * Upload the resume using the
         * newly created candidate ID.
         */

        await uploadResume({

          userId:
            newUserId,

          file,

          templateName:
            templateName.trim() ||
            null,

          completion:
            completion !== ''
              ? Number(
                  completion
                )
              : null,

          atsScore:
            atsScore !== ''
              ? Number(
                  atsScore
                )
              : null,

        });

        /*
         * SUCCESS
         */

        setSuccess(true);

        /*
         * Redirect back to candidates
         * after a short delay.
         */

        setTimeout(() => {

          navigate(
            '/candidates'
          );

        }, 1200);

      } catch (err) {

        console.error(
          'CREATE CANDIDATE ERROR:',
          err
        );

        setError(
          err?.message ||
          'Unable to create candidate.'
        );

      } finally {

        setLoading(false);

      }
    };

  /* =======================================================
     RENDER
  ======================================================= */

  return (
    <div className="w-full">

      {/* =================================================
          HEADER
      ================================================= */}

      <div className="mb-6 flex flex-col gap-4 sm:flex-row sm:items-center">

        <Button
          type="button"
          variant="outline"
          size="icon"
          onClick={() =>
            navigate(
              '/candidates'
            )
          }
        >

          <ArrowLeft className="h-4 w-4" />

        </Button>

        <div>

          <h1 className="text-2xl font-semibold text-foreground">
            Create Candidate
          </h1>

          <p className="mt-1 text-sm text-muted-foreground">
            Create a candidate and upload their resume.
          </p>

        </div>

      </div>

      {/* =================================================
          FORM
      ================================================= */}

      <Card className="border-border bg-card">

        <CardHeader>

          <div className="flex items-center gap-3">

            <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10">

              <UserPlus className="h-5 w-5 text-brand-red" />

            </div>

            <div>

              <CardTitle>
                Candidate Information
              </CardTitle>

              <p className="mt-1 text-xs text-muted-foreground">
                Enter the candidate details first, then attach their resume.
              </p>

            </div>

          </div>

        </CardHeader>

        <CardContent>

          <form
            onSubmit={
              handleSubmit
            }
            className="space-y-6"
          >

            {/* =================================================
                CANDIDATE DETAILS
            ================================================= */}

            <div>

              <h2 className="mb-4 text-sm font-semibold text-foreground">
                Candidate Details
              </h2>

              <div className="grid grid-cols-1 gap-4 md:grid-cols-2">

                {/* NAME */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">

                    Full Name
                    <span className="ml-1 text-brand-red">
                      *
                    </span>

                  </label>

                  <Input
                    value={name}
                    onChange={(event) =>
                      setName(
                        event.target.value
                      )
                    }
                    placeholder="e.g. Amit Kumar"
                    disabled={loading}
                  />

                </div>

                {/* EMAIL */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">

                    Email
                    <span className="ml-1 text-brand-red">
                      *
                    </span>

                  </label>

                  <Input
                    type="email"
                    value={email}
                    onChange={(event) =>
                      setEmail(
                        event.target.value
                      )
                    }
                    placeholder="amit@example.com"
                    disabled={loading}
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
                      setPhone(
                        event.target.value
                      )
                    }
                    placeholder="+91 9876543210"
                    disabled={loading}
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
                      setLocation(
                        event.target.value
                      )
                    }
                    placeholder="Bangalore, India"
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                RESUME
            ================================================= */}

            <div className="border-t border-border pt-6">

              <h2 className="mb-4 text-sm font-semibold text-foreground">
                Resume
              </h2>

              {/* FILE */}

              <div>

                <label className="mb-2 block text-sm font-medium text-foreground">

                  Resume PDF
                  <span className="ml-1 text-brand-red">
                    *
                  </span>

                </label>

                <div className="rounded-lg border border-dashed border-border p-5">

                  <div className="flex flex-col items-center justify-center text-center">

                    <div className="flex h-12 w-12 items-center justify-center rounded-full bg-brand-red/10">

                      <Upload className="h-6 w-6 text-brand-red" />

                    </div>

                    <p className="mt-3 text-sm font-medium text-foreground">
                      Upload candidate resume
                    </p>

                    <p className="mt-1 text-xs text-muted-foreground">
                      PDF files only
                    </p>

                    <label
                      htmlFor="resume-file"
                      className="
                        mt-4
                        inline-flex
                        cursor-pointer
                        items-center
                        rounded-md
                        border
                        border-border
                        bg-background
                        px-4
                        py-2
                        text-sm
                        font-medium
                        text-foreground
                        transition
                        hover:border-brand-red/50
                      "
                    >

                      <Upload className="mr-2 h-4 w-4" />

                      Choose PDF

                    </label>

                    <input
                      id="resume-file"
                      type="file"
                      accept=".pdf,application/pdf"
                      onChange={
                        handleFileChange
                      }
                      disabled={loading}
                      className="hidden"
                    />

                  </div>

                  {file && (
                    <div className="mt-4 flex items-center gap-3 rounded-md border border-green-500/20 bg-green-500/10 p-3">

                      <FileText className="h-5 w-5 shrink-0 text-green-400" />

                      <div className="min-w-0">

                        <p className="truncate text-sm font-medium text-foreground">
                          {file.name}
                        </p>

                        <p className="text-xs text-muted-foreground">
                          {(
                            file.size /
                            1024
                          ).toFixed(1)}{' '}
                          KB
                        </p>

                      </div>

                      <CheckCircle2 className="ml-auto h-5 w-5 shrink-0 text-green-400" />

                    </div>
                  )}

                </div>

              </div>

              {/* OPTIONAL RESUME DATA */}

              <div className="mt-4 grid grid-cols-1 gap-4 md:grid-cols-3">

                {/* TEMPLATE */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Template Name
                  </label>

                  <Input
                    value={
                      templateName
                    }
                    onChange={(
                      event
                    ) =>
                      setTemplateName(
                        event.target
                          .value
                      )
                    }
                    placeholder="Modern Professional"
                    disabled={loading}
                  />

                </div>

                {/* COMPLETION */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    Completion %
                  </label>

                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      completion
                    }
                    onChange={(
                      event
                    ) =>
                      setCompletion(
                        event.target
                          .value
                      )
                    }
                    placeholder="90"
                    disabled={loading}
                  />

                </div>

                {/* ATS */}

                <div>

                  <label className="mb-2 block text-sm font-medium text-foreground">
                    ATS Score
                  </label>

                  <Input
                    type="number"
                    min="0"
                    max="100"
                    value={
                      atsScore
                    }
                    onChange={(
                      event
                    ) =>
                      setAtsScore(
                        event.target
                          .value
                      )
                    }
                    placeholder="85"
                    disabled={loading}
                  />

                </div>

              </div>

            </div>

            {/* =================================================
                ERROR
            ================================================= */}

            {error && (
              <div className="rounded-lg border border-red-500/20 bg-red-500/10 px-4 py-3">

                <p className="text-sm font-medium text-red-400">
                  {error}
                </p>

              </div>
            )}

            {/* =================================================
                SUCCESS
            ================================================= */}

            {success && (
              <div className="flex items-center gap-3 rounded-lg border border-green-500/20 bg-green-500/10 px-4 py-3">

                <CheckCircle2 className="h-5 w-5 text-green-400" />

                <div>

                  <p className="text-sm font-medium text-green-400">
                    Candidate created successfully.
                  </p>

                  <p className="mt-1 text-xs text-muted-foreground">
                    Resume uploaded. Redirecting to candidates...
                  </p>

                </div>

              </div>
            )}

            {/* =================================================
                BUTTONS
            ================================================= */}

            <div className="flex flex-col-reverse gap-3 border-t border-border pt-5 sm:flex-row sm:justify-end">

              <Button
                type="button"
                variant="outline"
                onClick={() =>
                  navigate(
                    '/candidates'
                  )
                }
                disabled={loading}
              >
                Cancel
              </Button>

              <Button
                type="submit"
                disabled={
                  loading ||
                  success
                }
                className="bg-brand-red text-white hover:bg-brand-red/90"
              >

                {loading ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Creating Candidate...
                  </>
                ) : (
                  <>
                    <UserPlus className="mr-2 h-4 w-4" />
                    Create Candidate & Upload Resume
                  </>
                )}

              </Button>

            </div>

          </form>

        </CardContent>

      </Card>

    </div>
  );
}