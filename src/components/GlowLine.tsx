"use client";

import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useEffect, useRef, useState } from "react";

export const GlowLine = () => {
  const containerRef = useRef<HTMLDivElement>(null);
  const [isHovered, setIsHovered] = useState(false);
  const mouseX = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    mouseX.set(e.clientX - rect.left);
  };

  const smoothMouseX = useSpring(mouseX, { stiffness: 300, damping: 30 });
  
  const gradientCenter = useTransform(smoothMouseX, (val) => `${val}px`);

  return (
    <div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className="absolute top-12 left-0 w-full h-[1px] hidden md:block group cursor-crosshair"
    >
      {/* Base Line */}
      <div className="absolute inset-0 bg-white/10" />
      
      {/* Glow Effect */}
      <motion.div
        className="absolute inset-0 z-10"
        style={{
          background: useTransform(
            smoothMouseX,
            (x) => `radial-gradient(150px circle at ${x}px 50%, #FF7A30 0%, transparent 100%)`
          ),
          opacity: isHovered ? 1 : 0,
        }}
        transition={{ duration: 0.3 }}
      />

      {/* Intense Center Point */}
      <motion.div
        className="absolute top-1/2 -translate-y-1/2 w-40 h-[2px] blur-[2px] z-20"
        style={{
          left: useTransform(smoothMouseX, (x) => x - 80),
          background: "linear-gradient(90deg, transparent, #FF7A30, transparent)",
          opacity: isHovered ? 1 : 0,
        }}
      />
    </div>
  );
};
