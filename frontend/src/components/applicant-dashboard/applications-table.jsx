import { motion } from 'framer-motion';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { applications } from '@/data/applicant-dashboard';
import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

const statusStyles = {
  Applied: 'border-brand-red/30 bg-brand-red/10 text-brand-red',
  'Under Review': 'border-warning/30 bg-warning/10 text-warning',
  Shortlisted: 'border-sky-500/30 bg-sky-500/10 text-sky-500',
  Interview: 'border-emerald-500/30 bg-emerald-500/10 text-emerald-500',
  Rejected: 'border-muted-foreground/30 bg-muted/30 text-muted-foreground',
};

/**
 * My Applications table.
 * Lists each application with job, company, applied date, match score, and
 * a color-coded status badge.
 */
export function ApplicationsTable() {
  return (
    <motion.div variants={fadeUpItem}>
      <div className="flex flex-wrap items-center justify-between gap-2">
        <div>
          <h2 className="text-base font-semibold tracking-tight text-foreground">
            My Applications
          </h2>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Track the status of your submissions
          </p>
        </div>
        <Button variant="outline" size="sm">
          View all
        </Button>
      </div>

      <div className="mt-4 overflow-hidden rounded-lg border border-border bg-card">
        <Table>
          <TableHeader>
            <TableRow className="hover:bg-transparent">
              <TableHead className="px-4">Job</TableHead>
              <TableHead>Company</TableHead>
              <TableHead>Applied Date</TableHead>
              <TableHead>Match Score</TableHead>
              <TableHead className="text-right">Status</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {applications.map((app) => (
              <TableRow key={app.id}>
                <TableCell className="px-4 font-medium text-foreground">
                  {app.job}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {app.company}
                </TableCell>
                <TableCell className="text-muted-foreground">
                  {app.appliedDate}
                </TableCell>
                <TableCell>
                  <span className="font-semibold text-brand-red">
                    {app.matchScore}%
                  </span>
                </TableCell>
                <TableCell className="text-right">
                  <Badge
                    variant="outline"
                    className={cn(
                      'border-transparent text-[10px] font-medium',
                      statusStyles[app.status] || statusStyles.Applied
                    )}
                  >
                    {app.status}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </motion.div>
  );
}
