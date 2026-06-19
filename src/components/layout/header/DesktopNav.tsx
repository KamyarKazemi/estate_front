import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { FaAngleDown } from "react-icons/fa6";
import { resetAuth } from "../../../redux/slices/authSlice";
import type { AppDispatch, RootState } from "../../../redux/store";

const icons = {
  dropdownAngleDown: <FaAngleDown />,
};

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "مشتری",
  AGENT: "مشاور املاک",
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
  hoveredIndex,
  isDropdownClicked,
  dropdownWrapRef,
  setActiveIndex,
  setHoveredIndex,
  setIsDropdownClicked,
}: DesktopNavProps) {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const user = useSelector((state: RootState) => state.auth.user);
  const isSignedIn = useSelector(
    (state: RootState) => !!state.auth.access_token,
  );

  const baseLiClass = `
    relative cursor-pointer transition-colors duration-200
    text-sm font-light tracking-wide
  `;

  const isOpen = isDropdownClicked === "listings";
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const displayName = fullName || user?.username || "کاربر";
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : "-";

  const handleLogout = () => {
    dispatch(resetAuth());
    navigate("/profile");
  };

  return (
    <ul className="relative hidden gap-6 md:flex lg:gap-15">
      <li className={`${baseLiClass} text-slate-400 hover:text-white`}>
        <Link to="/">خانه</Link>
      </li>

      <li
        ref={dropdownWrapRef}
        onMouseEnter={() => setHoveredIndex(1)}
        onMouseLeave={() => setHoveredIndex(null)}
        className={`${baseLiClass} text-slate-400 hover:text-white`}
      >
        <button
          type="button"
          className="flex cursor-pointer items-center gap-2 outline-none"
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
            absolute left-1/2 top-full mt-3 min-w-64 -translate-x-1/2 rounded-2xl border border-white/10
            bg-slate-950/80 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]
            transition-all duration-200 ease-out
            ${
              isOpen
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }
          `}
          role="menu"
        >
          <div className="flex flex-col gap-0.5 p-2.5">
            <Link
              to="/listings/buy"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              بخر
            </Link>
            <Link
              to="/listings/rent"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              اجاره کن
            </Link>
            <Link
              to="/listings/new"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              نو ساز ها
            </Link>
            <Link
              to="/listings/luxury"
              className="block rounded-xl px-4 py-2.5 text-sm text-slate-300 transition-all duration-200 hover:bg-white/10 hover:text-white"
              role="menuitem"
              onClick={() => setIsDropdownClicked(null)}
            >
              املاک لوکس
            </Link>
          </div>
        </div>
      </li>

      <li className={`${baseLiClass} text-slate-400 hover:text-white`}>
        <Link to="/analytics">آنالیز ها</Link>
      </li>

      <li
        onMouseEnter={() => setHoveredIndex(3)}
        onMouseLeave={() => setHoveredIndex(null)}
        className={`${baseLiClass} text-slate-400 hover:text-white`}
      >
        <Link to={isSignedIn ? "/dashboard" : "/profile"}>پروفایل</Link>

        <div
          className={`
            absolute left-1/2 top-full mt-3 min-w-72 -translate-x-1/2 rounded-2xl border border-white/10
            bg-slate-950/90 p-3 backdrop-blur-2xl shadow-[0_20px_50px_rgba(0,0,0,0.7)]
            transition-all duration-200 ease-out
            ${
              hoveredIndex === 3
                ? "pointer-events-auto translate-y-0 opacity-100"
                : "pointer-events-none -translate-y-2 opacity-0"
            }
          `}
        >
          {isSignedIn ? (
            <div className="space-y-3">
              <div className="flex items-center gap-3">
                <div className="flex size-10 items-center justify-center rounded-full bg-sky-500/15 text-sm font-semibold text-sky-200">
                  {displayName.slice(0, 1)}
                </div>
                <div className="min-w-0">
                  <p className="truncate text-sm font-medium text-white">
                    {displayName}
                  </p>
                  <p className="truncate text-xs text-slate-400">
                    {user?.phone || user?.email || "حساب فعال"}
                  </p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-2 text-xs">
                <div className="rounded-xl bg-white/5 px-3 py-2">
                  <p className="text-slate-500">نوع حساب</p>
                  <p className="mt-1 text-slate-200">{roleLabel}</p>
                </div>
                <div className="rounded-xl bg-white/5 px-3 py-2">
                  <p className="text-slate-500">ایمیل</p>
                  <p className="mt-1 truncate text-slate-200">
                    {user?.email || "-"}
                  </p>
                </div>
              </div>

              <div className="flex gap-2">
                <Link
                  to="/dashboard"
                  className="flex-1 rounded-xl bg-sky-500/15 px-3 py-2 text-center text-xs text-sky-100 transition hover:bg-sky-500/25"
                >
                  داشبورد
                </Link>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex-1 rounded-xl bg-white/5 px-3 py-2 text-xs text-slate-200 transition hover:bg-white/10"
                >
                  خروج
                </button>
              </div>
            </div>
          ) : (
            <div className="space-y-3">
              <div>
                <p className="text-sm font-medium text-white">وارد نشده اید</p>
                <p className="mt-1 text-xs leading-5 text-slate-400">
                  برای دیدن داشبورد و اطلاعات حساب وارد شوید.
                </p>
              </div>
              <Link
                to="/profile"
                className="block rounded-xl bg-sky-500/15 px-3 py-2 text-center text-xs text-sky-100 transition hover:bg-sky-500/25"
              >
                ورود / ثبت نام
              </Link>
            </div>
          )}
        </div>
      </li>
    </ul>
  );
}
