import type { ClientType, Mode } from "../types/types";

type SignupValidationInput = {
  mode: Mode;
  clientType: ClientType;
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
  role: ClientType | "";
};

export function useSignupValidation({
  mode,
  clientType,
  firstName,
  lastName,
  email,
  password,
  confirmPassword,
  role,
}: SignupValidationInput) {
  const normalizedEmail = email.trim().toLowerCase();

  const isEmailValid = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(normalizedEmail);

  const isPasswordValid = password.length >= 8;

  const doPasswordsMatch =
    password.length > 0 &&
    confirmPassword.length > 0 &&
    password === confirmPassword;

  const isPersonalInfoValid =
    mode === "signup" &&
    clientType === "Customer" &&
    firstName.trim().length >= 2 &&
    lastName.trim().length >= 2 &&
    isEmailValid &&
    role !== "" &&
    isPasswordValid &&
    doPasswordsMatch;

  return {
    normalizedEmail,
    isEmailValid,
    isPasswordValid,
    doPasswordsMatch,
    isPersonalInfoValid,
  };
}
