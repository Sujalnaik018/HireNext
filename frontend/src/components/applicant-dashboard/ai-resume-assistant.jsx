import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { fadeUpItem } from '@/lib/motion';

/**
 * Prominent "AI Resume Assistant" feature card.
 * Promotes the Resume Builder and routes to it via the CTA button.
 */
export function AIResumeAssistant() {
  const navigate = useNavigate();

  return (
    <motion.div variants={fadeUpItem}>
      <Card className="relative overflow-hidden border border-brand-red/30 bg-card">
        {/* Decorative accents */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-40 w-40 rounded-full bg-brand-red/10 blur-2xl" />
        <div className="pointer-events-none absolute -bottom-12 right-20 h-32 w-32 rounded-full bg-brand-red/5 blur-2xl" />

        <div className="relative flex flex-col gap-5 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-start gap-4">
            <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
              <Sparkles className="h-6 w-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h2 className="text-lg font-semibold tracking-tight text-foreground">
                  AI Resume Assistant
                </h2>
                <span className="rounded-full border border-brand-red/30 bg-brand-red/10 px-2 py-0.5 text-[10px] font-medium text-brand-red">
                  AI
                </span>
              </div>
              <p className="mt-1 text-sm text-muted-foreground">
                Create and improve your professional ATS-friendly resume with
                AI.
              </p>
            </div>
          </div>

          <Button
            size="lg"
            className="shrink-0 bg-brand-red text-white hover:bg-brand-red-dark"
            onClick={() => navigate('/resume-builder')}
          >
            Start Building Resume
            <ArrowRight className="h-4 w-4" />
          </Button>
        </div>
      </Card>
    </motion.div>
  );
}
