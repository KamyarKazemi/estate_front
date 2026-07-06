import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { PhoneStep } from "../auth/components/PhoneStep";
import { OtpStep } from "../auth/components/OtpStep";
import { StepNavigation } from "../auth/components/StepNavigation";
import { useOtp } from "../auth/hooks/useOtp";

import { changePhoneThunk } from "../../store/thunks/changePhoneThunk";
import { changePhoneOtpThunk } from "../../store/thunks/changePhoneOtpThunk";
import { resetChangePhoneFlow } from "../../store/authSlice";

import type { AppDispatch, RootState } from "../../store";
import type { Step } from "../auth/types";

function ChangePhone() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    changePhoneOtpSessionToken,
    sendingChangePhone,
    verifyingChangePhoneOtp,
    error,
  } = useSelector((state: RootState) => state.auth);

  // clean up on unmount
  useEffect(() => {
    return () => {
      dispatch(resetChangePhoneFlow());
    };
  }, [dispatch]);

  /* -------- step logic -------- */
  const steps: Step[] = [1, 2];

  const stepLabels: Record<Step, string> = {
    1: "شماره جدید",
    2: "کد تأیید",
    3: "",
  };

  const stepCompletion: Record<Step, boolean> = {
    1: !!changePhoneOtpSessionToken,
    2: false,
    3: false,
  };

  const maxAllowedStep: Step = changePhoneOtpSessionToken ? 2 : 1;
  const [step, setStep] = useState<Step>(1);

  /* -------- step 1: new phone number -------- */
  const [phone, setPhone] = useState("");
  const isPhoneValid = /^09\d{9}$/.test(phone);

  const handlePhoneSubmit = async () => {
    try {
      await dispatch(changePhoneThunk(phone)).unwrap();
      setStep(2);
    } catch {
      // error lands in state.error via Redux
    }
  };

  /* -------- step 2: otp -------- */
  const { otp, otpRefs, isComplete, handleChange, handleKeyDown, handlePaste } =
    useOtp(5);

  const handleOtpSubmit = async () => {
    if (!changePhoneOtpSessionToken) return;
    try {
      await dispatch(
        changePhoneOtpThunk({
          otp_session_token: changePhoneOtpSessionToken,
          otp_code: otp.join(""),
          new_phone_number: phone,
        }),
      ).unwrap();
      navigate("/dashboard");
    } catch {
      // error lands in state.error via Redux
    }
  };

  /* -------- UI -------- */
  return (
    <main
      dir="rtl"
      className="relative min-h-screen overflow-hidden bg-slate-950 flex items-center justify-center px-3 sm:px-4 py-6 sm:py-10"
    >
      <motion.div
        className="pointer-events-none absolute -top-32 -right-32 h-96 w-96 rounded-full bg-sky-500/10 blur-[100px]"
        animate={{ opacity: [0.6, 1, 0.6] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        className="pointer-events-none absolute -bottom-32 -left-32 h-72 w-72 rounded-full bg-sky-500/5 blur-[100px]"
        animate={{ opacity: [0.4, 0.8, 0.4] }}
        transition={{ duration: 9, repeat: Infinity, ease: "easeInOut", delay: 1 }}
      />

      <div className="relative z-10 w-full max-w-xl">
        <motion.div
          initial={{ opacity: 0, y: 24, scale: 0.98 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          transition={{ duration: 0.45, ease: "easeOut" }}
          className="
            group relative bg-slate-900/60 backdrop-blur-xl
            border border-white/10 rounded-2xl sm:rounded-3xl
            shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]
            hover:border-white/20 transition-colors duration-500
            p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8
          "
        >
          <div className="text-center space-y-1.5">
            <h1 className="text-xl sm:text-2xl font-semibold text-white tracking-tight">
              تغییر شماره موبایل
            </h1>
            <p className="text-sm text-slate-400">
              شماره موبایل جدید خود را وارد کنید
            </p>
          </div>

          <StepNavigation
            steps={steps}
            currentStep={step}
            completion={stepCompletion}
            labels={stepLabels}
            onStepClick={(target) => {
              if (target <= maxAllowedStep) setStep(target);
            }}
          />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <PhoneStep
                key="change-phone-step"
                phone={phone}
                setPhone={setPhone}
                mode="signup"
                password=""
                setPassword={() => {}}
                isPasswordValid={true}
                isValid={isPhoneValid}
                loading={sendingChangePhone}
                onSubmit={handlePhoneSubmit}
              />
            )}

            {step === 2 && (
              <OtpStep
                key="change-phone-otp"
                otp={otp}
                otpRefs={otpRefs}
                isComplete={isComplete}
                loading={verifyingChangePhoneOtp}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handlePaste={handlePaste}
                onSubmit={handleOtpSubmit}
              />
            )}
          </AnimatePresence>

          <AnimatePresence>
            {error && (
              <motion.p
                key={error}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0 }}
                className="text-center text-sm text-red-400"
              >
                {error}
              </motion.p>
            )}
          </AnimatePresence>

          <button
            type="button"
            onClick={() => navigate("/dashboard")}
            className="w-full text-center text-sm text-slate-500 transition-colors hover:text-slate-300"
          >
            بازگشت به داشبورد
          </button>
        </motion.div>
      </div>
    </main>
  );
}

export default ChangePhone;
