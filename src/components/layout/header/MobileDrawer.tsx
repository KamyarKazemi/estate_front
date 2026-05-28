import React from "react";
import { FaAngleDown } from "react-icons/fa6";
import type { NavItem } from "./Header";

const icons = {
  dropdownAngleDown: <FaAngleDown />,
};

interface MobileDrawerProps {
  isMobileMenuMounted: boolean;
  isMobileMenuOpen: boolean;
  isMobileListingsOpen: boolean;
  navItems: NavItem[];
  mobileMenuRef: React.RefObject<HTMLDivElement | null>;
  setIsMobileMenuMounted: (mounted: boolean) => void;
  setIsMobileListingsOpen: (
    open: boolean | ((prev: boolean) => boolean),
  ) => void;
  closeMobileMenu: () => void;
}

export default function MobileDrawer({
  isMobileMenuMounted,
  isMobileMenuOpen,
  isMobileListingsOpen,
  navItems,
  mobileMenuRef,
  setIsMobileMenuMounted,
  setIsMobileListingsOpen,
  closeMobileMenu,
}: MobileDrawerProps) {
  if (!isMobileMenuMounted) return null;

  return (
    <div
      ref={mobileMenuRef}
      onTransitionEnd={(e) => {
        if (e.target === e.currentTarget && !isMobileMenuOpen) {
          setIsMobileMenuMounted(false);
        }
      }}
      className={`
        absolute top-full left-0 right-0 mt-3 md:hidden
       rounded-4xl border border-white/20
        /* Adjusted background: less dark-mask, more surface presence */
        bg-slate-900/90 backdrop-blur-xl
        shadow-[0_20px_50px_-10px_rgba(0,0,0,0.8),inset_0_1px_1px_rgba(255,255,255,0.1)]
        overflow-hidden origin-top
        transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
        ${
          isMobileMenuOpen
            ? "opacity-100 translate-y-0 scale-100 pointer-events-auto"
            : "opacity-0 -translate-y-4 scale-[0.96] pointer-events-none"
        }
      `}
    >
      {/* Subtle Inner Glow for depth */}
      <div className="absolute inset-0bg-linear-to-b from-white/3 to-transparent pointer-events-none" />

      <div className="p-3 relative z-10">
        <div className="mb-2 rounded-2xl bg-white/3 px-4 py-2.5 text-[10px] font-bold uppercase tracking-[0.25em] text-slate-400 border border-white/5">
          Overview
        </div>

        <ul className="flex flex-col gap-1.5">
          {navItems.map((item, index) => {
            const staggeredDelay = `${80 + index * 50}ms`;

            if (item.type === "link") {
              return (
                <li
                  key={item.label}
                  className={`
                    transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                    ${
                      isMobileMenuOpen
                        ? "opacity-100 translate-y-0"
                        : "opacity-0 translate-y-3"
                    }
                  `}
                  style={{ transitionDelay: staggeredDelay }}
                >
                  <a
                    href={item.href ?? "#"}
                    className="
                      flex items-center justify-between
                      rounded-2xl px-4 py-3.5
                      text-sm text-slate-100 font-light tracking-wide
                      hover:bg-white/5 active:bg-white/10 active:scale-[0.98]
                      border border-transparent hover:border-white/10
                      transition-all duration-300
                    "
                    onClick={closeMobileMenu}
                  >
                    <span>{item.label}</span>
                    <span className="text-slate-500 text-xs">←</span>
                  </a>
                </li>
              );
            }

            return (
              <li
                key={item.label}
                className={`
                  transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                  ${
                    isMobileMenuOpen
                      ? "opacity-100 translate-y-0"
                      : "opacity-0 translate-y-3"
                  }
                `}
                style={{ transitionDelay: staggeredDelay }}
              >
                <div className="rounded-2xl border border-transparent">
                  <button
                    type="button"
                    className="
                      w-full flex items-center justify-between
                      rounded-2xl px-4 py-3.5
                      text-sm text-slate-100 font-light tracking-wide
                      hover:bg-white/5 active:bg-white/10 active:scale-[0.98]
                      transition-all duration-300 outline-none
                    "
                    onClick={() => setIsMobileListingsOpen((prev) => !prev)}
                  >
                    <span>{item.label}</span>
                    <span
                      className={`transition-transform duration-500 text-slate-400 ${
                        isMobileListingsOpen
                          ? "rotate-180 text-sky-400"
                          : "rotate-0"
                      }`}
                    >
                      {icons.dropdownAngleDown}
                    </span>
                  </button>

                  <div
                    className={`
                      overflow-hidden transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
                      ${
                        isMobileListingsOpen
                          ? "max-h-75 opacity-100 mt-1 pe-4 border-r-2 border-sky-500/40 me-5"
                          : "max-h-0 opacity-0 pointer-events-none"
                      }
                    `}
                  >
                    <div className="flex flex-col gap-1 py-1 ps-2 pe-2">
                      {item.items.map((dd, childIndex) => (
                        <a
                          key={dd.label}
                          href={dd.href ?? "#"}
                          className={`
                            rounded-xl px-4 py-3 text-sm text-slate-400
                            hover:bg-white/5 hover:text-white
                            active:scale-[0.98]
                            transition-all duration-300
                            ${
                              isMobileListingsOpen
                                ? "opacity-100 translate-x-0"
                                : "opacity-0 -translate-x-2"
                            }
                          `}
                          style={{
                            transitionDelay: isMobileListingsOpen
                              ? `${childIndex * 40}ms`
                              : "0ms",
                          }}
                          onClick={closeMobileMenu}
                        >
                          {dd.label}
                        </a>
                      ))}
                    </div>
                  </div>
                </div>
              </li>
            );
          })}
        </ul>
      </div>
    </div>
  );
}
