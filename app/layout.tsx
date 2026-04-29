"use client";
import { Inter } from "next/font/google";
import "./globals.css";
import Link from "next/link";
import Image from "next/image";
import ScrollAnimations from "@/components/ScrollAnimations";
import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "motion/react";
import { Mail, Phone, MapPin, Linkedin, Twitter, ChevronDown, Sun, Moon } from "lucide-react";

const inter = Inter({ subsets: ["latin"] });

const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "Modes of Engagement", href: "/engagement-mode" },
  { label: "Use Case", href: "/use-case" },
  { label: "Login/Signup", href: "#" },
];

import { ThemeScript } from "./ThemeScript";

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  const [dark, setDark] = useState(true);
  const [scrolled, setScrolled] = useState(false);

  // Sync state with what ThemeScript did
  useEffect(() => {
    const isDark = document.documentElement.classList.contains("dark");
    setDark(isDark);
  }, []);

  const toggleTheme = () => {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    localStorage.setItem("theme", next ? "dark" : "light");
  };

  const [isNavigating, setIsNavigating] = useState(false);
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null);

  // Manual navigation handler
  const handleNavClick = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
    if (href === "/engagement-mode" || href === "/use-case") {
      e.preventDefault();
      window.location.href = href;
    }
  };

  useEffect(() => {
    const handler = () => setScrolled(window.scrollY > 20);
    handler(); // Check on mount
    window.addEventListener("scroll", handler, { passive: true });
    return () => window.removeEventListener("scroll", handler);
  }, []);

  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <ThemeScript />
      </head>
      <body className={`${inter.className} transition-colors duration-400`} style={{ background: "var(--bg)", color: "var(--text)" }}>
        <div className="min-h-screen overflow-x-hidden">
          


          {/* ── Floating Pill Navbar ── */}
          <div className="fixed top-5 left-0 w-full z-[200] flex justify-center px-4">
            <nav
              className={`nav-pill relative flex items-center gap-1 sm:gap-2 px-3 sm:px-6 rounded-full transition-all duration-500 ${
                scrolled 
                  ? "shadow-2xl bg-brand-bg/80 border border-black/10 backdrop-blur-md py-0.5" 
                  : "bg-transparent border-transparent backdrop-blur-none shadow-none py-1 mt-2"
              }`}
              style={{ maxWidth: 840, width: "100%" }}
            >
              {/* Logo */}
              <Link href="/" onClick={(e) => handleNavClick(e, "/")} className="flex items-center mr-2 sm:mr-6 flex-shrink-0 relative z-10">
                <Image
                  src="/images/logo_hd.png"
                  alt="Infollion"
                  width={90}
                  height={28}
                  className="object-contain sm:w-[110px] sm:h-[32px]"
                  priority
                />
              </Link>

              {/* Links */}
              <div className="flex items-center gap-1 sm:gap-2 flex-1 justify-center relative z-10 overflow-x-auto no-scrollbar">
                {NAV_LINKS.map((l, i) => (
                  <Link
                    key={l.label}
                    href={l.href}
                    onClick={(e) => handleNavClick(e, l.href)}
                    onMouseEnter={() => setHoveredIndex(i)}
                    onMouseLeave={() => setHoveredIndex(null)}
                    className="px-2 sm:px-4 py-2 rounded-full text-[11px] sm:text-[13px] font-semibold transition-all duration-300 relative group flex items-center justify-center min-w-[60px] sm:min-w-[80px]"
                    style={{
                      color: hoveredIndex === i ? "#ec9324" : "var(--text-muted)",
                      whiteSpace: "nowrap",
                    }}
                  >
                    <span className="relative z-10">{l.label}</span>
                    
                    <AnimatePresence>
                      {hoveredIndex === i && (
                        <div className="absolute inset-x-0 -top-2 flex flex-col items-center pointer-events-none">
                          <motion.div
                            initial={{ width: 0, opacity: 0 }}
                            animate={{ width: "100%", opacity: 1 }}
                            exit={{ width: 0, opacity: 0 }}
                            className="h-[2px] bg-[#ec9324] shadow-[0_0_20px_rgba(255,122,48,1)]"
                          />
                          <motion.div
                            initial={{ opacity: 0, scale: 0.6, y: -5 }}
                            animate={{ opacity: 1, scale: 1.2, y: 0 }}
                            exit={{ opacity: 0, scale: 0.6, y: -5 }}
                            className="w-[150%] h-24 -mt-[1px]"
                            style={{
                              background: "radial-gradient(50% 50% at 50% 0%, rgba(255,122,48,0.6) 0%, transparent 100%)",
                              filter: "blur(12px)",
                              clipPath: "inset(0px -100px -100px -100px)",
                            }}
                          />
                        </div>
                      )}
                    </AnimatePresence>
                  </Link>
                ))}
              </div>

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                onMouseEnter={() => setHoveredIndex(null)}
                aria-label="Toggle theme"
                className="ml-2 flex-shrink-0 w-9 h-9 rounded-full flex items-center justify-center transition-all relative z-10"
                style={{
                  background: dark ? "rgba(255,122,48,0.15)" : "rgba(0,0,0,0.06)",
                  color: dark ? "#ec9324" : "var(--text-muted)",
                }}
              >
                {dark ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
              </button>
            </nav>
          </div>

          <ScrollAnimations />

          {/* Global Background Wash */}
          <div 
            className="fixed inset-0 pointer-events-none z-0"
            style={{ 
              background: dark 
                ? "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,122,48,0.08) 0%, transparent 100%)" 
                : "radial-gradient(ellipse 80% 50% at 50% -10%, rgba(255,122,48,0.12) 0%, transparent 100%)" 
            }}
          />

          <main className="relative z-10 w-full pt-28 pb-8 page-enter">
            {children}
          </main>

          {/* FOOTER */}
          <footer
            className="relative z-50 pt-10 pb-6 transition-colors duration-500"
            style={{ background: "var(--bg2)", borderTop: "1px solid var(--border)" }}
          >
            <div className="max-w-7xl mx-auto px-8 text-[var(--text)]">
              <h2 id="contact" className="reveal text-2xl font-bold tracking-[0.5em] text-[var(--text)] text-center uppercase mb-3">
                Get In Touch
              </h2>
              <div className="reveal stagger-1 w-20 h-1 mx-auto mb-10" style={{ background: "#ec9324" }} />

              <div className="grid lg:grid-cols-12 gap-16">
                {/* Info */}
                <div className="lg:col-span-4 space-y-8">
                  <Link href="/">
                    <Image src="/images/logo_hd.png" alt="Infollion" width={130} height={38}
                      className="object-contain" />
                  </Link>
                  <div className="space-y-5">
                    <div className="flex gap-4 items-start opacity-70 text-sm">
                      <MapPin className="w-5 h-5 flex-shrink-0" style={{ color: "#ec9324" }} />
                      <p>5th Floor, Tower C, Unitech Cyberpark, Sector 39, Gurgaon, Haryana, India 122002</p>
                    </div>
                    <div className="flex gap-4 items-center opacity-70 text-sm">
                      <Phone className="w-5 h-5 flex-shrink-0" style={{ color: "#ec9324" }} />
                      <p>+91 (124) 427-2967</p>
                    </div>
                    <div className="flex gap-4 items-center opacity-70 text-sm">
                      <Mail className="w-5 h-5 flex-shrink-0" style={{ color: "#ec9324" }} />
                      <p>support@infollion.com</p>
                    </div>
                  </div>
                  <div>
                    <p className="text-[10px] uppercase tracking-widest opacity-40 mb-4 font-bold">Follow Us</p>
                    <div className="flex gap-4">
                      <a href="#" className="w-9 h-9 rounded-lg bg-[var(--text)]/5 border border-[var(--border)] flex items-center justify-center hover:text-[#ec9324] transition-all">
                        <Linkedin className="w-4 h-4" />
                      </a>
                      <a href="#" className="w-9 h-9 rounded-lg bg-[var(--text)]/5 border border-[var(--border)] flex items-center justify-center hover:text-[#ec9324] transition-all">
                        <Twitter className="w-4 h-4" />
                      </a>
                    </div>
                  </div>
                </div>

                {/* Quick Links */}
                <div className="lg:col-span-2">
                  <h3 className="text-xs font-bold tracking-[0.2em] opacity-80 uppercase mb-8">Quick Links</h3>
                  <ul className="space-y-4 text-xs font-semibold opacity-50 tracking-widest uppercase">
                    <li><Link href="/" className="hover:text-[#ec9324] transition-colors">Home</Link></li>
                    <li><a href="#" className="hover:text-[#ec9324] transition-colors">Expert Calls</a></li>
                    <li><a href="#" className="hover:text-[#ec9324] transition-colors">Knowledge Tours</a></li>
                    <li><a href="#" className="hover:text-[#ec9324] transition-colors">PexPanel</a></li>
                  </ul>
                </div>

                {/* Form */}
                <div className="lg:col-span-6 space-y-6">
                  <h3 className="text-xs font-bold tracking-[0.3em] opacity-80 uppercase">Send a Query</h3>
                  <div className="grid grid-cols-2 gap-4">
                    {["Your Name", "E-mail", "Mobile No", "Company Name"].map((ph) => (
                      <input
                        key={ph}
                        placeholder={ph}
                        className="w-full bg-[var(--text)]/[0.03] border border-[var(--border)] rounded-xl px-5 py-3 text-[13px] outline-none transition-all placeholder:opacity-30 text-[var(--text)]"
                        onFocus={(e) => (e.currentTarget.style.borderColor = "#ec9324")}
                        onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                      />
                    ))}
                    <div className="col-span-2 relative">
                      <select
                        className="w-full bg-[var(--text)]/[0.03] border border-[var(--border)] rounded-xl px-5 py-3 text-[13px] outline-none transition-all text-[var(--text)]/60 appearance-none bg-transparent"
                      >
                        <option className="bg-[var(--bg)] text-[var(--text)]">Select Keywords</option>
                        <option className="bg-[var(--bg)] text-[var(--text)]">Expert Consultation</option>
                        <option className="bg-[var(--bg)] text-[var(--text)]">PexPanel Subscription</option>
                        <option className="bg-[var(--bg)] text-[var(--text)]">Knowledge Tours</option>
                        <option className="bg-[var(--bg)] text-[var(--text)]">Sit-Ins / Masterclass</option>
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 opacity-20 pointer-events-none" />
                    </div>
                    <textarea
                      placeholder="Your Message..."
                      rows={3}
                      className="col-span-2 bg-[var(--text)]/[0.03] border border-[var(--border)] rounded-xl px-5 py-3 text-[13px] outline-none transition-all placeholder:opacity-30 resize-none text-[var(--text)]"
                      onFocus={(e) => (e.currentTarget.style.borderColor = "#ec9324")}
                      onBlur={(e) => (e.currentTarget.style.borderColor = "var(--border)")}
                    />
                    <div className="col-span-2">
                      <button
                        className="mt-2 px-12 py-3 text-[13px] font-black uppercase tracking-[0.2em] rounded-xl transition-all"
                        style={{ background: "#ec9324", color: "#fff", boxShadow: "0 12px 30px -8px rgba(255,122,48,0.4)" }}
                        onMouseEnter={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1.04)")}
                        onMouseLeave={(e) => ((e.currentTarget as HTMLElement).style.transform = "scale(1)")}
                      >
                        Submit Query
                      </button>
                    </div>
                  </div>
                </div>
              </div>

              <div className="mt-8 pt-6 border-t border-[var(--border)] flex flex-col md:flex-row justify-between items-center text-[10px] opacity-30 font-bold uppercase tracking-widest gap-4">
                <p>© Infollion — On-Demand Experts.</p>
                <div className="flex gap-6">
                  <a href="#" className="hover:text-[#ec9324] transition-colors">Privacy Policy</a>
                  <a href="#" className="hover:text-[#ec9324] transition-colors">Expert Agreement</a>
                  <a href="#" className="hover:text-[#ec9324] transition-colors">Contact Us</a>
                </div>
              </div>
            </div>
          </footer>
        </div>
      </body>
    </html>
  );
}
