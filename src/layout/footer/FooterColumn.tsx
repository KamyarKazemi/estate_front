import { useState } from "react";

interface FooterColumnProps {
  title: string;
  links: string[];
  onColumnClick: (active: boolean) => void;
}

export default function FooterColumn({
  title,
  links,
  onColumnClick,
}: FooterColumnProps) {
  const [isActive, setIsActive] = useState(false);

  const handleToggle = () => {
    const nextState = !isActive;
    setIsActive(nextState);
    onColumnClick(nextState); // Alerts parent to shift global container padding
  };

  return (
    <div className="flex flex-col gap-4 group/col">
      <h4
        onClick={handleToggle}
        className={`
          text-white font-semibold text-sm tracking-wide cursor-pointer select-none
          border-r-2 transition-all duration-300 ease-out
          ${isActive ? "border-sky-400 pr-3.5" : "border-sky-500/0 pr-0 group-hover/col:border-sky-500 group-hover/col:pr-3.5"}
        `}
      >
        {title}
      </h4>
      <ul
        className={`
          flex flex-col transition-all duration-300 ease-[cubic-bezier(0.16,1,0.3,1)]
          ${isActive ? "gap-3.5 translate-x-1" : "gap-2"}
        `}
      >
        {links.map((link) => (
          <li
            key={link}
            className="transform transition-transform duration-300 hover:-translate-x-2"
          >
            <a
              href="#"
              className="text-slate-400 hover:text-sky-400 transition-colors duration-200 text-sm flex items-center gap-2"
            >
              <span className="w-1.5 h-1.5 bg-sky-500 rounded-full opacity-0 scale-0 transition-all duration-300 group-hover/col:opacity-100 group-hover/col:scale-100" />
              {link}
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}
