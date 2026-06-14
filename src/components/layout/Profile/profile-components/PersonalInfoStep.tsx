import React from "react";
import { motion } from "motion/react";
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
          <div className="h-4 w-28 rounded bg-slate-800" />
          <div className="h-12 w-full rounded-lg bg-slate-800" />
        </div>
      ))}
      <div className="h-12 w-full rounded-lg bg-slate-800" />
    </div>
  );
}

export function PersonalInfoStep({
  values,
  setValues,
  isValid,
  loading,
  skeletonLoading = false,
  onSubmit,
}: PersonalInfoStepProps) {
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
      className="space-y-4"
      initial={{ opacity: 0, y: 14 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -10 }}
      transition={{ duration: 0.28, ease: "easeOut" }}
    >
      <div>
        <label className="mb-2 block text-sm font-medium text-white">نام</label>
        <input
          type="text"
          value={values.firstName}
          onChange={handleChange("firstName")}
          dir="rtl"
          className="
            h-12 w-full rounded-lg border border-slate-700 bg-slate-900 px-3
            text-right text-white placeholder-slate-500 outline-none transition
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
          "
          placeholder="نام"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          نام خانوادگی
        </label>
        <input
          type="text"
          value={values.lastName}
          onChange={handleChange("lastName")}
          dir="rtl"
          className="
            h-12 w-full rounded-lg border border-slate-700 bg-slate-900 px-3
            text-right text-white placeholder-slate-500 outline-none transition
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
          "
          placeholder="نام خانوادگی"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          ایمیل
        </label>
        <input
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          dir="ltr"
          className="
            h-12 w-full rounded-lg border border-slate-700 bg-slate-900 px-3
            text-left text-white placeholder-slate-500 outline-none transition
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
          "
          placeholder="example@email.com"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          رمز عبور
        </label>
        <input
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          dir="ltr"
          className="
            h-12 w-full rounded-lg border border-slate-700 bg-slate-900 px-3
            text-left text-white placeholder-slate-500 outline-none transition
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
          "
          placeholder="••••••••"
        />
      </div>

      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          تکرار رمز عبور
        </label>
        <input
          type="password"
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          dir="ltr"
          className="
            h-12 w-full rounded-lg border border-slate-700 bg-slate-900 px-3
            text-left text-white placeholder-slate-500 outline-none transition
            focus:border-indigo-500 focus:ring-2 focus:ring-indigo-500/30
          "
          placeholder="••••••••"
        />
      </div>

      <motion.button
        type="submit"
        disabled={!isValid || loading}
        whileHover={!loading && isValid ? { scale: 1.01 } : {}}
        whileTap={!loading && isValid ? { scale: 0.99 } : {}}
        className="
          flex h-12 w-full items-center justify-center gap-2 rounded-lg
          bg-indigo-600 font-semibold text-white transition hover:bg-indigo-500
          disabled:cursor-not-allowed disabled:bg-slate-700 disabled:text-slate-400
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
