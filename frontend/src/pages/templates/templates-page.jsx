import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowLeft, ArrowRight, LayoutTemplate } from 'lucide-react';

import { PreviewModal } from '@/components/template-selector/preview-modal';
import { TemplateCard } from '@/components/template-selector/template-card';
import { Button } from '@/components/ui/button';
import { Dialog } from '@/components/ui/dialog';
import { useResume } from '@/context/ResumeContext';
import { resumeTemplates } from '@/data/templates';
import { staggerContainer } from '@/lib/motion';

/**
 * Resume Template Selection page.
 * Displays template cards in a responsive grid. Selecting or previewing a
 * template opens a modal with a full ATS resume preview. Bottom buttons
 * navigate back / continue.
 *
 * The selected template is stored in the shared resume state so the choice
 * persists (localStorage) and is used by the Resume Export page.
 */
export function TemplatesPage() {
  const navigate = useNavigate();
  const { selectedTemplateId, selectTemplate } = useResume();
  const [selectedId, setSelectedId] = useState(selectedTemplateId);
  const [modalTemplateId, setModalTemplateId] = useState(null);

  const selectedTemplate = resumeTemplates.find((t) => t.id === selectedId);

  // Select a template and open its preview modal
  const handleSelect = (template) => {
    setSelectedId(template.id);
    selectTemplate(template.id);
    setModalTemplateId(template.id);
  };

  // Preview a template in the modal without changing selection
  const handlePreview = (template) => {
    setModalTemplateId(template.id);
  };

  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="mx-auto w-full max-w-6xl space-y-8"
    >
      {/* Page title */}
      <div className="space-y-2">
        <div className="flex items-center gap-2">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
            <LayoutTemplate className="h-5 w-5" />
          </div>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground sm:text-3xl">
            Resume Templates
          </h1>
        </div>
        <p className="text-sm text-muted-foreground sm:text-base">
          Choose a professional ATS-friendly resume template.
        </p>
      </div>

      {/* Template grid */}
      <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {resumeTemplates.map((template) => (
          <TemplateCard
            key={template.id}
            template={template}
            isSelected={template.id === selectedId}
            onSelect={handleSelect}
            onPreview={handlePreview}
          />
        ))}
      </div>

      {/* Bottom actions */}
      <div className="flex flex-col-reverse gap-3 border-t border-border pt-6 sm:flex-row sm:items-center sm:justify-between">
        <Button
          variant="outline"
          onClick={() => navigate(-1)}
          className="sm:w-auto"
        >
          <ArrowLeft className="h-4 w-4" />
          Back
        </Button>

        <div className="flex items-center gap-3">
          <p className="hidden text-sm text-muted-foreground sm:block">
            Selected:{' '}
            <span className="font-medium text-foreground">
              {selectedTemplate?.name}
            </span>
          </p>
          <Button
            className="bg-brand-red text-white hover:bg-brand-red-dark"
            onClick={() => navigate('/resume-export')}
          >
            Continue
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </div>

      {/* Preview modal */}
      <Dialog
        open={Boolean(modalTemplateId)}
        onOpenChange={(open) => {
          if (!open) setModalTemplateId(null);
        }}
      >
        {modalTemplateId && <PreviewModal templateId={modalTemplateId} />}
      </Dialog>
    </motion.div>
  );
}
