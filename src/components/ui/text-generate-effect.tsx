"use client";
import { useEffect } from "react";
import { motion, stagger, useAnimate } from "framer-motion";

export const TextGenerateEffect = ({
  words,
  className,
  filter = true,
  duration = 0.5,
}: {
  words: string;
  className?: string;
  filter?: boolean;
  duration?: number;
}) => {
  // Split into words, then split each word into characters
  const wordsArray = words.split(" ").map(word => word.split(""));
  
  const container = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.015, delayChildren: 0.1 },
    },
  };

  const child = {
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
    hidden: {
      opacity: 0,
      y: 20,
      transition: {
        type: "spring" as const,
        damping: 12,
        stiffness: 100,
      },
    },
  };

  return (
    <div className={className}>
      <motion.div
        variants={container}
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, margin: "-10%" }}
        className="mt-4"
      >
        <div className={`leading-snug tracking-wide flex flex-wrap ${className?.includes("text-center") ? "justify-center" : ""}`}>
          {wordsArray.map((wordChars, wordIdx) => {
            return (
              <span key={`word-${wordIdx}`} className="inline-block mr-1 whitespace-nowrap">
                {wordChars.map((char, charIdx) => (
                  <motion.span
                    key={`char-${wordIdx}-${charIdx}`}
                    variants={child}
                    className="inline-block"
                  >
                    {char}
                  </motion.span>
                ))}
              </span>
            );
          })}
        </div>
      </motion.div>
    </div>
  );
};
