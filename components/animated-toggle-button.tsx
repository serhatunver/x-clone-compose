import { AppTooltip } from '@/components/app-tooltip';
import { Toggle } from '@/components/animate-ui/components/radix/toggle';
import { useState } from 'react';
import {
  Particles,
  ParticlesEffect,
} from '@/components/animate-ui/primitives/effects/particles';

interface AnimatedToggleButtonProps {
  tooltip: string;
  pressed: boolean;
  onPressedChange: (value: boolean) => void;
  children: (params: { animate: boolean; pressed: boolean }) => React.ReactNode;
  className?: string;
  particleClassName?: string;
}

export function AnimatedToggleButton({
  tooltip,
  pressed,
  onPressedChange,
  children,
  className,
  particleClassName = 'bg-sky-400/50 size-1 rounded-full',
}: AnimatedToggleButtonProps) {
  const [animate, setAnimate] = useState(false);

  const handleToggle = (value: boolean) => {
    onPressedChange(value);
    setAnimate(true);
    setTimeout(() => setAnimate(false), 600);
  };

  return (
    <AppTooltip content={tooltip}>
      <Toggle
        data-interactive
        pressed={pressed}
        onPressedChange={handleToggle}
        className={className ?? 'rounded-full relative'}
      >
        <Particles asChild animate={animate}>
          <span className="relative flex items-center justify-center">
            {children({ animate, pressed })}

            <ParticlesEffect className={particleClassName} />
          </span>
        </Particles>
      </Toggle>
    </AppTooltip>
  );
}
