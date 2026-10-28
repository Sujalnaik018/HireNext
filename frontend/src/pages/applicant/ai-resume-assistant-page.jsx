import { motion } from 'framer-motion';

import { AIResumeAssistant } from '@/components/applicant/ai-resume/ai-resume-assistant';
import { staggerContainer } from '@/lib/motion';

/**
 * Applicant AI Resume Assistant page (/applicant/ai-resume-assistant).
 * Renders the two-column chat + live resume progress layout.
 */
export function AIResumeAssistantPage() {
  return (
    <motion.div
      variants={staggerContainer}
      initial="hidden"
      animate="show"
      className="space-y-6"
    >
      <AIResumeAssistant />
    </motion.div>
  );
}

