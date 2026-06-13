import React from "react";

type OtpStepProps = {
  otp: string[];
  otpRefs: React.MutableRefObject<Array<HTMLInputElement | null>>;
  isComplete: boolean;
  loading: boolean;

  handleChange: (idx: number, value: string) => void;
  handleKeyDown: (
    idx: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => void;
  handlePaste: (e: React.ClipboardEvent<HTMLInputElement>) => void;

  onSubmit: () => Promise<void>;
};

export function OtpStep({
  otp,
  otpRefs,
  isComplete,
  loading,
  handleChange,
  handleKeyDown,
  handlePaste,
  onSubmit,
}: OtpStepProps) {
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isComplete || loading) return;

    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {/* Label */}
      <div className="text-center">
        <p className="text-sm text-gray-600">
          Enter the verification code sent to your phone
        </p>
      </div>

      {/* OTP Inputs */}
      <div className="flex justify-center gap-2">
        {otp.map((digit, idx) => (
          <input
            key={idx}
            ref={(el) => {
              otpRefs.current[idx] = el;
            }}
            type="text"
            inputMode="numeric"
            maxLength={1}
            value={digit}
            onChange={(e) => handleChange(idx, e.target.value)}
            onKeyDown={(e) => handleKeyDown(idx, e)}
            onPaste={handlePaste}
            className="
              w-12 h-12 text-center text-lg font-semibold
              border rounded-lg
              focus:outline-none focus:ring-2 focus:ring-blue-500
            "
          />
        ))}
      </div>

      {/* Validation hint */}
      {!isComplete && (
        <p className="text-center text-sm text-gray-500">
          Please enter the full verification code
        </p>
      )}

      {/* Submit button */}
      <button
        type="submit"
        disabled={!isComplete || loading}
        className={`w-full py-2 rounded-lg font-semibold transition ${
          !isComplete || loading
            ? "bg-gray-300 cursor-not-allowed"
            : "bg-blue-600 hover:bg-blue-700 text-white"
        }`}
      >
        {loading ? "Verifying..." : "Verify Code"}
      </button>
    </form>
  );
}
