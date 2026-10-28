 import { motion } from 'framer-motion';
import { CalendarDays, Clock, Video } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { upcomingInterviews } from '@/data/applicant';
import { fadeUpItem } from '@/lib/motion';

const typeStyles = {
  Video: 'border-brand-red/40 bg-brand-red/10 text-brand-red',
  Phone: 'border-success/40 bg-success/10 text-success',
  Onsite: 'border-warning/40 bg-warning/10 text-warning',
};

/**
 * Upcoming Interviews card.
 * Displays interview schedule with company, date, time, and type.
 */
export function UpcomingInterviews() {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full border-border bg-card">
        <CardHeader>
          <h2 className="text-base font-semibold tracking-tight">Upcoming Interviews</h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Your scheduled interview calls
          </p>
        </CardHeader>
        <CardContent className="space-y-3">
          {upcomingInterviews.map((interview) => (
            <motion.div
              key={interview.id}
              variants={fadeUpItem}
              whileHover={{ y: -2 }}
              transition={{ type: 'spring', stiffness: 300, damping: 20 }}
              className="rounded-lg border border-border bg-background/40 p-4 transition-colors hover:border-brand-red/40"
            >
              <div className="flex items-start justify-between gap-2">
                <div>
                  <p className="text-sm font-semibold text-foreground">
                    {interview.company}
                  </p>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {interview.role}
                  </p>
                </div>
                <Badge
                  variant="outline"
                  className={`border ${typeStyles[interview.type]}`}
                >
                  {interview.type}
                </Badge>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-4 text-xs text-muted-foreground">
                <span className="flex items-center gap-1.5">
                  <CalendarDays className="h-3.5 w-3.5" />
                  {interview.date}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-3.5 w-3.5" />
                  {interview.time}
                </span>
                <span className="flex items-center gap-1.5">
                  <Video className="h-3.5 w-3.5" />
                  {interview.type} Interview
                </span>
              </div>
            </motion.div>
          ))}
        </CardContent>
      </Card>
    </motion.div>
  );
}
