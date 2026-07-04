import { motion } from "motion/react";
import "./glass.css";

type GlassButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  type?: "button" | "submit" | "reset";
  className?: string;
};

export default function GlassButton({
  children,
  onClick,
  type = "button",
  className = "",
}: GlassButtonProps) {
  return (
    <motion.div
      className={`glass-btn-wrapper  ${className}`}
      whileTap={{ scale: 0.98 }}
    >
      <button type={type} className="glass-btn" onClick={onClick}>
        <span className="glass-btn__label">{children}</span>
      </button>

      <div className="glass-btn-shadow" />
    </motion.div>
  );
}
