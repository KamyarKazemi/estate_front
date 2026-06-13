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
  return (
    <div className={`flex bg-gray-100 rounded-lg p-1 w-fit ${className}`}>
      {options.map((option) => {
        const active = option.value === value;

        return (
          <button
            key={option.value}
            type="button"
            onClick={() => onChange(option.value)}
            className={`
              px-4 py-2 rounded-md text-sm font-medium transition
              ${
                active
                  ? "bg-white shadow text-blue-600"
                  : "text-gray-600 hover:text-gray-800"
              }
            `}
          >
            {option.label}
          </button>
        );
      })}
    </div>
  );
}
