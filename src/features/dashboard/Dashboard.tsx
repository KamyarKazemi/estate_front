import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { AppDispatch, RootState } from "../../store";
import { resetAuth } from "../../store/authSlice";
import { updateProfileThunk } from "../../store/thunks/updateProfileThunk";
import { useState } from "react";
import { CiEdit } from "react-icons/ci";

const ROLE_LABELS: Record<string, string> = {
  CUSTOMER: "مشتری",
  AGENT: "مشاور املاک",
};

function Dashboard() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const user = useSelector((state: RootState) => state.auth.user);
  const updatingProfile = useSelector((state: RootState) => state.auth.updatingProfile);

  const fullName = [user?.first_name, user?.last_name].filter(Boolean).join(" ");
  const roleLabel = user?.role ? (ROLE_LABELS[user.role] ?? user.role) : "-";

  const [isEditing, setIsEditing] = useState(false);
  const [editError, setEditError] = useState<string | null>(null);
  const [editValues, setEditValues] = useState({ email: "", first_name: "", last_name: "" });

  const handleLogout = () => {
    dispatch(resetAuth());
    navigate("/");
  };

  const handleEditStart = () => {
    setEditValues({
      first_name: user?.first_name ?? "",
      last_name: user?.last_name ?? "",
      email: user?.email ?? "",
    });
    setEditError(null);
    setIsEditing(true);
  };

  const handleCancel = () => {
    setIsEditing(false);
    setEditError(null);
  };

  const handleSave = async () => {
    const changedFields: { email?: string; first_name?: string; last_name?: string } = {};
    if (editValues.email !== (user?.email ?? "")) changedFields.email = editValues.email;
    if (editValues.first_name !== (user?.first_name ?? "")) changedFields.first_name = editValues.first_name;
    if (editValues.last_name !== (user?.last_name ?? "")) changedFields.last_name = editValues.last_name;

    if (Object.keys(changedFields).length === 0) {
      setEditError("هیچ تغییری اعمال نشده است.");
      return;
    }

    try {
      await dispatch(updateProfileThunk(changedFields)).unwrap();
      setIsEditing(false);
      setEditError(null);
    } catch (err: unknown) {
      setEditError(typeof err === "string" ? err : "بروزرسانی ناموفق بود.");
    }
  };

  const readOnlyCard = (label: string, value: string, onEdit?: () => void) => (
    <div
      key={label}
      className="
        group/card rounded-2xl border border-white/10 bg-white/5 p-5
        backdrop-blur-sm transition-all duration-300
        hover:-translate-y-0.5 hover:border-sky-500/30 hover:bg-white/[0.07]
        hover:shadow-[0_10px_30px_-10px_rgba(14,165,233,0.25)]
      "
    >
      <p className="text-xs text-slate-500 transition-colors duration-300 group-hover/card:text-sky-400">
        {label}
      </p>
      <div className="mt-2 flex items-center justify-between">
        <p className="text-base text-slate-100">{value || "-"}</p>
        {onEdit && (
          <button
            type="button"
            onClick={onEdit}
            className="text-slate-500 transition-colors duration-200 hover:text-sky-400"
          >
            <CiEdit className="text-xl" />
          </button>
        )}
      </div>
    </div>
  );

  const editInput = (label: string, field: "email" | "first_name" | "last_name") => (
    <div className="rounded-2xl border border-sky-500/30 bg-white/5 p-5 backdrop-blur-sm">
      <label className="text-xs text-sky-400">{label}</label>
      <input
        type="text"
        value={editValues[field]}
        onChange={(e) => setEditValues((prev) => ({ ...prev, [field]: e.target.value }))}
        className="mt-2 w-full bg-transparent text-base text-slate-100 border-none outline-none placeholder-slate-600"
        placeholder={label}
      />
    </div>
  );

  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-slate-950 px-4 py-10 text-white"
    >
      <div className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]" />
      <div className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-sky-500/5 blur-[100px]" />

      <section className="relative z-10 mx-auto flex w-full max-w-4xl flex-col gap-6">
        <div
          className="
            group relative overflow-hidden bg-slate-900/60 backdrop-blur-xl
            border border-white/10 rounded-3xl
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
            transition-all duration-500 hover:border-white/20
            p-6 sm:p-10 space-y-8
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
            {isEditing ? (
              <>
                {editInput("نام", "first_name")}
                {editInput("نام خانوادگی", "last_name")}
                {editInput("ایمیل", "email")}
                {readOnlyCard("شماره موبایل", user?.phone_number ?? "")}
                {readOnlyCard("نوع حساب", roleLabel)}
              </>
            ) : (
              <>
                {readOnlyCard("نام و نام خانوادگی", fullName, handleEditStart)}
                {readOnlyCard("شماره موبایل", user?.phone_number ?? "", () => navigate("/change-phone"))}
                {readOnlyCard("ایمیل", user?.email ?? "", handleEditStart)}
                {readOnlyCard("نوع حساب", roleLabel)}
              </>
            )}
          </div>

          {editError && <p className="text-sm text-red-400">{editError}</p>}

          <div className="flex flex-wrap gap-3 pt-2">
            {isEditing ? (
              <>
                <button
                  type="button"
                  onClick={handleSave}
                  disabled={updatingProfile}
                  className="
                    w-fit rounded-xl border border-sky-500/30 bg-sky-500/10 px-5 py-2.5
                    text-sm text-sky-300 transition-all duration-300
                    hover:border-sky-500/50 hover:bg-sky-500/20 hover:text-sky-200
                    disabled:opacity-50 disabled:cursor-not-allowed
                  "
                >
                  {updatingProfile ? "در حال ذخیره..." : "ذخیره"}
                </button>
                <button
                  type="button"
                  onClick={handleCancel}
                  className="
                    w-fit rounded-xl border border-white/10 bg-white/5 px-5 py-2.5
                    text-sm text-slate-200 transition-all duration-300
                    hover:border-white/20 hover:bg-white/10 hover:text-white
                  "
                >
                  انصراف
                </button>
              </>
            ) : (
              <>
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
                <button
                  type="button"
                  onClick={() => navigate("/reset-password")}
                  className="
                    w-fit rounded-xl border border-sky-500/20 bg-sky-500/5 px-5 py-2.5
                    text-sm text-sky-300 transition-all duration-300
                    hover:border-sky-500/40 hover:bg-sky-500/10 hover:text-sky-200
                  "
                >
                  تغییر رمز عبور
                </button>
              </>
            )}
          </div>
        </div>
      </section>
    </main>
  );
}

export default Dashboard;
