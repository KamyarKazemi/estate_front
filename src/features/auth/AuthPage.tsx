import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Navigate, useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "motion/react";

import { PhoneStep } from "./components/PhoneStep";
import { OtpStep } from "./components/OtpStep";
import { PersonalInfoStep } from "./components/PersonalInfoStep";
import { StepNavigation } from "./components/StepNavigation";
import { Toggle } from "./ui/Toggle";

import { useOtp } from "./hooks/useOtp";
import { useSignupValidation, passwordRegex } from "./hooks/useSignupValidation";

import type { ClientType, Mode, Step, SignupValues } from "./types";

import { sendNumberThunk } from "../../store/thunks/sendNumberThunk";
import { sendOtpThunk } from "../../store/thunks/sendOtpThunk";
import { completeRegister } from "../../store/thunks/completeRegisterThunk";
import { resetAuthFlow } from "../../store/authSlice";
import { sendNumberLoginThunk } from "../../store/thunks/sendNumberLoginThunk";
import { sendOtpLoginThunk } from "../../store/thunks/sendOtpLoginThunk";

import type { AppDispatch, RootState } from "../../store";

function AuthPage() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();

  const {
    otp_session_token,
    registration_token,
    sendingPhone,
    verifyingOtp,
    completingRegister,
    bootstrappingProfile,
    access_token,
    error,
  } = useSelector((state: RootState) => state.auth);

  const [clientType, setClientType] = useState<ClientType>("CUSTOMER");
  const [mode, setMode] = useState<Mode>("login");
  const [step, setStep] = useState<Step>(1);

  const steps: Step[] = mode === "signup" ? [1, 2, 3] : [1, 2];

  const stepLabels: Record<Step, string> = {
    1: "شماره موبایل",
    2: "کد تأیید",
    3: "اطلاعات حساب",
  };

  const stepCompletion: Record<Step, boolean> = {
    1: !!otp_session_token,
    2: mode === "login" ? !!otp_session_token : !!registration_token,
    3: false,
  };

  const maxAllowedStep: Step = (() => {
    if (mode === "login") return otp_session_token ? 2 : 1;
    return registration_token ? 3 : otp_session_token ? 2 : 1;
  })();

  useEffect(() => {
    setStep(maxAllowedStep);
  }, [maxAllowedStep]);

  const goToStep = (target: Step) => {
    if (target <= maxAllowedStep) setStep(target);
  };

  /* -------- step 1: phone -------- */
  const [phone, setPhone] = useState("");
  const [loginPassword, setLoginPassword] = useState("");

  const isPhoneValid = /^09\d{9}$/.test(phone);
  const isLoginPasswordValid = mode !== "login" || passwordRegex.test(loginPassword);
  const isPhoneFormValid = isPhoneValid && isLoginPasswordValid;

  const handlePhoneSubmit = async () => {
    if (!isPhoneFormValid || sendingPhone) return;
    try {
      if (mode === "login") {
        await dispatch(sendNumberLoginThunk({ phone_number: phone, password: loginPassword })).unwrap();
      } else {
        await dispatch(sendNumberThunk(phone)).unwrap();
      }
    } catch {
      // error lands in state.error via Redux
    }
  };

  /* -------- step 2: otp -------- */
  const { otp, otpRefs, isComplete: isOtpComplete, handleChange, handleKeyDown, handlePaste, resetOtp } = useOtp(5);

  const handleOtpSubmit = async () => {
    if (!otp_session_token || !isOtpComplete || verifyingOtp) return;
    const otp_code = otp.join("");
    try {
      if (mode === "login") {
        await dispatch(sendOtpLoginThunk({ otp_session_token, otp_code })).unwrap();
        navigate("/dashboard");
        return;
      }
      await dispatch(sendOtpThunk({ otp_session_token, otp_code })).unwrap();
    } catch {
      // error lands in state.error via Redux
    }
  };

  /* -------- step 3: personal info -------- */
  const [signupValues, setSignupValues] = useState<SignupValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  const { normalizedEmail, isPersonalInfoValid } = useSignupValidation(signupValues);

  const handleCompleteSignup = async () => {
    if (!registration_token || !isPersonalInfoValid || completingRegister) return;
    try {
      const result = await dispatch(
        completeRegister({
          registration_token,
          first_name: signupValues.firstName,
          last_name: signupValues.lastName,
          email: normalizedEmail,
          role: clientType,
          password: signupValues.password,
          confirm_password: signupValues.confirmPassword,
        }),
      ).unwrap();

      if (result.access_token) {
        navigate("/dashboard");
        return;
      }
      setMode("login");
      setStep(1);
    } catch {
      // error lands in state.error via Redux
    }
  };

  /* -------- reset flow on mode/clientType change -------- */
  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) { didMountRef.current = true; return; }
    dispatch(resetAuthFlow());
    setStep(1);
    setPhone("");
    setLoginPassword("");
    resetOtp();
    setSignupValues({ firstName: "", lastName: "", email: "", password: "", confirmPassword: "" });
  }, [mode, clientType, dispatch, resetOtp]);

  const clientOptions = [
    { label: "مشتری", value: "CUSTOMER" as ClientType },
    { label: "مشاور", value: "AGENT" as ClientType },
  ];

  const modeOptions = [
    { label: "ورود", value: "login" as Mode },
    { label: "ثبت نام", value: "signup" as Mode },
  ];

  const title = mode === "login" ? "ورود به حساب کاربری" : "ایجاد حساب کاربری";
  const subtitle = clientType === "CUSTOMER" ? "پنل کاربران" : "پنل مشاوران";

  if (access_token) return <Navigate to="/dashboard" replace />;

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
            transition-colors duration-500 hover:border-white/20
            p-5 sm:p-8 md:p-10 space-y-6 sm:space-y-8
          "
        >
          <div className="text-center space-y-1.5 sm:space-y-2">
            <AnimatePresence mode="wait">
              <motion.h1
                key={title}
                initial={{ opacity: 0, y: -6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 6 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-xl sm:text-2xl font-semibold text-white tracking-tight"
              >
                {title}
              </motion.h1>
            </AnimatePresence>
            <AnimatePresence mode="wait">
              <motion.p
                key={subtitle}
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: 4 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className="text-sm text-slate-400"
              >
                {subtitle}
              </motion.p>
            </AnimatePresence>
          </div>

          <div className="space-y-3 sm:space-y-4">
            <Toggle value={clientType} onChange={setClientType} options={clientOptions} />
            <Toggle value={mode} onChange={setMode} options={modeOptions} />
          </div>

          <StepNavigation
            steps={steps}
            currentStep={step}
            completion={stepCompletion}
            labels={stepLabels}
            onStepClick={goToStep}
          />

          <AnimatePresence mode="wait">
            {step === 1 && (
              <PhoneStep
                key="phone-step"
                phone={phone}
                setPhone={setPhone}
                mode={mode}
                password={loginPassword}
                setPassword={setLoginPassword}
                isPasswordValid={isLoginPasswordValid}
                isValid={isPhoneFormValid}
                loading={sendingPhone}
                skeletonLoading={bootstrappingProfile}
                onSubmit={handlePhoneSubmit}
              />
            )}
            {step === 2 && (
              <OtpStep
                key="otp-step"
                otp={otp}
                otpRefs={otpRefs}
                isComplete={isOtpComplete}
                loading={verifyingOtp}
                skeletonLoading={bootstrappingProfile}
                handleChange={handleChange}
                handleKeyDown={handleKeyDown}
                handlePaste={handlePaste}
                onSubmit={handleOtpSubmit}
              />
            )}
            {mode === "signup" && step === 3 && (
              <PersonalInfoStep
                key="personal-step"
                values={signupValues}
                setValues={setSignupValues}
                isValid={isPersonalInfoValid}
                loading={completingRegister}
                skeletonLoading={bootstrappingProfile}
                onSubmit={handleCompleteSignup}
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
        </motion.div>
      </div>
    </main>
  );
}

export default AuthPage;
