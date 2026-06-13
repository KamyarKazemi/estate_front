import { useRef, useState } from "react";
import type { KeyboardEvent, ClipboardEvent } from "react";

export function useOtp(length: number) {
  const [otp, setOtp] = useState<string[]>(Array.from({ length }, () => ""));

  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusOtpIndex = (idx: number) => {
    const el = otpRefs.current[idx];
    el?.focus();
    el?.select?.();
  };

  const setOtpAt = (idx: number, value: string) => {
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  };

  const handleChange = (idx: number, value: string) => {
    const v = value.replace(/[^\d]/g, "");

    if (!v) {
      setOtpAt(idx, "");
      return;
    }

    const digit = v.slice(-1);
    setOtpAt(idx, digit);

    if (idx < length - 1) {
      focusOtpIndex(idx + 1);
    }
  };

  const handleKeyDown = (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
    const key = e.key;

    if (key === "Backspace") {
      if (otp[idx]) {
        e.preventDefault();
        setOtpAt(idx, "");
        return;
      }

      if (idx > 0) {
        e.preventDefault();
        setOtpAt(idx - 1, "");
        focusOtpIndex(idx - 1);
      }

      return;
    }

    if (key === "ArrowLeft") {
      e.preventDefault();
      if (idx > 0) focusOtpIndex(idx - 1);
      return;
    }

    if (key === "ArrowRight") {
      e.preventDefault();
      if (idx < length - 1) focusOtpIndex(idx + 1);
      return;
    }

    if (key.length === 1 && !/^\d$/.test(key)) {
      e.preventDefault();
    }
  };

  const handlePaste = (e: ClipboardEvent<HTMLInputElement>) => {
    const text = e.clipboardData.getData("text");
    const digits = text.replace(/[^\d]/g, "").slice(0, length);

    if (!digits) return;

    e.preventDefault();

    const next = Array.from({ length }, (_, i) => digits[i] ?? "");
    setOtp(next);

    const lastFilled = Math.min(digits.length, length) - 1;

    if (lastFilled >= 0) {
      focusOtpIndex(lastFilled);
    }
  };

  const isComplete = otp.every((d) => d.length === 1 && /^\d$/.test(d));

  return {
    otp,
    otpRefs,
    isComplete,
    handleChange,
    handleKeyDown,
    handlePaste,
    setOtp,
  };
}
