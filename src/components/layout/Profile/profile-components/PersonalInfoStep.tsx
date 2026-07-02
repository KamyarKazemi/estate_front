import React, { useState } from "react";
import { motion } from "motion/react";
import type { Variants } from "motion/react";
import type { SignupValues } from "../types/types";

type PersonalInfoStepProps = {
  values: SignupValues;
  setValues: React.Dispatch<React.SetStateAction<SignupValues>>;
  isValid: boolean;
  loading: boolean;
  skeletonLoading?: boolean;
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

function PersonalInfoStepSkeleton() {
  return (
    <div className="space-y-4 animate-pulse">
      {Array.from({ length: 5 }).map((_, idx) => (
        <div key={idx} className="space-y-2">
          <div className="h-4 w-28 rounded bg-white/5" />
          <div className="h-12 w-full rounded-xl bg-white/5" />
        </div>
      ))}
      <div className="h-12 w-full rounded-xl bg-white/5" />
    </div>
  );
}

const inputClasses = `
  h-12 w-full rounded-xl border border-white/10 bg-white/5 px-3
  text-white placeholder-slate-500 outline-none transition-colors duration-300
  focus:border-sky-500/50 focus:bg-slate-800/40 focus:ring-4 focus:ring-sky-500/10
`;

const containerVariants: Variants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: { staggerChildren: 0.06, delayChildren: 0.04 },
  },
};

const fieldVariants: Variants = {
  hidden: { opacity: 0, y: 10 },
  show: { opacity: 1, y: 0, transition: { duration: 0.22, ease: "easeOut" } },
};

export function PersonalInfoStep({
  values,
  setValues,
  isValid,
  loading,
  skeletonLoading = false,
  onSubmit,
}: PersonalInfoStepProps) {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);

  const handleChange =
    (field: keyof SignupValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;
    await onSubmit();
  };

  if (skeletonLoading) {
    return <PersonalInfoStepSkeleton />;
  }

  return (
    <motion.form
      onSubmit={handleSubmit}
      className="space-y-3 sm:space-y-4"
      variants={containerVariants}
      initial="hidden"
      animate="show"
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <motion.div variants={fieldVariants}>
        <label className="mb-2 block text-sm font-medium text-white">نام</label>
        <motion.input
          type="text"
          value={values.firstName}
          onChange={handleChange("firstName")}
          dir="rtl"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={inputClasses}
          placeholder="نام"
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <label className="mb-2 block text-sm font-medium text-white">
          نام خانوادگی
        </label>
        <motion.input
          type="text"
          value={values.lastName}
          onChange={handleChange("lastName")}
          dir="rtl"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={inputClasses}
          placeholder="نام خانوادگی"
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <label className="mb-2 block text-sm font-medium text-white">
          ایمیل
        </label>
        <motion.input
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          dir="ltr"
          whileFocus={{ scale: 1.01 }}
          transition={{ type: "spring", stiffness: 400, damping: 30 }}
          className={`${inputClasses} text-left`}
          placeholder="example@email.com"
        />
      </motion.div>

      <motion.div variants={fieldVariants}>
        <label className="mb-2 block text-sm font-medium text-white">
          رمز عبور
        </label>
        <div className="relative">
          <motion.input
            type={showPassword ? "text" : "password"}
            value={values.password}
            onChange={handleChange("password")}
            dir="ltr"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`${inputClasses} pl-12 text-left`}
            placeholder="••••••••"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowPassword((v) => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-sky-200"
          >
            {showPassword ? "پنهان" : "نمایش"}
          </button>
        </div>
      </motion.div>

      <motion.div variants={fieldVariants}>
        <label className="mb-2 block text-sm font-medium text-white">
          تکرار رمز عبور
        </label>
        <div className="relative">
          <motion.input
            type={showConfirmPassword ? "text" : "password"}
            value={values.confirmPassword}
            onChange={handleChange("confirmPassword")}
            dir="ltr"
            whileFocus={{ scale: 1.01 }}
            transition={{ type: "spring", stiffness: 400, damping: 30 }}
            className={`${inputClasses} pl-12 text-left`}
            placeholder="••••••••"
          />
          <button
            type="button"
            tabIndex={-1}
            onClick={() => setShowConfirmPassword((v) => !v)}
            className="absolute left-3 top-1/2 -translate-y-1/2 text-xs text-slate-400 transition-colors hover:text-sky-200"
          >
            {showConfirmPassword ? "پنهان" : "نمایش"}
          </button>
        </div>
      </motion.div>

      <motion.button
        type="submit"
        variants={fieldVariants}
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
            <span>در حال تکمیل ثبت‌نام...</span>
          </>
        ) : (
          "تکمیل ثبت‌نام"
        )}
      </motion.button>
    </motion.form>
  );
}
