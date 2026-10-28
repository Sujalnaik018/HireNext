import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';

/**
 * Renders a single field based on its type.
 * Supports text, email, and textarea inputs.
 */
export function StepInput({ field, value, onChange }) {
  const common = {
    id: field.key,
    value,
    onChange: (e) => onChange(field.key, e.target.value),
    placeholder: field.placeholder,
    className: 'bg-background',
  };

  return (
    <div className="space-y-1.5">
      <Label htmlFor={field.key} className="text-xs font-medium text-muted-foreground">
        {field.label}
      </Label>
      {field.type === 'textarea' ? (
        <Textarea {...common} rows={3} />
      ) : (
        <Input {...common} type={field.type || 'text'} />
      )}
    </div>
  );
}
