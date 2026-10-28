import { motion } from 'framer-motion';

import { pageVariants } from '@/lib/motion';

/**
 * Wraps route elements with a consistent page transition.
 * Use as the element for each route in the router.
 */
export function PageTransition({ children }) {
  return (
    <motion.div
      variants={pageVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      className="flex min-h-full flex-col"
    >
      {children}
    </motion.div>
  );
}
