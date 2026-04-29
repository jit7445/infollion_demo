"use client";

import React, { useEffect, useRef, useCallback } from "react";

const OR = "#F5A623";
const OR2 = "rgba(245,166,35,";
const BG = "#0A0A0B"; // Matching the app's dark theme

interface Node {
  x: number;
  y: number;
  r: number;
  glow: number;
  expert: boolean;
}

interface FailLine {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  life: number;
}

export function InfollionStory() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  
  // Animation state refs to avoid re-renders
  const state = useRef({
    t: 0,
    phase: 0,
    pt: 0,
    nodes: [] as Node[],
    expert: null as Node | null,
    client: { x: 55, y: 190, r: 9 },
    ring: { x: -60, y: 190, r: 20, alpha: 0 },
    failLines: [] as FailLine[],
    failQueue: [] as number[],
    scanIdx: 0,
    scanTimer: 0,
    scanned: [] as number[],
    expertHalo: 0,
    clientP: 0,
    waveOff: 0,
    waveA: 0,
    ringFade: 1,
    logoT: 0,
    images: {
      full: null as HTMLImageElement | null,
      icon: null as HTMLImageElement | null,
    },
    initialized: false,
    dimensions: { width: 900, height: 520 },
  });

  const initNodes = useCallback(() => {
    const s = state.current;
    const { width, height } = s.dimensions;
    s.nodes = [];
    const cols = 13, rows = 7;
    for (let i = 0; i < cols; i++) {
      for (let j = 0; j < rows; j++) {
        s.nodes.push({
          x: 70 + i * (width - 140) / (cols - 1) + (Math.random() - 0.5) * 20,
          y: 55 + j * (height - 140) / (rows - 1) + (Math.random() - 0.5) * 20,
          r: 11 + Math.random() * 6, // Significantly larger
          glow: 0,
          expert: false,
        });
      }
    }
    const expertIdx = 45; // Match index from provided code
    s.nodes[expertIdx].expert = true;
    s.expert = s.nodes[expertIdx];
    s.client = { x: 80, y: height / 2, r: 22 }; // Significantly larger
    s.ring = { x: -110, y: height / 2, r: 40, alpha: 0 }; // Significantly larger
    s.failQueue = [];
    let pool = Array.from({ length: s.nodes.length }, (_, i) => i).filter(i => i !== expertIdx);
    for (let k = 0; k < 8; k++) {
      const r = Math.floor(Math.random() * pool.length);
      s.failQueue.push(pool.splice(r, 1)[0]);
    }
    s.failLines = [];
    s.scanned = [];
    s.scanIdx = 0;
    s.scanTimer = 0;
    s.expertHalo = 0;
    s.clientP = 0;
    s.waveA = 0;
    s.ringFade = 1;
    s.logoT = 0;
    s.pt = 0;
    s.phase = 0;
  }, []);

  const setPhase = (p: number) => {
    state.current.phase = p;
    state.current.pt = 0;
  };

  const drawNodeHuman = (ctx: CanvasRenderingContext2D, x: number, y: number, r: number, glowAmt: number, isExpert: boolean) => {
    ctx.save();
    if (glowAmt > 0.05) {
      const g = ctx.createRadialGradient(x, y, 0, x, y, r * 4.5);
      g.addColorStop(0, OR2 + (glowAmt * 0.4) + ')');
      g.addColorStop(1, 'transparent');
      ctx.beginPath();
      ctx.arc(x, y, r * 4.5, 0, Math.PI * 2);
      ctx.fillStyle = g;
      ctx.fill();
    }
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fillStyle = isExpert ? `rgba(245,166,35,${0.2 + glowAmt * 0.4})` : `rgba(60, 58, 56, 0.8)`;
    ctx.strokeStyle = isExpert ? OR2 + (0.8 + glowAmt * 0.2) + ')' : 'rgba(140, 138, 134, 0.4)';
    ctx.lineWidth = 2.2; // Even thicker border
    ctx.fill();
    ctx.stroke();
    
    const s = r * 0.82; // Even larger stickman size
    const col = isExpert ? OR : 'rgba(215, 210, 203, 0.8)';
    ctx.strokeStyle = col;
    ctx.lineWidth = r * 0.28; // Even thicker stickman lines
    ctx.lineCap = 'round';
    ctx.beginPath();
    ctx.arc(x, y - s * 0.6, s * 0.45, 0, Math.PI * 2); // Larger head
    ctx.stroke();
    ctx.beginPath();
    ctx.moveTo(x, y - s * 0.15); ctx.lineTo(x, y + s * 0.6); // Torso
    ctx.moveTo(x - s * 0.55, y + s * 0.25); ctx.lineTo(x + s * 0.55, y + s * 0.25); // Arms
    ctx.moveTo(x, y + s * 0.6); ctx.lineTo(x - s * 0.4, y + s * 1.2); // Legs
    ctx.moveTo(x, y + s * 0.6); ctx.lineTo(x + s * 0.4, y + s * 1.2);
    ctx.stroke();
    ctx.restore();
  };

  const drawWave = (ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, off: number, a: number) => {
    ctx.save();
    ctx.strokeStyle = OR2 + a + ')';
    ctx.lineWidth = 1.3;
    ctx.setLineDash([5, 5]);
    const dx = x2 - x1, dy = y2 - y1, len = Math.hypot(dx, dy);
    const px = -dy / len, py = dx / len;
    ctx.beginPath();
    for (let i = 0; i <= 64; i++) {
      const f = i / 64;
      const w = Math.sin(f * Math.PI * 5 + off) * 6.5;
      const nx = x1 + dx * f + px * w;
      const ny = y1 + dy * f + py * w;
      if (i === 0) ctx.moveTo(nx, ny); else ctx.lineTo(nx, ny);
    }
    ctx.stroke();
    ctx.setLineDash([]);
    ctx.restore();
  };

  const lerp = (a: number, b: number, f: number) => a + (b - a) * f;
  const eio = (t: number) => t < 0.5 ? 2 * t * t : 1 - Math.pow(-2 * t + 2, 2) / 2;

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Use current environment's logo or common names
    const imgFull = new Image();
    imgFull.src = "/images/logo_hd.png"; // Local asset
    imgFull.onload = () => { state.current.images.full = imgFull; };
    
    const imgIcon = new Image();
    imgIcon.src = "/favicon.svg"; // Fallback to favicon as icon
    imgIcon.onload = () => { state.current.images.icon = imgIcon; };

    initNodes();

    let rafId: number;
    const loop = () => {
      const s = state.current;
      const { width, height } = s.dimensions;
      
      // Update logic
      s.t++;
      s.pt++;
      s.waveOff += 0.09;

      if (s.phase === 0) {
        s.client.x = lerp(s.client.x, 65 + Math.sin(s.t * 0.018) * 25, 0.035);
        s.client.y = lerp(s.client.y, height / 2 + Math.cos(s.t * 0.013) * 35, 0.035);
        s.failLines.forEach(f => f.life -= 0.025);
        s.failLines = s.failLines.filter(f => f.life > 0);
        s.nodes.forEach(n => { if (!n.expert) n.glow = Math.max(0, n.glow - 0.025); });
        if (s.pt % 60 === 0 && s.failQueue.length > 0) {
          const ni = s.failQueue.shift()!;
          const n = s.nodes[ni];
          s.failLines.push({ x1: s.client.x, y1: s.client.y, x2: n.x, y2: n.y, life: 1 });
          n.glow = 0.8;
        }
        if (s.pt > 350) setPhase(1);
      } else if (s.phase === 1) {
        s.ring.alpha = Math.min(1, s.ring.alpha + 0.035);
        const tn = s.nodes[Math.min(s.scanIdx, s.nodes.length - 1)];
        s.ring.x = lerp(s.ring.x, tn.x, 0.075);
        s.ring.y = lerp(s.ring.y, tn.y, 0.075);
        s.scanTimer++;
        if (Math.hypot(s.ring.x - tn.x, s.ring.y - tn.y) < 10 && s.scanTimer > 15) {
          tn.glow = Math.min(0.9, tn.glow + 0.5);
          s.scanned.push(s.scanIdx);
          s.scanIdx = Math.min(s.scanIdx + Math.floor(Math.random() * 4 + 2), s.nodes.length - 1);
          s.scanTimer = 0;
        }
        s.scanned.forEach(i => { if (!s.nodes[i].expert) s.nodes[i].glow = Math.max(0, s.nodes[i].glow - 0.007); });
        if (s.scanned.length > 20) setPhase(2);
      } else if (s.phase === 2) {
        s.ring.x = lerp(s.ring.x, s.expert!.x, 0.055);
        s.ring.y = lerp(s.ring.y, s.expert!.y, 0.055);
        s.expert!.glow = Math.min(1, s.expert!.glow + 0.04);
        s.expertHalo = Math.min(1, s.expertHalo + 0.03);
        if (Math.hypot(s.ring.x - s.expert!.x, s.ring.y - s.expert!.y) < 8 && s.expert!.glow > 0.9) setPhase(3);
      } else if (s.phase === 3) {
        s.clientP = Math.min(1, s.clientP + 0.014);
        const p = eio(s.clientP);
        s.client.x = lerp(65, s.expert!.x - 55, p);
        s.client.y = lerp(height / 2, s.expert!.y, p);
        s.ring.x = lerp(s.ring.x, (s.client.x + s.expert!.x) / 2, 0.05);
        s.ring.y = lerp(s.ring.y, (s.client.y + s.expert!.y) / 2, 0.05);
        s.expert!.glow = 0.75 + Math.sin(s.t * 0.09) * 0.25;
        if (s.clientP >= 1) setPhase(4);
      } else if (s.phase === 4) {
        s.waveA = Math.min(0.65, s.waveA + 0.018);
        s.expert!.glow = 0.75 + Math.sin(s.t * 0.11) * 0.25;
        if (s.pt > 140) setPhase(5);
      } else if (s.phase === 5) {
        s.ringFade = Math.max(0, s.ringFade - 0.022);
        s.logoT = Math.min(1, s.logoT + 0.012);
        
        // Loop back to start after a pause at the finish
        if (s.logoT >= 1 && s.pt > 280) {
          initNodes();
        }
      }

      // Render logic
      ctx.clearRect(0, 0, width, height);
      ctx.fillStyle = BG;
      ctx.fillRect(0, 0, width, height);
      
      // Grid
      ctx.save();
      ctx.strokeStyle = 'rgba(255,255,255,0.025)';
      ctx.lineWidth = 0.5;
      for (let x = 0; x < width; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 0); ctx.lineTo(x, height); ctx.stroke();
      }
      for (let y = 0; y < height; y += 40) {
        ctx.beginPath(); ctx.moveTo(0, y); ctx.lineTo(width, y); ctx.stroke();
      }
      ctx.restore();

      // Connections
      for (let i = 0; i < s.nodes.length; i++) {
        for (let j = i + 1; j < s.nodes.length; j++) {
          const d = Math.hypot(s.nodes[i].x - s.nodes[j].x, s.nodes[i].y - s.nodes[j].y);
          if (d < 68) {
            ctx.save();
            ctx.strokeStyle = `rgba(110,108,104,${(1 - d / 68) * 0.11})`;
            ctx.lineWidth = 0.5;
            ctx.beginPath(); ctx.moveTo(s.nodes[i].x, s.nodes[i].y); ctx.lineTo(s.nodes[j].x, s.nodes[j].y); ctx.stroke();
            ctx.restore();
          }
        }
      }

      s.nodes.forEach(n => drawNodeHuman(ctx, n.x, n.y, n.r, n.glow, n.expert));

      if (s.phase === 0) {
        s.failLines.forEach(f => {
          ctx.save();
          ctx.strokeStyle = OR2 + (f.life * 0.4) + ')';
          ctx.lineWidth = 0.8;
          ctx.beginPath(); ctx.moveTo(f.x1, f.y1); ctx.lineTo(f.x2, f.y2); ctx.stroke();
          ctx.strokeStyle = `rgba(220,60,50,${f.life * 0.9})`;
          ctx.lineWidth = 1.5;
          const mx = (f.x1 + f.x2) / 2, my = (f.y1 + f.y2) / 2, xs = 7;
          ctx.beginPath(); ctx.moveTo(mx - xs, my - xs); ctx.lineTo(mx + xs, my + xs); ctx.stroke();
          ctx.beginPath(); ctx.moveTo(mx + xs, my - xs); ctx.lineTo(mx - xs, my + xs); ctx.stroke();
          ctx.restore();
        });
      }

      if (s.phase >= 1 && s.phase < 5) {
        const a = s.ring.alpha * s.ringFade;
        if (a > 0.01) {
          ctx.save();
          ctx.globalAlpha = a;
          const rx = s.ring.x, ry = s.ring.y, rr = s.ring.r;
          
          if (s.images.icon) {
            ctx.drawImage(s.images.icon, rx - 15, ry - 15, 30, 30);
          } else {
            const g = ctx.createRadialGradient(rx, ry, 0, rx, ry, rr * 2.2);
            g.addColorStop(0, OR2 + '0.15)');
            g.addColorStop(1, 'transparent');
            ctx.beginPath(); ctx.arc(rx, ry, rr * 2.2, 0, Math.PI * 2); ctx.fillStyle = g; ctx.fill();
            ctx.beginPath(); ctx.arc(rx, ry, rr, 0, Math.PI * 2); ctx.strokeStyle = OR; ctx.lineWidth = 2.2; ctx.stroke();
          }
          ctx.restore();
        }
      }

      if (s.phase >= 2 && s.expertHalo > 0) {
        ctx.save();
        const gh = ctx.createRadialGradient(s.expert!.x, s.expert!.y, 0, s.expert!.x, s.expert!.y, 36);
        gh.addColorStop(0, OR2 + (0.25 * s.expertHalo) + ')');
        gh.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(s.expert!.x, s.expert!.y, 36, 0, Math.PI * 2); ctx.fillStyle = gh; ctx.fill();
        ctx.restore();
      }

      if (s.phase < 5) {
        ctx.save();
        const cx = s.client.x, cy = s.client.y, cr = s.client.r;
        const gr = ctx.createRadialGradient(cx, cy, 0, cx, cy, cr * 2.8);
        gr.addColorStop(0, OR2 + '0.2)');
        gr.addColorStop(1, 'transparent');
        ctx.beginPath(); ctx.arc(cx, cy, cr * 2.8, 0, Math.PI * 2); ctx.fillStyle = gr; ctx.fill();
        ctx.strokeStyle = OR; ctx.lineWidth = cr * 0.22; ctx.lineCap = 'round';
        ctx.beginPath(); ctx.arc(cx, cy - cr * 0.38, cr * 0.3, 0, Math.PI * 2); ctx.stroke();
        ctx.beginPath();
        ctx.moveTo(cx, cy - cr * 0.06); ctx.lineTo(cx, cy + cr * 0.55);
        ctx.moveTo(cx - cr * 0.42, cy + cr * 0.18); ctx.lineTo(cx + cr * 0.42, cy + cr * 0.18);
        ctx.moveTo(cx, cy + cr * 0.55); ctx.lineTo(cx - cr * 0.28, cy + cr * 0.95);
        ctx.moveTo(cx, cy + cr * 0.55); ctx.lineTo(cx + cr * 0.28, cy + cr * 0.95);
        ctx.stroke();
        ctx.restore();
      }

      if (s.phase >= 4) {
        const mx = (s.client.x + s.expert!.x) / 2, my = (s.client.y + s.expert!.y) / 2;
        const a = s.waveA * s.ringFade;
        drawWave(ctx, s.client.x, s.client.y, mx, my, s.waveOff, a);
        drawWave(ctx, mx, my, s.expert!.x, s.expert!.y, s.waveOff + Math.PI, a);
        if (s.phase === 4) {
          ctx.save();
          ctx.globalAlpha = s.ring.alpha * s.ringFade;
          ctx.beginPath(); ctx.arc(mx, my, 15, 0, Math.PI * 2); ctx.strokeStyle = OR; ctx.lineWidth = 2; ctx.stroke();
          ctx.restore();
        }
      }

      if (s.phase === 5 && s.logoT > 0) {
        const fade = Math.min(1, s.pt / 55);
        ctx.save();
        ctx.fillStyle = `rgba(10,10,11, ${Math.min(0.95, fade)})`;
        ctx.fillRect(0, 0, width, height);
        ctx.restore();
        
        ctx.save();
        ctx.globalAlpha = Math.min(1, s.logoT * 2);
        const logoScale = Math.min(1, s.logoT * 1.4) * 0.8;
        const lw = width * logoScale;
        const lh = height * logoScale;
        
        if (s.images.full) {
          ctx.drawImage(s.images.full, width / 2 - lw / 2, height / 2 - lh / 2, lw, lh);
        } else {
            ctx.fillStyle = OR;
            ctx.font = "bold 48px Inter";
            ctx.textAlign = "center";
            ctx.fillText("INFOLLION", width / 2, height / 2);
        }
        ctx.restore();
      }

      rafId = requestAnimationFrame(loop);
    };

    rafId = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafId);
  }, [initNodes]);

  return (
    <div ref={containerRef} className="relative group w-full aspect-[900/520] bg-[#0A0A0B] rounded-2xl md:rounded-3xl overflow-hidden shadow-[0_0_50px_rgba(236,147,36,0.15)] border border-white/5 w-full mx-auto">
      <canvas 
        ref={canvasRef} 
        width={900} 
        height={520} 
        className="w-full h-full block object-contain"
      />
      
      {/* Decorative Corners */}
      <div className="absolute top-0 left-0 w-8 h-8 border-l border-t border-brand-primary/20 rounded-tl-3xl pointer-events-none" />
      <div className="absolute bottom-0 right-0 w-8 h-8 border-r border-b border-brand-primary/20 rounded-br-3xl pointer-events-none" />
    </div>
  );
}
