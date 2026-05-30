import React, { useMemo, useRef, useState } from "react";
import {
  AnimatePresence,
  motion,
  useReducedMotion,
  type Variants,
  type Transition,
} from "framer-motion";

type ClientType = "normal" | "estate";
type Mode = "login" | "signup";
type Step = 1 | 2 | 3;

const OTP_LENGTH = 4;

type StepItem = { id: Step; title: string };

function Profile() {
  const prefersReducedMotion = useReducedMotion();

  const [clientType, setClientType] = useState<ClientType>("normal");
  const [mode, setMode] = useState<Mode>("login");

  const [step, setStep] = useState<Step>(1);

  const [phone, setPhone] = useState<string>("");
  const [otp, setOtp] = useState<string[]>(
    Array.from({ length: OTP_LENGTH }, () => ""),
  );
  const [firstName, setFirstName] = useState<string>("");
  const [lastName, setLastName] = useState<string>("");

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  // Derived (no effect needed)
  const maxStep: Step =
    clientType === "normal" ? (mode === "signup" ? 3 : 2) : 1;
  const effectiveStep: Step = (step > maxStep ? maxStep : step) as Step;

  // ---------- Input rules ----------
  const normalizeIranPhone = (raw: string) =>
    raw.replace(/[^\d]/g, "").slice(0, 11);

  const normalizeName = (raw: string) => {
    const cleaned = raw.replace(/[^a-zA-Z\u0600-\u06FF\s-]/g, "");
    return cleaned.replace(/\s+/g, " ").trimStart();
  };

  const isPhoneValidEnough = phone.replace(/[^\d]/g, "").length >= 10;
  const isOtpComplete = otp.every((d) => d.length === 1 && /^\d$/.test(d));
  const isNameValid =
    mode === "signup" &&
    clientType === "normal" &&
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2;

  const stepCompletion: Record<Step, boolean> = {
    1: isPhoneValidEnough,
    2: isOtpComplete,
    3: isNameValid,
  };

  const steps: StepItem[] = useMemo(() => {
    const base: StepItem[] = [
      { id: 1, title: "شماره موبایل" },
      { id: 2, title: "کد تایید" },
    ];
    if (mode === "signup") base.push({ id: 3, title: "مشخصات" });
    return base;
  }, [mode]);

  const goToStep = (next: Step) => {
    // clamp to current maxStep without an effect (prevents "cascading renders" warnings)
    const clamped = (Math.min(Math.max(next, 1), maxStep) as Step) ?? 1;
    setStep(clamped);
  };

  const setClientTypeSafe = (next: ClientType) => {
    setClientType(next);

    // Avoid effects: if leaving normal, wipe normal-form state in the same event
    if (next !== "normal") {
      setPhone("");
      setOtp(Array.from({ length: OTP_LENGTH }, () => ""));
      setFirstName("");
      setLastName("");
      setStep(1);
    } else {
      // Returning to normal: keep step but clamp
      setStep((prev) =>
        prev > (mode === "signup" ? 3 : 2)
          ? ((mode === "signup" ? 3 : 2) as Step)
          : prev,
      );
    }
  };

  const setModeSafe = (next: Mode) => {
    setMode(next);

    // If switching to login, clear signup-only fields and clamp step (same event, no effect)
    if (next === "login") {
      setFirstName("");
      setLastName("");
      setStep((prev) => (prev > 2 ? 2 : prev));
    } else {
      // switching to signup, allow up to step 3
      setStep((prev) => (prev > 3 ? 3 : prev));
    }
  };

  // ---------- OTP handlers ----------
  const focusOtpIndex = (idx: number) => {
    const el = otpRefs.current[idx];
    el?.focus();
    el?.select?.();
  };

  const setOtpAt = (idx: number, value: string) => {
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleOtpChange = (idx: number, value: string) => {
    const v = value.replace(/[^\d]/g, "");
    if (!v) {
      setOtpAt(idx, "");
      return;
    }
    const digit = v.slice(-1);
    setOtpAt(idx, digit);
    if (idx < OTP_LENGTH - 1) focusOtpIndex(idx + 1);
  };

  const handleOtpKeyDown = (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    const key = e.key;

    if (key === "Backspace") {
      if (otp[idx]) {
        e.preventDefault();
        setOtpAt(idx, "");
        return;
      }
      if (idx > 0) {
        e.preventDefault();
        setOtpAt(idx - 1, "");
        focusOtpIndex(idx - 1);
      }
      return;
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) focusOtpIndex(idx - 1);
      return;
    }
    if (key === "ArrowRight") {
      e.preventDefault();
      if (idx < OTP_LENGTH - 1) focusOtpIndex(idx + 1);
      return;
    }

    if (key.length === 1 && !/^\d$/.test(key)) {
      e.preventDefault();
    }
  };

  const handleOtpPaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/[^\d]/g, "").slice(0, OTP_LENGTH);
    if (!digits) return;

    e.preventDefault();
    const next = Array.from({ length: OTP_LENGTH }, (_, i) => digits[i] ?? "");
    setOtp(next);

    const lastFilled = Math.min(digits.length, OTP_LENGTH) - 1;
    if (lastFilled >= 0) focusOtpIndex(lastFilled);
  };

  // ---------- Motion variants (typed correctly) ----------
  const springy: Transition = prefersReducedMotion
    ? { duration: 0 }
    : {
        duration: 0.45,
        ease: [0.2, 0.8, 0.2, 1] as [number, number, number, number],
      };

  const containerVariants: Variants = {
    hidden: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 18 },
    show: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, transition: springy },
  };

  const stepVariants: Variants = {
    initial: prefersReducedMotion ? { opacity: 0 } : { opacity: 0, y: 10 },
    animate: prefersReducedMotion
      ? { opacity: 1 }
      : { opacity: 1, y: 0, transition: { duration: 0.25, ease: "easeOut" } },
    exit: prefersReducedMotion
      ? { opacity: 0 }
      : { opacity: 0, y: -8, transition: { duration: 0.18, ease: "easeIn" } },
  };

  return (
    <main
      dir="rtl"
      className="min-h-[calc(100vh-120px)] px-4 sm:px-6 lg:px-8 py-10 lg:py-14"
    >
      {/* Ambient background */}
      <div className="pointer-events-none fixed inset-0 -z-10 overflow-hidden">
        <div
          className="absolute -top-40 left-1/2 h-[560px] w-[560px] -translate-x-1/2 rounded-full blur-3xl opacity-30"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, rgba(99,102,241,0.55), rgba(0,0,0,0))",
          }}
        />
        <div
          className="absolute -bottom-56 right-[-140px] h-[620px] w-[620px] rounded-full blur-3xl opacity-25"
          style={{
            background:
              "radial-gradient(circle at 40% 40%, rgba(16,185,129,0.45), rgba(0,0,0,0))",
          }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-black/0 via-black/0 to-black/40" />
      </div>

      {/* Desktop narrower */}
      <section className="mx-auto w-full max-w-2xl lg:max-w-3xl">
        <header className="mb-8 lg:mb-10">
          <h1 className="text-2xl sm:text-3xl font-semibold tracking-tight text-white">
            ورود / ثبت نام
          </h1>
          <p className="mt-2 text-sm sm:text-base text-slate-300 max-w-2xl leading-7">
            حساب کاربری خود را بسازید یا وارد شوید.
          </p>
        </header>

        <motion.div
          variants={containerVariants}
          initial="hidden"
          animate="show"
          className="
            rounded-[28px] border border-white/10
            bg-slate-950/65 backdrop-blur-2xl
            shadow-[0_30px_100px_rgba(0,0,0,0.6)]
            overflow-hidden
          "
        >
          <div className="p-5 sm:p-7 lg:p-8">
            {/* Top controls */}
            <div className="mb-7 lg:mb-8 flex flex-col gap-4 lg:gap-5">
              {/* Client type toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm sm:text-base font-semibold text-slate-100">
                  نوع کاربر
                </div>

                <div
                  className="
                    inline-flex w-full sm:w-auto justify-between sm:justify-start
                    rounded-2xl border border-white/10 bg-white/5 p-1
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                  "
                >
                  <button
                    type="button"
                    onClick={() => setClientTypeSafe("normal")}
                    className={`
                      relative flex-1 sm:flex-none px-5 py-2.5 text-sm sm:text-base rounded-xl transition-all
                      ${clientType === "normal" ? "text-white" : "text-slate-300 hover:text-white"}
                    `}
                    aria-pressed={clientType === "normal"}
                  >
                    {clientType === "normal" && (
                      <span
                        className="
                          absolute inset-0 -z-10 rounded-xl
                          bg-gradient-to-r from-indigo-500/30 via-indigo-500/15 to-emerald-500/20
                          border border-white/10
                          shadow-[0_10px_30px_rgba(99,102,241,0.18)]
                        "
                      />
                    )}
                    کاربر عادی
                  </button>

                  <button
                    type="button"
                    onClick={() => setClientTypeSafe("estate")}
                    className={`
                      relative flex-1 sm:flex-none px-5 py-2.5 text-sm sm:text-base rounded-xl transition-all
                      ${clientType === "estate" ? "text-white" : "text-slate-300 hover:text-white"}
                    `}
                    aria-pressed={clientType === "estate"}
                  >
                    {clientType === "estate" && (
                      <span
                        className="
                          absolute inset-0 -z-10 rounded-xl
                          bg-gradient-to-r from-indigo-500/30 via-indigo-500/15 to-emerald-500/20
                          border border-white/10
                          shadow-[0_10px_30px_rgba(16,185,129,0.14)]
                        "
                      />
                    )}
                    کاربر املاک
                  </button>
                </div>
              </div>

              {/* Mode toggle */}
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
                <div className="text-sm sm:text-base font-semibold text-slate-100">
                  حالت
                </div>

                <div
                  className="
                    inline-flex w-full sm:w-auto justify-between sm:justify-start
                    rounded-2xl border border-white/10 bg-white/5 p-1
                    shadow-[inset_0_1px_0_rgba(255,255,255,0.08)]
                  "
                >
                  <button
                    type="button"
                    onClick={() => setModeSafe("login")}
                    className={`
                      relative flex-1 sm:flex-none px-5 py-2.5 text-sm sm:text-base rounded-xl transition-all
                      ${mode === "login" ? "text-white" : "text-slate-300 hover:text-white"}
                    `}
                    aria-pressed={mode === "login"}
                  >
                    {mode === "login" && (
                      <span className="absolute inset-0 -z-10 rounded-xl bg-white/10 border border-white/10" />
                    )}
                    ورود
                  </button>

                  <button
                    type="button"
                    onClick={() => setModeSafe("signup")}
                    className={`
                      relative flex-1 sm:flex-none px-5 py-2.5 text-sm sm:text-base rounded-xl transition-all
                      ${mode === "signup" ? "text-white" : "text-slate-300 hover:text-white"}
                    `}
                    aria-pressed={mode === "signup"}
                  >
                    {mode === "signup" && (
                      <span className="absolute inset-0 -z-10 rounded-xl bg-white/10 border border-white/10" />
                    )}
                    ثبت نام
                  </button>
                </div>
              </div>
            </div>

            {/* Main card */}
            {clientType === "normal" ? (
              <form
                onSubmit={(e) => e.preventDefault()}
                className="
                  rounded-3xl border border-white/10 bg-white/5
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                  overflow-hidden
                "
              >
                <div className="p-5 sm:p-6 border-b border-white/10">
                  <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                    <div className="text-base sm:text-lg font-semibold text-white">
                      {mode === "login"
                        ? "ورود کاربر عادی"
                        : "ثبت نام کاربر عادی"}
                    </div>
                    <div className="text-sm text-slate-300">
                      مرحله {effectiveStep} از {maxStep}
                    </div>
                  </div>

                  {/* Stepper */}
                  <div
                    className={`mt-4 grid gap-3 ${
                      maxStep === 2
                        ? "grid-cols-1 sm:grid-cols-2"
                        : "grid-cols-1 sm:grid-cols-3"
                    }`}
                  >
                    {steps.map(({ id, title }) => {
                      const isDone = stepCompletion[id];
                      const isActive = effectiveStep === id;

                      return (
                        <motion.button
                          key={id}
                          type="button"
                          onClick={() => goToStep(id)}
                          whileHover={
                            prefersReducedMotion ? undefined : { y: -1 }
                          }
                          whileTap={
                            prefersReducedMotion ? undefined : { scale: 0.99 }
                          }
                          className="
                            group relative overflow-hidden rounded-2xl
                            border border-white/10 bg-white/5
                            px-4 py-3 text-right transition
                            hover:bg-white/7
                            focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60
                          "
                        >
                          <span
                            className={`
                              pointer-events-none absolute inset-x-0 -top-10 h-20
                              blur-2xl transition-opacity duration-300
                              ${isActive ? "opacity-100" : "opacity-0 group-hover:opacity-70"}
                            `}
                            style={{
                              background:
                                "radial-gradient(circle at 50% 65%, rgba(99,102,241,0.55), rgba(0,0,0,0))",
                            }}
                          />

                          <div className="flex items-center justify-between gap-3">
                            <div className="flex items-center gap-3">
                              <span
                                className={`
                                  grid place-items-center h-9 w-9 rounded-xl text-sm font-semibold
                                  transition
                                  ${
                                    isDone
                                      ? "bg-emerald-500/20 text-emerald-200 border border-emerald-400/25"
                                      : isActive
                                        ? "bg-indigo-500/20 text-indigo-100 border border-indigo-400/25"
                                        : "bg-white/5 text-slate-300 border border-white/10"
                                  }
                                `}
                              >
                                {id}
                              </span>

                              <span
                                className={`
                                  text-sm transition
                                  ${isActive ? "text-white" : isDone ? "text-emerald-100" : "text-slate-300"}
                                `}
                              >
                                {title}
                              </span>
                            </div>

                            <span
                              className={`
                                text-xs px-2.5 py-1.5 rounded-xl border transition
                                ${
                                  isDone
                                    ? "border-emerald-400/20 text-emerald-200 bg-emerald-500/10"
                                    : isActive
                                      ? "border-indigo-400/20 text-indigo-100 bg-indigo-500/10"
                                      : "border-white/10 text-slate-300 bg-white/5"
                                }
                              `}
                            >
                              {isDone ? "انجام شد" : isActive ? "فعلی" : "بعدی"}
                            </span>
                          </div>
                        </motion.button>
                      );
                    })}
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="relative min-h-[320px] sm:min-h-[340px]">
                    <AnimatePresence mode="wait">
                      {effectiveStep === 1 && (
                        <motion.section
                          key="step-1"
                          variants={stepVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <div className="mb-6">
                            <div className="text-lg sm:text-xl font-semibold text-white">
                              شماره موبایل
                            </div>
                            <div className="text-sm sm:text-base text-slate-300 mt-2 leading-7">
                              شماره موبایل خود را وارد کنید تا ادامه دهید.
                            </div>
                          </div>

                          <div className="max-w-xl">
                            <label className="block text-sm sm:text-base text-slate-200 mb-2">
                              شماره موبایل
                            </label>

                            <div
                              className="
                                flex items-center gap-3 rounded-2xl border border-white/10
                                bg-slate-950/40 px-4 py-3
                                shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                                focus-within:ring-2 focus-within:ring-indigo-400/45
                                transition
                              "
                            >
                              <span className="text-slate-400 text-sm sm:text-base">
                                +98
                              </span>
                              <input
                                value={phone}
                                onChange={(e) =>
                                  setPhone(normalizeIranPhone(e.target.value))
                                }
                                className="
                                  w-full bg-transparent outline-none
                                  text-white placeholder:text-slate-500
                                  py-2 text-sm sm:text-base
                                "
                                placeholder="مثلاً 09121234567"
                                inputMode="numeric"
                                autoComplete="tel"
                              />
                            </div>
                          </div>

                          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <button
                              type="button"
                              className="
                                inline-flex items-center justify-center
                                rounded-2xl border border-white/10 bg-white/5
                                px-6 py-3.5 text-sm sm:text-base text-slate-200
                                hover:bg-white/10 transition
                              "
                            >
                              انصراف
                            </button>

                            <button
                              type="button"
                              onClick={() => goToStep(2)}
                              disabled={!isPhoneValidEnough}
                              className="
                                relative inline-flex items-center justify-center overflow-hidden
                                rounded-2xl px-7 py-3.5 text-sm sm:text-base font-semibold text-white
                                border border-indigo-400/20
                                bg-gradient-to-r from-indigo-500/35 via-indigo-500/15 to-emerald-500/20
                                shadow-[0_18px_60px_rgba(99,102,241,0.20)]
                                hover:shadow-[0_26px_85px_rgba(99,102,241,0.28)]
                                transition
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60
                                disabled:opacity-45 disabled:cursor-not-allowed
                              "
                            >
                              ادامه
                            </button>
                          </div>
                        </motion.section>
                      )}

                      {effectiveStep === 2 && (
                        <motion.section
                          key="step-2"
                          variants={stepVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <div className="mb-6">
                            <div className="text-lg sm:text-xl font-semibold text-white">
                              کد تایید (OTP)
                            </div>
                            <div className="text-sm sm:text-base text-slate-300 mt-2 leading-7">
                              کد {OTP_LENGTH} رقمی ارسال‌شده را وارد کنید.
                            </div>
                          </div>

                          <div className="max-w-md">
                            <div
                              className="grid grid-cols-4 gap-2 sm:gap-3"
                              dir="ltr"
                            >
                              {Array.from({ length: OTP_LENGTH }).map(
                                (_, idx) => (
                                  <input
                                    key={idx}
                                    ref={(el) => {
                                      otpRefs.current[idx] = el;
                                    }}
                                    value={otp[idx]}
                                    onChange={(e) =>
                                      handleOtpChange(idx, e.target.value)
                                    }
                                    onKeyDown={(e) => handleOtpKeyDown(idx, e)}
                                    onPaste={
                                      idx === 0 ? handleOtpPaste : undefined
                                    }
                                    className="
                                    h-12 sm:h-14 rounded-2xl border border-white/10 bg-slate-950/40
                                    text-center text-white outline-none text-base sm:text-lg
                                    shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                                    focus:ring-2 focus:ring-indigo-400/45
                                    transition
                                  "
                                    inputMode="numeric"
                                    autoComplete={
                                      idx === 0 ? "one-time-code" : "off"
                                    }
                                    aria-label={`OTP digit ${idx + 1}`}
                                    maxLength={1}
                                  />
                                ),
                              )}
                            </div>

                            <div className="mt-5 flex items-center justify-between text-sm text-slate-400">
                              <button
                                type="button"
                                className="hover:text-white transition"
                              >
                                ارسال مجدد کد
                              </button>
                              <span>00:59</span>
                            </div>
                          </div>

                          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <button
                              type="button"
                              onClick={() => goToStep(1)}
                              className="
                                inline-flex items-center justify-center
                                rounded-2xl border border-white/10 bg-white/5
                                px-6 py-3.5 text-sm sm:text-base text-slate-200
                                hover:bg-white/10 transition
                              "
                            >
                              مرحله قبل
                            </button>

                            <button
                              type="button"
                              onClick={() => {
                                if (mode === "signup") goToStep(3);
                              }}
                              disabled={!isOtpComplete}
                              className="
                                relative inline-flex items-center justify-center overflow-hidden
                                rounded-2xl px-7 py-3.5 text-sm sm:text-base font-semibold text-white
                                border border-indigo-400/20
                                bg-gradient-to-r from-indigo-500/35 via-indigo-500/15 to-emerald-500/20
                                shadow-[0_18px_60px_rgba(99,102,241,0.20)]
                                hover:shadow-[0_26px_85px_rgba(99,102,241,0.28)]
                                transition
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-400/60
                                disabled:opacity-45 disabled:cursor-not-allowed
                              "
                            >
                              {mode === "signup" ? "ادامه" : "تایید"}
                            </button>
                          </div>
                        </motion.section>
                      )}

                      {effectiveStep === 3 && mode === "signup" && (
                        <motion.section
                          key="step-3"
                          variants={stepVariants}
                          initial="initial"
                          animate="animate"
                          exit="exit"
                        >
                          <div className="mb-6">
                            <div className="text-lg sm:text-xl font-semibold text-white">
                              مشخصات
                            </div>
                            <div className="text-sm sm:text-base text-slate-300 mt-2 leading-7">
                              نام و نام خانوادگی خود را وارد کنید.
                            </div>
                          </div>

                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-w-2xl">
                            <div>
                              <label className="block text-sm sm:text-base text-slate-200 mb-2">
                                نام
                              </label>
                              <input
                                value={firstName}
                                onChange={(e) =>
                                  setFirstName(normalizeName(e.target.value))
                                }
                                className="
                                  w-full h-12 sm:h-14 rounded-2xl border border-white/10 bg-slate-950/40
                                  px-4 text-sm sm:text-base text-white outline-none
                                  placeholder:text-slate-500
                                  shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                                  focus:ring-2 focus:ring-indigo-400/45
                                  transition
                                "
                                placeholder="مثلاً علی"
                                autoComplete="given-name"
                              />
                              <div className="mt-2 text-xs text-slate-400 leading-6">
                                فقط حروف (فارسی/انگلیسی) مجاز است.
                              </div>
                            </div>

                            <div>
                              <label className="block text-sm sm:text-base text-slate-200 mb-2">
                                نام خانوادگی
                              </label>
                              <input
                                value={lastName}
                                onChange={(e) =>
                                  setLastName(normalizeName(e.target.value))
                                }
                                className="
                                  w-full h-12 sm:h-14 rounded-2xl border border-white/10 bg-slate-950/40
                                  px-4 text-sm sm:text-base text-white outline-none
                                  placeholder:text-slate-500
                                  shadow-[inset_0_1px_0_rgba(255,255,255,0.05)]
                                  focus:ring-2 focus:ring-indigo-400/45
                                  transition
                                "
                                placeholder="مثلاً محمدی"
                                autoComplete="family-name"
                              />
                              <div className="mt-2 text-xs text-slate-400 leading-6">
                                فقط حروف (فارسی/انگلیسی) مجاز است.
                              </div>
                            </div>
                          </div>

                          <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                            <button
                              type="button"
                              onClick={() => goToStep(2)}
                              className="
                                inline-flex items-center justify-center
                                rounded-2xl border border-white/10 bg-white/5
                                px-6 py-3.5 text-sm sm:text-base text-slate-200
                                hover:bg-white/10 transition
                              "
                            >
                              مرحله قبل
                            </button>

                            <button
                              type="submit"
                              disabled={!isNameValid}
                              className="
                                relative inline-flex items-center justify-center overflow-hidden
                                rounded-2xl px-7 py-3.5 text-sm sm:text-base font-semibold text-white
                                border border-emerald-400/20
                                bg-gradient-to-r from-emerald-500/25 via-indigo-500/10 to-emerald-500/20
                                shadow-[0_18px_60px_rgba(16,185,129,0.16)]
                                hover:shadow-[0_26px_85px_rgba(16,185,129,0.22)]
                                transition
                                focus:outline-none focus-visible:ring-2 focus-visible:ring-emerald-400/60
                                disabled:opacity-45 disabled:cursor-not-allowed
                              "
                            >
                              تکمیل ثبت نام
                            </button>
                          </div>
                        </motion.section>
                      )}
                    </AnimatePresence>
                  </div>
                </div>
              </form>
            ) : (
              <div
                className="
                  rounded-3xl border border-white/10 bg-white/5
                  shadow-[inset_0_1px_0_rgba(255,255,255,0.06)]
                  overflow-hidden
                "
              >
                <div className="p-5 sm:p-6 border-b border-white/10">
                  <div className="text-base sm:text-lg font-semibold text-white">
                    {mode === "login"
                      ? "ورود کاربر املاک"
                      : "ثبت نام کاربر املاک"}
                  </div>
                  <div className="text-sm sm:text-base text-slate-300 mt-2 leading-7 max-w-2xl">
                    فعلاً فقط گزینه‌ها نمایش داده می‌شوند (بدون ورودی).
                  </div>
                </div>

                <div className="p-5 sm:p-6 lg:p-7">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {[
                      {
                        title: "مشاور املاک",
                        desc: "مناسب برای مشاوران و بنگاه‌ها",
                        tone: "indigo" as const,
                      },
                      {
                        title: "سازنده / توسعه‌دهنده",
                        desc: "مناسب برای پروژه‌های نوساز",
                        tone: "emerald" as const,
                      },
                      {
                        title: "مدیر مجموعه",
                        desc: "مدیریت چند کاربر و چند شعبه",
                        tone: "indigo" as const,
                      },
                      {
                        title: "مالک (حقیقی/حقوقی)",
                        desc: "ثبت و مدیریت فایل‌های ملک",
                        tone: "emerald" as const,
                      },
                    ].map((card) => (
                      <motion.button
                        key={card.title}
                        type="button"
                        whileHover={
                          prefersReducedMotion ? undefined : { y: -1 }
                        }
                        whileTap={
                          prefersReducedMotion ? undefined : { scale: 0.99 }
                        }
                        className="
                          group relative overflow-hidden rounded-2xl border border-white/10
                          bg-slate-950/35 px-5 py-5 text-right
                          hover:bg-white/7 transition
                          focus:outline-none focus-visible:ring-2 focus-visible:ring-white/20
                        "
                      >
                        <div className="text-base font-semibold text-white">
                          {card.title}
                        </div>
                        <div className="mt-2 text-sm text-slate-300 leading-7">
                          {card.desc}
                        </div>

                        <span
                          className="pointer-events-none absolute inset-x-0 -bottom-12 h-28 opacity-0 group-hover:opacity-100 transition-opacity duration-300 blur-2xl"
                          style={{
                            background:
                              card.tone === "emerald"
                                ? "radial-gradient(circle at 50% 30%, rgba(16,185,129,0.40), rgba(0,0,0,0))"
                                : "radial-gradient(circle at 50% 30%, rgba(99,102,241,0.45), rgba(0,0,0,0))",
                          }}
                        />
                      </motion.button>
                    ))}
                  </div>

                  <div className="mt-8 flex flex-col sm:flex-row gap-3 sm:items-center sm:justify-between">
                    <button
                      type="button"
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl border border-white/10 bg-white/5
                        px-6 py-3.5 text-sm sm:text-base text-slate-200
                        hover:bg-white/10 transition
                      "
                    >
                      بازگشت
                    </button>

                    <button
                      type="button"
                      className="
                        inline-flex items-center justify-center
                        rounded-2xl border border-white/10 bg-white/5
                        px-6 py-3.5 text-sm sm:text-base text-slate-200
                        hover:bg-white/10 transition
                      "
                    >
                      ادامه (بعداً)
                    </button>
                  </div>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </section>
    </main>
  );
}

export default Profile;
