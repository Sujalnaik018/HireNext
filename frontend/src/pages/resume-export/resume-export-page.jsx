import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';

import {
  ArrowLeft,
  CheckCircle2,
  Download,
  FileText,
  FileType2,
  Pencil,
  Printer,
  Sparkles,
  Target,
} from 'lucide-react';

import { ExportPreview } from '@/components/resume-export/export-preview';
import { ATSScoreCard } from '@/components/resume-export/ats-score-card';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

import { useResume } from '@/context/ResumeContext';

import { getTemplateById } from '@/data/templates';

import { canonicalToExport } from '@/lib/resumeAdapter';

import { downloadResumeDocx } from '@/lib/generateResumeDocx';

import {
  staggerContainer,
  fadeUpItem,
} from '@/lib/motion';


function safeObject(value) {
  if (!value || typeof value !== 'object') {
    return {};
  }

  return value;
}


export function ResumeExportPage() {
  const navigate = useNavigate();

  const {
    resume: sharedResume,
    selectedTemplateId,
  } = useResume();

  const [notice, setNotice] = useState(null);

  /*
   * Convert resume safely.
   */
  let resume = {};

  try {
    resume = canonicalToExport(
      safeObject(sharedResume)
    );

    if (!resume || typeof resume !== 'object') {
      resume = {};
    }
  } catch (error) {
    console.error(
      'Resume adapter error:',
      error
    );

    resume = safeObject(sharedResume);
  }


  /*
   * Get selected template safely.
   */
  let template = null;

  try {
    template = getTemplateById(
      selectedTemplateId
    );
  } catch (error) {
    console.error(
      'Template error:',
      error
    );
  }

  if (!template) {
    template = {
      id:
        selectedTemplateId ||
        'classic-ats',

      name:
        'Classic ATS',
    };
  }


  /*
   * PDF
   */
  const handleDownloadPdf = () => {
    setNotice(null);

    setTimeout(() => {
      window.print();
    }, 100);
  };


  /*
   * DOCX
   */
  const handleDownloadDocx = async () => {
    setNotice(null);

    try {
      await downloadResumeDocx(
        resume,
        template
      );

      setNotice({
        type: 'success',
        text:
          'DOCX resume downloaded successfully.',
      });
    } catch (error) {
      console.error(
        'DOCX download error:',
        error
      );

      setNotice({
        type: 'error',
        text:
          error?.message ||
          'Unable to generate DOCX. Please try again.',
      });
    }
  };


  /*
   * Print
   */
  const handlePrint = () => {
    window.print();
  };


  /*
   * Edit
   */
  const handleEdit = () => {
    navigate('/resume-builder');
  };


  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >

      {/* =====================================================
          HEADER
      ====================================================== */}

      <motion.div
        variants={fadeUpItem}
        className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between"
      >

        <div className="flex items-center gap-3">

          <div className="flex h-11 w-11 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
            <FileText className="h-5 w-5" />
          </div>

          <div>

            <h1 className="text-xl font-semibold tracking-tight text-foreground sm:text-2xl">
              Resume Export
            </h1>

            <p className="text-sm text-muted-foreground">
              Review and download your ATS-friendly resume
            </p>

          </div>

        </div>


        <div className="flex items-center gap-2">

          <Badge variant="brand">
            {template.name}
          </Badge>

          <Badge
            variant="outline"
            className="border-border text-muted-foreground"
          >
            Preview
          </Badge>

        </div>

      </motion.div>


      {/* =====================================================
          ACTION BAR
      ====================================================== */}

      <motion.div variants={fadeUpItem}>

        <Card className="border-border bg-card p-4">

          <div className="flex flex-col-reverse gap-3 lg:flex-row lg:items-center lg:justify-between">

            {/* LEFT */}

            <div className="flex flex-wrap items-center gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={() => navigate(-1)}
              >
                <ArrowLeft className="h-4 w-4" />
                Back
              </Button>


              <Button
                variant="outline"
                size="sm"
                onClick={handleEdit}
              >
                <Pencil className="h-4 w-4" />
                Edit Resume
              </Button>

            </div>


            {/* RIGHT */}

            <div className="flex flex-wrap items-center gap-2">

              <Button
                variant="outline"
                size="sm"
                onClick={handlePrint}
              >
                <Printer className="h-4 w-4" />
                Print Resume
              </Button>


              <Button
                variant="outline"
                size="sm"
                onClick={handleDownloadDocx}
              >
                <FileType2 className="h-4 w-4" />
                Download DOCX
              </Button>


              <Button
                size="sm"
                className="bg-brand-red text-white hover:bg-brand-red-dark"
                onClick={handleDownloadPdf}
              >
                <Download className="h-4 w-4" />
                Download PDF
              </Button>

            </div>

          </div>

        </Card>

      </motion.div>


      {/* =====================================================
          NOTICE
      ====================================================== */}

      {notice && (

        <motion.div variants={fadeUpItem}>

          <div
            className={`flex items-center gap-2 rounded-lg px-4 py-3 text-sm ${
              notice.type === 'error'
                ? 'border border-red-500/30 bg-red-500/10 text-red-400'
                : 'border border-green-500/30 bg-green-500/10 text-green-400'
            }`}
          >

            <CheckCircle2 className="h-4 w-4 shrink-0" />

            {notice.text}

          </div>

        </motion.div>

      )}


      {/* =====================================================
          FEATURE STRIP
      ====================================================== */}

      <motion.div variants={fadeUpItem}>

        <div className="flex flex-wrap items-center gap-2 rounded-lg border border-border bg-card/50 px-4 py-3 text-xs text-muted-foreground">

          <span className="flex items-center gap-1.5">
            <Download className="h-3.5 w-3.5 text-brand-red" />
            PDF
          </span>


          <Separator
            orientation="vertical"
            className="h-4"
          />


          <span className="flex items-center gap-1.5">
            <FileType2 className="h-3.5 w-3.5 text-brand-red" />
            DOCX
          </span>


          <Separator
            orientation="vertical"
            className="h-4"
          />


          <span className="flex items-center gap-1.5">
            <Sparkles className="h-3.5 w-3.5 text-brand-red" />
            AI Optimization
          </span>


          <Separator
            orientation="vertical"
            className="h-4"
          />


          <span className="flex items-center gap-1.5">
            <Target className="h-3.5 w-3.5 text-brand-red" />
            ATS Score
          </span>


          <span className="ml-auto hidden sm:inline">
            PDF & DOCX export available
          </span>

        </div>

      </motion.div>


      {/* =====================================================
          ATS SCORE
      ====================================================== */}

      <motion.div variants={fadeUpItem}>

        <ATSScoreCard
          resume={resume}
        />

      </motion.div>


      {/* =====================================================
          RESUME PREVIEW
      ====================================================== */}

      <motion.div variants={fadeUpItem}>

        <div className="print-area">

          <ExportPreview
            resume={resume}
            template={template}
          />

        </div>

      </motion.div>


      {/* =====================================================
          BOTTOM ACTIONS
      ====================================================== */}

      <motion.div variants={fadeUpItem}>

        <div className="flex flex-col gap-3 border-t border-border pt-5 sm:flex-row sm:items-center sm:justify-between">

          <Button
            variant="ghost"
            asChild
            className="justify-start text-muted-foreground"
          >

            <Link to="/templates">

              <ArrowLeft className="h-4 w-4" />

              Back to Templates

            </Link>

          </Button>


          <div className="flex flex-wrap items-center gap-2">

            <Button
              variant="outline"
              size="sm"
              onClick={handleEdit}
            >

              <Pencil className="h-4 w-4" />

              Edit Resume

            </Button>


            <Button
              variant="outline"
              size="sm"
              onClick={handlePrint}
              className="hidden sm:inline-flex"
            >

              <Printer className="h-4 w-4" />

              Print

            </Button>


            <Button
              variant="outline"
              size="sm"
              onClick={handleDownloadDocx}
            >

              <FileType2 className="h-4 w-4" />

              DOCX

            </Button>


            <Button
              size="sm"
              className="bg-brand-red text-white hover:bg-brand-red-dark"
              onClick={handleDownloadPdf}
            >

              <Download className="h-4 w-4" />

              Download PDF

            </Button>

          </div>

        </div>

      </motion.div>

    </motion.div>
  );
}


export default ResumeExportPage;