"use client";

import { useRef } from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const HorizontalScrollCarousel = ({ children }: { children: React.ReactNode }) => {
  const targetRef = useRef<HTMLDivElement | null>(null);
  const { scrollYProgress } = useScroll({
    target: targetRef,
  });

  const x = useTransform(scrollYProgress, [0, 1], ["0%", "-66.66%"]);

  return (
    <section ref={targetRef} className="relative h-[300vh] bg-transparent">
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        <motion.div style={{ x }} className="flex gap-24 px-12 pb-24 items-center h-full w-[300vw]">
          {children}
        </motion.div>
      </div>
    </section>
  );
};
