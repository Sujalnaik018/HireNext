import { motion } from 'framer-motion';
import { ArrowRight, Sparkles } from 'lucide-react';
import { Link } from 'react-router-dom';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { fadeUpItem, staggerContainer } from '@/lib/motion';

/**
 * Placeholder landing page to demonstrate the layout & theme.
 * Will be replaced with full marketing content later.
 */
export function HomePage() {
  return (
    <section className="relative flex min-h-[80vh] items-center justify-center overflow-hidden">
      {/* Background glow */}
      <div
        className="pointer-events-none absolute inset-0 opacity-40"
        style={{
          background:
            'radial-gradient(ellipse at 50% 0%, rgba(229,9,20,0.25), transparent 60%)',
        }}
      />

      <motion.div
        variants={staggerContainer}
        initial="hidden"
        animate="show"
        className="container relative flex flex-col items-center gap-6 py-24 text-center"
      >
        <motion.div variants={fadeUpItem}>
          <Badge variant="brand" className="gap-1.5">
            <Sparkles className="h-3.5 w-3.5" />
            AI-Powered Recruitment
          </Badge>
        </motion.div>

        <motion.h1
          variants={fadeUpItem}
          className="max-w-3xl text-4xl font-extrabold tracking-tight sm:text-5xl md:text-6xl"
        >
          Recruit smarter with{' '}
          <span className="text-gradient-red">AI intelligence</span>
        </motion.h1>

        <motion.p
          variants={fadeUpItem}
          className="max-w-xl text-lg text-muted-foreground"
        >
          HireNext automates resume screening, matches candidates to jobs, and
          ranks the best talent — powered by AI.
        </motion.p>

        <motion.div variants={fadeUpItem} className="flex flex-wrap items-center justify-center gap-3">
          <Button size="lg" asChild>
            <Link to="/register">
              Get Started <ArrowRight className="ml-1 h-4 w-4" />
            </Link>
          </Button>
          <Button size="lg" variant="outline" asChild>
            <Link to="/dashboard">Explore Dashboard</Link>
          </Button>
        </motion.div>
      </motion.div>
    </section>
  );
}
