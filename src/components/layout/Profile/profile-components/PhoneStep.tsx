import { useState, type ChangeEvent, type FormEvent } from "react";
import { motion } from "motion/react";
import type { Mode } from "../types/types";
import { passwordRegex } from "../hooks/useSignupValidation";

export type PhoneStepProps = {
  phone: string;
  setPhone: (v: string) => void;
  mode: Mode;
  password: string;
  setPassword: (v: string) => void;
  isPasswordValid: boolean;
  isValid: boolean;
  loading: boolean;
  skeletonLoading?: boolean;
  onSubmit: () => Promise<void>;
};

const PHONE_REGEX = /^09\d{9}$/;

function Spinner() {
  return (
    <motion.span
      animate={{ rotate: 360 }}
      transition={{ repeat: Infinity, duration: 0.9, ease: "linear" }}
      className="inline-block h-5 w-5 rounded-full border-2 border-white/30 border-t-white"
    />
  );
}

function PhoneStepSkeleton({ withPassword }: { withPassword: boolean }) {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-white/5" />
        <div className="h-12 w-full rounded-xl bg-white/5" />
        <div className="h-3 w-52 rounded bg-white/5" />
      </div>
      {withPassword && (
        <div className="space-y-3">
          <div className="h-4 w-24 rounded bg-white/5" />
          <div className="h-12 w-full rounded-xl bg-white/5" />
        </div>
      )}
      <div className="h-12 w-full rounded-xl bg-white/5" />
    </div>
  );
}

const inputClasses = `
  h-12 w-full rounded-xl border border-white/10 bg-white/5 px-4
  text-white placeholder-slate-500 outline-none transition-colors duration-300
  focus:border-sky-500/50 focus:bg-slate-800/40 focus:ring-4 focus:ring-sky-500/10
`;

export function PhoneStep({
  phone,
  setPhone,
  mode,
  password,
  setPassword,
  loading,
  skeletonLoading = false,
  onSubmit,
}: PhoneStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isLogin = mode === "login";

  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    let digits = e.target.value.replace(/\D/g, "");

    digits = digits.slice(0, 11);

    if (digits.length === 1 && digits !== "0" && digits !== "9") {
      return;
    }

    if (digits.length === 10 && digits.startsWith("9")) {
      digits = `0${digits}`;
    }

    setPhone(digits);
  };

  const isPhoneValid = PHONE_REGEX.test(phone);
  const isPasswordValid = !isLogin || passwordRegex.test(password);
  const isStrictValid = isPhoneValid && isPasswordValid;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isStrictValid || loading) return;
    await onSubmit();
  };

  if (skeletonLoading) {
    return <PhoneStepSkeleton withPassword={isLogin} />;
  }

  return (
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
          شماره تلفن همراه
        </label>

        <motion.input
          type="tel"
          value={phone}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="tel"
          placeholder="09123456789"
          dir="ltr"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={inputClasses}
        />

        {phone.length > 0 && !isPhoneValid && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            شماره باید با 09 یا 9 شروع شود و در نهایت 11 رقم باشد.
          </motion.p>
        )}
      </div>

      {isLogin && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -6 }}
          transition={{ duration: 0.22, ease: "easeOut" }}
        >
          <label className="mb-3 block text-sm font-medium text-white">
            رمز عبور
          </label>

          <div className="relative">
            <motion.input
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              autoComplete="current-password"
              placeholder="••••••••"
              dir="ltr"
              whileFocus={{ scale: 1.01 }}
              transition={{ type: "spring", stiffness: 400, damping: 30 }}
              className={`${inputClasses} pl-12`}
            />

            <button
              type="button"
              onClick={() => setShowPassword((v) => !v)}
              tabIndex={-1}
              className="
                absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400
                transition-colors duration-200 hover:text-sky-200
              "
            >
              {showPassword ? "پنهان" : "نمایش"}
            </button>
          </div>

          {password.length > 0 && !isPasswordValid && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              className="mt-2 text-sm text-red-400"
            >
              رمز عبور باید حداقل ۸ کاراکتر و شامل حروف بزرگ، کوچک و عدد باشد.
            </motion.p>
          )}
        </motion.div>
      )}

      <motion.button
        type="submit"
        disabled={!isStrictValid || loading}
        whileHover={!loading && isStrictValid ? { scale: 1.01 } : {}}
        whileTap={!loading && isStrictValid ? { scale: 0.99 } : {}}
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
            <span>در حال ارسال کد تأیید...</span>
          </>
        ) : (
          "دریافت کد تأیید"
        )}
      </motion.button>
    </motion.form>
  );
}
