import { Textarea } from '@/components/ui/textarea';
import { Field } from '@/components/ui/field';
import { cn } from '@/lib/utils';

interface ComposerInputProps {
  value: string;
  onChange: (value: string) => void;
  onFocus?: () => void;
  className?: string;
}

export function ComposerInput({
  value,
  onChange,
  onFocus,
  className,
}: ComposerInputProps) {
  return (
    <Field>
      <Textarea
        placeholder="Type your message here."
        className={cn(
          'resize-none text-lg dark:bg-transparent max-h-40',
          className
        )}
        maxLength={280}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onFocus={onFocus}
      />
    </Field>
  );
}
