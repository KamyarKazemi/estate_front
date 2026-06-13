import type { ChangeEvent, FormEvent } from "react";

export type PhoneStepProps = {
  phone: string;
  setPhone: (v: string) => void;
  isValid: boolean;
  loading: boolean;
  onSubmit: () => Promise<void>;
};

export function PhoneStep({
  phone,
  setPhone,
  isValid,
  loading,
  onSubmit,
}: PhoneStepProps) {
  const handleChange = (e: ChangeEvent<HTMLInputElement>) => {
    // Keep only digits
    const digitsOnly = e.target.value.replace(/[^\d]/g, "");
    setPhone(digitsOnly);
  };

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    if (!isValid || loading) return;

    await onSubmit();
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      {/* Phone Label */}
      <div>
        <label className="block text-sm font-medium mb-1">Phone Number</label>

        <input
          type="tel"
          value={phone}
          onChange={handleChange}
          placeholder="09123456789"
          className="w-full border rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
        />

        {/* Validation hint */}
        {!isValid && phone.length > 0 && (
          <p className="text-sm text-red-500 mt-1">
            Phone number must be 11 digits.
          </p>
        )}
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
        {loading ? "Sending..." : "Send Verification Code"}
      </button>
    </form>
  );
}
