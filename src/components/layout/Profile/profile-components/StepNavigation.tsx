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
    <div className="flex items-center justify-between mb-8">
      {steps.map((step, index) => {
        const isActive = step === currentStep;
        const isCompleted = completion[step];

        return (
          <div key={step} className="flex items-center flex-1">
            <button
              type="button"
              onClick={() => onStepClick(step)}
              className={`
                flex items-center justify-center
                w-10 h-10 rounded-full border transition
                ${
                  isCompleted
                    ? "bg-green-500 text-white border-green-500"
                    : isActive
                      ? "bg-blue-600 text-white border-blue-600"
                      : "bg-white text-gray-500 border-gray-300"
                }
              `}
            >
              {step}
            </button>

            <span
              className={`
                ml-2 text-sm font-medium
                ${isActive ? "text-blue-600" : "text-gray-500"}
              `}
            >
              {labels[step]}
            </span>

            {index < steps.length - 1 && (
              <div className="flex-1 h-0.5 bg-gray-200 mx-4" />
            )}
          </div>
        );
      })}
    </div>
  );
}
