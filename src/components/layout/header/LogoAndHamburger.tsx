import { FaBars, FaXmark, FaFingerprint } from "react-icons/fa6";

const icons = {
  headerMain: <FaBars />,
  headerClose: <FaXmark />,
  headerLogo: <FaFingerprint />,
};

interface LogoAndHamburgerProps {
  isMobileMenuOpen: boolean;
  isSearchFocused: boolean;
  toggleMobileMenu: () => void;
}

export default function LogoAndHamburger({
  isMobileMenuOpen,
  isSearchFocused,
  toggleMobileMenu,
}: LogoAndHamburgerProps) {
  return (
    <div className="flex items-center gap-3 min-w-0">
      <button
        type="button"
        className="hamburger-trigger block md:hidden text-xl cursor-pointer active:scale-90 transition-transform duration-300 p-2 rounded-xl bg-white/5 hover:bg-white/10"
        onClick={toggleMobileMenu}
        aria-label="Toggle mobile menu"
        aria-expanded={isMobileMenuOpen}
      >
        <div className="relative w-5 h-5 flex items-center justify-center">
          <span
            className={`absolute transition-all duration-300 ${
              isMobileMenuOpen
                ? "rotate-90 scale-0 opacity-0"
                : "rotate-0 scale-100 opacity-100"
            }`}
          >
            {icons.headerMain}
          </span>
          <span
            className={`absolute transition-all duration-300 ${
              isMobileMenuOpen
                ? "rotate-0 scale-100 opacity-100"
                : "-rotate-90 scale-0 opacity-0"
            }`}
          >
            {icons.headerClose}
          </span>
        </div>
      </button>

      <div className="hidden md:flex items-center gap-2">
        <span className="text-2xl text-blue-400">{icons.headerLogo}</span>
      </div>

      <h2
        className={`
          text-lg font-semibold tracking-tight
          bg-linear-to-r from-white via-slate-200 to-slate-400 bg-clip-text text-transparent
          whitespace-nowrap overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          max-md:will-change-[max-width,opacity]
          ${
            isSearchFocused
              ? "max-md:max-w-0 max-md:opacity-0 max-md:me-0 max-md:pointer-events-none"
              : "max-md:max-w-35 max-md:opacity-100 max-md:me-2"
          }
        `}
        style={{
          backgroundSize: "200% auto",
          animation: "gradientSweep 4s ease infinite",
        }}
      >
        املاک لوکس
      </h2>
    </div>
  );
}
