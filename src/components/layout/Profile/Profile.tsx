import { useEffect, useRef, useState } from "react";
import { useDispatch, useSelector } from "react-redux";

import { PhoneStep } from "./profile-components/PhoneStep";
import { OtpStep } from "./profile-components/OtpStep";
import { PersonalInfoStep } from "./profile-components/PersonalInfoStep";
import { StepNavigation } from "./profile-components/StepNavigation";
import { Toggle } from "./ui/Toggle";

import { useOtp } from "./hooks/useOtp";
import { useSignupValidation } from "./hooks/useSignupValidation";

import type { ClientType, Mode, Step, SignupValues } from "./types/types";

import { sendNumberThunk } from "../../../redux/thunks/sendNumberThunk";
import { sendOtpThunk } from "../../../redux/thunks/sendOtpThunk";
import { completeRegister } from "../../../redux/thunks/completeRegisterThunk";
import { resetAuth } from "../../../redux/slices/authSlice";
import { sendNumberLoginThunk } from "../../../redux/thunks/sendNumberLogin";
import { sendOtpLoginThunk } from "../../../redux/thunks/sendOtpLogin";

import type { AppDispatch, RootState } from "../../../redux/store";

function Profile() {
  const dispatch = useDispatch<AppDispatch>();

  const {
    otp_session_token,
    registration_token,
    sendingPhone,
    verifyingOtp,
    completingRegister,
    bootstrappingProfile,
  } = useSelector((state: RootState) => state.auth);

  /* ---------------- نوع کاربر + حالت ---------------- */

  const [clientType, setClientType] = useState<ClientType>("CUSTOMER");
  const [mode, setMode] = useState<Mode>("login");

  /* ---------------- مدیریت مراحل ---------------- */

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
    if (mode === "login") {
      return otp_session_token ? 2 : 1;
    }

    return registration_token ? 3 : otp_session_token ? 2 : 1;
  })();

  useEffect(() => {
    setStep(maxAllowedStep);
  }, [maxAllowedStep]);

  const goToStep = (target: Step) => {
    if (target <= maxAllowedStep) {
      setStep(target);
    }
  };

  /* ---------------- شماره موبایل ---------------- */

  const [phone, setPhone] = useState("");

  const isPhoneValid = /^09\d{9}$/.test(phone);

  const handlePhoneSubmit = async () => {
    if (!isPhoneValid || sendingPhone) return;

    if (mode === "login") {
      await dispatch(sendNumberLoginThunk(phone)).unwrap();
    } else {
      await dispatch(sendNumberThunk(phone)).unwrap();
    }
  };

  /* ---------------- کد تایید ---------------- */

  const {
    otp,
    otpRefs,
    isComplete: isOtpComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
    resetOtp,
  } = useOtp(5);

  const handleOtpSubmit = async () => {
    if (!otp_session_token || !isOtpComplete || verifyingOtp) return;

    const otp_code = otp.join("");

    if (mode === "login") {
      const result = await dispatch(
        sendOtpLoginThunk({
          otp_session_token,
          otp_code,
        }),
      ).unwrap();

      console.log("✅ Login success:", result);

      // 👉 here you normally:
      // - store access token
      // - navigate to dashboard
      // example:
      // navigate("/dashboard")

      return;
    }

    // signup flow
    await dispatch(
      sendOtpThunk({
        otp_session_token,
        otp_code,
      }),
    ).unwrap();
  };

  /* ---------------- اطلاعات ثبت نام ---------------- */

  const [signupValues, setSignupValues] = useState<SignupValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------- اعتبارسنجی ---------------- */

  const { normalizedEmail, isPersonalInfoValid } =
    useSignupValidation(signupValues);

  /* ---------------- تکمیل ثبت نام ---------------- */

  const handleCompleteSignup = async () => {
    if (!registration_token || !isPersonalInfoValid || completingRegister) {
      return;
    }

    await dispatch(
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
  };

  /* ---------------- ریست جریان احراز هویت هنگام تغییر حالت ---------------- */

  const didMountRef = useRef(false);

  useEffect(() => {
    if (!didMountRef.current) {
      didMountRef.current = true;
      return;
    }

    dispatch(resetAuth());
    setStep(1);
    setPhone("");
    resetOtp();
    setSignupValues({
      firstName: "",
      lastName: "",
      email: "",
      password: "",
      confirmPassword: "",
    });
  }, [mode, clientType, dispatch, resetOtp]);

  /* ---------------- گزینه های تاگل ---------------- */

  const clientOptions = [
    { label: "مشتری", value: "CUSTOMER" as ClientType },
    { label: "مشاور", value: "AGENT" as ClientType },
  ];

  const modeOptions = [
    { label: "ورود", value: "login" as Mode },
    { label: "ثبت نام", value: "signup" as Mode },
  ];

  /* ---------------- متن هدر ---------------- */

  const title = mode === "login" ? "ورود به حساب کاربری" : "ایجاد حساب کاربری";

  const subtitle = clientType === "CUSTOMER" ? "پنل کاربران" : "پنل مشاوران";

  /* ---------------- UI ---------------- */

  return (
    <main
      dir="rtl"
      className="min-h-screen bg-slate-950 flex items-center justify-center px-4 py-10"
    >
      <div className="w-full max-w-xl">
        <div
          className="
            bg-slate-900/70 backdrop-blur-xl
            border border-slate-700/50
            rounded-2xl
            shadow-2xl
            p-6 sm:p-8
            space-y-8
          "
        >
          {/* Header */}
          <div className="text-center space-y-2">
            <h1 className="text-2xl font-semibold text-white tracking-tight">
              {title}
            </h1>
            <p className="text-sm text-slate-400">{subtitle}</p>
          </div>

          {/* Toggles */}
          <div className="space-y-4">
            <Toggle
              value={clientType}
              onChange={setClientType}
              options={clientOptions}
            />

            <Toggle value={mode} onChange={setMode} options={modeOptions} />
          </div>

          {/* Step Navigation */}
          <StepNavigation
            steps={steps}
            currentStep={step}
            completion={stepCompletion}
            labels={stepLabels}
            onStepClick={goToStep}
          />

          {/* Step 1 */}
          {step === 1 && (
            <PhoneStep
              phone={phone}
              setPhone={setPhone}
              isValid={isPhoneValid}
              loading={sendingPhone}
              skeletonLoading={bootstrappingProfile}
              onSubmit={handlePhoneSubmit}
            />
          )}

          {/* Step 2 */}
          {step === 2 && (
            <OtpStep
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

          {/* Step 3 */}
          {mode === "signup" && step === 3 && (
            <PersonalInfoStep
              values={signupValues}
              setValues={setSignupValues}
              isValid={isPersonalInfoValid}
              loading={completingRegister}
              skeletonLoading={bootstrappingProfile}
              onSubmit={handleCompleteSignup}
            />
          )}
        </div>
      </div>
    </main>
  );
}

export default Profile;
