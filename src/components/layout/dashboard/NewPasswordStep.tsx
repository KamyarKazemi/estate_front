import { useState } from "react";
import { motion } from "motion/react";
import { passwordRegex } from "../../../components/layout/Profile/hooks/useSignupValidation";

type Props = {
  newPassword: string;
  setNewPassword: (v: string) => void;
  confirmPassword: string;
  setConfirmPassword: (v: string) => void;
  loading: boolean;
  onSubmit: () => Promise<void>;
};

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      className="inline-block h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
    />
  );
}

const inputClasses = `
  h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4
  text-white placeholder-slate-500 outline-none transition-colors duration-300
  focus:border-sky-500/50 focus:bg-slate-800/40 focus:ring-4 focus:ring-sky-500/10
`;

export function NewPasswordStep({
  newPassword,
  setNewPassword,
  confirmPassword,
  setConfirmPassword,
  loading,
  onSubmit,
}: Props) {
  const [showNew, setShowNew] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const isPasswordValid = passwordRegex.test(newPassword);
  const passwordsMatch = newPassword === confirmPassword;
  const isValid =
    isPasswordValid && passwordsMatch && confirmPassword.length > 0;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    await onSubmit();
  };

  return (
    <>
      <motion.form
        onSubmit={handleSubmit}
        className="space-y-6"
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -10 }}
        transition={{ duration: 0.28, ease: "easeOut" }}
      >
        <div>
          <label className="mb-3 block text-sm font-medium text-white">
            رمز عبور جدید
          </label>
          <div className="realtive">
            <motion.input
              type={showNew ? "text" : "password"}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              dir="rtl"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`${inputClasses} pl-12`}
            />
            <button
              type="button"
              onClick={() => setShowNew((v) => !v)}
              tabIndex={-1}
              className="absolute left-3 top1/2 -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-sky-200"
            >
              {showNew ? "نمایش" : "پنهان"}
            </button>
          </div>
          {newPassword.length > 0 && !isPasswordValid && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400"
            >
              رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک و عدد باشد.
            </motion.p>
          )}
        </div>

        <div>
          <label className="mb-3 block text-sm fornt-medium text-white">
            تکرار رمز عبور جدید
          </label>
          <div className="relative">
            <motion.input
              type={showConfirm ? "text" : "password"}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              dir="rtl"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`${inputClasses} pl-12`}
            />
            <button
              type="button"
              onClick={() => setShowConfirm((v) => !v)}
              tabIndex={-1}
              className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 transition-colors hover: text-sky-200"
            >
              {showConfirm ? "نمایش" : "پنهان"}
            </button>
          </div>
          {confirmPassword.length > 0 && !passwordsMatch && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400"
            >
              رمزهای عبور با هم مطابقت ندارند.
            </motion.p>
          )}
        </div>

        <motion.button
          type="submit"
          disabled={!isValid || loading}
          whileHover={!loading && isValid ? { scale: 1.01 } : {}}
          whileTap={!loading && isValid ? { scale: 0.99 } : {}}
          className="
          flex h-12 w-full items-center justify-center gap-2 rounded-xl
          border font-semibold transition-all duration-300
          border-sky-500/25 bg-sky-500/15 text-sky-100 hover:border-sky-500/40 hover:bg-sky-500/25
          disabled:cursor-not-allowed disabled:border-white/10 disabled:bg-white/5 disabled:text-slate-500
        "
        >
          {loading ? (
            <>
              <Spinner />
              <span>در حال تغییر رمز...</span>
            </>
          ) : (
            "تغییر رمز عبور"
          )}
        </motion.button>
      </motion.form>
    </>
  );
}
