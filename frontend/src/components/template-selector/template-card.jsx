import { motion } from 'framer-motion';
import { Check, Eye } from 'lucide-react';

import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { fadeUpItem } from '@/lib/motion';
import { cn } from '@/lib/utils';

/**
 * Template card — minified visual representation of a resume template.
 * Shows a colored accent strip, template name, description, and action buttons.
 */
export function TemplateCard({
  template,
  isSelected,
  onSelect,
  onPreview,
}) {
  return (
    <motion.div variants={fadeUpItem}>
      <Card
        className={cn(
          'group relative overflow-hidden border transition-all duration-200',
          isSelected
            ? 'border-brand-red ring-1 ring-brand-red'
            : 'border-border hover:border-muted-foreground/30'
        )}
      >
        {/* Accent bar */}
        <div className={cn('h-2 w-full', template.accent.bg)} />

        <CardContent className="p-4 sm:p-5">
          {/* Thumbnail area */}
          <div className="flex aspect-[3/4] items-center justify-center rounded-md border border-border bg-background/40 p-3">
            <div className="w-full space-y-1.5">
              {/* Mini resume preview */}
              <div className={cn('h-2 w-3/4 rounded', template.accent.bg)} />
              <div className="h-1.5 w-1/2 rounded bg-muted-foreground/20" />
              <div className="mt-2 space-y-1">
                <div className="h-1 rounded bg-muted-foreground/15" />
                <div className="h-1 rounded bg-muted-foreground/10" />
                <div className="h-1 w-3/4 rounded bg-muted-foreground/10" />
              </div>
              <div className="mt-2 space-y-1">
                <div className="h-1 rounded bg-muted-foreground/15" />
                <div className="h-1 rounded bg-muted-foreground/10" />
              </div>
            </div>
          </div>

          {/* Template info */}
          <div className="mt-3">
            <div className="flex items-start justify-between gap-2">
              <div className="min-w-0 flex-1">
                <h3 className="flex items-center gap-1.5 text-sm font-semibold text-foreground">
                  {template.name}
                  {template.isDefault && (
                    <Badge variant="outline" className="border-border text-[10px] font-normal text-muted-foreground">
                      Default
                    </Badge>
                  )}
                </h3>
                <p className="mt-0.5 text-xs leading-relaxed text-muted-foreground">
                  {template.description}
                </p>
              </div>
            </div>

            {/* Actions */}
            <div className="mt-4 flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                className="flex-1"
                onClick={() => onPreview(template)}
              >
                <Eye className="h-3.5 w-3.5" />
                Preview
              </Button>
              <Button
                size="sm"
                className={cn(
                  'flex-1',
                  isSelected
                    ? 'bg-brand-red text-white hover:bg-brand-red-dark'
                    : 'bg-muted text-foreground hover:bg-muted/80'
                )}
                onClick={() => onSelect(template)}
              >
                {isSelected ? (
                  <>
                    <Check className="h-3.5 w-3.5" />
                    Selected
                  </>
                ) : (
                  'Select'
                )}
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
}
