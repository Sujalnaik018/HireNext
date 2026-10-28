import { motion } from 'framer-motion';
import { Building2, CalendarDays, Clock, Phone, Video } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { upcomingInterviews } from '@/data/applicant-dashboard';
import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

const statusStyles = {
  Confirmed: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  Scheduled: 'border-sky-500/30 bg-sky-500/10 text-sky-500',
  Pending: 'border-warning/30 bg-warning/10 text-warning',
};

const typeIcons = {
  Video: Video,
  Phone: Phone,
  Onsite: Building2,
};

/**
 * Upcoming Interviews section.
 * Shows company, job, date, time, interview type, and status.
 */
export function UpcomingInterviews() {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="h-full border-border bg-card">
        <CardHeader className="flex-row items-start justify-between space-y-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight text-foreground">
              Upcoming Interviews
            </h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your scheduled interview rounds
            </p>
          </div>
          <Button variant="outline" size="sm">
            View calendar
          </Button>
        </CardHeader>

        <CardContent className="space-y-3">
          {upcomingInterviews.map((interview) => {
            const TypeIcon = typeIcons[interview.type] || Video;

            return (
              <div
                key={interview.id}
                className="flex flex-col gap-3 rounded-lg border border-border bg-background/40 p-4 sm:flex-row sm:items-center sm:justify-between"
              >
                <div className="flex items-start gap-3">
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red">
                    <TypeIcon className="h-4 w-4" />
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {interview.company}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      {interview.job}
                    </p>
                    <div className="mt-1.5 flex flex-wrap gap-x-4 gap-y-1 text-xs text-muted-foreground">
                      <span className="flex items-center gap-1">
                        <CalendarDays className="h-3 w-3" />
                        {interview.date}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {interview.time}
                      </span>
                      <span>{interview.type}</span>
                    </div>
                  </div>
                </div>

                <Badge
                  variant="outline"
                  className={cn(
                    'shrink-0 self-start border-transparent text-[10px] font-medium sm:self-center',
                    statusStyles[interview.status] || statusStyles.Pending
                  )}
                >
                  {interview.status}
                </Badge>
              </div>
            );
          })}
        </CardContent>
      </Card>
    </motion.div>
  );
}
