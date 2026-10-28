import { motion } from 'framer-motion';
import { Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardHeader,
} from '@/components/ui/card';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { recentApplications } from '@/data/applicant';
import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

const statusStyles = {
  'Under Review': 'border-brand-red/40 bg-brand-red/10 text-brand-red',
  Shortlisted: 'border-success/40 bg-success/10 text-success',
  Interview: 'border-warning/40 bg-warning/10 text-warning',
  Applied: 'border-border bg-muted/40 text-muted-foreground',
  Rejected: 'border-destructive/40 bg-destructive/10 text-destructive',
};

/**
 * Recent Applications table.
 * Columns: Company, Job Role, Applied Date, Status, Action.
 */
export function RecentApplicationsTable() {
  return (
    <motion.div variants={fadeUpItem}>
      <Card className="border-border bg-card">
        <CardHeader className="flex-row items-center justify-between space-y-0">
          <div>
            <h2 className="text-base font-semibold tracking-tight">Recent Applications</h2>
            <p className="mt-0.5 text-xs text-muted-foreground">
              Your latest job applications
            </p>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Company</TableHead>
                <TableHead>Job Role</TableHead>
                <TableHead>Applied Date</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Action</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {recentApplications.map((app) => (
                <TableRow key={app.id}>
                  <TableCell className="font-medium text-foreground">
                    {app.company}
                  </TableCell>
                  <TableCell className="text-muted-foreground">{app.role}</TableCell>
                  <TableCell className="text-muted-foreground">{app.appliedDate}</TableCell>
                  <TableCell>
                    <Badge
                      variant="outline"
                      className={cn('border', statusStyles[app.status])}
                    >
                      {app.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    <Button variant="ghost" size="sm" className="h-8 gap-1">
                      <Eye className="h-3.5 w-3.5" />
                      View
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </motion.div>
  );
}
