import React from "react";
import { Link } from "react-router-dom";
import { FaAngleDown } from "react-icons/fa6";

const icons = {
  dropdownAngleDown: <FaAngleDown />,
};

interface DesktopNavProps {
  activeIndex: number | null;
  hoveredIndex: number | null;
  isDropdownClicked: null | "listings";
  dropdownWrapRef: React.RefObject<HTMLLIElement | null>;
  setActiveIndex: (index: number | null) => void;
  setHoveredIndex: (index: number | null) => void;
  setIsDropdownClicked: (state: null | "listings") => void;
}

export default function DesktopNav({
  activeIndex,
  isDropdownClicked,
  dropdownWrapRef,
  setActiveIndex,
  setHoveredIndex,
  setIsDropdownClicked,
}: DesktopNavProps) {
  const baseLiClass = `
    relative cursor-pointer transition-colors duration-200
    text-sm font-light tracking-wide
  `;

  const isOpen = isDropdownClicked === "listings";

  return (
    <ul className="hidden md:flex gap-6 lg:gap-15 relative">
      {/* خانه */}
      <li className={`${baseLiClass} text-slate-400 hover:text-white`}>
        <Link to="/">خانه</Link>
      </li>

      {/* آگهی ها - Dropdown */}
      <li
        ref={dropdownWrapRef}
        onMouseEnter={() => setHoveredIndex(1)}
        onMouseLeave={() => setHoveredIndex(null)}
        className={`${baseLiClass} text-slate-400 hover:text-white`}
      >
        <button
          type="button"
          className="flex items-center gap-2 outline-none cursor-pointer"
          aria-haspopup="menu"
          aria-expanded={isOpen}
          onClick={(e) => {
            e.stopPropagation();
            setActiveIndex(1);
            setIsDropdownClicked(isOpen ? null : "listings");
          }}
        >
          <span>آگهی ها</span>
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
            <Link
              to="/listings/buy"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              بخر
            </Link>
            <Link
              to="/listings/rent"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              اجاره کن
            </Link>
            <Link
              to="/listings/new"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              نو ساز ها
            </Link>
            <Link
              to="/listings/luxury"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 hover:bg-white/10 hover:text-white transition-all duration-200"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              املاک لوکس
            </Link>
          </div>
        </div>
      </li>

      {/* آنالیز ها */}
      <li className={`${baseLiClass} text-slate-400 hover:text-white`}>
        <Link to="/analytics">آنالیز ها</Link>
      </li>

      {/* پروفایل */}
      <li className={`${baseLiClass} text-slate-400 hover:text-white`}>
        <Link to="/profile">پروفایل</Link>
      </li>
    </ul>
  );
}
