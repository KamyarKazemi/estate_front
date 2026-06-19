import { Link } from "react-router-dom";
import { useSelector } from "react-redux";
import type { RootState } from "../../../redux/store";

function Dashboard() {
  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");

  return (
    <main dir="rtl" className="min-h-screen bg-slate-950 px-4 py-10 text-white">
      <section className="mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div className="space-y-2">
          <p className="text-sm text-sky-300">پنل کاربری</p>
          <h1 className="text-2xl font-semibold tracking-tight">
            {fullName || user?.username || "خوش آمدید"}
          </h1>
          <p className="text-sm text-slate-400">
            اطلاعات حساب شما در این بخش نمایش داده می‌شود.
          </p>
        </div>

        <div className="grid gap-4 sm:grid-cols-2">
          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl">
            <p className="text-xs text-slate-500">نام و نام خانوادگی</p>
            <p className="mt-2 text-base text-slate-100">{fullName || "-"}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl">
            <p className="text-xs text-slate-500">شماره موبایل</p>
            <p className="mt-2 text-base text-slate-100">{user?.phone || "-"}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl">
            <p className="text-xs text-slate-500">ایمیل</p>
            <p className="mt-2 text-base text-slate-100">{user?.email || "-"}</p>
          </div>

          <div className="rounded-2xl border border-white/10 bg-slate-900/70 p-5 shadow-2xl">
            <p className="text-xs text-slate-500">نوع حساب</p>
            <p className="mt-2 text-base text-slate-100">{user?.role || "-"}</p>
          </div>
        </div>

        <Link
          to="/"
          className="w-fit rounded-xl border border-white/10 px-5 py-2.5 text-sm text-slate-200 transition hover:bg-white/10 hover:text-white"
        >
          بازگشت به صفحه اصلی
        </Link>
      </section>
    </main>
  );
}

export default Dashboard;
