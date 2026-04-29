"use client";
import { motion } from "framer-motion";

export function BackgroundParticles() {
  return (
    <div className="pointer-events-none absolute inset-0 overflow-hidden">
      {/* Floating Particles */}
      {Array.from({ length: 40 }).map((_, i) => (
        <motion.span
          key={i}
          className="absolute h-1.5 w-1.5 rounded-full bg-[#FF7A30]/30"
          style={{ 
            left: `${(i * 37.1) % 100}%`, 
            top: `${(i * 53.7) % 100}%` 
          }}
          animate={{ 
            y: [0, -30, 0], 
            x: [0, (i % 2 === 0 ? 15 : -15), 0],
            opacity: [0.1, 0.6, 0.1],
            scale: [1, 1.2, 1]
          }}
          transition={{ 
            duration: 5 + (i % 7), 
            repeat: Infinity, 
            delay: i * 0.1,
            ease: "easeInOut"
          }}
        />
      ))}

    </div>
  );
}
