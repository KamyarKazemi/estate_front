import { useEffect, useRef, useState } from "react";
import FooterColumn from "./FooterColumn";
import NewsletterSection from "./NewsletterSection";

const footerLinks = [
  {
    title: "املاک",
    links: ["جستجوی ملک", "مشاوران ما", "پروژه‌های جدید", "فروش فوری"],
  },
  {
    title: "دسترسی سریع",
    links: ["پنل کاربری", "تماس با ما", "درباره ما", "قوانین و مقررات"],
  },
  {
    title: "خدمات",
    links: ["آنالیز قیمت", "مشاوره حقوقی", "وام مسکن", "بیمه ملک"],
  },
];

export default function Footer() {
  const [isVisible, setIsVisible] = useState(false);
  const [isExpanded, setIsExpanded] = useState(false); // Controls the global morphing state
  const footerRef = useRef<HTMLElement>(null);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) setIsVisible(true);
      },
      { threshold: 0.1 },
    );

    if (footerRef.current) observer.observe(footerRef.current);
    return () => observer.disconnect();
  }, []);

  return (
    <footer
      ref={footerRef}
      className="w-full px-4 py-8 mt-12 transition-all duration-1000 ease-out"
      dir="rtl"
      style={{
        opacity: isVisible ? 1 : 0,
        transform: isVisible ? "translateY(0)" : "translateY(40px)",
      }}
    >
      <div
        className={`
          group relative bg-slate-900/60 backdrop-blur-xl border border-white/10 
          rounded-3xl overflow-hidden
          transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${
            isExpanded
              ? "p-10 md:p-16 shadow-[0_25px_60px_-10px_rgba(14,165,233,0.15)] border-white/20 scale-[1.01]"
              : "p-8 md:p-12 shadow-[0_10px_40px_-10px_rgba(0,0,0,0.5)]"
          }
        `}
      >
        {/* Ambient background glow that expands when footer is in active state */}
        <div
          className={`
            absolute -top-24 -right-24 bg-sky-500/10 blur-[100px] rounded-full 
            pointer-events-none transition-all duration-700
            ${isExpanded ? "w-96 h-96 opacity-100 bg-sky-500/15" : "w-64 h-64 opacity-0 group-hover:opacity-100"}
          `}
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 mb-12 relative z-10">
          {/* Left Side: Brand & Newsletter */}
          <div className="lg:col-span-5 flex flex-col gap-6">
            <h3 className="text-2xl font-bold text-white tracking-tight hover:tracking-widest transition-all duration-500 cursor-default">
              املاک <span className="text-sky-400">لوکس</span>
            </h3>
            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              بهترین مرجع برای جستجو و آنالیز املاک لوکس در سراسر کشور. با ما در
              ارتباط باشید.
            </p>
            {/* We pass the focus setter down to trigger the container scaling */}
            <NewsletterSection onFocusChange={setIsExpanded} />
          </div>

          {/* Right Side: Navigation Links */}
          <div className="lg:col-span-7 grid grid-cols-2 md:grid-cols-3 gap-8">
            {footerLinks.map((section, idx) => (
              <div
                key={section.title}
                className="transition-all duration-700"
                style={{
                  transitionDelay: `${idx * 150}ms`,
                  opacity: isVisible ? 1 : 0,
                  transform: isVisible ? "translateX(0)" : "translateX(-20px)",
                }}
              >
                <FooterColumn
                  title={section.title}
                  links={section.links}
                  onColumnClick={setIsExpanded}
                />
              </div>
            ))}
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-center gap-4 text-slate-500 text-xs relative z-10">
          <p className="hover:text-slate-300 transition-colors cursor-default">
            © ۲۰۲۶ تمامی حقوق برای املاک لوکس محفوظ است.
          </p>
          <div className="flex gap-6">
            {["حریم خصوصی", "شرایط استفاده"].map((item) => (
              <a
                key={item}
                href="#"
                className="relative hover:text-white transition-colors group/link"
              >
                {item}
                <span className="absolute -bottom-1 right-0 w-0 h-px bg-sky-500 transition-all duration-300 group-hover/link:w-full" />
              </a>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
