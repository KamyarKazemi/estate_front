import { useEffect, useRef, useState, useCallback } from "react";
import LogoAndHamburger from "./LogoAndHamburger";
import DesktopNav from "./DesktopNav";
import SearchForm from "./SearchForm";
import MobileDrawer from "./MobileDrawer";

// export type NavItem =
//   | { label: string; type: "link"; to?: string }
//   | {
//       label: string;
//       type: "dropdown";
//       items: { label: string; to?: string }[];
//     };

// export const navItems: NavItem[] = [
//   { label: "خانه", type: "link", to: "/" },
//   {
//     label: "آگهی ها",
//     type: "dropdown",
//     items: [
//       { label: "بخر", to: "/listings/buy" },
//       { label: "اجاره کن", to: "/listings/rent" },
//       { label: "نو ساز ها", to: "/listings/new" },
//       { label: "املاک لوکس", to: "/listings/luxury" },
//     ],
//   },
//   { label: "آنالیز ها", type: "link", to: "/analytics" },
//   { label: "پروفایل", type: "link", to: "/profile" },
// ];

function Header() {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);
  const [activeIndex, setActiveIndex] = useState<number | null>(0);
  const [isSearchFocused, setIsSearchFocused] = useState<boolean>(false);
  const [isDropdownClicked, setIsDropdownClicked] = useState<null | "listings">(
    null,
  );

  // Mobile menu: split mount/open state for reliable enter animation
  const [isMobileMenuMounted, setIsMobileMenuMounted] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isMobileListingsOpen, setIsMobileListingsOpen] = useState(false);

  const dropdownWrapRef = useRef<HTMLLIElement | null>(null);
  const mobileMenuRef = useRef<HTMLDivElement | null>(null);

  const closeDropdown = useCallback(() => {
    setIsDropdownClicked(null);
  }, []);

  const openMobileMenu = useCallback(() => {
    setIsMobileMenuMounted(true);
    requestAnimationFrame(() => {
      requestAnimationFrame(() => {
        setIsMobileMenuOpen(true);
      });
    });
  }, []);

  const closeMobileMenu = useCallback(() => {
    setIsMobileMenuOpen(false);
    setIsMobileListingsOpen(false);
  }, []);

  const toggleMobileMenu = useCallback(() => {
    if (isMobileMenuMounted && isMobileMenuOpen) {
      closeMobileMenu();
    } else {
      openMobileMenu();
    }
  }, [isMobileMenuMounted, isMobileMenuOpen, openMobileMenu, closeMobileMenu]);

  useEffect(() => {
    const handleEvents = (e: Event) => {
      if (e instanceof MouseEvent) {
        const target = e.target as Node;

        if (
          dropdownWrapRef.current &&
          !dropdownWrapRef.current.contains(target)
        ) {
          closeDropdown();
        }

        const clickedHamburger = (target as HTMLElement)?.closest(
          ".hamburger-trigger",
        );

        if (
          mobileMenuRef.current &&
          !mobileMenuRef.current.contains(target) &&
          !clickedHamburger
        ) {
          closeMobileMenu();
        }
      }

      if (e instanceof KeyboardEvent && e.key === "Escape") {
        closeDropdown();
        closeMobileMenu();
      }
    };

    document.addEventListener("mousedown", handleEvents);
    document.addEventListener("keydown", handleEvents);

    return () => {
      document.removeEventListener("mousedown", handleEvents);
      document.removeEventListener("keydown", handleEvents);
    };
  }, [closeDropdown, closeMobileMenu]);

  return (
    <header className="sticky top-0 z-50 w-full px-4 py-2" dir="rtl">
      {/* Global Injection of CSS Keyframes for the gradient effect */}
      <style>{`
        @keyframes gradientSweep {
          0% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
          100% { background-position: 0% 50%; }
        }
      `}</style>

      <div
        className="
          relative
          bg-slate-900/60
          backdrop-blur-xl
          border border-white/10
          shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
          flex items-center justify-between
          p-3.5 h-16
          w-full
          rounded-2xl
          text-white
        "
      >
        {/* LOGO & HAMBURGER */}
        <LogoAndHamburger
          isMobileMenuOpen={isMobileMenuOpen}
          isSearchFocused={isSearchFocused}
          toggleMobileMenu={toggleMobileMenu}
        />

        {/* DESKTOP NAVIGATION */}
        <DesktopNav
          activeIndex={activeIndex}
          hoveredIndex={hoveredIndex}
          isDropdownClicked={isDropdownClicked}
          dropdownWrapRef={dropdownWrapRef}
          setActiveIndex={setActiveIndex}
          setHoveredIndex={setHoveredIndex}
          setIsDropdownClicked={setIsDropdownClicked}
        />

        {/* ELASTIC SEARCH FORM */}
        <SearchForm
          isSearchFocused={isSearchFocused}
          setIsSearchFocused={setIsSearchFocused}
        />

        {/* MOBILE DRAWER */}
        <MobileDrawer
          isMobileMenuMounted={isMobileMenuMounted}
          isMobileMenuOpen={isMobileMenuOpen}
          isMobileListingsOpen={isMobileListingsOpen}
          mobileMenuRef={mobileMenuRef}
          setIsMobileMenuMounted={setIsMobileMenuMounted}
          setIsMobileListingsOpen={setIsMobileListingsOpen}
          closeMobileMenu={closeMobileMenu}
        />
      </div>
    </header>
  );
}

export default Header;
