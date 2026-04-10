import { Button } from '@/components/ui/button';
import { AnimatedCircularProgressBar } from '@/components/ui/animated-circular-progress-bar';
import { cn } from '@/lib/utils';

interface ComposerSubmitProps {
  content: string;
  label: string;
  maxLength?: number;
}

export function ComposerSubmit({
  content,
  label,
  maxLength = 280,
}: ComposerSubmitProps) {
  const length = content.length;
  const isDisabled = length === 0 || length > maxLength;

  return (
    <div className="flex gap-4">
      {length > 0 && (
        <AnimatedCircularProgressBar
          className={cn(
            length >= maxLength - 20 ? 'scale-125' : 'scale-100',
            length >= maxLength && 'animate-shake',
            'my-auto text-[10px] size-6 transition-all duration-300'
          )}
          value={length}
          max={280}
          gaugePrimaryColor={
            length < 260
              ? 'var(--color-sky-400)'
              : length < 280
                ? 'var(--color-yellow-300)'
                : 'var(--color-red-500)'
          }
          gaugeSecondaryColor="var(--color-gray-200)"
          renderValue={(value, max) => (value >= max - 20 ? max - value : '')}
        />
      )}

      <Button disabled={isDisabled} className="ml-auto rounded-full">
        {label}
      </Button>
    </div>
  );
}
