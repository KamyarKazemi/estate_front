export interface SignupValues {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export type ClientType = "Customer" | "Agent";
export type Mode = "login" | "signup";

export type Step = 1 | 2 | 3;
