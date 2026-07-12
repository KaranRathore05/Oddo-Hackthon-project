import { cn } from '@/lib/utils';
import { Check } from 'lucide-react';

interface Step {
  label: string;
  value: string;
}

interface StepperProps {
  steps: Step[];
  currentStep: string;
  className?: string;
}

export function Stepper({ steps, currentStep, className }: StepperProps) {
  const currentIdx = steps.findIndex(s => s.value === currentStep);

  return (
    <div className={cn('flex items-center justify-between', className)}>
      {steps.map((step, idx) => {
        const isCompleted = idx < currentIdx;
        const isCurrent = idx === currentIdx;
        const isLast = idx === steps.length - 1;

        return (
          <div key={step.value} className="flex items-center flex-1 last:flex-initial">
            {/* Step circle + label */}
            <div className="flex flex-col items-center gap-1.5">
              <div
                className={cn(
                  'w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition-all duration-300',
                  isCompleted && 'bg-emerald text-charcoal',
                  isCurrent && 'bg-cyan text-charcoal ring-4 ring-cyan/20',
                  !isCompleted && !isCurrent && 'bg-white/10 text-muted border border-white/10',
                )}
              >
                {isCompleted ? <Check className="w-4 h-4" /> : idx + 1}
              </div>
              <span
                className={cn(
                  'text-2xs font-medium whitespace-nowrap',
                  isCurrent ? 'text-cyan' : isCompleted ? 'text-emerald' : 'text-muted',
                )}
              >
                {step.label}
              </span>
            </div>

            {/* Connecting line */}
            {!isLast && (
              <div className="flex-1 mx-3 mt-[-20px]">
                <div className="h-[2px] rounded-full overflow-hidden bg-white/10">
                  <div
                    className={cn(
                      'h-full rounded-full transition-all duration-500',
                      isCompleted ? 'bg-emerald w-full' : isCurrent ? 'bg-cyan/50 w-1/2' : 'w-0',
                    )}
                  />
                </div>
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
