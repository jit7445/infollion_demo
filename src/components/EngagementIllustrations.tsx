"use client";

import React, { useRef, useEffect, useState, useCallback } from 'react';
import { motion, useSpring, useTransform, useScroll, useMotionValue, animate, stagger } from 'motion/react';

// ─── DESIGN TOKENS ────────────────────────────────────────────────────────────
const T = {
  orange:   '#FF7A30',
  orangeHi: '#FFBA5A',
  orangeLo: '#C96F00',
  dark:     '#1A1A2E',
  mid:      '#2C3E50',
  grey:     '#8FA3B1',
  white:    '#FFFFFF',
  skin:     ['#F5CBA7', '#D2A679', '#C68642'],
  hair:     ['#222', '#5C3317', '#D2691E', '#F0C040'],
};

// ─── SHARED SPRING CONFIG ────────────────────────────────────────────────────
const SPRING: any = { type: 'spring', stiffness: 120, damping: 18 };
const SOFT: any   = { type: 'spring', stiffness: 60,  damping: 20 };
const EASE: any   = [0.16, 1, 0.3, 1];

// ─── GLOW FILTER DEFS ────────────────────────────────────────────────────────
const GlowDefs = ({ id = 'glow' }) => (
  <defs>
    <filter id={`${id}-sm`} x="-50%" y="-50%" width="200%" height="200%">
      <feGaussianBlur stdDeviation="3" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id={`${id}-md`} x="-80%" y="-80%" width="260%" height="260%">
      <feGaussianBlur stdDeviation="8" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id={`${id}-lg`} x="-100%" y="-100%" width="300%" height="300%">
      <feGaussianBlur stdDeviation="14" result="blur" />
      <feMerge><feMergeNode in="blur" /><feMergeNode in="SourceGraphic" /></feMerge>
    </filter>
    <filter id={`${id}-shadow`} x="-30%" y="-30%" width="160%" height="160%">
      <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#1A1A2E" floodOpacity="0.18" />
    </filter>
    <filter id={`${id}-inner`}>
      <feGaussianBlur in="SourceAlpha" stdDeviation="2" result="blur"/>
      <feOffset dx="0" dy="-2" result="offsetBlur"/>
      <feComposite in="offsetBlur" in2="SourceAlpha" operator="in" result="innerBlur"/>
      <feFlood floodColor="white" floodOpacity="0.35" result="white"/>
      <feComposite in="white" in2="innerBlur" operator="in" result="innerGlow"/>
      <feMerge><feMergeNode in="SourceGraphic"/><feMergeNode in="innerGlow"/></feMerge>
    </filter>
    <radialGradient id={`${id}-radial`} cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor={T.orange} stopOpacity="0.35" />
      <stop offset="100%" stopColor={T.orange} stopOpacity="0"    />
    </radialGradient>
    <radialGradient id={`${id}-bg`} cx="50%" cy="40%" r="60%">
      <stop offset="0%"   stopColor="var(--illustration-bg-start)" stopOpacity="1" />
      <stop offset="100%" stopColor="var(--illustration-bg-end)" stopOpacity="1" />
    </radialGradient>
    {/* Skin gradients */}
    <radialGradient id={`${id}-skin0`} cx="40%" cy="35%" r="55%">
      <stop offset="0%"   stopColor="#FDDBB4" />
      <stop offset="60%"  stopColor="#F5CBA7" />
      <stop offset="100%" stopColor="#DDA87A" />
    </radialGradient>
    <radialGradient id={`${id}-skin1`} cx="40%" cy="35%" r="55%">
      <stop offset="0%"   stopColor="#E8C49A" />
      <stop offset="60%"  stopColor="#D2A679" />
      <stop offset="100%" stopColor="#B07840" />
    </radialGradient>
    <radialGradient id={`${id}-skin2`} cx="40%" cy="35%" r="55%">
      <stop offset="0%"   stopColor="#D9966A" />
      <stop offset="60%"  stopColor="#C68642" />
      <stop offset="100%" stopColor="#8B5E28" />
    </radialGradient>
    {/* Body/clothing gradients */}
    <linearGradient id={`${id}-body-dark`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stopColor="#3D5166" />
      <stop offset="100%" stopColor="#1E2D3D" />
    </linearGradient>
    <linearGradient id={`${id}-body-orange`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stopColor="#FFAA44" />
      <stop offset="100%" stopColor="#D4720A" />
    </linearGradient>
    <linearGradient id={`${id}-body-slate`} x1="0" y1="0" x2="1" y2="1">
      <stop offset="0%"   stopColor="#7B97AA" />
      <stop offset="100%" stopColor="#465A6A" />
    </linearGradient>
    {/* Floor shadow */}
    <radialGradient id={`${id}-floor`} cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor="#1A1A2E" stopOpacity="0.14" />
      <stop offset="100%" stopColor="#1A1A2E" stopOpacity="0"    />
    </radialGradient>
    {/* Screen glow */}
    <radialGradient id={`${id}-screen`} cx="50%" cy="50%" r="50%">
      <stop offset="0%"   stopColor={T.orangeHi} stopOpacity="0.4" />
      <stop offset="100%" stopColor={T.orange}   stopOpacity="0"   />
    </radialGradient>
    {/* Hair dark */}
    <linearGradient id={`${id}-hair0`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor="#3A3A3A" />
      <stop offset="100%" stopColor="#111111" />
    </linearGradient>
    <linearGradient id={`${id}-hair1`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor="#7B4A25" />
      <stop offset="100%" stopColor="#3D200A" />
    </linearGradient>
    <linearGradient id={`${id}-hair2`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor="#E8845A" />
      <stop offset="100%" stopColor="#A04820" />
    </linearGradient>
    <linearGradient id={`${id}-hair3`} x1="0" y1="0" x2="0" y2="1">
      <stop offset="0%"   stopColor="#F5D070" />
      <stop offset="100%" stopColor="#C09020" />
    </linearGradient>
  </defs>
);

// ─── REUSABLE: BREATHING WRAPPER ─────────────────────────────────────────────
const Breathe = ({ children, delay = 0, amount = 0.015 }: { children: React.ReactNode, delay?: number, amount?: number }) => (
  <motion.g
    animate={{ scale: [1, 1 + amount, 1] }}
    transition={{ repeat: Infinity, duration: 3.6 + delay * 0.4, delay, ease: 'easeInOut' }}
  >
    {children}
  </motion.g>
);

// ─── REUSABLE: FLOAT ──────────────────────────────────────────────────────────
const Float = ({ children, y = 6, delay = 0, dur = 3 }: { children: React.ReactNode, y?: number, delay?: number, dur?: number }) => (
  <motion.g
    animate={{ y: [0, -y, 0] }}
    transition={{ repeat: Infinity, duration: dur, delay, ease: 'easeInOut' }}
  >
    {children}
  </motion.g>
);

// ─── REUSABLE: PULSE GLOW RING ────────────────────────────────────────────────
const PulseRing = ({ cx, cy, r, color = T.orange, delay = 0 }: { cx: number, cy: number, r: number, color?: string, delay?: number }) => (
  <motion.circle
    cx={cx} cy={cy} r={r}
    fill="none" stroke={color} strokeWidth="2"
    initial={{ opacity: 0.7, scale: 1 }}
    animate={{ opacity: 0, scale: 2.2 }}
    transition={{ repeat: Infinity, duration: 2, delay, ease: 'easeOut' }}
    style={{ transformOrigin: `${cx}px ${cy}px` }}
  />
);

// ─── REUSABLE: STAGGER CONTAINER ─────────────────────────────────────────────
const staggerVariants = {
  hidden: {},
  show:   { transition: { staggerChildren: 0.12, delayChildren: 0.1 } },
};
const itemVariants = {
  hidden: { opacity: 0, y: 18, filter: 'blur(6px)' },
  show:   { opacity: 1, y: 0,  filter: 'blur(0px)', transition: { ...SPRING } },
};

// ─────────────────────────────────────────────────────────────────────────────
// 1. CALLS SCENE
// ─────────────────────────────────────────────────────────────────────────────
export const CallsScene = () => {
  const [typed, setTyped] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setTyped(p => (p < 12 ? p + 1 : 0)), 180);
    return () => clearInterval(t);
  }, []);

  const notifications = [
    { x: 320, y: 100, label: 'Expert joined', delay: 0 },
    { x: 340, y: 148, label: 'Call started',   delay: 0.6 },
    { x: 310, y: 196, label: '5 min left',     delay: 1.2 },
  ];

  return (
    <svg viewBox="0 0 500 350" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlowDefs id="calls" />

      {/* Ambient bg */}
      <circle cx="250" cy="175" r="160" fill="url(#calls-radial)" />
      <circle cx="250" cy="175" r="130" fill="url(#calls-bg)" />

      {/* Desk */}
      <rect x="100" y="252" width="300" height="10" rx="5" fill="#D8E3EC" />
      <motion.rect x="100" y="252" width="300" height="10" rx="5"
        fill={T.orange} fillOpacity="0"
        animate={{ fillOpacity: [0, 0.08, 0] }}
        transition={{ repeat: Infinity, duration: 4, ease: 'easeInOut' }}
      />

      {/* Character */}
      <motion.g
        initial={{ y: 30, opacity: 0, filter: 'blur(8px)' }}
        animate={{ y: 0,  opacity: 1, filter: 'blur(0px)' }}
        transition={{ duration: 1, ease: EASE }}
      >
        <Breathe delay={0.2}>
          {/* Floor shadow */}
          <ellipse cx="250" cy="256" rx="40" ry="8" fill="url(#calls-floor)" />
          {/* Torso with shoulder volume */}
          <path d="M218 252 Q216 220 222 196 Q232 182 250 181 Q268 182 278 196 Q284 220 282 252 Z"
            fill="url(#calls-body-dark)" filter="url(#calls-shadow)" />
          {/* Shirt highlight */}
          <path d="M240 185 Q250 182 260 185 Q256 205 250 207 Q244 205 240 185 Z" fill="white" fillOpacity="0.10" />
          {/* Collar */}
          <path d="M240 194 Q250 200 260 194" fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.2" strokeLinecap="round" />
          {/* Neck */}
          <rect x="243" y="178" width="14" height="11" rx="6" fill="url(#calls-skin0)" />
          {/* Head shadow */}
          <ellipse cx="253" cy="161" rx="26" ry="26" fill="#000" fillOpacity="0.10" />
          {/* Head */}
          <circle cx="250" cy="158" r="26" fill="url(#calls-skin0)" filter="url(#calls-inner)" />
          {/* Cheeks */}
          <ellipse cx="234" cy="163" rx="7" ry="4" fill="#E8805A" fillOpacity="0.16" />
          <ellipse cx="266" cy="163" rx="7" ry="4" fill="#E8805A" fillOpacity="0.16" />
          {/* Eyes */}
          <ellipse cx="243" cy="156" rx="3" ry="3.5" fill="#1A1A2E" />
          <ellipse cx="257" cy="156" rx="3" ry="3.5" fill="#1A1A2E" />
          <circle cx="244.2" cy="154.5" r="1.1" fill="white" />
          <circle cx="258.2" cy="154.5" r="1.1" fill="white" />
          {/* Nose */}
          <path d="M250 160 Q252 164 250 166" stroke="#C0805A" strokeWidth="1.4" fill="none" strokeLinecap="round" />
          {/* Mouth - slight smile */}
          <path d="M244 170 Q250 175 256 170" stroke="#B0705A" strokeWidth="1.8" fill="none" strokeLinecap="round" />
          {/* Hair volume */}
          <path d="M224 152 Q228 126 250 124 Q272 126 276 152 Q268 144 250 142 Q232 144 224 152 Z" fill="url(#calls-hair0)" />
          {/* Hair highlight */}
          <path d="M236 130 Q248 124 258 128" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.18" strokeLinecap="round" />
          {/* Headset arc */}
          <path d="M226 154 A24 24 0 0 1 274 154" stroke={T.mid} strokeWidth="5" fill="none" strokeLinecap="round" />
          {/* Ear cups */}
          <rect x="221" y="150" width="11" height="16" rx="5.5" fill={T.mid} />
          <rect x="268" y="150" width="11" height="16" rx="5.5" fill={T.mid} />
          {/* Mic boom */}
          <path d="M226 164 Q217 173 224 182" stroke={T.mid} strokeWidth="2.8" fill="none" strokeLinecap="round" />
          <circle cx="224" cy="184" r="4" fill={T.orange} filter="url(#calls-glow-sm)" />
          <PulseRing cx={224} cy={184} r={7} />
          {/* Arms */}
          <path d="M220 200 Q210 222 215 248" stroke="url(#calls-skin0)" strokeWidth="12" strokeLinecap="round" fill="none" />
          <path d="M280 200 Q285 218 282 240" stroke="url(#calls-skin0)" strokeWidth="12" strokeLinecap="round" fill="none" />
        </Breathe>

        {/* Laptop */}
        <rect x="270" y="222" width="48" height="32" rx="4" fill={T.mid} />
        <rect x="274" y="226" width="40" height="24" rx="2" fill="#1A2740" />
        {/* Screen content — typed lines */}
        {[0,1,2].map(i => (
          <motion.rect key={i} x={278} y={229 + i*7} height={3} rx={1.5}
            fill={T.orange} fillOpacity={0.7}
            initial={{ width: 0 }}
            animate={{ width: typed > i * 4 ? Math.min((typed - i*4) * 4, 30) : 0 }}
            transition={{ ease: 'linear' }}
          />
        ))}
        <rect x="270" y="254" width="48" height="6" rx="3" fill={T.mid} />
      </motion.g>

      {/* Floating notification bubbles */}
      {notifications.map((n, i) => (
        <Float key={i} y={5} delay={n.delay} dur={3 + i * 0.3}>
          <motion.g
            initial={{ opacity: 0, x: 20, scale: 0.8 }}
            animate={{ opacity: 1, x: 0,  scale: 1   }}
            transition={{ delay: 0.5 + i * 0.5, ...SPRING }}
          >
            <rect x={n.x} y={n.y} width={90} height={22} rx={11} fill="white"
              stroke={T.orange} strokeWidth="1.5" strokeOpacity="0.6"
              filter="url(#calls-glow-sm)"
            />
            <circle cx={n.x + 11} cy={n.y + 11} r={5} fill={T.orange} />
            <text x={n.x + 20} y={n.y + 15} fontSize="8" fill={T.mid} fontFamily="sans-serif">{n.label}</text>
          </motion.g>
        </Float>
      ))}

      {/* Ambient wave rings around head */}
      {[0, 0.7, 1.4].map((d, i) => (
        <motion.circle key={i} cx={250} cy={158} r={30 + i * 14}
          fill="none" stroke={T.orange} strokeWidth="1" strokeOpacity="0.15"
          animate={{ r: [30 + i*14, 30 + i*14 + 8, 30 + i*14], opacity: [0.15, 0, 0.15] }}
          transition={{ repeat: Infinity, duration: 3, delay: d }}
        />
      ))}
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 2. SITINS DETAILED
// ─────────────────────────────────────────────────────────────────────────────
const skinGrads = ['url(#sitins-skin0)', 'url(#sitins-skin1)', 'url(#sitins-skin2)'];
const hairGrads  = ['url(#sitins-hair0)', 'url(#sitins-hair1)', 'url(#sitins-hair2)', 'url(#sitins-hair3)'];
const bodyGrads  = [
  'url(#sitins-body-dark)',
  'url(#sitins-body-slate)',
  'url(#sitins-body-orange)',
  'url(#sitins-body-slate)',
  'url(#sitins-body-dark)',
];

const Person = ({ x, bodyColor, skinIdx = 0, hairIdx = 0, delay = 0, raising = false, nodding = false, bidx = 0 }: any) => {
  const sk  = skinGrads[skinIdx]  ?? T.skin[skinIdx];
  const hr  = hairGrads[hairIdx]  ?? T.hair[hairIdx];
  const bd  = bodyGrads[bidx]     ?? bodyColor;
  const hY  = 155; // head centre Y
  return (
    <motion.g variants={itemVariants}>
      {/* Floor shadow */}
      <ellipse cx={x} cy={248} rx={20} ry={5} fill="url(#sitins-floor)" />

      <Breathe delay={delay} amount={0.01}>
        {/* ── Torso with shoulder volume ── */}
        <path
          d={`M${x-20} 243 Q${x-22} 215 ${x-18} 193 Q${x-8} 183 ${x} 182 Q${x+8} 183 ${x+18} 193 Q${x+22} 215 ${x+20} 243 Z`}
          fill={bd} filter="url(#sitins-shadow)"
        />
        {/* Torso highlight */}
        <path
          d={`M${x-8} 185 Q${x} 183 ${x+8} 185 Q${x+4} 200 ${x} 202 Q${x-4} 200 ${x-8} 185 Z`}
          fill="white" fillOpacity="0.10"
        />
        {/* Collar */}
        <path
          d={`M${x-8} 192 Q${x} 197 ${x+8} 192`}
          fill="none" stroke="white" strokeWidth="1.5" strokeOpacity="0.25" strokeLinecap="round"
        />

        {/* ── Neck ── */}
        <rect x={x - 6} y={180} width={12} height={12} rx={5} fill={sk} />

        {/* ── Head (motion layer for nodding) ── */}
        <motion.g
          animate={nodding ? { rotate: [0, 5, 0, -3, 0] } : {}}
          transition={{ repeat: Infinity, duration: 4 + delay, delay, ease: 'easeInOut' }}
          style={{ transformOrigin: `${x}px ${hY}px` }}
        >
          {/* Head shadow */}
          <ellipse cx={x+3} cy={hY+2} rx={17} ry={17} fill="#000" fillOpacity="0.10" />
          {/* Head */}
          <circle cx={x} cy={hY} r={17} fill={sk} filter="url(#sitins-inner)" />
          {/* Cheek blush */}
          <ellipse cx={x-9} cy={hY+4} rx={5} ry={3} fill="#E8805A" fillOpacity="0.18" />
          <ellipse cx={x+9} cy={hY+4} rx={5} ry={3} fill="#E8805A" fillOpacity="0.18" />
          {/* Eyes */}
          <ellipse cx={x-5} cy={hY-1} rx={2.5} ry={3} fill="#1A1A2E" />
          <ellipse cx={x+5} cy={hY-1} rx={2.5} ry={3} fill="#1A1A2E" />
          <circle cx={x-4.2} cy={hY-2} r={0.9} fill="white" />
          <circle cx={x+5.8} cy={hY-2} r={0.9} fill="white" />
          {/* Nose */}
          <path d={`M${x} ${hY+2} Q${x+2} ${hY+5} ${x} ${hY+6}`} stroke="#C0805A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* Mouth */}
          <path d={`M${x-4} ${hY+9} Q${x} ${hY+12} ${x+4} ${hY+9}`} stroke="#B0705A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Hair volume */}
          <path
            d={`M${x-17} ${hY-6} Q${x-14} ${hY-22} ${x} ${hY-18} Q${x+14} ${hY-22} ${x+17} ${hY-6}`}
            fill={hr}
          />
          {/* Hair highlight */}
          <path
            d={`M${x-10} ${hY-18} Q${x-4} ${hY-22} ${x+2} ${hY-20}`}
            fill="white" fillOpacity="0.14" strokeWidth="0"
          />
        </motion.g>

        {/* ── Right arm (raised if raising) ── */}
        {raising ? (
          <motion.g
            animate={{ rotate: [-8, 8, -8] }}
            style={{ transformOrigin: `${x+18}px 200px` }}
            transition={{ repeat: Infinity, duration: 3, ease: 'easeInOut' }}
          >
            {/* Upper arm */}
            <path d={`M${x+16} 198 Q${x+32} 178 ${x+46} 158`} stroke={sk} strokeWidth={11} strokeLinecap="round" fill="none" />
            {/* Forearm */}
            <path d={`M${x+46} 158 Q${x+54} 148 ${x+58} 138`} stroke={sk} strokeWidth={9} strokeLinecap="round" fill="none" />
          </motion.g>
        ) : (
          /* Resting arm */
          <path d={`M${x+16} 198 Q${x+22} 218 ${x+20} 240`} stroke={sk} strokeWidth={10} strokeLinecap="round" fill="none" />
        )}
        {/* Left arm resting */}
        <path d={`M${x-16} 198 Q${x-22} 218 ${x-20} 240`} stroke={sk} strokeWidth={10} strokeLinecap="round" fill="none" />

        {/* ── Laptop on table ── */}
        <g>
          {/* Screen */}
          <path d={`M${x-18} 240 L${x-25} 213 H${x+15} L${x+8} 240 Z`} fill={T.mid} rx="2" filter="url(#sitins-shadow)" />
          {/* Screen glow */}
          <path d={`M${x-20} 240 L${x-27} 211 H${x+17} L${x+10} 240 Z`} fill="url(#sitins-screen)" fillOpacity="0.4" />
          {/* Screen content lines */}
          {[0,1].map(i => (
            <line key={i} x1={x-18} y1={221+i*8} x2={x+8} y2={221+i*8}
              stroke={T.orangeHi} strokeWidth="1.5" strokeOpacity="0.5" strokeLinecap="round" />
          ))}
          {/* Base */}
          <path d={`M${x-20} 240 H${x+12} L${x+16} 244 H${x-24} Z`} fill="#8FA3B1" />
        </g>
      </Breathe>
    </motion.g>
  );
};

export const SitInsDetailed = () => {
  const people = [
    { x: 90,  bodyColor: T.mid,     skinIdx: 1, hairIdx: 1, delay: 0,   bidx: 0 },
    { x: 185, bodyColor: '#607D8B', skinIdx: 0, hairIdx: 0, delay: 0.1, bidx: 1, nodding: true },
    { x: 290, bodyColor: T.orange,  skinIdx: 0, hairIdx: 2, delay: 0.2, bidx: 2, raising: true },
    { x: 390, bodyColor: '#546E7A', skinIdx: 2, hairIdx: 3, delay: 0.3, bidx: 3, nodding: true },
    { x: 490, bodyColor: '#78909C', skinIdx: 1, hairIdx: 0, delay: 0.4, bidx: 4 },
  ];

  return (
    <svg viewBox="0 0 600 350" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlowDefs id="sitins" />
      <ellipse cx="300" cy="340" rx="280" ry="18" fill="black" fillOpacity="0.04" />

      {/* Table */}
      <rect x="30" y="240" width="540" height="14" rx="7" fill="#CFD8DC" />
      <rect x="80"  y="254" width="10" height="80" fill="#B0BEC5" />
      <rect x="510" y="254" width="10" height="80" fill="#B0BEC5" />

      {/* Subtle table glow */}
      <motion.rect x="30" y="240" width="540" height="14" rx="7"
        fill={T.orange} fillOpacity="0"
        animate={{ fillOpacity: [0, 0.05, 0] }}
        transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}
      />

      {/* People */}
      <motion.g variants={staggerVariants} initial="hidden" animate="show">
        {people.map((p, i) => <Person key={i} {...p} />)}
      </motion.g>

      {/* Speech bubble from speaker */}
      <Float y={4} dur={2.8}>
        <motion.g
          initial={{ opacity: 0, scale: 0.6 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 1.2, ...SPRING }}
        >
          <rect x={310} y={90} width={80} height={28} rx={14} fill="white"
            stroke={T.orange} strokeWidth="1.5" filter="url(#sitins-glow-sm)"
          />
          <path d="M330 118 L322 128 L340 118 Z" fill="white" stroke={T.orange} strokeWidth="1.5" />
          {[0,1,2].map(i => (
            <motion.circle key={i} cx={328 + i * 12} cy={104} r={3} fill={T.orange}
              animate={{ y: [0, -4, 0] }}
              transition={{ repeat: Infinity, duration: 1.2, delay: i * 0.2 }}
            />
          ))}
        </motion.g>
      </Float>

      {/* Ambient light blob */}
      <motion.ellipse cx={290} cy={160} rx={60} ry={40}
        fill={T.orange} fillOpacity="0"
        animate={{ fillOpacity: [0, 0.04, 0] }}
        transition={{ repeat: Infinity, duration: 4 }}
      />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 3. PEX PANEL SCENE
// ─────────────────────────────────────────────────────────────────────────────
export const PexPanelScene = () => {
  const [selected, setSelected] = useState(4);
  useEffect(() => {
    const t = setInterval(() => setSelected(s => (s + 1) % 6), 2800);
    return () => clearInterval(t);
  }, []);

  const grid = [
    { x:150,y:100 },{ x:250,y:100 },{ x:350,y:100 },
    { x:150,y:200 },{ x:250,y:200 },{ x:350,y:200 },
  ];
  const skinCycle = [0,1,2,0,1,2];
  const hairCycle = [0,1,2,3,0,1];
  const bodyColors = [T.mid, '#546E7A', T.orange, '#607D8B', '#455A64', '#78909C'];

  return (
    <svg viewBox="0 0 500 340" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlowDefs id="pex" />
      <circle cx="250" cy="170" r="155" fill="url(#pex-radial)" />
      <circle cx="250" cy="170" r="130" fill="url(#pex-bg)" />

      {/* Connecting lines to selected */}
      {grid.map((p, i) => i !== selected && (
        <motion.line key={i}
          x1={p.x} y1={p.y} x2={grid[selected].x} y2={grid[selected].y}
          stroke={T.orange} strokeWidth="1" strokeOpacity="0"
          animate={{ strokeOpacity: [0, 0.15, 0] }}
          transition={{ repeat: Infinity, duration: 2.8, delay: i * 0.1 }}
        />
      ))}

      {/* Expert cards */}
      <motion.g variants={staggerVariants} initial="hidden" animate="show">
        {grid.map((pos, i) => {
          const isSel = i === selected;
          return (
            <motion.g key={i} variants={itemVariants}>
              <motion.g
                animate={isSel
                  ? { scale: 1.18, filter: 'drop-shadow(0 0 12px #F7941D88)' }
                  : { scale: 1,    filter: 'drop-shadow(0 0 0px transparent)' }
                }
                transition={SPRING}
                style={{ transformOrigin: `${pos.x}px ${pos.y}px` }}
              >
                {/* Card bg */}
                <rect x={pos.x-36} y={pos.y-38} width={72} height={76} rx={12}
                  fill={isSel ? '#FFF7EE' : 'white'}
                  stroke={isSel ? T.orange : '#E0E8F0'}
                  strokeWidth={isSel ? 2 : 1}
                />
                {/* Glow halo */}
                {isSel && <PulseRing cx={pos.x} cy={pos.y-2} r={32} />}
                {/* Avatar: shadow */}
                <ellipse cx={pos.x+2} cy={pos.y-10} rx={16} ry={16} fill="#000" fillOpacity="0.08" />
                {/* Avatar: face */}
                <circle cx={pos.x} cy={pos.y-12} r={16}
                  fill={`url(#pex-skin${skinCycle[i]})`}
                  filter="url(#pex-inner)"
                />
                {/* Eyes */}
                <ellipse cx={pos.x-4} cy={pos.y-13} rx={2} ry={2.4} fill="#1A1A2E" />
                <ellipse cx={pos.x+4} cy={pos.y-13} rx={2} ry={2.4} fill="#1A1A2E" />
                <circle cx={pos.x-3.2} cy={pos.y-14} r={0.7} fill="white" />
                <circle cx={pos.x+4.8} cy={pos.y-14} r={0.7} fill="white" />
                {/* Mouth */}
                <path d={`M${pos.x-3} ${pos.y-6} Q${pos.x} ${pos.y-3} ${pos.x+3} ${pos.y-6}`}
                  stroke="#B0705A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
                {/* Hair */}
                <path d={`M${pos.x-14} ${pos.y-19} Q${pos.x-10} ${pos.y-30} ${pos.x} ${pos.y-28} Q${pos.x+10} ${pos.y-30} ${pos.x+14} ${pos.y-19}`}
                  fill={`url(#pex-hair${hairCycle[i]})`} />
                {/* Body sliver with highlight */}
                <path d={`M${pos.x-18} ${pos.y+38} L${pos.x+18} ${pos.y+38} L${pos.x+12} ${pos.y+14} L${pos.x-12} ${pos.y+14} Z`}
                  fill={bodyColors[i]} />
                <path d={`M${pos.x-4} ${pos.y+14} Q${pos.x} ${pos.y+12} ${pos.x+4} ${pos.y+14} Q${pos.x+2} ${pos.y+22} ${pos.x} ${pos.y+23} Q${pos.x-2} ${pos.y+22} ${pos.x-4} ${pos.y+14} Z`}
                  fill="white" fillOpacity="0.10" />
                {/* Badge on selected */}
                {isSel && (
                  <motion.g initial={{ scale: 0 }} animate={{ scale: 1 }} transition={SPRING}>
                    <circle cx={pos.x+26} cy={pos.y-28} r={9} fill={T.orange} filter="url(#pex-glow-sm)" />
                    <path d={`M${pos.x+22} ${pos.y-28} L${pos.x+25} ${pos.y-25} L${pos.x+30} ${pos.y-31}`}
                      stroke="white" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" fill="none" />
                  </motion.g>
                )}
              </motion.g>
            </motion.g>
          );
        })}
      </motion.g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 4. KNOWLEDGE TOURS SCENE
// ─────────────────────────────────────────────────────────────────────────────
export const KnowledgeToursScene = () => {
  const pins = [
    { cx: 148, cy: 95,  delay: 0   },
    { cx: 210, cy: 130, delay: 0.5 },
    { cx: 175, cy: 155, delay: 1   },
  ];

  return (
    <svg viewBox="0 0 500 340" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlowDefs id="tours" />
      <circle cx="250" cy="170" r="155" fill="url(#tours-radial)" />

      {/* Globe */}
      <motion.g animate={{ rotate: 360 }} style={{ transformOrigin: '155px 130px' }}
        transition={{ duration: 28, repeat: Infinity, ease: 'linear' }}>
        <circle cx={155} cy={130} r={70} fill="#EBF4FF" stroke={T.orange} strokeWidth="1" strokeOpacity="0.4" />
        {/* Latitude lines */}
        {[-28, 0, 28].map((dy, i) => (
          <ellipse key={i} cx={155} cy={130 + dy} rx={70} ry={12 + i*4}
            fill="none" stroke={T.orange} strokeWidth="0.8" strokeOpacity="0.2" />
        ))}
        {/* Longitude lines */}
        {[0, 40, 80].map((angle, i) => (
          <ellipse key={i} cx={155} cy={130} rx={18 + i * 20} ry={70}
            fill="none" stroke={T.orange} strokeWidth="0.8" strokeOpacity="0.2" />
        ))}
        {/* Land blob */}
        <path d="M120 110 Q135 95 155 100 Q175 105 180 120 Q185 140 170 150 Q150 155 130 145 Q110 135 120 110 Z"
          fill={T.orange} fillOpacity="0.12" />
      </motion.g>

      {/* Location Pins */}
      {pins.map((p, i) => (
        <Float key={i} y={5} delay={p.delay} dur={2.5 + i * 0.3}>
          <motion.g
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6 + i * 0.3, ...SPRING }}
          >
            <PulseRing cx={p.cx} cy={p.cy} r={10} delay={i * 0.4} />
            <path d={`M${p.cx} ${p.cy+14} L${p.cx-7} ${p.cy+2} A8 8 0 1 1 ${p.cx+7} ${p.cy+2} Z`}
              fill={T.orange} filter="url(#tours-glow-sm)" />
            <circle cx={p.cx} cy={p.cy - 1} r={4} fill="white" />
          </motion.g>
        </Float>
      ))}

      {/* Character with tablet */}
      <motion.g initial={{ x: -30, opacity: 0 }} animate={{ x: 0, opacity: 1 }} transition={{ delay: 0.3, duration: 0.9, ease: EASE }}>
        <Breathe delay={0.5}>
          {/* Floor shadow */}
          <ellipse cx="310" cy="268" rx="32" ry="7" fill="url(#tours-floor)" />
          {/* Torso */}
          <path d="M278 264 Q276 236 282 218 Q290 204 310 202 Q330 204 338 218 Q344 236 342 264 Z"
            fill="url(#tours-body-orange)" filter="url(#tours-shadow)" />
          <path d="M302 206 Q310 202 318 206 Q315 220 310 222 Q305 220 302 206 Z" fill="white" fillOpacity="0.10" />
          {/* Neck */}
          <rect x="304" y="196" width="12" height="9" rx="5" fill="url(#tours-skin1)" />
          {/* Head shadow */}
          <ellipse cx="313" cy="181" rx="22" ry="22" fill="#000" fillOpacity="0.09" />
          {/* Head */}
          <circle cx="310" cy="179" r="22" fill="url(#tours-skin1)" filter="url(#tours-inner)" />
          {/* Cheeks */}
          <ellipse cx="299" cy="183" rx="6" ry="3.5" fill="#E8805A" fillOpacity="0.16" />
          <ellipse cx="321" cy="183" rx="6" ry="3.5" fill="#E8805A" fillOpacity="0.16" />
          {/* Eyes */}
          <ellipse cx="303" cy="177" rx="2.6" ry="3" fill="#1A1A2E" />
          <ellipse cx="317" cy="177" rx="2.6" ry="3" fill="#1A1A2E" />
          <circle cx="304" cy="175.5" r="1" fill="white" />
          <circle cx="318" cy="175.5" r="1" fill="white" />
          {/* Nose */}
          <path d="M310 180 Q312 184 310 186" stroke="#C0805A" strokeWidth="1.2" fill="none" strokeLinecap="round" />
          {/* Mouth */}
          <path d="M305 190 Q310 194 315 190" stroke="#B0705A" strokeWidth="1.5" fill="none" strokeLinecap="round" />
          {/* Hair */}
          <path d="M290 173 Q294 158 310 156 Q326 158 330 173 Q322 165 310 163 Q298 165 290 173 Z" fill="url(#tours-hair1)" />
          <path d="M296 162 Q308 156 320 160" fill="none" stroke="white" strokeWidth="2" strokeOpacity="0.14" strokeLinecap="round" />
          {/* Tablet arm */}
          <path d="M330 220 Q348 208 360 196" stroke="url(#tours-skin1)" strokeWidth="11" strokeLinecap="round" fill="none" />
          {/* Left arm resting */}
          <path d="M280 220 Q272 240 278 264" stroke="url(#tours-skin1)" strokeWidth="11" strokeLinecap="round" fill="none" />
          {/* Tablet */}
          <rect x="352" y="178" width="38" height="54" rx="5" fill={T.mid} filter="url(#tours-shadow)" />
          <rect x="355" y="181" width="32" height="46" rx="3" fill="#1A2740" />
          {[0,1,2].map(i => (
            <motion.rect key={i} x={358} y={185 + i * 13} width={26} height={8} rx={2}
              fill={T.orange} fillOpacity={0.5 - i * 0.1}
              animate={{ fillOpacity: [0.5 - i*0.1, 0.9 - i*0.1, 0.5 - i*0.1] }}
              transition={{ repeat: Infinity, duration: 2.5, delay: i * 0.4 }}
            />
          ))}
          {/* Screen glow */}
          <rect x="352" y="178" width="38" height="54" rx="5" fill="url(#tours-screen)" fillOpacity="0.35" />
        </Breathe>
      </motion.g>

      {/* Factory backdrop */}
      <path d="M30 310 H470 V265 L430 230 V265 L380 230 V265 L330 230 V310" fill="var(--illustration-bg-start)" fillOpacity="0.3" />
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 5. CORPORATIONS SCENE
// ─────────────────────────────────────────────────────────────────────────────
const SwingLamp = ({ x, delay = 0 }: any) => (
  <motion.g
    animate={{ rotate: [-4, 4, -4] }}
    style={{ transformOrigin: `${x}px 0px` }}
    transition={{ repeat: Infinity, duration: 4 + delay * 0.5, delay, ease: 'easeInOut', type: 'tween' }}
  >
    <line x1={x} y1="0" x2={x} y2="55" stroke={T.mid} strokeWidth="2" />
    <path d={`M${x-18} 86 Q${x-18} 55 ${x} 55 Q${x+18} 55 ${x+18} 86 Z`} fill={T.mid} />
    <motion.circle cx={x} cy={88} r={5} fill={T.orangeHi}
      animate={{ opacity: [0.6, 1, 0.6] }}
      transition={{ repeat: Infinity, duration: 2.5, delay }}
      filter="url(#corp-glow-sm)"
    />
  </motion.g>
);

const LeafBranch = ({ x, y, angle, color, delay }: any) => (
  <motion.path
    d={`M${x} ${y} Q${x - 22} ${y - 25} ${x - 35} ${y - 10}`}
    fill={color}
    animate={{ rotate: [angle - 4, angle + 4, angle - 4] }}
    style={{ transformOrigin: `${x}px ${y}px` }}
    transition={{ repeat: Infinity, duration: 3 + delay, delay, ease: 'easeInOut' }}
  />
);

export const CorporationsScene = () => (
  <svg viewBox="0 0 560 340" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
    <GlowDefs id="corp" />
    <defs>
      <linearGradient id="corpTableGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="var(--illustration-floor)" />
        <stop offset="100%" stopColor="var(--illustration-floor)" stopOpacity="0.8" />
      </linearGradient>
      <linearGradient id="corpWallGrad" x1="0" y1="0" x2="0" y2="1">
        <stop offset="0%"  stopColor="var(--illustration-wall)" />
        <stop offset="100%" stopColor="var(--illustration-wall)" stopOpacity="0.9" />
      </linearGradient>
      <radialGradient id="corpLampGlow" cx="50%" cy="50%" r="50%">
        <stop offset="0%"  stopColor={T.orangeHi} stopOpacity="0.5" />
        <stop offset="100%" stopColor={T.orange} stopOpacity="0" />
      </radialGradient>
    </defs>

    {/* Room background */}
    <rect x="0" y="0" width="560" height="340" fill="url(#corpWallGrad)" />
    <rect x="0" y="248" width="560" height="92" fill="var(--illustration-floor)" />
    <line x1="0" y1="248" x2="560" y2="248" stroke="var(--border)" strokeWidth="1.5" />

    {/* Wall art frames */}
    {[[165,52,80,68],[260,52,80,68],[355,52,80,68]].map(([fx,fy,fw,fh],i) => (
      <g key={i}>
        <rect x={fx} y={fy} width={fw} height={fh} rx="4" fill="white" stroke="#D4C0AE" strokeWidth="3"/>
        <rect x={fx+8} y={fy+8} width={fw-16} height={fh-16} rx="2" fill={i===1?'#F5E0CE':'#EDE0D4'}/>
        <ellipse cx={fx+fw/2} cy={fy+fh/2-5} rx={i===1?18:12} ry={i===1?13:9}
          fill={i===1?T.orangeLo:'#D4C0AE'} fillOpacity="0.5"/>
        <ellipse cx={fx+fw/2-8} cy={fy+fh/2+8} rx="8" ry="5" fill={T.orange} fillOpacity="0.18"/>
      </g>
    ))}

    {/* Hanging pendant lamp */}
    <motion.g animate={{ rotate: [-3, 3, -3] }} style={{ transformOrigin: '280px 0px' }}
      transition={{ repeat: Infinity, duration: 5, ease: 'easeInOut' }}>
      <line x1="280" y1="0" x2="280" y2="52" stroke={T.mid} strokeWidth="2"/>
      <path d="M260 84 Q260 52 280 52 Q300 52 300 84 Z" fill={T.mid}/>
      <path d="M258 84 Q262 78 280 78 Q298 78 302 84 Z" fill="#455A64"/>
      <motion.ellipse cx="280" cy="95" rx="48" ry="22" fill="url(#corpLampGlow)"
        animate={{ opacity: [0.5, 1, 0.5] }} transition={{ repeat: Infinity, duration: 3 }}/>
      <motion.circle cx="280" cy="86" r="4" fill={T.orangeHi}
        animate={{ opacity: [0.6, 1, 0.6] }} transition={{ repeat: Infinity, duration: 2.5 }}
        filter="url(#corp-glow-sm)"/>
    </motion.g>

    {/* Plant LEFT */}
    <g transform="translate(28,158)">
      <rect x="10" y="62" width="24" height="28" rx="5" fill={T.mid}/>
      <LeafBranch x={22} y={62} angle={0}   color={T.mid}       delay={0}  />
      <LeafBranch x={22} y={62} angle={-22} color="#37474F"     delay={0.8}/>
      <LeafBranch x={22} y={52} angle={10}  color={T.orangeLo}  delay={1.4}/>
    </g>

    {/* Plant RIGHT */}
    <g transform="translate(498,158)">
      <rect x="4" y="62" width="24" height="28" rx="5" fill={T.mid}/>
      <LeafBranch x={16} y={62} angle={0}   color="#37474F"     delay={0.3}/>
      <LeafBranch x={16} y={62} angle={-18} color={T.mid}       delay={1}  />
      <LeafBranch x={16} y={52} angle={12}  color={T.orangeLo}  delay={1.6}/>
    </g>

    {/* Oval conference table */}
    <ellipse cx="280" cy="236" rx="168" ry="34" fill="url(#corpTableGrad)"/>
    <ellipse cx="280" cy="236" rx="168" ry="34" fill="none" stroke="#C4A882" strokeWidth="2"/>
    <ellipse cx="278" cy="232" rx="164" ry="31" fill="none" stroke="white" strokeOpacity="0.22" strokeWidth="1.5"/>
    <rect x="262" y="266" width="10" height="48" rx="4" fill="#B8996E"/>
    <rect x="290" y="266" width="10" height="48" rx="4" fill="#B8996E"/>

    {/* Laptops on table */}
    {[[168,224],[378,220]].map(([lx,ly],i) => (
      <g key={i}>
        <path d={`M${lx} ${ly} L${lx-5} ${ly-22} H${lx+28} L${lx+23} ${ly} Z`} fill={T.mid} fillOpacity="0.85"/>
        <path d={`M${lx-2} ${ly} L${lx-8} ${ly-21} H${lx+30} L${lx+24} ${ly} Z`} fill={T.mid} fillOpacity="0.22"/>
        <rect x={lx-3} y={ly-20} width={30} height={18} rx="2" fill="url(#corp-screen)" fillOpacity="0.3"/>
        <path d={`M${lx-5} ${ly} H${lx+27} L${lx+31} ${ly+5} H${lx-9} Z`} fill="#8FA3B1"/>
      </g>
    ))}

    {/* Center presenter with document */}
    <motion.g initial={{ y:15, opacity:0 }} animate={{ y:0, opacity:1 }} transition={{ delay:0.2, ...SPRING }}>
      <Breathe delay={0.4} amount={0.008}>
        <ellipse cx="280" cy="240" rx="23" ry="5" fill="url(#corp-floor)"/>
        <path d="M260 237 Q258 212 264 196 Q271 182 280 181 Q289 182 296 196 Q302 212 300 237 Z"
          fill="url(#corp-body-dark)" filter="url(#corp-shadow)"/>
        <path d="M274 184 Q280 181 286 184 Q283 196 280 198 Q277 196 274 184 Z" fill="white" fillOpacity="0.10"/>
        <path d="M275 190 Q280 194 285 190" fill="none" stroke="white" strokeWidth="1.8" strokeOpacity="0.3" strokeLinecap="round"/>
        <rect x="274" y="174" width="11" height="8" rx="4" fill="url(#corp-skin1)"/>
        <ellipse cx="282" cy="161" rx="16" ry="16" fill="#000" fillOpacity="0.09"/>
        <circle cx="280" cy="159" r="16" fill="url(#corp-skin1)" filter="url(#corp-inner)"/>
        <path d="M272 157 Q275 154 279 157" fill="none" stroke={T.mid} strokeWidth="1.3" strokeLinecap="round"/>
        <path d="M281 157 Q284 154 288 157" fill="none" stroke={T.mid} strokeWidth="1.3" strokeLinecap="round"/>
        <line x1="279" y1="157" x2="281" y2="157" stroke={T.mid} strokeWidth="1.1"/>
        <ellipse cx="275" cy="157" rx="2" ry="2.6" fill="#1A1A2E"/>
        <ellipse cx="285" cy="157" rx="2" ry="2.6" fill="#1A1A2E"/>
        <circle cx="276" cy="156" r="0.8" fill="white"/>
        <circle cx="286" cy="156" r="0.8" fill="white"/>
        <path d="M280 162 Q282 165 280 167" stroke="#C0805A" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        <path d="M276 170 Q280 174 284 170" stroke="#B0705A" strokeWidth="1.3" fill="none" strokeLinecap="round"/>
        <path d="M266 153 Q269 142 280 140 Q291 142 294 153 Q288 147 280 146 Q272 147 266 153 Z" fill="url(#corp-hair0)"/>
        <motion.g animate={{ rotate:[-3,3,-3] }} style={{ transformOrigin:'280px 208px' }}
          transition={{ repeat:Infinity, duration:4, ease:'easeInOut' }}>
          <path d="M262 200 Q250 208 248 220" stroke="url(#corp-skin1)" strokeWidth="9" strokeLinecap="round" fill="none"/>
          <path d="M298 200 Q310 208 312 220" stroke="url(#corp-skin1)" strokeWidth="9" strokeLinecap="round" fill="none"/>
          <rect x="255" y="208" width="50" height="34" rx="4" fill="white" stroke="#D0DCE8" strokeWidth="2" filter="url(#corp-shadow)"/>
          {[0,1,2,3].map(i=>(
            <line key={i} x1={260} y1={215+i*6} x2={300} y2={215+i*6}
              stroke={i===0?T.orange:'#CFD8DC'} strokeWidth={i===0?1.8:1} strokeLinecap="round"/>
          ))}
          <circle cx="266" cy="217" r="2.5" fill={T.orange} fillOpacity="0.6"/>
        </motion.g>
      </Breathe>
    </motion.g>

    {/* Left person - dark long hair */}
    <motion.g initial={{ x:-20, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:0.35, ...SPRING }}>
      <Breathe delay={0.1} amount={0.008}>
        <ellipse cx="168" cy="240" rx="19" ry="4" fill="url(#corp-floor)"/>
        <path d="M155 237 Q153 214 158 200 Q163 187 168 186 Q173 187 178 200 Q183 214 181 237 Z"
          fill="url(#corp-body-slate)" filter="url(#corp-shadow)"/>
        <rect x="162" y="179" width="10" height="8" rx="4" fill="url(#corp-skin0)"/>
        <ellipse cx="170" cy="167" rx="14" ry="14" fill="#000" fillOpacity="0.09"/>
        <circle cx="168" cy="165" r="14" fill="url(#corp-skin0)" filter="url(#corp-inner)"/>
        <ellipse cx="163" cy="168" rx="3.5" ry="2.2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="174" cy="168" rx="3.5" ry="2.2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="164" cy="164" rx="2" ry="2.5" fill="#1A1A2E"/>
        <ellipse cx="173" cy="164" rx="2" ry="2.5" fill="#1A1A2E"/>
        <circle cx="165" cy="163" r="0.7" fill="white"/>
        <circle cx="174" cy="163" r="0.7" fill="white"/>
        <path d="M168 169 Q170 172 168 174" stroke="#C0805A" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M165 177 Q168 180 171 177" stroke="#B0705A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M156 161 Q159 150 168 148 Q177 150 180 161 Q175 155 168 154 Q161 155 156 161 Z" fill="url(#corp-hair0)"/>
        <path d="M156 163 Q155 178 157 192" stroke="#111" strokeWidth="7" strokeLinecap="round" fill="none"/>
        <path d="M180 163 Q181 174 179 186" stroke="#111" strokeWidth="5" strokeLinecap="round" fill="none"/>
        <motion.path d="M177 200 Q192 212 188 224" stroke="url(#corp-skin0)" strokeWidth="9" strokeLinecap="round" fill="none"
          animate={{ rotate:[-4,4,-4] }} style={{ transformOrigin:'177px 200px' }}
          transition={{ repeat:Infinity, duration:3.5 }}/>
        <path d="M155 200 Q149 214 153 237" stroke="url(#corp-skin0)" strokeWidth="9" strokeLinecap="round" fill="none"/>
      </Breathe>
    </motion.g>

    {/* Far-left person */}
    <motion.g initial={{ x:-30, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:0.5, ...SPRING }}>
      <Breathe delay={0.6} amount={0.008}>
        <ellipse cx="90" cy="240" rx="17" ry="4" fill="url(#corp-floor)"/>
        <path d="M79 237 Q77 216 82 203 Q87 191 90 190 Q93 191 98 203 Q103 216 101 237 Z"
          fill="url(#corp-body-dark)" filter="url(#corp-shadow)"/>
        <rect x="84" y="183" width="10" height="8" rx="4" fill="url(#corp-skin2)"/>
        <ellipse cx="92" cy="171" rx="13" ry="13" fill="#000" fillOpacity="0.09"/>
        <circle cx="90" cy="169" r="13" fill="url(#corp-skin2)" filter="url(#corp-inner)"/>
        <ellipse cx="85" cy="172" rx="3.2" ry="2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="96" cy="172" rx="3.2" ry="2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="86" cy="168" rx="1.9" ry="2.3" fill="#1A1A2E"/>
        <ellipse cx="95" cy="168" rx="1.9" ry="2.3" fill="#1A1A2E"/>
        <circle cx="87" cy="167" r="0.6" fill="white"/>
        <circle cx="96" cy="167" r="0.6" fill="white"/>
        <path d="M90 173 Q92 176 90 178" stroke="#C0805A" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M87 181 Q90 184 93 181" stroke="#B0705A" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        <path d="M79 163 Q82 153 90 151 Q98 153 101 163 Q96 158 90 157 Q84 158 79 163 Z" fill="url(#corp-hair2)"/>
        <path d="M98 203 Q110 214 106 224" stroke="url(#corp-skin2)" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M79 203 Q73 215 77 237" stroke="url(#corp-skin2)" strokeWidth="8" strokeLinecap="round" fill="none"/>
      </Breathe>
    </motion.g>

    {/* Right person - gesturing */}
    <motion.g initial={{ x:20, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:0.4, ...SPRING }}>
      <Breathe delay={0.5} amount={0.008}>
        <ellipse cx="392" cy="240" rx="19" ry="4" fill="url(#corp-floor)"/>
        <path d="M379 237 Q377 214 382 200 Q387 187 392 186 Q397 187 402 200 Q407 214 405 237 Z"
          fill="url(#corp-body-orange)" filter="url(#corp-shadow)"/>
        <path d="M387 189 Q392 186 397 189 Q395 199 392 201 Q389 199 387 189 Z" fill="white" fillOpacity="0.10"/>
        <rect x="386" y="179" width="10" height="8" rx="4" fill="url(#corp-skin1)"/>
        <ellipse cx="394" cy="167" rx="14" ry="14" fill="#000" fillOpacity="0.09"/>
        <circle cx="392" cy="165" r="14" fill="url(#corp-skin1)" filter="url(#corp-inner)"/>
        <ellipse cx="386" cy="168" rx="3.5" ry="2.2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="398" cy="168" rx="3.5" ry="2.2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="387" cy="164" rx="2" ry="2.5" fill="#1A1A2E"/>
        <ellipse cx="397" cy="164" rx="2" ry="2.5" fill="#1A1A2E"/>
        <circle cx="388" cy="163" r="0.7" fill="white"/>
        <circle cx="398" cy="163" r="0.7" fill="white"/>
        <path d="M392 169 Q394 172 392 174" stroke="#C0805A" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M389 177 Q392 180 395 177" stroke="#B0705A" strokeWidth="1.2" fill="none" strokeLinecap="round"/>
        <path d="M380 160 Q383 150 392 148 Q401 150 404 160 Q398 154 392 153 Q386 154 380 160 Z" fill="url(#corp-hair1)"/>
        <motion.path d="M379 200 Q366 210 360 222" stroke="url(#corp-skin1)" strokeWidth="9" strokeLinecap="round" fill="none"
          animate={{ rotate:[-5,5,-5] }} style={{ transformOrigin:'379px 200px' }}
          transition={{ repeat:Infinity, duration:3 }}/>
        <path d="M405 200 Q411 213 405 237" stroke="url(#corp-skin1)" strokeWidth="9" strokeLinecap="round" fill="none"/>
      </Breathe>
    </motion.g>

    {/* Far-right person */}
    <motion.g initial={{ x:30, opacity:0 }} animate={{ x:0, opacity:1 }} transition={{ delay:0.55, ...SPRING }}>
      <Breathe delay={0.8} amount={0.008}>
        <ellipse cx="472" cy="240" rx="17" ry="4" fill="url(#corp-floor)"/>
        <path d="M461 237 Q459 216 464 203 Q469 191 472 190 Q475 191 480 203 Q485 216 483 237 Z"
          fill="url(#corp-body-slate)" filter="url(#corp-shadow)"/>
        <rect x="466" y="183" width="10" height="8" rx="4" fill="url(#corp-skin0)"/>
        <ellipse cx="474" cy="171" rx="13" ry="13" fill="#000" fillOpacity="0.09"/>
        <circle cx="472" cy="169" r="13" fill="url(#corp-skin0)" filter="url(#corp-inner)"/>
        <ellipse cx="467" cy="172" rx="3.2" ry="2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="478" cy="172" rx="3.2" ry="2" fill="#E8805A" fillOpacity="0.13"/>
        <ellipse cx="468" cy="168" rx="1.9" ry="2.3" fill="#1A1A2E"/>
        <ellipse cx="477" cy="168" rx="1.9" ry="2.3" fill="#1A1A2E"/>
        <circle cx="469" cy="167" r="0.6" fill="white"/>
        <circle cx="478" cy="167" r="0.6" fill="white"/>
        <path d="M472 173 Q474 176 472 178" stroke="#C0805A" strokeWidth="1" fill="none" strokeLinecap="round"/>
        <path d="M469 181 Q472 184 475 181" stroke="#B0705A" strokeWidth="1.1" fill="none" strokeLinecap="round"/>
        <path d="M461 163 Q464 153 472 151 Q480 153 483 163 Q478 158 472 157 Q466 158 461 163 Z" fill="url(#corp-hair3)"/>
        <path d="M461 203 Q455 215 459 237" stroke="url(#corp-skin0)" strokeWidth="8" strokeLinecap="round" fill="none"/>
        <path d="M481 203 Q488 213 484 224" stroke="url(#corp-skin0)" strokeWidth="8" strokeLinecap="round" fill="none"/>
      </Breathe>
    </motion.g>

    {/* Chair backs */}
    {[[87,240],[163,242],[387,242],[468,240]].map(([cx,cy],i) => (
      <g key={i}>
        <path d={`M${cx-20} ${cy} Q${cx} ${cy-10} ${cx+20} ${cy}`}
          fill="none" stroke={T.mid} strokeWidth="6" strokeLinecap="round"/>
        <line x1={cx} y1={cy} x2={cx} y2={cy+28} stroke={T.mid} strokeWidth="5"/>
        <ellipse cx={cx} cy={cy+28} rx="14" ry="4" fill={T.mid} fillOpacity="0.4"/>
      </g>
    ))}
  </svg>
);


// ─────────────────────────────────────────────────────────────────────────────
// 6. CONSULTING SCENE
// ─────────────────────────────────────────────────────────────────────────────
export const ConsultingScene = () => {
  const bars = [
    { x: 130, maxH: 55,  color: T.orange,   delay: 0   },
    { x: 180, maxH: 88,  color: T.orangeHi, delay: 0.2 },
    { x: 230, maxH: 115, color: T.orange,   delay: 0.4 },
    { x: 280, maxH: 75,  color: T.orangeLo, delay: 0.6 },
  ];

  return (
    <svg viewBox="0 0 500 340" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlowDefs id="consult" />
      <circle cx="250" cy="170" r="155" fill="url(#consult-radial)" />

      {/* Whiteboard */}
      <rect x="90" y="70" width="320" height="175" rx="12" fill="var(--bg)"
        stroke="var(--border)" strokeWidth="8" />
      <rect x="128" y="238" width="10" height="60" fill="#B0BEC5" />
      <rect x="362" y="238" width="10" height="60" fill="#B0BEC5" />

      {/* Grid lines */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={108} y1={100 + i * 38} x2={402} y2={100 + i * 38}
          stroke="#EEF2F7" strokeWidth="1" />
      ))}

      {/* Chart bars */}
      {bars.map((b, i) => (
        <motion.g key={i}>
          <motion.rect
            x={b.x} y={210} width={32} rx={4}
            fill={b.color} fillOpacity="0.85"
            initial={{ height: 0, y: 210 }}
            animate={{ height: b.maxH, y: 210 - b.maxH }}
            transition={{ delay: b.delay, duration: 0.9, ease: EASE }}
          />
          {/* Glow on tallest */}
          {i === 2 && (
            <motion.rect x={b.x} y={210 - b.maxH} width={32} height={b.maxH} rx={4}
              fill={T.orange} fillOpacity="0"
              animate={{ fillOpacity: [0, 0.15, 0] }}
              transition={{ repeat: Infinity, duration: 2 }}
            />
          )}
          {/* Value dot */}
          <motion.circle cx={b.x + 16} cy={210} r={5} fill={b.color}
            filter="url(#consult-glow-sm)"
            initial={{ cy: 210, opacity: 0 }}
            animate={{ cy: 210 - b.maxH, opacity: 1 }}
            transition={{ delay: b.delay + 0.8, duration: 0.5, ...SPRING }}
          />
        </motion.g>
      ))}

      {/* Trend line */}
      <motion.path
        d={`M146 ${210-55} L196 ${210-88} L246 ${210-115} L296 ${210-75}`}
        fill="none" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round"
        strokeDasharray="200" strokeDashoffset="200"
        animate={{ strokeDashoffset: 0 }}
        transition={{ delay: 1.2, duration: 1, ease: 'easeOut' }}
      />

      {/* Magnifying glass scanning */}
      <motion.g
        animate={{ x: [0, 80, 140, 80, 0], y: [0, -20, 10, -20, 0] }}
        transition={{ repeat: Infinity, duration: 6, ease: 'easeInOut' }}
      >
        <circle cx={340} cy={155} r={28} fill="none" stroke={T.mid} strokeWidth="5" />
        <circle cx={340} cy={155} r={28} fill={T.orange} fillOpacity="0.06" />
        <path d="M360 175 L382 197" stroke={T.mid} strokeWidth="8" strokeLinecap="round" />
        {/* Scan line inside lens */}
        <motion.line x1={318} y1={155} x2={362} y2={155}
          stroke={T.orange} strokeWidth="1.5" strokeOpacity="0.5"
          animate={{ y1: [140, 170, 140], y2: [140, 170, 140] }}
          transition={{ repeat: Infinity, duration: 1.8, ease: 'easeInOut' }}
        />
      </motion.g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 7. INVESTMENT SCENE
// ─────────────────────────────────────────────────────────────────────────────
export const InvestmentScene = () => {
  const points = [
    { x: 80,  y: 280 },
    { x: 160, y: 220 },
    { x: 240, y: 238 },
    { x: 320, y: 158 },
    { x: 420, y: 98  },
  ];
  const pathD = points.map((p,i) => `${i===0?'M':'L'}${p.x} ${p.y}`).join(' ');
  const areaD = pathD + ` L${points[points.length-1].x} 290 L${points[0].x} 290 Z`;

  const bars = [
    { x: 72,  h: 48,  color0: '#6EE7F7', color1: '#2196F3', label: 'Q1' },
    { x: 152, h: 72,  color0: '#A78BFA', color1: '#7C3AED', label: 'Q2' },
    { x: 232, h: 58,  color0: '#FCD34D', color1: '#F59E0B', label: 'Q3' },
    { x: 312, h: 110, color0: '#6EE7B7', color1: '#059669', label: 'Q4' },
    { x: 412, h: 155, color0: '#FFBA5A', color1: '#F7941D', label: 'Now' },
  ];

  return (
    <svg viewBox="0 0 500 340" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlowDefs id="invest" />

      <defs>
        <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0%"   stopColor={T.orange} stopOpacity="0.18" />
          <stop offset="100%" stopColor={T.orange} stopOpacity="0"    />
        </linearGradient>
        <linearGradient id="lineGrad" x1="0" y1="0" x2="1" y2="0">
          <stop offset="0%"   stopColor={T.orangeLo} />
          <stop offset="100%" stopColor={T.orangeHi} />
        </linearGradient>
        {/* Bar gradients */}
        {bars.map((b, i) => (
          <linearGradient key={i} id={`barGrad${i}`} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%"   stopColor={b.color0} stopOpacity="1" />
            <stop offset="100%" stopColor={b.color1} stopOpacity="0.7" />
          </linearGradient>
        ))}
        <filter id="barShadow" x="-20%" y="-20%" width="140%" height="140%">
          <feDropShadow dx="0" dy="3" stdDeviation="4" floodOpacity="0.18" />
        </filter>
      </defs>

      <circle cx="250" cy="170" r="155" fill="url(#invest-radial)" />

      {/* Grid */}
      {[0,1,2,3].map(i => (
        <line key={i} x1={60} y1={100 + i*50} x2={460} y2={100 + i*50}
          stroke="#E8EFF5" strokeWidth="1" />
      ))}
      {[0,1,2,3,4].map(i => (
        <line key={i} x1={80 + i*85} y1={80} x2={80 + i*85} y2={295}
          stroke="#E8EFF5" strokeWidth="1" />
      ))}

      {/* ── Colored bars ── */}
      {bars.map((b, i) => (
        <motion.g key={i}
          initial={{ opacity: 0, scaleY: 0 }}
          animate={{ opacity: 1, scaleY: 1 }}
          transition={{ delay: 0.15 + i * 0.12, duration: 0.7, ease: EASE }}
          style={{ transformOrigin: `${b.x + 16}px 294px` }}
        >
          {/* Bar body */}
          <motion.rect
            x={b.x} y={294 - b.h} width={32} height={b.h} rx={6}
            fill={`url(#barGrad${i})`}
            filter="url(#barShadow)"
          />
          {/* Bar top highlight */}
          <rect x={b.x + 4} y={294 - b.h + 3} width={12} height={6} rx={3}
            fill="white" fillOpacity="0.28" />
          {/* Glowing dot at top */}
          <motion.circle
            cx={b.x + 16} cy={294 - b.h}
            r={5}
            fill={b.color0}
            filter="url(#invest-glow-sm)"
            animate={{ opacity: [0.7, 1, 0.7], scale: [1, 1.25, 1] }}
            transition={{ repeat: Infinity, duration: 2 + i * 0.3, delay: i * 0.2 }}
            style={{ transformOrigin: `${b.x + 16}px ${294 - b.h}px` }}
          />
          {/* Label */}
          <text x={b.x + 16} y={308} fontSize="8" fill={T.grey}
            textAnchor="middle" fontFamily="sans-serif" fontWeight="600">
            {b.label}
          </text>
        </motion.g>
      ))}

      {/* Area fill */}
      <motion.path d={areaD} fill="url(#areaGrad)"
        initial={{ opacity: 0 }} animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.6 }}
      />

      {/* Chart line draw */}
      <motion.path d={pathD} fill="none"
        stroke="url(#lineGrad)" strokeWidth="4"
        strokeLinecap="round" strokeLinejoin="round"
        strokeDasharray="600" strokeDashoffset="600"
        animate={{ strokeDashoffset: 0 }}
        transition={{ duration: 1.6, ease: EASE }}
        filter="url(#invest-glow-sm)"
      />

      {/* Axis */}
      <line x1={60} y1={295} x2={460} y2={295} stroke="#C5D1DC" strokeWidth="2" />
      <line x1={60} y1={80}  x2={60}  y2={295} stroke="#C5D1DC" strokeWidth="2" />

      {/* Data points */}
      {points.map((p, i) => (
        <motion.g key={i}
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.3 + i * 0.28, ...SPRING }}
          style={{ transformOrigin: `${p.x}px ${p.y}px` }}
        >
          {i === points.length - 1 && (
            <>
              <PulseRing cx={p.x} cy={p.y} r={14} />
              <motion.circle cx={p.x} cy={p.y} r={22}
                fill={T.orange} fillOpacity="0"
                animate={{ fillOpacity: [0, 0.08, 0] }}
                transition={{ repeat: Infinity, duration: 2 }}
              />
            </>
          )}
          <Float y={i === points.length-1 ? 8 : 5} delay={i * 0.2} dur={2 + i * 0.2}>
            <circle cx={p.x} cy={p.y} r={i === points.length-1 ? 14 : 9}
              fill={i === points.length-1 ? T.orange : T.orangeHi}
              filter={i === points.length-1 ? 'url(#invest-glow-md)' : 'url(#invest-glow-sm)'}
            />
            <circle cx={p.x} cy={p.y} r={i === points.length-1 ? 6 : 4} fill="white" />
          </Float>
        </motion.g>
      ))}

      {/* Peak value callout */}
      <motion.g
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 2, ...SPRING }}
      >
        <rect x={390} y={60} width={66} height={28} rx={8}
          fill={T.orange} filter="url(#invest-glow-sm)" />
        <text x={423} y={79} fontSize="11" fill="white" textAnchor="middle"
          fontFamily="sans-serif" fontWeight="bold">+42.8%</text>
        <path d="M422 88 L416 96 L428 88 Z" fill={T.orange} />
      </motion.g>
    </svg>
  );
};

// ─────────────────────────────────────────────────────────────────────────────
// 6. EXPERT CALLS SCENE
// ─────────────────────────────────────────────────────────────────────────────
export const ExpertCallsScene = () => {
  return (
    <svg viewBox="0 0 500 340" className="w-full h-full" fill="none" xmlns="http://www.w3.org/2000/svg">
      <GlowDefs id="expert-calls" />
      <circle cx="250" cy="170" r="150" fill="url(#expert-calls-radial)" opacity="0.4" />
      
      {/* Shutter background lines */}
      <g stroke="#D8E3EC" strokeWidth="2" strokeOpacity="0.15">
        {[...Array(12)].map((_, i) => (
          <line key={i} x1="50" y1={60 + i * 18} x2="450" y2={60 + i * 18} />
        ))}
      </g>

      {/* Desk */}
      <rect x="80" y="250" width="340" height="70" rx="4" fill="#2C3E50" />
      <rect x="80" y="250" width="340" height="8" fill="#3D5166" />

      {/* Character */}
      <motion.g
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.2, ...SPRING }}
      >
        <Breathe amount={0.01}>
          {/* Torso */}
          <path d="M200 250 Q195 210 215 190 Q230 175 250 175 Q270 175 285 190 Q305 210 300 250 Z" 
            fill="url(#expert-calls-body-dark)" filter="url(#expert-calls-shadow)" />
          {/* Head */}
          <circle cx="250" cy="155" r="28" fill="url(#expert-calls-skin0)" />
          {/* Eyes */}
          <motion.g
            animate={{ scaleY: [1, 0.1, 1] }}
            transition={{ repeat: Infinity, duration: 4, times: [0, 0.05, 1], delay: 1 }}
            style={{ transformOrigin: '250px 152px' }}
          >
            <circle cx="242" cy="152" r="3" fill="#1A1A2E" />
            <circle cx="258" cy="152" r="3" fill="#1A1A2E" />
          </motion.g>
          {/* Mouth */}
          <motion.path
            d="M242 166 Q250 171 258 166"
            stroke="#B0705A"
            strokeWidth="2"
            strokeLinecap="round"
            fill="none"
            animate={{ 
              d: [
                "M242 166 Q250 171 258 166", 
                "M240 168 Q250 162 260 168", 
                "M242 166 Q250 171 258 166"
              ] 
            }}
            transition={{ repeat: Infinity, duration: 2.5, ease: "easeInOut" }}
          />
          {/* Hair */}
          <path d="M222 153 Q225 125 250 125 Q275 125 278 153 Q260 142 250 142 Q240 142 222 153 Z" fill="url(#expert-calls-hair0)" />
          {/* Headset */}
          <path d="M223 155 Q223 125 250 125 Q277 125 277 155" stroke="#1A2740" strokeWidth="6" fill="none" />
          <rect x="218" y="150" width="10" height="22" rx="5" fill="#1A2740" />
          <rect x="272" y="150" width="10" height="22" rx="5" fill="#1A2740" />
          <path d="M228 168 Q215 178 225 188" stroke="#1A2740" strokeWidth="3" fill="none" strokeLinecap="round" />
          <motion.circle 
            cx="226" cy="189" r="4" fill={T.orange} 
            animate={{ opacity: [0.7, 1, 0.7] }}
            transition={{ repeat: Infinity, duration: 1.5 }}
          />
        </Breathe>
      </motion.g>

      {/* Laptop */}
      <motion.g
        initial={{ scale: 0.8, opacity: 0 }}
        whileInView={{ scale: 1, opacity: 1 }}
        viewport={{ once: true }}
        transition={{ delay: 0.4, ...SPRING }}
      >
        <rect x="205" y="215" width="90" height="55" rx="4" fill="#FFFFFF" filter="url(#expert-calls-shadow)" />
        <rect x="205" y="265" width="90" height="6" rx="3" fill="#CFD8DC" />
        <circle cx="250" cy="235" r="7" fill={T.orange} opacity="0.1" />
      </motion.g>

      {/* Floating Icons */}
      <Float y={12} delay={0} dur={4}>
        <motion.g 
          initial={{ scale: 0, opacity: 0 }} 
          whileInView={{ scale: 1, opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.6, ...SPRING }}
        >
          <rect x="120" y="100" width="60" height="70" rx="6" fill="white" stroke="#D8E3EC" filter="url(#expert-calls-shadow)" />
          <circle cx="150" cy="130" r="18" fill="none" stroke={T.orange} strokeWidth="1.5" strokeDasharray="4 2" />
          <text x="150" y="135" textAnchor="middle" fontSize="12" fontWeight="bold" fill={T.orange} fontFamily="monospace">24h</text>
        </motion.g>
      </Float>

      <Float y={10} delay={1} dur={3.5}>
        <motion.g 
          initial={{ scale: 0, opacity: 0 }} 
          whileInView={{ scale: 1, opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ delay: 0.8, ...SPRING }}
        >
          <rect x="360" y="70" width="55" height="40" rx="6" fill="white" stroke="#D8E3EC" filter="url(#expert-calls-shadow)" />
          <path d="M370 82 L387.5 95 L405 82" stroke={T.orange} strokeWidth="2" fill="none" strokeLinecap="round" />
        </motion.g>
      </Float>

      <Float y={15} delay={0.5} dur={4.5}>
        <motion.g 
          initial={{ scale: 0, opacity: 0 }} 
          whileInView={{ scale: 1, opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ delay: 1, ...SPRING }}
        >
          <circle cx="390" cy="180" r="26" fill="white" stroke="#D8E3EC" filter="url(#expert-calls-shadow)" />
          <path d="M380 178 Q380 170 390 170 Q400 170 400 178 Q400 188 390 192 Q380 188 380 178" 
            fill="none" stroke={T.orange} strokeWidth="2.5" strokeLinecap="round" />
        </motion.g>
      </Float>

      <Float y={10} delay={1.5} dur={3.8}>
        <motion.g 
          initial={{ scale: 0, opacity: 0 }} 
          whileInView={{ scale: 1, opacity: 1 }} 
          viewport={{ once: true }}
          transition={{ delay: 1.2, ...SPRING }}
        >
          <rect x="230" y="40" width="55" height="35" rx="6" fill="white" stroke="#D8E3EC" filter="url(#expert-calls-shadow)" />
          <circle cx="242" cy="57" r="2.5" fill={T.orange} />
          <circle cx="257.5" cy="57" r="2.5" fill={T.orange} />
          <circle cx="273" cy="57" r="2.5" fill={T.orange} />
        </motion.g>
      </Float>
    </svg>
  );
};

