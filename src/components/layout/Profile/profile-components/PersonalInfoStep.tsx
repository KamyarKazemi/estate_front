import React from "react";
import type { SignupValues } from "../types/types";

type PersonalInfoStepProps = {
  values: SignupValues;
  setValues: React.Dispatch<React.SetStateAction<SignupValues>>;
  isValid: boolean;
  loading: boolean;
  onSubmit: () => Promise<void>;
};

export function PersonalInfoStep({
  values,
  setValues,
  isValid,
  loading,
  onSubmit,
}: PersonalInfoStepProps) {
  const handleChange =
    (field: keyof SignupValues) => (e: React.ChangeEvent<HTMLInputElement>) => {
      setValues((prev) => ({
        ...prev,
        [field]: e.target.value,
      }));
    };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* First Name */}
      <div>
        <label className="block text-sm font-medium mb-1">First Name</label>
        <input
          type="text"
          value={values.firstName}
          onChange={handleChange("firstName")}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="John"
        />
      </div>

      {/* Last Name */}
      <div>
        <label className="block text-sm font-medium mb-1">Last Name</label>
        <input
          type="text"
          value={values.lastName}
          onChange={handleChange("lastName")}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="Doe"
        />
      </div>

      {/* Email */}
      <div>
        <label className="block text-sm font-medium mb-1">Email</label>
        <input
          type="email"
          value={values.email}
          onChange={handleChange("email")}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="john@example.com"
        />
      </div>

      {/* Password */}
      <div>
        <label className="block text-sm font-medium mb-1">Password</label>
        <input
          type="password"
          value={values.password}
          onChange={handleChange("password")}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {/* Confirm Password */}
      <div>
        <label className="block text-sm font-medium mb-1">
          Confirm Password
        </label>
        <input
          type="password"
          value={values.confirmPassword}
          onChange={handleChange("confirmPassword")}
          className="w-full border rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:outline-none"
          placeholder="••••••••"
        />
      </div>

      {/* Submit Button */}
      <button
        type="submit"
        disabled={!isValid || loading}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          !isValid || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Creating Account..." : "Complete Registration"}
      </button>
    </form>
  );
}
