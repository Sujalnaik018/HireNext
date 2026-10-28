import { useMemo, useRef, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import {
  ArrowLeft,
  ArrowRight,
  Bot,
  Check,
  Download,
  FileText,
  Plus,
  RotateCcw,
  Save,
  Sparkles,
  Trash2,
} from 'lucide-react';

import html2canvas from 'html2canvas';
import jsPDF from 'jspdf';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { useResume } from '@/context/ResumeContext';
import { getTemplateById } from '@/data/templates';
import {
  builderToCanonical,
  canonicalToBuilder,
  canonicalToExport,
} from '@/lib/resumeAdapter';
import { fadeUpItem, staggerContainer } from '@/lib/motion';
import { ExportPreview } from '@/components/resume-export/export-preview';

/* =========================================================
   STEP DEFINITIONS
========================================================= */

const steps = [
  {
    id: 'personal',
    title: 'Personal Information',
    description: 'Tell us about yourself.',
  },
  {
    id: 'education',
    title: 'Education',
    description: 'Add your educational background.',
  },
  {
    id: 'skills',
    title: 'Technical Skills',
    description: 'List your technical and soft skills.',
  },
  {
    id: 'projects',
    title: 'Projects',
    description: 'Add your important projects.',
  },
  {
    id: 'experience',
    title: 'Experience',
    description: 'Add your work experience.',
  },
  {
    id: 'certificates',
    title: 'Certificates',
    description: 'Add certifications and courses.',
  },
  {
    id: 'achievements',
    title: 'Achievements',
    description: 'Add achievements, languages and hobbies.',
  },
];

/* =========================================================
   HELPERS
========================================================= */

function splitComma(value) {
  if (!value) return [];

  return value
    .split(',')
    .map((item) => item.trim())
    .filter(Boolean);
}

function joinComma(value) {
  if (Array.isArray(value)) {
    return value.join(', ');
  }

  return value || '';
}

function createEmptyBuilder() {
  return {
    personal: {
      fullName: '',
      email: '',
      phone: '',
      location: '',
      linkedin: '',
      github: '',
    },

    summary: '',

    education: {
      college: '',
      degree: '',
      branch: '',
      cgpa: '',
      gradYear: '',
    },

    skills: {
      programming: '',
      frameworks: '',
      databases: '',
      tools: '',
      softSkills: '',
    },

    projects: [],

    experience: [],

    certificates: [],

    achievements: {
      achievements: '',
      languages: '',
      hobbies: '',
    },
  };
}

/* =========================================================
   MAIN COMPONENT
========================================================= */

export function ResumeBuilderPage() {
  const navigate = useNavigate();

  const {
    resume: sharedResume,
    selectedTemplateId,
    updateResume,
    resetResume,
  } = useResume();

  const resumePreviewRef = useRef(null);

  const [currentStep, setCurrentStep] = useState(0);
  const [downloadingPdf, setDownloadingPdf] = useState(false);
  const [notice, setNotice] = useState(null);

  /* -------------------------------------------------------
     Convert shared canonical resume -> builder format
  ------------------------------------------------------- */

  const initialBuilder = useMemo(() => {
    try {
      const converted = canonicalToBuilder(sharedResume);

      return {
        ...createEmptyBuilder(),
        ...converted,

        personal: {
          ...createEmptyBuilder().personal,
          ...(converted.personal || {}),
        },

        education: {
          ...createEmptyBuilder().education,
          ...(converted.education || {}),
        },

        skills: {
          ...createEmptyBuilder().skills,
          ...(converted.skills || {}),
        },

        projects: Array.isArray(converted.projects)
          ? converted.projects
          : [],

        experience: Array.isArray(converted.experience)
          ? converted.experience
          : [],

        certificates: Array.isArray(converted.certificates)
          ? converted.certificates
          : [],

        achievements: {
          ...createEmptyBuilder().achievements,
          ...(converted.achievements || {}),
        },
      };
    } catch (error) {
      console.error('Failed to load resume:', error);
      return createEmptyBuilder();
    }
  }, [sharedResume]);

  const [builder, setBuilder] = useState(initialBuilder);

  /* -------------------------------------------------------
     Current preview data
  ------------------------------------------------------- */

  const previewResume = useMemo(() => {
    try {
      const canonical = builderToCanonical(builder);
      return canonicalToExport(canonical);
    } catch (error) {
      console.error('Preview conversion failed:', error);

      return canonicalToExport(sharedResume);
    }
  }, [builder, sharedResume]);

  const template = getTemplateById(selectedTemplateId);

  /* =========================================================
     FIELD UPDATE HELPERS
  ========================================================= */

  const updatePersonal = (field, value) => {
    setBuilder((prev) => ({
      ...prev,
      personal: {
        ...prev.personal,
        [field]: value,
      },
    }));
  };

  const updateEducation = (field, value) => {
    setBuilder((prev) => ({
      ...prev,
      education: {
        ...prev.education,
        [field]: value,
      },
    }));
  };

  const updateSkill = (field, value) => {
    setBuilder((prev) => ({
      ...prev,
      skills: {
        ...prev.skills,
        [field]: value,
      },
    }));
  };

  const updateAchievements = (field, value) => {
    setBuilder((prev) => ({
      ...prev,
      achievements: {
        ...prev.achievements,
        [field]: value,
      },
    }));
  };

  /* =========================================================
     PROJECTS
  ========================================================= */

  const addProject = () => {
    setBuilder((prev) => ({
      ...prev,
      projects: [
        ...(prev.projects || []),
        {
          name: '',
          description: '',
          technologies: '',
          link: '',
        },
      ],
    }));
  };

  const updateProject = (index, field, value) => {
    setBuilder((prev) => {
      const projects = [...(prev.projects || [])];

      projects[index] = {
        ...projects[index],
        [field]: value,
      };

      return {
        ...prev,
        projects,
      };
    });
  };

  const removeProject = (index) => {
    setBuilder((prev) => ({
      ...prev,
      projects: prev.projects.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     EXPERIENCE
  ========================================================= */

  const addExperience = () => {
    setBuilder((prev) => ({
      ...prev,
      experience: [
        ...(prev.experience || []),
        {
          company: '',
          role: '',
          duration: '',
          responsibilities: '',
        },
      ],
    }));
  };

  const updateExperience = (index, field, value) => {
    setBuilder((prev) => {
      const experience = [...(prev.experience || [])];

      experience[index] = {
        ...experience[index],
        [field]: value,
      };

      return {
        ...prev,
        experience,
      };
    });
  };

  const removeExperience = (index) => {
    setBuilder((prev) => ({
      ...prev,
      experience: prev.experience.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     CERTIFICATES
  ========================================================= */

  const addCertificate = () => {
    setBuilder((prev) => ({
      ...prev,
      certificates: [
        ...(prev.certificates || []),
        {
          course: '',
          platform: '',
          year: '',
        },
      ],
    }));
  };

  const updateCertificate = (index, field, value) => {
    setBuilder((prev) => {
      const certificates = [...(prev.certificates || [])];

      certificates[index] = {
        ...certificates[index],
        [field]: value,
      };

      return {
        ...prev,
        certificates,
      };
    });
  };

  const removeCertificate = (index) => {
    setBuilder((prev) => ({
      ...prev,
      certificates: prev.certificates.filter((_, i) => i !== index),
    }));
  };

  /* =========================================================
     SAVE
  ========================================================= */

  const handleSaveDraft = () => {
    try {
      const canonical = builderToCanonical(builder);

      updateResume(canonical);

      setNotice({
        type: 'success',
        text: 'Draft saved successfully.',
      });
    } catch (error) {
      console.error('Save draft failed:', error);

      setNotice({
        type: 'error',
        text: 'Unable to save the resume draft.',
      });
    }
  };

  /* =========================================================
     GENERATE RESUME
  ========================================================= */

  const handleGenerateResume = () => {
    try {
      const canonical = builderToCanonical(builder);

      updateResume(canonical);

      setNotice({
        type: 'success',
        text: 'Resume generated successfully.',
      });

      setTimeout(() => {
        navigate('/resume-export');
      }, 500);
    } catch (error) {
      console.error('Resume generation failed:', error);

      setNotice({
        type: 'error',
        text: 'Unable to generate the resume.',
      });
    }
  };

  /* =========================================================
     RESET
  ========================================================= */

  const handleStartNew = () => {
    const confirmed = window.confirm(
      'Start a new resume? Your current resume data will be cleared.'
    );

    if (!confirmed) return;

    const empty = createEmptyBuilder();

    setBuilder(empty);
    setCurrentStep(0);
    setNotice({
      type: 'success',
      text: 'Started a new resume.',
    });

    resetResume();
  };

  /* =========================================================
     PDF DOWNLOAD
  ========================================================= */

  const handleDownloadPdf = async () => {
    const resumeElement = resumePreviewRef.current;

    if (!resumeElement) {
      setNotice({
        type: 'error',
        text: 'Resume preview could not be found.',
      });

      return;
    }

    try {
      setDownloadingPdf(true);
      setNotice(null);

      /*
       * Save current builder data first.
       */
      const canonical = builderToCanonical(builder);
      updateResume(canonical);

      /*
       * Allow React to finish rendering.
       */
      await new Promise((resolve) => setTimeout(resolve, 400));

      /*
       * Capture the actual visible resume preview.
       */
      const canvas = await html2canvas(resumeElement, {
        scale: 2,
        useCORS: true,
        allowTaint: true,
        backgroundColor: '#ffffff',
        logging: false,
        imageTimeout: 15000,
        windowWidth: resumeElement.scrollWidth,
        windowHeight: resumeElement.scrollHeight,
      });

      const imageData = canvas.toDataURL('image/png');

      const pdf = new jsPDF({
        orientation: 'portrait',
        unit: 'mm',
        format: 'a4',
      });

      const pageWidth = 210;
      const pageHeight = 297;

      const margin = 0;

      const imageWidth = pageWidth;
      const imageHeight =
        (canvas.height * imageWidth) / canvas.width;

      let heightLeft = imageHeight;
      let position = 0;

      /*
       * First page.
       */
      pdf.addImage(
        imageData,
        'PNG',
        margin,
        position,
        imageWidth,
        imageHeight,
        undefined,
        'FAST'
      );

      heightLeft -= pageHeight;

      /*
       * Additional pages.
       */
      while (heightLeft > 0) {
        position = -(imageHeight - heightLeft);

        pdf.addPage();

        pdf.addImage(
          imageData,
          'PNG',
          margin,
          position,
          imageWidth,
          imageHeight,
          undefined,
          'FAST'
        );

        heightLeft -= pageHeight;
      }

      const name =
        builder.personal?.fullName?.trim() || 'HireNext';

      const safeName = name
        .replace(/[^a-zA-Z0-9-_ ]/g, '')
        .trim()
        .replace(/\s+/g, '_');

      pdf.save(`${safeName || 'HireNext'}_Resume.pdf`);

      setNotice({
        type: 'success',
        text: 'Resume PDF downloaded successfully.',
      });
    } catch (error) {
      console.error('PDF generation failed:', error);

      setNotice({
        type: 'error',
        text:
          error?.message ||
          'Failed to generate the PDF. Please try again.',
      });
    } finally {
      setDownloadingPdf(false);
    }
  };

  /* =========================================================
     STEP NAVIGATION
  ========================================================= */

  const goNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep((prev) => prev + 1);
    }
  };

  const goBack = () => {
    if (currentStep > 0) {
      setCurrentStep((prev) => prev - 1);
    }
  };

  /* =========================================================
     PROGRESS
  ========================================================= */

  const progress = Math.round(
    ((currentStep + 1) / steps.length) * 100
  );

  /* =========================================================
     RENDER STEP
  ========================================================= */

  const renderStep = () => {
    const step = steps[currentStep];

    /* -------------------------------------------------------
       PERSONAL
    ------------------------------------------------------- */

    if (step.id === 'personal') {
      return (
        <div className="space-y-5">
          <SectionTitle
            title="Personal Information"
            description="Add the contact information recruiters should see."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="Full Name"
              value={builder.personal.fullName}
              onChange={(value) =>
                updatePersonal('fullName', value)
              }
              placeholder="John Doe"
            />

            <Field
              label="Email"
              type="email"
              value={builder.personal.email}
              onChange={(value) =>
                updatePersonal('email', value)
              }
              placeholder="john@example.com"
            />

            <Field
              label="Phone"
              value={builder.personal.phone}
              onChange={(value) =>
                updatePersonal('phone', value)
              }
              placeholder="+91 9876543210"
            />

            <Field
              label="Location"
              value={builder.personal.location}
              onChange={(value) =>
                updatePersonal('location', value)
              }
              placeholder="Mumbai, India"
            />

            <Field
              label="LinkedIn"
              value={builder.personal.linkedin}
              onChange={(value) =>
                updatePersonal('linkedin', value)
              }
              placeholder="linkedin.com/in/username"
            />

            <Field
              label="GitHub"
              value={builder.personal.github}
              onChange={(value) =>
                updatePersonal('github', value)
              }
              placeholder="github.com/username"
            />
          </div>

          <TextAreaField
            label="Professional Summary"
            value={builder.summary}
            onChange={(value) =>
              setBuilder((prev) => ({
                ...prev,
                summary: value,
              }))
            }
            placeholder="Write a short professional summary..."
            rows={5}
          />
        </div>
      );
    }

    /* -------------------------------------------------------
       EDUCATION
    ------------------------------------------------------- */

    if (step.id === 'education') {
      return (
        <div className="space-y-5">
          <SectionTitle
            title="Education"
            description="Add your highest or most relevant education."
          />

          <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
            <Field
              label="College / University"
              value={builder.education.college}
              onChange={(value) =>
                updateEducation('college', value)
              }
              placeholder="Shah and Anchor Kutchhi Engineering College"
            />

            <Field
              label="Degree"
              value={builder.education.degree}
              onChange={(value) =>
                updateEducation('degree', value)
              }
              placeholder="Bachelor of Engineering"
            />

            <Field
              label="Branch"
              value={builder.education.branch}
              onChange={(value) =>
                updateEducation('branch', value)
              }
              placeholder="Computer Engineering"
            />

            <Field
              label="CGPA / Percentage"
              value={builder.education.cgpa}
              onChange={(value) =>
                updateEducation('cgpa', value)
              }
              placeholder="8.5"
            />

            <Field
              label="Graduation Year"
              value={builder.education.gradYear}
              onChange={(value) =>
                updateEducation('gradYear', value)
              }
              placeholder="2026"
            />
          </div>
        </div>
      );
    }

    /* -------------------------------------------------------
       SKILLS
    ------------------------------------------------------- */

    if (step.id === 'skills') {
      return (
        <div className="space-y-5">
          <SectionTitle
            title="Technical Skills"
            description="Separate multiple skills with commas."
          />

          <Field
            label="Programming Languages"
            value={builder.skills.programming}
            onChange={(value) =>
              updateSkill('programming', value)
            }
            placeholder="JavaScript, Python, Java, C++"
          />

          <Field
            label="Frameworks"
            value={builder.skills.frameworks}
            onChange={(value) =>
              updateSkill('frameworks', value)
            }
            placeholder="React, Node.js, FastAPI"
          />

          <Field
            label="Databases"
            value={builder.skills.databases}
            onChange={(value) =>
              updateSkill('databases', value)
            }
            placeholder="PostgreSQL, MySQL, MongoDB"
          />

          <Field
            label="Tools"
            value={builder.skills.tools}
            onChange={(value) =>
              updateSkill('tools', value)
            }
            placeholder="Git, GitHub, Docker, VS Code"
          />

          <Field
            label="Soft Skills"
            value={builder.skills.softSkills}
            onChange={(value) =>
              updateSkill('softSkills', value)
            }
            placeholder="Communication, Leadership, Problem Solving"
          />
        </div>
      );
    }

    /* -------------------------------------------------------
       PROJECTS
    ------------------------------------------------------- */

    if (step.id === 'projects') {
      return (
        <div className="space-y-5">
          <SectionTitle
            title="Projects"
            description="Show recruiters the projects that demonstrate your skills."
          />

          {(builder.projects || []).map((project, index) => (
            <Card
              key={index}
              className="border-border bg-card p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                  Project {index + 1}
                </h3>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeProject(index)}
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <Field
                  label="Project Name"
                  value={project.name}
                  onChange={(value) =>
                    updateProject(index, 'name', value)
                  }
                  placeholder="AI Resume Screening System"
                />

                <TextAreaField
                  label="Description"
                  value={project.description}
                  onChange={(value) =>
                    updateProject(
                      index,
                      'description',
                      value
                    )
                  }
                  placeholder="Describe what the project does..."
                  rows={4}
                />

                <Field
                  label="Technologies"
                  value={project.technologies}
                  onChange={(value) =>
                    updateProject(
                      index,
                      'technologies',
                      value
                    )
                  }
                  placeholder="React, Python, FastAPI, PostgreSQL"
                />

                <Field
                  label="Project Link"
                  value={project.link}
                  onChange={(value) =>
                    updateProject(index, 'link', value)
                  }
                  placeholder="https://github.com/username/project"
                />
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addProject}
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Add Project
          </Button>
        </div>
      );
    }

    /* -------------------------------------------------------
       EXPERIENCE
    ------------------------------------------------------- */

    if (step.id === 'experience') {
      return (
        <div className="space-y-5">
          <SectionTitle
            title="Work Experience"
            description="Add internships, jobs or relevant professional experience."
          />

          {(builder.experience || []).map((experience, index) => (
            <Card
              key={index}
              className="border-border bg-card p-5"
            >
              <div className="mb-4 flex items-center justify-between">
                <h3 className="font-semibold">
                  Experience {index + 1}
                </h3>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() =>
                    removeExperience(index)
                  }
                  className="text-destructive"
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-4">
                <Field
                  label="Company"
                  value={experience.company}
                  onChange={(value) =>
                    updateExperience(
                      index,
                      'company',
                      value
                    )
                  }
                  placeholder="Google"
                />

                <Field
                  label="Job Role"
                  value={experience.role}
                  onChange={(value) =>
                    updateExperience(
                      index,
                      'role',
                      value
                    )
                  }
                  placeholder="Data Analyst"
                />

                <Field
                  label="Duration"
                  value={experience.duration}
                  onChange={(value) =>
                    updateExperience(
                      index,
                      'duration',
                      value
                    )
                  }
                  placeholder="2022 - 2026"
                />

                <TextAreaField
                  label="Responsibilities"
                  value={experience.responsibilities}
                  onChange={(value) =>
                    updateExperience(
                      index,
                      'responsibilities',
                      value
                    )
                  }
                  placeholder="Describe your responsibilities and achievements..."
                  rows={5}
                />
              </div>
            </Card>
          ))}

          <Button
            variant="outline"
            onClick={addExperience}
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Add Experience
          </Button>
        </div>
      );
    }

    /* -------------------------------------------------------
       CERTIFICATES
    ------------------------------------------------------- */

    if (step.id === 'certificates') {
      return (
        <div className="space-y-5">
          <SectionTitle
            title="Certificates"
            description="Add certifications, courses and credentials."
          />

          {(builder.certificates || []).map(
            (certificate, index) => (
              <Card
                key={index}
                className="border-border bg-card p-5"
              >
                <div className="mb-4 flex items-center justify-between">
                  <h3 className="font-semibold">
                    Certificate {index + 1}
                  </h3>

                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() =>
                      removeCertificate(index)
                    }
                    className="text-destructive"
                  >
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>

                <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
                  <Field
                    label="Certificate"
                    value={certificate.course}
                    onChange={(value) =>
                      updateCertificate(
                        index,
                        'course',
                        value
                      )
                    }
                    placeholder="AWS Cloud Practitioner"
                  />

                  <Field
                    label="Platform / Organization"
                    value={certificate.platform}
                    onChange={(value) =>
                      updateCertificate(
                        index,
                        'platform',
                        value
                      )
                    }
                    placeholder="Amazon Web Services"
                  />

                  <Field
                    label="Year"
                    value={certificate.year}
                    onChange={(value) =>
                      updateCertificate(
                        index,
                        'year',
                        value
                      )
                    }
                    placeholder="2026"
                  />
                </div>
              </Card>
            )
          )}

          <Button
            variant="outline"
            onClick={addCertificate}
            className="w-full"
          >
            <Plus className="h-4 w-4" />
            Add Certificate
          </Button>
        </div>
      );
    }

    /* -------------------------------------------------------
       ACHIEVEMENTS
    ------------------------------------------------------- */

    if (step.id === 'achievements') {
      return (
        <div className="space-y-5">
          <SectionTitle
            title="Achievements & Additional Information"
            description="Add achievements, languages and hobbies."
          />

          <TextAreaField
            label="Achievements"
            value={builder.achievements.achievements}
            onChange={(value) =>
              updateAchievements(
                'achievements',
                value
              )
            }
            placeholder="Winner of hackathon&#10;Completed major engineering project&#10;Academic achievement"
            rows={5}
          />

          <Field
            label="Languages"
            value={builder.achievements.languages}
            onChange={(value) =>
              updateAchievements(
                'languages',
                value
              )
            }
            placeholder="English, Hindi, Marathi"
          />

          <Field
            label="Hobbies / Interests"
            value={builder.achievements.hobbies}
            onChange={(value) =>
              updateAchievements(
                'hobbies',
                value
              )
            }
            placeholder="Cricket, Reading, Technology"
          />
        </div>
      );
    }

    return null;
  };

  /* =========================================================
     RETURN
  ========================================================= */

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      {/* =====================================================
          HEADER
      ===================================================== */}

      <motion.div
        variants={fadeUpItem}
        className="flex flex-col gap-4 border-b border-border pb-5 lg:flex-row lg:items-center lg:justify-between"
      >
        <div className="flex items-center gap-3">
          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
            <FileText className="h-5 w-5" />
          </div>

          <div>
            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              AI Resume Builder
            </h1>

            <p className="text-sm text-muted-foreground">
              Build an ATS-friendly resume in minutes
            </p>
          </div>
        </div>

        <div className="flex flex-wrap items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={handleStartNew}
          >
            <RotateCcw className="h-4 w-4" />
            Start New Resume
          </Button>

          <Button
            variant="outline"
            size="sm"
            onClick={handleSaveDraft}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>

          <Button
            size="sm"
            onClick={handleGenerateResume}
            className="bg-brand-red text-white hover:bg-brand-red-dark"
          >
            <Sparkles className="h-4 w-4" />
            Generate Resume
          </Button>

          <Button
            size="sm"
            variant="outline"
            disabled={downloadingPdf}
            onClick={handleDownloadPdf}
          >
            <Download className="h-4 w-4" />
            {downloadingPdf
              ? 'Generating...'
              : 'Download PDF'}
          </Button>
        </div>
      </motion.div>

      {/* =====================================================
          NOTICE
      ===================================================== */}

      {notice && (
        <motion.div variants={fadeUpItem}>
          <div
            className={`rounded-lg border px-4 py-3 text-sm ${
              notice.type === 'error'
                ? 'border-destructive/40 bg-destructive/10 text-destructive'
                : 'border-success/40 bg-success/10 text-success'
            }`}
          >
            {notice.text}
          </div>
        </motion.div>
      )}

      {/* =====================================================
          MAIN GRID
      ===================================================== */}

      <div className="grid grid-cols-1 gap-0 overflow-hidden rounded-xl border border-border bg-card xl:grid-cols-2">
        {/* ===================================================
            LEFT — AI BUILDER
        =================================================== */}

        <div className="min-h-[700px] border-b border-border xl:border-b-0 xl:border-r">
          {/* Assistant header */}

          <div className="border-b border-border p-5">
            <div className="flex items-center gap-3">
              <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                <Bot className="h-5 w-5" />
              </div>

              <div>
                <h2 className="font-semibold text-foreground">
                  HireNext Resume AI
                </h2>

                <p className="text-xs text-muted-foreground">
                  Let's build your ATS-friendly resume.
                </p>
              </div>
            </div>
          </div>

          {/* Progress */}

          <div className="border-b border-border p-5">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-xs font-medium text-muted-foreground">
                Step {currentStep + 1} of {steps.length}
              </span>

              <span className="text-xs font-semibold text-brand-red">
                {progress}%
              </span>
            </div>

            <div className="h-1.5 overflow-hidden rounded-full bg-muted">
              <div
                className="h-full rounded-full bg-brand-red transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          {/* Step navigation */}

          <div className="flex gap-2 overflow-x-auto border-b border-border p-4">
            {steps.map((step, index) => (
              <button
                key={step.id}
                type="button"
                onClick={() => setCurrentStep(index)}
                className={`shrink-0 rounded-md px-3 py-2 text-xs transition-colors ${
                  currentStep === index
                    ? 'bg-brand-red text-white'
                    : index < currentStep
                      ? 'bg-success/10 text-success'
                      : 'bg-muted text-muted-foreground hover:bg-muted/80'
                }`}
              >
                {index + 1}. {step.title}
              </button>
            ))}
          </div>

          {/* Current step */}

          <div className="p-5 sm:p-6">
            <div className="mb-6 rounded-lg border border-brand-red/20 bg-brand-red/5 p-4">
              <div className="flex gap-3">
                <Sparkles className="mt-0.5 h-4 w-4 shrink-0 text-brand-red" />

                <div>
                  <p className="text-xs font-semibold uppercase tracking-wide text-brand-red">
                    HIRENEXT AI
                  </p>

                  <p className="mt-1 text-sm text-foreground">
                    {steps[currentStep].description}
                  </p>
                </div>
              </div>
            </div>

            {renderStep()}
          </div>

          {/* Navigation */}

          <div className="flex items-center justify-between border-t border-border p-5">
            <Button
              variant="outline"
              onClick={() => {
                if (currentStep === 0) {
                  navigate(-1);
                } else {
                  goBack();
                }
              }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>

            {currentStep < steps.length - 1 ? (
              <Button
                onClick={goNext}
                className="bg-brand-red text-white hover:bg-brand-red-dark"
              >
                Next
                <ArrowRight className="h-4 w-4" />
              </Button>
            ) : (
              <Button
                onClick={handleGenerateResume}
                className="bg-brand-red text-white hover:bg-brand-red-dark"
              >
                Generate Resume
                <Sparkles className="h-4 w-4" />
              </Button>
            )}
          </div>
        </div>

        {/* ===================================================
            RIGHT — LIVE PREVIEW
        =================================================== */}

        <div className="min-h-[700px] bg-background/40">
          <div className="sticky top-0 z-10 flex items-center justify-between border-b border-border bg-card px-5 py-4">
            <div>
              <h2 className="font-semibold text-foreground">
                Live Resume Preview
              </h2>

              <p className="text-xs text-muted-foreground">
                Updates as you type
              </p>
            </div>

            <Button
              variant="outline"
              size="sm"
              disabled={downloadingPdf}
              onClick={handleDownloadPdf}
            >
              <Download className="h-4 w-4" />
              {downloadingPdf
                ? 'Generating...'
                : 'Download PDF'}
            </Button>
          </div>

          <div className="overflow-auto p-4 sm:p-6">
            {/* 
              IMPORTANT:
              This ref is the exact element captured by html2canvas.
            */}

            <div
              ref={resumePreviewRef}
              className="mx-auto w-full max-w-[794px] bg-white"
            >
              <ExportPreview
                resume={previewResume}
                template={template}
              />
            </div>
          </div>
        </div>
      </div>

      {/* =====================================================
          BOTTOM ACTIONS
      ===================================================== */}

      <motion.div
        variants={fadeUpItem}
        className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between"
      >
        <Button
          variant="ghost"
          onClick={() => navigate('/templates')}
          className="justify-start text-muted-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Choose Resume Template
        </Button>

        <div className="flex flex-wrap gap-2">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
          >
            <Save className="h-4 w-4" />
            Save Draft
          </Button>

          <Button
            variant="outline"
            disabled={downloadingPdf}
            onClick={handleDownloadPdf}
          >
            <Download className="h-4 w-4" />
            Download PDF
          </Button>

          <Button
            onClick={handleGenerateResume}
            className="bg-brand-red text-white hover:bg-brand-red-dark"
          >
            Generate Resume
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </motion.div>
    </motion.div>
  );
}

/* =========================================================
   REUSABLE FIELD
========================================================= */

function Field({
  label,
  value,
  onChange,
  placeholder = '',
  type = 'text',
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>

      <input
        type={type}
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        className="flex h-10 w-full rounded-md border border-border bg-background px-3 py-2 text-sm text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-red focus:ring-1 focus:ring-brand-red"
      />
    </div>
  );
}

/* =========================================================
   REUSABLE TEXTAREA
========================================================= */

function TextAreaField({
  label,
  value,
  onChange,
  placeholder = '',
  rows = 4,
}) {
  return (
    <div className="space-y-2">
      <label className="text-sm font-medium text-foreground">
        {label}
      </label>

      <textarea
        value={value || ''}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        rows={rows}
        className="w-full resize-y rounded-md border border-border bg-background px-3 py-2 text-sm leading-6 text-foreground outline-none transition-colors placeholder:text-muted-foreground focus:border-brand-red focus:ring-1 focus:ring-brand-red"
      />
    </div>
  );
}

/* =========================================================
   SECTION TITLE
========================================================= */

function SectionTitle({ title, description }) {
  return (
    <div>
      <h3 className="text-lg font-semibold text-foreground">
        {title}
      </h3>

      {description && (
        <p className="mt-1 text-sm text-muted-foreground">
          {description}
        </p>
      )}
    </div>
  );
}