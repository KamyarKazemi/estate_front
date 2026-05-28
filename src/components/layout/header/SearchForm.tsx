import { FaSearchengin } from "react-icons/fa6";

const icons = {
  headerSearch: <FaSearchengin />,
};

interface SearchFormProps {
  isSearchFocused: boolean;
  setIsSearchFocused: (focused: boolean) => void;
}

export default function SearchForm({
  isSearchFocused,
  setIsSearchFocused,
}: SearchFormProps) {
  return (
    <form
      onSubmit={(e) => e.preventDefault()}
      className={`
        flex items-center gap-1.5 md:gap-2
        bg-white/10 border border-white/10 backdrop-blur-md
        px-2 py-1 rounded-xl
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${
          isSearchFocused
            ? "max-md:basis-0 max-md:grow max-md:me-2 ring-1 ring-sky-400/50 bg-slate-900/40"
            : "max-md:basis-28 max-md:grow-0 w-auto"
        }
      `}
    >
      <span className="text-white/40 ps-1.5 text-sm">{icons.headerSearch}</span>

      <input
        type="text"
        placeholder="جست و جو در املاک..."
        onFocus={() => setIsSearchFocused(true)}
        onBlur={() => setIsSearchFocused(false)}
        className={`
          bg-transparent border-none outline-none text-white
          placeholder:text-white/30 text-sm text-right
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isSearchFocused ? "flex-1 md:w-56 lg:w-72" : "w-8 md:w-36 lg:w-48"}
        `}
      />

      <div className="flex items-center gap-1">
        <button
          type="submit"
          className="px-3.5 py-1.5 rounded-lg bg-sky-500/80 text-white text-xs font-semibold hover:bg-sky-500 transition-all active:scale-95"
        >
          <span className="hidden md:inline">جست و جو</span>
          <span className="md:hidden">بگرد</span>
        </button>
      </div>
    </form>
  );
}
