import { useCallback, useRef, useState } from "react";
import type { ClipboardEvent, KeyboardEvent } from "react";

export function useOtp(length: number) {
  const [otp, setOtp] = useState<string[]>(Array.from({ length }, () => ""));
  const otpRefs = useRef<Array<HTMLInputElement | null>>([]);

  const focusOtpIndex = useCallback((idx: number) => {
    const el = otpRefs.current[idx];
    el?.focus();
    el?.select?.();
  }, []);

  const sanitizeDigit = useCallback((value: string) => value.replace(/\D/g, "").slice(-1), []);

  const setOtpAt = useCallback((idx: number, value: string) => {
    setOtp((prev) => {
      const next = [...prev];
      next[idx] = value;
      return next;
    });
  }, []);

  const resetOtp = useCallback(() => {
    setOtp(Array.from({ length }, () => ""));
    focusOtpIndex(0);
  }, [focusOtpIndex, length]);

  const handleChange = useCallback(
    (idx: number, value: string) => {
      const digit = sanitizeDigit(value);
      if (!digit) { setOtpAt(idx, ""); return; }
      setOtpAt(idx, digit);
      if (idx < length - 1) focusOtpIndex(idx + 1);
    },
    [focusOtpIndex, length, sanitizeDigit, setOtpAt],
  );

  const handleKeyDown = useCallback(
    (idx: number, e: KeyboardEvent<HTMLInputElement>) => {
      const key = e.key;
      if (key === "Backspace") {
        if (otp[idx]) { e.preventDefault(); setOtpAt(idx, ""); return; }
        if (idx > 0) { e.preventDefault(); setOtpAt(idx - 1, ""); focusOtpIndex(idx - 1); }
        return;
      }
      if (key === "ArrowLeft") { e.preventDefault(); if (idx > 0) focusOtpIndex(idx - 1); return; }
      if (key === "ArrowRight") { e.preventDefault(); if (idx < length - 1) focusOtpIndex(idx + 1); return; }
      if (key === "Home") { e.preventDefault(); focusOtpIndex(0); return; }
      if (key === "End") { e.preventDefault(); focusOtpIndex(length - 1); return; }
      if (key.length === 1 && !/^\d$/.test(key)) e.preventDefault();
    },
    [focusOtpIndex, length, otp, setOtpAt],
  );

  const handlePaste = useCallback(
    (e: ClipboardEvent<HTMLInputElement>) => {
      const text = e.clipboardData.getData("text");
      const digits = text.replace(/\D/g, "").slice(0, length);
      if (!digits) return;
      e.preventDefault();
      const next = Array.from({ length }, (_, i) => digits[i] ?? "");
      setOtp(next);
      focusOtpIndex(Math.min(digits.length, length) - 1);
    },
    [focusOtpIndex, length],
  );

  const isComplete = otp.every((digit) => /^\d$/.test(digit));

  return { otp, otpRefs, isComplete, handleChange, handleKeyDown, handlePaste, resetOtp };
}
