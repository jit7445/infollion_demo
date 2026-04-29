"use client";

import React, { useRef, useState } from "react";
import { motion } from "motion/react";

interface GlowCardProps {
  children: React.ReactNode;
  className?: string;
}

export function GlowCard({ children, className = "" }: GlowCardProps) {
  const [isHovered, setIsHovered] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!containerRef.current) return;
    const rect = containerRef.current.getBoundingClientRect();
    setMousePos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top,
    });
  };

  return (
    <motion.div
      ref={containerRef}
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      className={`relative group rounded-[2.5rem] overflow-hidden bg-[var(--card-bg)] border border-[var(--border)] backdrop-blur-xl p-8 transition-all duration-500 hover:border-orange-500/30 hover:bg-[var(--bg2)] shadow-2xl ${className}`}
    >
      {/* Animated Border Trace */}
      <div className="absolute inset-0 pointer-events-none">
        <svg className="w-full h-full" preserveAspectRatio="none">
          <motion.rect
            width="100%"
            height="100%"
            rx="38"
            fill="none"
            stroke="url(#glowGradient)"
            strokeWidth="2"
            strokeDasharray="80 200"
            animate={{
              strokeDashoffset: isHovered ? [0, -400] : 0,
              opacity: isHovered ? 1 : 0
            }}
            transition={{
              strokeDashoffset: { duration: 3, repeat: Infinity, ease: "linear" },
              opacity: { duration: 0.3 }
            }}
          />
          <defs>
            <linearGradient id="glowGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#ec9324" />
              <stop offset="50%" stopColor="#ff7e32" />
              <stop offset="100%" stopColor="#ec9324" />
            </linearGradient>
          </defs>
        </svg>
      </div>

      {/* Radial Hover Glow (Spotlight) */}
      <div
        className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
        style={{
          background: `radial-gradient(400px circle at ${mousePos.x}px ${mousePos.y}px, rgba(236,147,36,0.1), transparent)`
        }}
      />

      <div className="relative z-10 h-full">{children}</div>
    </motion.div>
  );
}
