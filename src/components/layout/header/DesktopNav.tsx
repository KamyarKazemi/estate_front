import React from "react";
import { FaAngleDown } from "react-icons/fa6";
import type { NavItem } from "../header/Header";

const icons = {
  dropdownAngleDown: <FaAngleDown />,
};

interface DesktopNavProps {
  navItems: NavItem[];
  activeIndex: number | null;
  hoveredIndex: number | null;
  isDropdownClicked: null | "listings";
  dropdownWrapRef: React.RefObject<HTMLLIElement | null>;
  setActiveIndex: (index: number | null) => void;
  setHoveredIndex: (index: number | null) => void;
  setIsDropdownClicked: (state: null | "listings") => void;
}

export default function DesktopNav({
  navItems,
  activeIndex,
  isDropdownClicked,
  dropdownWrapRef,
  setActiveIndex,
  setHoveredIndex,
  setIsDropdownClicked,
}: DesktopNavProps) {
  return (
    <ul className="hidden md:flex gap-6 lg:gap-15 relative">
      {navItems.map((item, i) => {
        const baseLiClass = `
          relative cursor-pointer transition-colors duration-200
          text-sm font-light tracking-wide
          ${
            activeIndex === i ? "text-white" : "text-slate-400 hover:text-white"
          }
        `;

        if (item.type === "link") {
          return (
            <li
              key={item.label}
              onMouseEnter={() => setHoveredIndex(i)}
              onMouseLeave={() => setHoveredIndex(null)}
              onClick={() => {
                setActiveIndex(i);
                setIsDropdownClicked(null);
              }}
              className={baseLiClass}
            >
              <a href={item.href ?? "#"}>{item.label}</a>
            </li>
          );
        }

        const isOpen = isDropdownClicked === "listings";

        return (
          <li
            key={item.label}
            ref={dropdownWrapRef}
            onMouseEnter={() => setHoveredIndex(i)}
            onMouseLeave={() => setHoveredIndex(null)}
            className={baseLiClass}
          >
            <button
              type="button"
              className="flex items-center gap-2 outline-none cursor-pointer"
              aria-haspopup="menu"
              aria-expanded={isOpen}
              onClick={(e) => {
                e.stopPropagation();
                setActiveIndex(i);
                setIsDropdownClicked(isOpen ? null : "listings");
              }}
            >
              <span>{item.label}</span>
              <span
                className={`text-xs transition-transform duration-200 ${
                  isOpen ? "rotate-180" : "rotate-0"
                }`}
              >
                {icons.dropdownAngleDown}
              </span>
            </button>

            <div
              className={`
                absolute left-1/2 -translate-x-1/2 top-full mt-3 min-w-64 rounded-2xl border border-white/10
                bg-slate-950/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]
                transition-all duration-200 ease-out
                ${
                  isOpen
                    ? "opacity-100 translate-y-0 pointer-events-auto"
                    : "opacity-0 -translate-y-2 pointer-events-none"
                }
              `}
              role="menu"
            >
              <div className="p-2.5 flex flex-col gap-0.5">
                {item.items.map((dd) => (
                  <a
                    key={dd.label}
                    href={dd.href ?? "#"}
                    className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
                    role="menuitem"
                    onClick={() => setIsDropdownClicked(null)}
                  >
                    {dd.label}
                  </a>
                ))}
              </div>
            </div>
          </li>
        );
      })}
    </ul>
  );
}
