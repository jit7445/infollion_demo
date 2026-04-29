"use client";

import { useEffect, useRef } from "react";

export default function ScrollAnimations() {
  const glowRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    /* ── Intersection Observer for all reveal elements ── */
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
          }
        });
      },
      { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }
    );

    const targets = document.querySelectorAll(
      ".reveal, .reveal-left, .reveal-right, .reveal-scale, .reveal-flip-up"
    );
    targets.forEach((el) => observer.observe(el));

    /* ── Cursor glow follow ── */
    const glow = glowRef.current;
    const onMouseMove = (e: MouseEvent) => {
      if (!glow) return;
      glow.style.left = `${e.clientX}px`;
      glow.style.top  = `${e.clientY}px`;
    };
    window.addEventListener("mousemove", onMouseMove, { passive: true });

    /* ── Navbar shadow on scroll ── */
    const nav = document.querySelector("nav");
    const onScroll = () => {
      if (!nav) return;
      if (window.scrollY > 20) {
        nav.classList.add("nav-scrolled");
      } else {
        nav.classList.remove("nav-scrolled");
      }
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    /* ── Re-observe on DOM mutations (for dynamic content) ── */
    const mutObs = new MutationObserver(() => {
      const newTargets = document.querySelectorAll(
        ".reveal:not(.is-visible), .reveal-left:not(.is-visible), .reveal-right:not(.is-visible), .reveal-scale:not(.is-visible), .reveal-flip-up:not(.is-visible)"
      );
      newTargets.forEach((el) => observer.observe(el));
    });
    mutObs.observe(document.body, { childList: true, subtree: true });

    return () => {
      observer.disconnect();
      mutObs.disconnect();
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  return (
    <div
      ref={glowRef}
      className="cursor-glow hidden lg:block"
      aria-hidden="true"
    />
  );
}
