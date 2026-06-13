import { useEffect, useState } from "react";
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

import type { AppDispatch, RootState } from "../../../redux/store";

function Profile() {
  const dispatch = useDispatch<AppDispatch>();

  const { otp_session_token, registration_token, loading } = useSelector(
    (state: RootState) => state.auth,
  );

  /* ---------------- CLIENT + MODE ---------------- */

  const [clientType, setClientType] = useState<ClientType>("Customer");
  const [mode, setMode] = useState<Mode>("login");

  /* ---------------- STEP ---------------- */

  const [step, setStep] = useState<Step>(1);

  const steps: Step[] = [1, 2, 3];

  const stepLabels: Record<Step, string> = {
    1: "Phone",
    2: "Verification",
    3: "Profile",
  };

  const stepCompletion: Record<Step, boolean> = {
    1: !!otp_session_token,
    2: !!registration_token,
    3: false,
  };

  const maxAllowedStep: Step = registration_token
    ? 3
    : otp_session_token
      ? 2
      : 1;

  useEffect(() => {
    setStep(maxAllowedStep);
  }, [maxAllowedStep]);

  const goToStep = (target: Step) => {
    if (target <= maxAllowedStep) setStep(target);
  };

  /* ---------------- PHONE ---------------- */

  const [phone, setPhone] = useState("");

  const isPhoneValid = phone.length === 11;

  const handlePhoneSubmit = async () => {
    await dispatch(sendNumberThunk(phone)).unwrap();
  };

  /* ---------------- OTP ---------------- */

  const {
    otp,
    otpRefs,
    isComplete: isOtpComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
  } = useOtp(6);

  const handleOtpSubmit = async () => {
    const code = otp.join("");

    await dispatch(
      sendOtpThunk({
        otp_session_token,
        code,
      }),
    ).unwrap();
  };

  /* ---------------- SIGNUP VALUES ---------------- */

  const [signupValues, setSignupValues] = useState<SignupValues>({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
  });

  /* ---------------- VALIDATION ---------------- */

  const {
    normalizedEmail,
    isEmailValid,
    isPasswordValid,
    doPasswordsMatch,
    isPersonalInfoValid,
  } = useSignupValidation({
    mode,
    clientType,
    firstName: signupValues.firstName,
    lastName: signupValues.lastName,
    email: signupValues.email,
    password: signupValues.password,
    confirmPassword: signupValues.confirmPassword,
    role: clientType,
  });

  /* ---------------- COMPLETE REGISTER ---------------- */

  const handleCompleteSignup = async () => {
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

  /* ---------------- TOGGLE OPTIONS ---------------- */

  const clientOptions = [
    { label: "Customer", value: "Customer" as ClientType },
    { label: "Agent", value: "Agent" as ClientType },
  ];

  const modeOptions = [
    { label: "Login", value: "login" as Mode },
    { label: "Signup", value: "signup" as Mode },
  ];

  /* ---------------- RENDER ---------------- */

  return (
    <div className="max-w-md mx-auto p-6 space-y-6">
      {/* Client Type */}
      <Toggle
        value={clientType}
        onChange={setClientType}
        options={clientOptions}
      />

      {/* Mode */}
      <Toggle value={mode} onChange={setMode} options={modeOptions} />

      {/* Step Header */}
      <h2 className="text-xl font-semibold text-center">
        Account Verification
      </h2>

      {/* Step Navigation */}
      <StepNavigation
        steps={steps}
        currentStep={step}
        completion={stepCompletion}
        labels={stepLabels}
        onStepClick={goToStep}
      />

      {/* STEP 1 */}
      {step === 1 && (
        <PhoneStep
          phone={phone}
          setPhone={setPhone}
          isValid={isPhoneValid}
          loading={loading}
          onSubmit={handlePhoneSubmit}
        />
      )}

      {/* STEP 2 */}
      {step === 2 && (
        <OtpStep
          otp={otp}
          otpRefs={otpRefs}
          isComplete={isOtpComplete}
          loading={loading}
          handleChange={handleChange}
          handleKeyDown={handleKeyDown}
          handlePaste={handlePaste}
          onSubmit={handleOtpSubmit}
        />
      )}

      {/* STEP 3 */}
      {step === 3 && (
        <PersonalInfoStep
          values={signupValues}
          setValues={setSignupValues}
          isValid={isPersonalInfoValid}
          loading={loading}
          onSubmit={handleCompleteSignup}
        />
      )}
    </div>
  );
}

export default Profile;
