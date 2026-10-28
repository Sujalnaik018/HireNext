import { motion } from 'framer-motion';
import { Briefcase, Clock, MapPin } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { recommendedJobs } from '@/data/applicant-dashboard';
import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Recommended Jobs grid.
 * Each card shows title, company, location, experience, required skills,
 * an AI match percentage, and an Apply button.
 */
export function RecommendedJobs() {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="border-border bg-card">
        <CardHeader>
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div>
              <h2 className="text-base font-semibold tracking-tight text-foreground">
                Recommended Jobs
              </h2>
              <p className="mt-0.5 text-xs text-muted-foreground">
                AI-matched roles based on your profile
              </p>
            </div>
            <Button variant="outline" size="sm">
              Browse all jobs
            </Button>
          </div>
        </CardHeader>

        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommendedJobs.map((job) => {
              const matchColor =
                job.match >= 90
                  ? 'text-emerald-500'
                  : job.match >= 80
                    ? 'text-brand-red'
                    : 'text-muted-foreground';

              return (
                <motion.div
                  key={job.id}
                  variants={fadeUpItem}
                  whileHover={{ y: -4 }}
                  transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                  className="group flex flex-col rounded-lg border border-border bg-background/40 p-4 transition-colors hover:border-brand-red/40"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-semibold text-foreground">
                        {job.title}
                      </h3>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {job.company}
                      </p>
                    </div>
                    <div className="flex shrink-0 flex-col items-end">
                      <span className={cn('text-sm font-bold', matchColor)}>
                        {job.match}%
                      </span>
                      <span className="text-[10px] text-muted-foreground">
                        Match
                      </span>
                    </div>
                  </div>

                  <div className="mt-3 space-y-1.5 text-xs text-muted-foreground">
                    <p className="flex items-center gap-1.5">
                      <MapPin className="h-3 w-3" />
                      {job.location}
                    </p>
                    <p className="flex items-center gap-1.5">
                      <Clock className="h-3 w-3" />
                      {job.experience}
                    </p>
                  </div>

                  <div className="mt-3 flex flex-wrap gap-1">
                    {job.skills.map((skill) => (
                      <Badge
                        key={skill}
                        variant="outline"
                        className="border-border bg-muted/40 text-[10px] font-normal text-muted-foreground"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <Button
                    size="sm"
                    className="mt-4 w-full bg-brand-red text-white hover:bg-brand-red-dark"
                  >
                    <Briefcase className="h-3.5 w-3.5" />
                    Apply
                  </Button>
                </motion.div>
              );
            })}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
