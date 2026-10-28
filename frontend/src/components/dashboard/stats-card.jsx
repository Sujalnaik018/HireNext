import { motion } from 'framer-motion';
import {
  BarChart3,
  Briefcase,
  CalendarDays,
  FileText,
  Star,
  TrendingUp,
} from 'lucide-react';

import { Card, CardContent } from '@/components/ui/card';
import { cn } from '@/lib/utils';
import { fadeUpItem } from '@/lib/motion';

const iconMap = {
  Briefcase,
  FileText,
  Star,
  CalendarDays,
  BarChart3,
};

/**
 * Statistic card used in the dashboard header grid.
 * Displays an icon, a large number, and a small status/trend text.
 */
export function StatsCard({ stat, index = 0 }) {
  const Icon = iconMap[stat.icon] || BarChart3;
  const isUp = stat.trend === 'up';

  return (
    <motion.div variants={fadeUpItem}>
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
              {isUp && <TrendingUp className="h-3 w-3" />}
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
}
