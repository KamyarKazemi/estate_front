import { useId } from "react";
import { motion } from "motion/react";

export type ToggleOption<T extends string> = {
  label: string;
  value: T;
};

type ToggleProps<T extends string> = {
  value: T;
  onChange: (value: T) => void;
  options: ToggleOption<T>[];
  className?: string;
};

export function Toggle<T extends string>({
  value,
  onChange,
  options,
  className = "",
}: ToggleProps<T>) {
  const groupId = useId();

  return (
    <div
      className={`
        flex w-fit gap-1 rounded-xl border border-white/10 bg-white/5 p-1
        backdrop-blur-sm
        ${className}
      `}
    >
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              relative rounded-lg px-4 py-2 text-sm font-medium transition-colors duration-200
              ${!active ? "hover:bg-white/5" : ""}
            `}
          >
            {active && (
              <motion.span
                layoutId={`toggle-pill-${groupId}`}
                className="absolute inset-0 rounded-lg border border-sky-500/25 bg-sky-500/15"
                transition={{ type: "spring", stiffness: 500, damping: 35 }}
              />
            )}
            <span
              className={`relative z-10 transition-colors duration-200 ${
                active ? "text-sky-100" : "text-slate-400 hover:text-white"
              }`}
            >
              {option.label}
            </span>
          </button>
        );
      })}
    </div>
  );
}
