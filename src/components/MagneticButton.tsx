"use client";
import { motion, useSpring, useTransform } from "framer-motion";
import { useRef, useState } from "react";

export function MagneticButton({
  children,
  href,
  variant = "primary",
}: {
  children: React.ReactNode;
  href: string;
  variant?: "primary" | "ghost";
}) {
  const ref = useRef<HTMLAnchorElement>(null);
  const [hovered, setHovered] = useState(false);

  const x = useSpring(0, { stiffness: 150, damping: 15 });
  const y = useSpring(0, { stiffness: 150, damping: 15 });

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { left, top, width, height } = ref.current!.getBoundingClientRect();
    const centerX = left + width / 2;
    const centerY = top + height / 2;
    x.set((clientX - centerX) * 0.35);
    y.set((clientY - centerY) * 0.35);
  };

  const handleMouseLeave = () => {
    setHovered(false);
    x.set(0);
    y.set(0);
  };

  return (
    <motion.a
      ref={ref}
      href={href}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={handleMouseLeave}
      style={{ x, y }}
      className={`relative inline-flex items-center gap-3 rounded-full px-10 py-5 font-bold transition-all duration-300 text-sm uppercase tracking-widest ${
        variant === "primary"
          ? "bg-[#FF7A30] text-white shadow-[0_20px_40px_-10px_rgba(255,122,48,0.3)] hover:scale-105 active:scale-95"
          : "border-2 border-[#FF7A30]/30 text-[#FF7A30] hover:bg-[#FF7A30]/5 hover:border-[#FF7A30]/60"
      }`}
    >
      {children}
    </motion.a>
  );
}
