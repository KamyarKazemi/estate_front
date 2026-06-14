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

const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d).{8,}$/;

/*
Password rule:
- minimum 8 chars
- at least one lowercase
- at least one uppercase
- at least one number
*/

export function useSignupValidation(values: SignupValues): ValidationResult {
  const normalizedEmail = useMemo(() => {
    return values.email.trim().toLowerCase();
  }, [values.email]);

  const isEmailValid = useMemo(() => {
    return emailRegex.test(normalizedEmail);
  }, [normalizedEmail]);

  const isPasswordValid = useMemo(() => {
    return passwordRegex.test(values.password);
  }, [values.password]);

  const doPasswordsMatch = useMemo(() => {
    if (!values.password || !values.confirmPassword) return false;
    return values.password === values.confirmPassword;
  }, [values.password, values.confirmPassword]);

  const isPersonalInfoValid = useMemo(() => {
    return (
      values.firstName.trim().length > 1 &&
      values.lastName.trim().length > 1 &&
      isEmailValid &&
      isPasswordValid &&
      doPasswordsMatch
    );
  }, [
    values.firstName,
    values.lastName,
    isEmailValid,
    isPasswordValid,
    doPasswordsMatch,
  ]);

  return {
    normalizedEmail,
    isEmailValid,
    isPasswordValid,
    doPasswordsMatch,
    isPersonalInfoValid,
  };
}
