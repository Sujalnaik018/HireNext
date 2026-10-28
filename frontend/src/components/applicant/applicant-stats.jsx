import { motion } from 'framer-motion';
import {
  FileText,
  Gauge,
  Phone,
  Send,
  TrendingUp,
  TrendingDown,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { applicantStats } from '@/data/applicant';
import { cn } from '@/lib/utils';
import { fadeUpItem } from '@/lib/motion';

const iconMap = {
  FileText,
  Gauge,
  Send,
  Phone,
};

/**
 * Statistic cards for the applicant dashboard.
 * Resume Score, ATS Score, Jobs Applied, Interview Calls.
 */
export function ApplicantStats() {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {applicantStats.map((stat) => {
        const Icon = iconMap[stat.icon] || FileText;
        const isUp = stat.trend === 'up';

        return (
          <motion.div key={stat.id} variants={fadeUpItem}>
            <Card className="group border-border bg-card transition-colors hover:border-brand-red/40">
              <CardContent className="flex items-start justify-between p-5">
                <div className="space-y-2">
                  <p className="text-sm text-muted-foreground">{stat.label}</p>
                  <p className="text-3xl font-semibold tracking-tight text-foreground">
                    {stat.value}
                  </p>
                  <p
                    className={cn(
                      'flex items-center gap-1 text-xs font-medium',
                      isUp ? 'text-success' : 'text-muted-foreground'
                    )}
                  >
                    {isUp ? (
                      <TrendingUp className="h-3 w-3" />
                    ) : (
                      <TrendingDown className="h-3 w-3 opacity-50" />
                    )}
                    {stat.status}
                  </p>
                </div>

                <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-brand-red/10 text-brand-red transition-transform group-hover:scale-105">
                  <Icon className="h-5 w-5" />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        );
      })}
    </div>
  );
}
