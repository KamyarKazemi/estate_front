import { useMemo } from "react";

export type SignupValues = {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
};

type ValidationResult = {
  normalizedEmail: string;
  isEmailValid: boolean;
  isPasswordValid: boolean;
  doPasswordsMatch: boolean;
  isPersonalInfoValid: boolean;
};

const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

export function useSignupValidation(values: SignupValues): ValidationResult {
  const normalizedEmail = useMemo(() => values.email.trim().toLowerCase(), [values.email]);

  const isEmailValid = useMemo(() => emailRegex.test(normalizedEmail), [normalizedEmail]);

  const isPasswordValid = useMemo(() => passwordRegex.test(values.password), [values.password]);

  const doPasswordsMatch = useMemo(() => {
    if (!values.password || !values.confirmPassword) return false;
    return values.password === values.confirmPassword;
  }, [values.password, values.confirmPassword]);

  const isPersonalInfoValid = useMemo(
    () =>
      values.firstName.trim().length > 1 &&
      values.lastName.trim().length > 1 &&
      isEmailValid &&
      isPasswordValid &&
      doPasswordsMatch,
    [values.firstName, values.lastName, isEmailValid, isPasswordValid, doPasswordsMatch],
  );

  return { normalizedEmail, isEmailValid, isPasswordValid, doPasswordsMatch, isPersonalInfoValid };
}
