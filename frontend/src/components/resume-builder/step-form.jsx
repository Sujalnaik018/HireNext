import { Plus, Trash2 } from 'lucide-react';

import { Button } from '@/components/ui/button';
import { StepInput } from '@/components/resume-builder/step-input';

/**
 * Renders the form for the current step.
 * For list-type steps (projects/experience/certificates), it renders
 * multiple editable entries with add/remove controls.
 */
export function StepForm({ step, data, onChange }) {
  // Non-list steps: bind directly to step.data[field.key]
  if (step.type !== 'list') {
    return (
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
        {step.fields.map((field) => (
          <StepInput
            key={field.key}
            field={field}
            value={data[field.key] || ''}
            onChange={(key, val) => onChange({ ...data, [key]: val })}
          />
        ))}
      </div>
    );
  }

  // List steps: render each entry object with add/remove
  const handleEntryChange = (entryIndex, key, value) => {
    const next = data.map((entry, i) =>
      i === entryIndex ? { ...entry, [key]: value } : entry
    );
    onChange(next);
  };

  const handleAdd = () => {
    const blank = {};
    step.fields.forEach((field) => {
      blank[field.key] = '';
    });
    onChange([...data, blank]);
  };

  const handleRemove = (entryIndex) => {
    onChange(data.filter((_, i) => i !== entryIndex));
  };

  return (
    <div className="space-y-4">
      {data.map((entry, entryIndex) => (
        <div
          key={entryIndex}
          className="relative space-y-3 rounded-lg border border-border bg-background/40 p-4"
        >
          {data.length > 1 && (
            <Button
              variant="ghost"
              size="icon"
              className="absolute right-2 top-2 h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={() => handleRemove(entryIndex)}
              aria-label={`Remove ${step.title} entry`}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
            {step.fields.map((field) => (
              <div
                key={field.key}
                className={
                  field.type === 'textarea' ? 'sm:col-span-2' : undefined
                }
              >
                <StepInput
                  field={field}
                  value={entry[field.key] || ''}
                  onChange={(key, val) =>
                    handleEntryChange(entryIndex, key, val)
                  }
                />
              </div>
            ))}
          </div>
        </div>
      ))}

      <Button
        variant="outline"
        size="sm"
        onClick={handleAdd}
        className="w-full border-dashed"
      >
        <Plus className="h-4 w-4" />
        Add {step.title === 'Projects' ? 'Project' : step.title === 'Experience' ? 'Experience' : 'Certificate'}
      </Button>
    </div>
  );
}
