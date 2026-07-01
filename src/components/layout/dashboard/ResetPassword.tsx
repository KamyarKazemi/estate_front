import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { PhoneStep } from "../Profile/profile-components/PhoneStep";
import { OtpStep } from "../Profile/profile-components/OtpStep";
import { StepNavigation } from "../Profile/profile-components/StepNavigation";
import { NewPasswordStep } from "./NewPasswordStep";

import { useOtp } from "../Profile/hooks/useOtp";

import { resetPasswordPhoneThunk } from "../../../redux/thunks/resetPasswordPhoneThunk";
import { resetPasswordOtpThunk } from "../../../redux/thunks/resetPasswordOtpThunk";
import { resetPasswordThunk } from "../../../redux/thunks/resetPasswordThunk";
import { resetPasswordFlow } from "../../../redux/slices/authSlice";

import type { AppDispatch, RootState } from "../../../redux/store";
import type { Step } from "../Profile/types/types";

function ResetPassword() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    resetOtpSessionToken,
    resetPasswordToken,
    sendingResetPhone,
    verifyingResetOtp,
    resettingPassword,
  } = useSelector((state: RootState) => state.auth);

  // clean up the reset flow state when the user leaves this page
  useEffect(() => {
    return () => {
      dispatch(resetPasswordFlow());
    };
  }, [dispatch]);

  /* -------- step logic -------- */
  const steps: Step[] = [1, 2, 3];

  const stepLabels: Record<Step, string> = {
    1: "شماره موبایل",
    2: "کد تأیید",
    3: "رمز جدید",
  };

  const stepCompletion: Record<Step, boolean> = {
    1: !!resetOtpSessionToken,
    2: !!resetPasswordToken,
    3: false,
  };

  const maxAllowedStep: Step = resetPasswordToken
    ? 3
    : resetOtpSessionToken
      ? 2
      : 1;

  const [step, setStep] = useState<Step>(1);

  /* -------- step 1: phone -------- */
  const [phone, setPhone] = useState("");
  const isPhoneValid = /^09\d{9}$/.test(phone);

  const handlePhoneSubmit = async () => {
    await dispatch(resetPasswordPhoneThunk(phone)).unwrap();
    setStep(2);
  };

  /* -------- step 2: otp -------- */
  const { otp, otpRefs, isComplete, handleChange, handleKeyDown, handlePaste } =
    useOtp(5);

  const handleOtpSubmit = async () => {
    if (!resetOtpSessionToken) return;
    await dispatch(
      resetPasswordOtpThunk({
        otp_session_token: resetOtpSessionToken,
        otp_code: otp.join(""),
      }),
    ).unwrap();
    setStep(3);
  };

  /* -------- step 3: new password -------- */
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const handlePasswordSubmit = async () => {
    if (!resetPasswordToken) return;
    await dispatch(
      resetPasswordThunk({
        reset_token: resetPasswordToken,
        password: newPassword,
        confirm_password: confirmPassword,
      }),
    ).unwrap();
    navigate("/dashboard");
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
        transition={{
          duration: 9,
          repeat: Infinity,
          ease: "easeInOut",
          delay: 1,
        }}
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
              تغییر رمز عبور
            </h1>
            <p className="text-sm text-slate-400">
              برای تغییر رمز، ابتدا شماره موبایل خود را تأیید کنید
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
                key="reset-phone"
                phone={phone}
                setPhone={setPhone}
                mode="signup"
                password=""
                setPassword={() => {}}
                isPasswordValid={true}
                isValid={isPhoneValid}
                loading={sendingResetPhone}
                onSubmit={handlePhoneSubmit}
              />
            )}

            {step === 2 && (
              <OtpStep
                key="reset-otp"
                otp={otp}
                otpRefs={otpRefs}
                isComplete={isComplete}
                loading={verifyingResetOtp}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handlePaste={handlePaste}
                onSubmit={handleOtpSubmit}
              />
            )}

            {step === 3 && (
              <NewPasswordStep
                key="reset-new-password"
                newPassword={newPassword}
                setNewPassword={setNewPassword}
                confirmPassword={confirmPassword}
                setConfirmPassword={setConfirmPassword}
                loading={resettingPassword}
                onSubmit={handlePasswordSubmit}
              />
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

export default ResetPassword;
