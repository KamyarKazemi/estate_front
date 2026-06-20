import { motion } from "motion/react";
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
    <div className="flex items-center justify-between gap-1.5 sm:gap-4">
      {steps.map((step, index) => {
        const active = step === currentStep;
        const done = completion[step];

        return (
          <div key={step} className="flex items-center flex-1">
            <motion.button
              type="button"
              onClick={() => onStepClick(step)}
              animate={{ scale: active ? 1.08 : 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 25 }}
              className={`
                flex shrink-0 items-center justify-center
                h-9 w-9 sm:h-10 sm:w-10 rounded-full text-sm font-semibold
                border transition-colors duration-300
                ${
                  done
                    ? "border-emerald-400/40 bg-emerald-500/15 text-emerald-200"
                    : active
                      ? "border-sky-500/40 bg-sky-500/15 text-sky-100"
                      : "border-white/10 bg-white/5 text-slate-400 hover:border-white/20 hover:text-slate-200"
                }
              `}
            >
              {step}
            </motion.button>

            <span
              className={`
                ms-2.5 sm:ms-3 truncate text-[11px] sm:text-sm font-medium transition-colors duration-300
                ${active ? "text-white" : "text-slate-400"}
              `}
            >
              {labels[step]}
            </span>

            {index < steps.length - 1 && (
              <div className="relative flex-1 self-center mx-2 sm:mx-3 h-px overflow-hidden bg-white/10">
                <motion.div
                  className="absolute inset-0 bg-emerald-400/60"
                  style={{ originX: 1 }}
                  initial={false}
                  animate={{ scaleX: done ? 1 : 0 }}
                  transition={{ duration: 0.4, ease: "easeOut" }}
                />
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
