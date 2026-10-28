import { motion } from 'framer-motion';
import { MapPin, Wallet } from 'lucide-react';

import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import { recommendedJobs } from '@/data/applicant';
import { fadeUpItem } from '@/lib/motion';

/**
 * Recommended Jobs grid.
 * Displays 6 job cards with company logo, title, location, salary, and Apply button.
 */
export function RecommendedJobs() {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Recommended Jobs</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              AI-matched roles based on your profile
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-3">
            {recommendedJobs.map((job) => (
              <motion.div
                key={job.id}
                variants={fadeUpItem}
                whileHover={{ y: -4 }}
                transition={{ type: 'spring', stiffness: 300, damping: 20 }}
                className="group rounded-lg border border-border bg-background/40 p-4 transition-colors hover:border-brand-red/40"
              >
                <div className="flex items-start justify-between">
                  <Avatar className="h-10 w-10 border border-border">
                    <AvatarFallback className="bg-brand-red/15 text-sm font-semibold text-brand-red">
                      {job.initials}
                    </AvatarFallback>
                  </Avatar>
                  <Badge
                    variant="outline"
                    className="border-border bg-muted/40 text-[10px] font-normal text-muted-foreground"
                  >
                    {job.type}
                  </Badge>
                </div>

                <h3 className="mt-3 text-sm font-semibold text-foreground">
                  {job.title}
                </h3>
                <p className="mt-0.5 text-xs text-muted-foreground">{job.company}</p>

                <div className="mt-3 space-y-1.5">
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <MapPin className="h-3 w-3" />
                    {job.location}
                  </p>
                  <p className="flex items-center gap-1.5 text-xs text-muted-foreground">
                    <Wallet className="h-3 w-3" />
                    {job.salary}
                  </p>
                </div>

                <Button
                  size="sm"
                  className="mt-4 w-full bg-brand-red text-white hover:bg-brand-red-dark"
                >
                  Apply Now
                </Button>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
