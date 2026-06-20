import React from "react";
import { motion } from "motion/react";

type OtpStepProps = {
  otp: string[];
  otpRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  isComplete: boolean;
  loading: boolean;
  skeletonLoading?: boolean;

  handleChange: (idx: number, value: string) => void;
  handleKeyDown: (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;

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

function OtpStepSkeleton() {
  return (
    <div className="space-y-6 animate-pulse">
      <div className="flex flex-col items-center gap-3">
        <div className="h-4 w-56 rounded bg-white/5" />
      </div>

      <div className="flex justify-center gap-2">
        {Array.from({ length: 5 }).map((_, idx) => (
          <div
            key={idx}
            className="h-12 w-12 rounded-xl bg-white/5 sm:h-14 sm:w-14"
          />
        ))}
      </div>

      <div className="mx-auto h-3 w-44 rounded bg-white/5" />
      <div className="h-12 w-full rounded-xl bg-white/5" />
    </div>
  );
}

export function OtpStep({
  otp,
  otpRefs,
  isComplete,
  loading,
  skeletonLoading = false,
  handleChange,
  handleKeyDown,
  handlePaste,
  onSubmit,
}: OtpStepProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || loading) return;
    await onSubmit();
  };

  if (skeletonLoading) {
    return <OtpStepSkeleton />;
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
      <div className="text-center">
        <p className="text-sm text-slate-400">
          کد تأییدی که برای شماره شما ارسال شده را وارد کنید
        </p>
      </div>

      <div className="flex justify-center gap-2" dir="ltr">
        {otp.map((digit, idx) => (
          <motion.input
            key={idx}
            ref={(el) => {
              otpRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            dir="ltr"
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: idx * 0.04, duration: 0.2, ease: "easeOut" }}
            whileFocus={{ scale: 1.06 }}
            className="
              h-12 w-12 rounded-xl border border-white/10 bg-white/5
              text-center text-lg font-semibold text-white outline-none transition-colors duration-300
              focus:border-sky-500/50 focus:bg-slate-800/40 focus:ring-4 focus:ring-sky-500/10
              sm:h-14 sm:w-14
            "
          />
        ))}
      </div>

      {!isComplete && (
        <motion.p
          initial={{ opacity: 0, y: -4 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center text-sm text-slate-400"
        >
          لطفاً تمام ارقام کد تأیید را وارد کنید
        </motion.p>
      )}

      <motion.button
        type="submit"
        disabled={!isComplete || loading}
        whileHover={!loading && isComplete ? { scale: 1.01 } : {}}
        whileTap={!loading && isComplete ? { scale: 0.99 } : {}}
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
            <span>در حال تأیید کد...</span>
          </>
        ) : (
          "تأیید کد"
        )}
      </motion.button>
    </motion.form>
  );
}
