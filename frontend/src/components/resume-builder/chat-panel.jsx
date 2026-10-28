import { motion, AnimatePresence } from 'framer-motion';
import { ArrowLeft, ArrowRight, Bot, Sparkles } from 'lucide-react';

import { StepForm } from '@/components/resume-builder/step-form';
import { Button } from '@/components/ui/button';
import { ScrollArea } from '@/components/ui/scroll-area';
import { chatIntroMessage, steps } from '@/data/resume-builder';
import { cn } from '@/lib/utils';

function TypingIndicator() {
  return (
    <div className="flex items-center gap-1 py-1">
      {[0, 1, 2].map((i) => (
        <motion.span
          key={i}
          className="h-1.5 w-1.5 rounded-full bg-brand-red"
          animate={{ opacity: [0.3, 1, 0.3] }}
          transition={{ duration: 1, repeat: Infinity, delay: i * 0.2 }}
        />
      ))}
    </div>
  );
}

/**
 * Left panel — AI chat interface for the resume builder.
 * Contains chat header, messages, typing indicator, progress bar,
 * current step form, and navigation buttons.
 */
export function ChatPanel({
  currentStep,
  stepData,
  messages,
  isTyping,
  onStepChange,
  onDataChange,
  onGenerate,
  onSaveDraft,
}) {
  const step = steps[currentStep];
  const progress = ((currentStep + 1) / steps.length) * 100;

  return (
    <div className="flex h-full flex-col border-r border-border bg-background">
      {/* Header */}
      <div className="border-b border-border bg-card px-5 py-4">
        <div className="flex items-center gap-3">
          <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <h2 className="text-sm font-semibold text-foreground">HireNext Resume AI</h2>
            <p className="text-xs text-muted-foreground">
              Let's build your ATS-friendly resume.
            </p>
          </div>
        </div>
      </div>

      {/* Chat messages */}
      <ScrollArea className="flex-1">
        <div className="space-y-3 p-5">
          <AnimatePresence>
            {messages.map((msg, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                className={cn(
                  'max-w-[85%] rounded-lg px-3 py-2 text-sm',
                  msg.from === 'ai'
                    ? 'bg-card text-foreground'
                    : 'ml-auto bg-brand-red text-white'
                )}
              >
                {msg.from === 'ai' && (
                  <div className="mb-1 flex items-center gap-1 text-[10px] font-medium uppercase tracking-wide text-brand-red">
                    <Sparkles className="h-3 w-3" />
                    HireNext AI
                  </div>
                )}
                {msg.text}
              </motion.div>
            ))}
          </AnimatePresence>

          {isTyping && (
            <div className="flex items-center gap-2 rounded-lg bg-card px-3 py-2 text-sm text-muted-foreground">
              <TypingIndicator />
            </div>
          )}
        </div>
      </ScrollArea>

      {/* Progress + current step */}
      <div className="border-t border-border bg-card px-5 py-4">
        <div className="mb-1 flex items-center justify-between text-xs">
          <span className="font-medium text-muted-foreground">
            Step {currentStep + 1} of {steps.length}: {step.title}
          </span>
          <span className="text-brand-red">{Math.round(progress)}%</span>
        </div>
        <div className="h-1.5 w-full overflow-hidden rounded-full bg-muted">
          <motion.div
            className="h-full rounded-full bg-brand-red"
            animate={{ width: `${progress}%` }}
            transition={{ duration: 0.4, ease: 'easeOut' }}
          />
        </div>

        {/* Step form */}
        <div className="mt-4">
          <StepForm
            step={step}
            data={stepData[step.id]}
            onChange={(value) => onDataChange(step.id, value)}
          />
        </div>

        {/* Navigation */}
        <div className="mt-4 flex items-center gap-2">
          <Button
            variant="outline"
            size="sm"
            disabled={currentStep === 0}
            onClick={() => onStepChange(currentStep - 1)}
          >
            <ArrowLeft className="h-4 w-4" />
            Back
          </Button>

          {currentStep < steps.length - 1 ? (
            <Button
              size="sm"
              className="flex-1 bg-brand-red text-white hover:bg-brand-red-dark"
              onClick={() => onStepChange(currentStep + 1)}
            >
              Next
              <ArrowRight className="h-4 w-4" />
            </Button>
          ) : (
            <Button
              size="sm"
              className="flex-1 bg-brand-red text-white hover:bg-brand-red-dark"
              onClick={onGenerate}
            >
              <Sparkles className="h-4 w-4" />
              Generate Resume
            </Button>
          )}
        </div>

        <Button
          variant="ghost"
          size="sm"
          className="mt-2 w-full text-muted-foreground"
          onClick={onSaveDraft}
        >
          Save Draft
        </Button>
      </div>
    </div>
  );
}

export { chatIntroMessage };
