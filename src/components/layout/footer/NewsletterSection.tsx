import { useState } from "react";
import { FaArrowLeft } from "react-icons/fa6";

interface NewsletterSectionProps {
  onFocusChange: (focused: boolean) => void;
}

export default function NewsletterSection({
  onFocusChange,
}: NewsletterSectionProps) {
  const [isFocused, setIsFocused] = useState(false);
  const [email, setEmail] = useState("");

  const handleFocus = () => {
    setIsFocused(true);
    onFocusChange(true);
  };

  const handleBlur = () => {
    setIsFocused(false);
    onFocusChange(false);
  };

  return (
    <div className="flex flex-col gap-3 group/news">
      <label className="text-slate-300 text-sm font-medium transition-colors group-hover/news:text-sky-400">
        عضویت در خبرنامه
      </label>
      <div
        className={`
          flex items-center gap-2 p-1.5 rounded-2xl bg-white/5 border transition-all duration-500
          ${isFocused ? "border-sky-500/50 ring-4 ring-sky-500/10 bg-slate-800/40" : "border-white/10"}
        `}
      >
        <input
          type="email"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          placeholder="ایمیل خود را وارد کنید..."
          className="flex-1 bg-transparent px-4 py-2 text-white outline-none text-sm placeholder:text-slate-600"
          onFocus={handleFocus}
          onBlur={handleBlur}
        />
        <button
          className={`
            relative overflow-hidden p-3 rounded-xl transition-all duration-300 active:scale-90
            ${email.includes("@") ? "bg-sky-500 text-white shadow-[0_0_20px_rgba(14,165,233,0.4)]" : "bg-white/5 text-slate-500"}
          `}
        >
          <FaArrowLeft
            className={`transition-transform duration-300 ${isFocused ? "-translate-x-1" : ""}`}
          />

          {/* Shine overlay */}
          <div className="absolute inset-0 bg-linear-to-r from-transparent via-white/20 to-transparent -translate-x-full hover:animate-[shimmer_1.5s_infinite] pointer-events-none" />
        </button>
      </div>

      <style>{`
        @keyframes shimmer {
          100% { transform: translateX(100%); }
        }
      `}</style>
    </div>
  );
}
