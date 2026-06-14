import type { Step } from "../types/types";

type StepNavigationProps = {
  steps: Step[];
  currentStep: Step;
  completion: Record<Step, boolean>;
  labels: Record<Step, string>;
  onStepClick: (step: Step) => void;
};

export function StepNavigation({
  steps,
  currentStep,
  completion,
  labels,
  onStepClick,
}: StepNavigationProps) {
  return (
    <div className="flex items-center justify-between gap-2 sm:gap-4">
      {steps.map((step, index) => {
        const active = step === currentStep;
        const done = completion[step];

        return (
          <div key={step} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => onStepClick(step)}
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full text-sm font-semibold
                transition-all duration-200
                ${
                  done
                    ? "bg-emerald-500 text-white"
                    : active
                      ? "bg-indigo-600 text-white"
                      : "bg-slate-800 text-slate-400 border border-slate-700"
                }
              `}
            >
              {step}
            </button>

            <span
              className={`
                ml-2 text-xs sm:text-sm font-medium
                ${active ? "text-white" : "text-slate-400"}
              `}
            >
              {labels[step]}
            </span>

            {index < steps.length - 1 && (
              <div className="flex-1 h-px bg-slate-700 mx-3" />
            )}
          </div>
        );
      })}
    </div>
  );
}
