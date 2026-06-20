import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../../../redux/store";
import { resetAuth } from "../../../redux/slices/authSlice";

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "مشتری",
  AGENT: "مشاور املاک",
};

const infoCards = (fullName: string, phone: string, email: string, role: string) => [
  { label: "نام و نام خانوادگی", value: fullName || "-" },
  { label: "شماره موبایل", value: phone || "-" },
  { label: "ایمیل", value: email || "-" },
  { label: "نوع حساب", value: role },
];

function Dashboard() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const fullName = [user?.first_name, user?.last_name]
    .filter(Boolean)
    .join(" ");
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : "-";

  const handleLogout = () => {
    dispatch(resetAuth());
    navigate("/");
  };

  const cards = infoCards(fullName, user?.phone_number ?? "", user?.email ?? "", roleLabel);

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white"
    >
      {/* Ambient glow, matches the header/footer liquid-glass treatment */}
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-sky-500/5 blur-[100px]" />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div
          className="
            group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl
            border border-white/10 rounded-3xl
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
            transition-all duration-500 hover:border-white/20
            p-6 sm:p-10
            space-y-8
          "
        >
          <div className="space-y-2">
            <p className="text-sm text-sky-400">پنل کاربری</p>
            <h1 className="text-2xl font-semibold tracking-tight text-white">
              {fullName || user?.username || "خوش آمدید"}
            </h1>
            <p className="text-sm text-slate-400">
              اطلاعات حساب شما در این بخش نمایش داده می‌شود.
            </p>
          </div>

          <div className="grid gap-4 sm:grid-cols-2">
            {cards.map((card) => (
              <div
                key={card.label}
                className="
                  group/card rounded-2xl border border-white/10 bg-white/5 p-5
                  backdrop-blur-sm transition-all duration-300
                  hover:-translate-y-0.5 hover:border-sky-500/30 hover:bg-white/[0.07]
                  hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.25)]
                "
              >
                <p className="text-xs text-slate-500 transition-colors duration-300 group-hover/card:text-sky-400">
                  {card.label}
                </p>
                <p className="mt-2 text-base text-slate-100">{card.value}</p>
              </div>
            ))}
          </div>

          <div className="flex flex-wrap gap-3 pt-2">
            <Link
              to="/"
              className="
                w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-2.5
                text-sm text-slate-200 transition-all duration-300
                hover:border-white/20 hover:bg-white/10 hover:text-white
              "
            >
              بازگشت به صفحه اصلی
            </Link>
            <button
              type="button"
              onClick={handleLogout}
              className="
                w-fit rounded-xl border border-red-500/20 bg-red-500/5 px-5 py-2.5
                text-sm text-red-300 transition-all duration-300
                hover:border-red-500/40 hover:bg-red-500/10 hover:text-red-200
              "
            >
              خروج از حساب کاربری
            </button>
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
