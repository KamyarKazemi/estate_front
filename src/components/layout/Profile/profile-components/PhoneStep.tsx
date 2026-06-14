import type { ChangeEvent, FormEvent } from "react";
import { motion } from "motion/react";

export type PhoneStepProps = {
  phone: string;
  setPhone: (v: string) => void;
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

function PhoneStepSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="space-y-3">
        <div className="h-4 w-32 rounded bg-slate-800" />
        <div className="h-12 w-full rounded-lg bg-slate-800" />
        <div className="h-3 w-52 rounded bg-slate-800" />
      </div>
      <div className="h-12 w-full rounded-lg bg-slate-800" />
    </div>
  );
}

export function PhoneStep({
  phone,
  setPhone,
  isValid,
  loading,
  skeletonLoading = false,
  onSubmit,
}: PhoneStepProps) {
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

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!PHONE_REGEX.test(phone) || loading) return;
    await onSubmit();
  };

  const isStrictValid = PHONE_REGEX.test(phone);

  if (skeletonLoading) {
    return <PhoneStepSkeleton />;
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

        <input
          type="tel"
          value={phone}
          onChange={handleChange}
          inputMode="numeric"
          autoComplete="tel"
          placeholder="09123456789"
          dir="ltr"
          className="
            h-12 w-full rounded-lg border border-slate-700 bg-slate-900 px-4
            text-white placeholder-slate-500 outline-none transition
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
          "
        />

        {phone.length > 0 && !isStrictValid && (
          <motion.p
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            className="mt-2 text-sm text-red-400"
          >
            شماره باید با 09 یا 9 شروع شود و در نهایت 11 رقم باشد.
          </motion.p>
        )}
      </div>

      <motion.button
        type="submit"
        disabled={!isStrictValid || loading}
        whileHover={!loading && isStrictValid ? { scale: 1.01 } : {}}
        whileTap={!loading && isStrictValid ? { scale: 0.99 } : {}}
        className="
          flex h-12 w-full items-center justify-center gap-2 rounded-lg
          font-semibold text-white transition
          bg-indigo-600 hover:bg-indigo-500
          disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400
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
