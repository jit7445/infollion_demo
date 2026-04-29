"use client";

import React, { useEffect, useRef } from "react";

const W = 1000;
const H = 1000;
const CX = W / 2;
const CY = H / 2 - 10;

function makeRing(n: number, r: number, phase: number, cx: number, cy: number) {
  return Array.from({ length: n }).map((_, i) => {
    const a = phase + (i / n) * Math.PI * 2;
    return { x: cx + Math.cos(a) * r, y: cy + Math.sin(a) * r };
  });
}

const OUTER  = makeRing(10, 400, -Math.PI / 2 + 0.1,  CX, CY - 15); // 0-9
const MID    = makeRing(8,  260, -Math.PI / 2 + 0.4,  CX, CY - 15); // 10-17
const INNER  = makeRing(6,  140,  -Math.PI / 2 + 0.2,  CX, CY - 15); // 18-23

// 4 extra scattered nodes to fill gaps
const SCATTER = [
  { x: CX - 320, y: CY - 240 },
  { x: CX + 340, y: CY - 180  },
  { x: CX + 300, y: CY + 300 },
  { x: CX - 280, y: CY + 280 },
];

const NODES = [...OUTER, ...MID, ...INNER, ...SCATTER]; // 28 total

const NODE_LABELS = [
  // OUTER (0–9) → Industries
  "Finance","Healthcare","Legal","Marketing","Retail",
  "EdTech","Manufacturing","SaaS","Consulting","Supply Chain",
  // MID (10–17) → Functions
  "Product","Sales","HR","Operations","Strategy","Growth","Analytics","Cust. Success",
  // INNER (18–23) → Deep Expertise
  "AI/ML","Data Science","Blockchain","Cybersecurity","UX Research","Cloud",
  // SCATTER (24–27) → High-value Experts
  "C-Level","Investors","Advisors","Domain Experts",
];

const EXPERT_IDX = 2;  // top-right outer
const FAIL_IDXS  = [7, 13];

const EDGES = [
  // outer ring
  [0,1],[1,2],[2,3],[3,4],[4,5],[5,6],[6,7],[7,8],[8,9],[9,0],
  // mid ring
  [10,11],[11,12],[12,13],[13,14],[14,15],[15,16],[16,17],[17,10],
  // inner ring
  [18,19],[19,20],[20,21],[21,22],[22,23],[23,18],
  // outer → mid spokes
  [0,10],[1,10],[1,11],[2,11],[2,12],[3,12],[3,13],[4,13],[4,14],
  [5,14],[5,15],[6,15],[6,16],[7,16],[7,17],[8,17],[9,10],
  // mid → inner spokes
  [10,18],[11,18],[12,19],[13,19],[13,20],[14,20],[15,21],[16,21],[16,22],[17,22],[17,23],[10,23],
  // cross-outer long diagonals
  [0,5],[1,6],[2,7],[3,8],[4,9],[0,3],[1,4],[2,9],
  // cross-mid diagonals
  [10,14],[11,15],[12,16],[13,17],[10,13],[11,14],
  // scatter connections
  [24,0],[24,1],[24,10],[24,18],
  [25,2],[25,3],[25,11],[25,19],
  [26,4],[26,5],[26,14],[26,20],
  [27,6],[27,7],[27,16],[27,22],
  // extra cross-ring links for density
  [0,18],[2,19],[4,20],[6,21],[8,22],[9,23],
  [1,17],[3,15],[5,13],[7,11],
];

const STICK_HOME = { x: CX, y: CY + 120 };

// Client and expert positions for the "conversation" phase
const CLIENT_CONV = { x: CX - 220, y: CY + 50 };
const EXPERT_CONV = { x: CX + 220, y: CY + 50 };

const ORANGE    = "#E6A817";
const GREY_NODE = "rgba(0, 0, 0, 0.4)";
const GREY_EDGE = "rgba(0, 0, 0, 0.1)";

const TOTAL = 25000; // ms

function ease(t: number) { return t < 0.5 ? 2*t*t : -1+(4-2*t)*t; }
function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }
function progress(t: number, start: number, end: number) { return clamp01((t - start) / (end - start)); }
function lerp(a: number, b: number, t: number) { return a + (b - a) * t; }
function lerpPt(a: {x: number, y: number}, b: {x: number, y: number}, t: number) { 
  return { x: lerp(a.x, b.x, t), y: lerp(a.y, b.y, t) }; 
}

function drawStick(ctx: CanvasRenderingContext2D, cx: number, cy: number, color: string, smile = false, scale = 2.3) {
  ctx.save();
  ctx.translate(cx, cy);
  ctx.scale(scale, scale);
  ctx.strokeStyle = color;
  ctx.fillStyle = color;
  ctx.lineWidth = 3;
  ctx.lineCap = "round";
  ctx.beginPath(); ctx.arc(0, -18, 8, 0, Math.PI * 2); ctx.fill();
  ctx.beginPath(); ctx.moveTo(0, -10); ctx.lineTo(0, 10); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(-12, 1); ctx.lineTo(12, 1); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(-8, 24); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(0, 10); ctx.lineTo(8, 24); ctx.stroke();
  if (smile) {
    ctx.strokeStyle = "#FFFFFF";
    ctx.lineWidth = 1.8;
    ctx.beginPath();
    ctx.arc(0, -17, 3.5, 0.1, Math.PI - 0.1);
    ctx.stroke();
  }
  ctx.restore();
}

// Draw a sine wave between two points
function drawWave(ctx: CanvasRenderingContext2D, x1: number, y1: number, x2: number, y2: number, amplitude: number, frequency: number, phase: number, color: string, alpha: number) {
  ctx.save();
  ctx.globalAlpha = alpha;
  ctx.strokeStyle = color;
  ctx.lineWidth = 2.5;
  ctx.lineCap = "round";
  ctx.lineJoin = "round";

  const dx = x2 - x1;
  const dy = y2 - y1;
  const len = Math.sqrt(dx * dx + dy * dy);
  const ux = dx / len, uy = dy / len;
  // perpendicular
  const px = -uy, py = ux;

  const steps = 80;
  ctx.beginPath();
  for (let i = 0; i <= steps; i++) {
    const tt = i / steps;
    const along = tt * len;
    const wave = amplitude * Math.sin(frequency * tt * Math.PI * 2 + phase);
    const wx = x1 + ux * along + px * wave;
    const wy = y1 + uy * along + py * wave;
    if (i === 0) ctx.moveTo(wx, wy);
    else ctx.lineTo(wx, wy);
  }
  ctx.stroke();
  ctx.restore();
}

export function HeroAnimation() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const rafRef = useRef<number | null>(null);
  const startRef = useRef<number | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    const logoImg = new Image();
    logoImg.src = "/images/logo_hd.png";

    function draw(ts: number) {
      if (!startRef.current) startRef.current = ts;
      const elapsed = (ts - startRef.current) % TOTAL;
      const t = elapsed;

      ctx.clearRect(0, 0, W, H);

      const pNetwork = ease(progress(t, 0, 2000));
      const pClient  = ease(progress(t, 2400, 4000));
      const pFail0   = ease(progress(t, 4200, 5400));
      const pFail0b  = ease(progress(t, 5400, 6400));
      const pFail1   = ease(progress(t, 6400, 7600));
      const pFail1b  = ease(progress(t, 7600, 8000));
      const pReturn  = ease(progress(t, 8000, 8400));
      const pScanner = ease(progress(t, 8400, 10000));
      const pScan    = progress(t, 10000, 12400);
      const pExpert  = ease(progress(t, 12400, 14000));

      const pNetFade = ease(progress(t, 12400, 14200));
      const networkAlpha = 1 - pNetFade;

      const pConvEnter = ease(progress(t, 14200, 15800));
      const waveActive = t >= 16400;
      const pConvFade = ease(progress(t, 21500, 22000));
      const convAlpha = 1 - pConvFade;

      let stickPos = { x: STICK_HOME.x, y: STICK_HOME.y + 60 * (1 - pClient) };
      if (t >= 4200 && t < 5400) {
        stickPos = lerpPt(STICK_HOME, { x: NODES[FAIL_IDXS[0]].x, y: NODES[FAIL_IDXS[0]].y + 18 }, pFail0);
      } else if (t >= 5400 && t < 6400) {
        stickPos = { x: NODES[FAIL_IDXS[0]].x + Math.sin(t * 0.02) * 6 * (1 - pFail0b), y: NODES[FAIL_IDXS[0]].y + 18 };
      } else if (t >= 6400 && t < 7600) {
        stickPos = lerpPt({ x: NODES[FAIL_IDXS[0]].x, y: NODES[FAIL_IDXS[0]].y + 18 }, { x: NODES[FAIL_IDXS[1]].x, y: NODES[FAIL_IDXS[1]].y + 18 }, pFail1);
      } else if (t >= 7600 && t < 8000) {
        stickPos = { x: NODES[FAIL_IDXS[1]].x + Math.sin(t * 0.02) * 5 * (1 - pFail1b), y: NODES[FAIL_IDXS[1]].y + 18 };
      } else if (t >= 8000 && t < 8400) {
        stickPos = lerpPt({ x: NODES[FAIL_IDXS[1]].x, y: NODES[FAIL_IDXS[1]].y + 18 }, STICK_HOME, pReturn);
      } else if (t >= 8400) {
        stickPos = STICK_HOME;
      }

      const confused = t >= 2400 && t < 14200;
      const smile = t >= 14200;
      const inConvPhase = t >= 14200;

      // ── DRAW: Network (edges + nodes) with fade-out ───────────────────
      if (networkAlpha > 0) {
        // Optimized Edge Drawing: Path Batching
        ctx.save();
        ctx.strokeStyle = GREY_EDGE;
        ctx.lineWidth = 0.9;
        const baseAlpha = networkAlpha * 0.4;

        if (pNetwork >= 1) {
          // Fast-path: Single stroke for all edges
          ctx.globalAlpha = baseAlpha;
          ctx.beginPath();
          for (let i = 0; i < EDGES.length; i++) {
            const n1 = NODES[EDGES[i][0]];
            const n2 = NODES[EDGES[i][1]];
            ctx.moveTo(n1.x, n1.y);
            ctx.lineTo(n2.x, n2.y);
          }
          ctx.stroke();
        } else {
          // Progressive Batching: Group edges by visibility threshold to minimize stroke calls
          let currentAlpha = -1;
          for (let i = 0; i < EDGES.length; i++) {
            const delay = (i / EDGES.length) * 0.5;
            const p = clamp01((pNetwork - delay) / 0.5);
            if (p <= 0) continue;
            
            const edgeAlpha = p * baseAlpha;
            // Batch similar opacities to avoid context switching
            if (Math.abs(edgeAlpha - currentAlpha) < 0.05) {
              const n1 = NODES[EDGES[i][0]];
              const n2 = NODES[EDGES[i][1]];
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
            } else {
              if (currentAlpha !== -1) ctx.stroke();
              currentAlpha = edgeAlpha;
              ctx.globalAlpha = currentAlpha;
              ctx.beginPath();
              const n1 = NODES[EDGES[i][0]];
              const n2 = NODES[EDGES[i][1]];
              ctx.moveTo(n1.x, n1.y);
              ctx.lineTo(n2.x, n2.y);
            }
          }
          if (currentAlpha !== -1) ctx.stroke();
        }
        ctx.restore();

        const failShaking0 = t >= 5400 && t < 6400;
        const failShaking1 = t >= 7600 && t < 8000;

        NODES.forEach((n, i) => {
          const delay = (i / NODES.length) * 0.8;
          const p = clamp01((pNetwork * 1.6 - delay));
          if (p <= 0) return;
          const isExpert = i === EXPERT_IDX;
          const isFail0 = i === FAIL_IDXS[0];
          const isFail1 = i === FAIL_IDXS[1];
          const shake = (isFail0 && failShaking0) || (isFail1 && failShaking1);
          let nx = n.x, ny = n.y;
          if (shake) { nx += Math.sin(t * 0.025) * 5; ny += Math.cos(t * 0.035) * 3; }
          const expertP = isExpert ? pExpert : 0;
          const baseR = i < 10 ? 12 : i < 18 ? 10 : i < 24 ? 8 : 15;
          const r = lerp(baseR, 32, expertP * ease(clamp01(p)));
          const baseColor = isExpert && expertP > 0 ? ORANGE : GREY_NODE;

          ctx.save();
          ctx.globalAlpha = p * networkAlpha;

          if (isExpert && expertP > 0) {
            const grad = ctx.createRadialGradient(nx, ny, 0, nx, ny, r * 3);
            grad.addColorStop(0, "rgba(255,106,0,0.35)");
            grad.addColorStop(1, "rgba(255,106,0,0)");
            ctx.fillStyle = grad;
            ctx.beginPath(); ctx.arc(nx, ny, r * 3, 0, Math.PI * 2); ctx.fill();
            const pulse = ((t % 3200) / 3200);
            ctx.strokeStyle = ORANGE; ctx.lineWidth = 2;
            ctx.globalAlpha = (1 - pulse) * expertP * networkAlpha;
            ctx.beginPath(); ctx.arc(nx, ny, r + pulse * r * 2.5, 0, Math.PI * 2); ctx.stroke();
            ctx.globalAlpha = p * networkAlpha;
          }
          if ((isFail0 && failShaking0) || (isFail1 && failShaking1)) {
            ctx.fillStyle = "rgba(255,80,80,0.6)";
            ctx.beginPath(); ctx.arc(nx, ny, r * 1.8, 0, Math.PI * 2); ctx.fill();
          }
          ctx.fillStyle = baseColor;
          ctx.beginPath(); ctx.arc(nx, ny, r, 0, Math.PI * 2); ctx.fill();
          if (isExpert && expertP > 0) {
            ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5;
            ctx.globalAlpha = expertP * networkAlpha;
            ctx.beginPath(); ctx.arc(nx, ny, r + 6, 0, Math.PI * 2); ctx.stroke();
          }

          if (t >= 10000 && r > 9) {
            const labelAlpha = clamp01((t - 10000) / 1200) * p * networkAlpha;
            ctx.globalAlpha = labelAlpha;
            const isIdentified = isExpert && expertP > 0;
            ctx.fillStyle = isIdentified ? ORANGE : "#94a3b8"; 
            ctx.font = isIdentified
              ? "bold 14px Inter, sans-serif"
              : "12px Inter, sans-serif";
            ctx.textAlign = "center";
            ctx.fillText(NODE_LABELS[i], nx, ny + r + 16);
          }
          ctx.restore();
        });
      }

      // ── DRAW: Scanner rings (fade with network) ───────────────────────
      if (pScanner > 0 && networkAlpha > 0) {
        const sx = CX, sy = CY - 15;
        ctx.save();
        ctx.globalAlpha = pScanner * 0.9 * networkAlpha;
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 2.5;
        ctx.fillStyle = "rgba(255,106,0,0.06)";
        ctx.beginPath(); ctx.arc(sx, sy, lerp(0, 420, ease(pScanner)), 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = pScanner * 0.95 * networkAlpha;
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 2;
        ctx.fillStyle = "rgba(255,106,0,0.08)";
        ctx.beginPath(); ctx.arc(sx, sy, lerp(0, 210, ease(pScanner)), 0, Math.PI * 2);
        ctx.fill(); ctx.stroke();
        ctx.restore();

        if (pScan > 0) {
          [0, 0.33, 0.66].forEach(offset => {
            const pulse = ((t / 2000 + offset) % 1.2) / 1.2;
            ctx.save();
            ctx.globalAlpha = (1 - pulse) * 0.7 * clamp01(pScan * 3) * networkAlpha;
            ctx.strokeStyle = ORANGE; ctx.lineWidth = 2;
            ctx.beginPath(); ctx.arc(sx, sy, 50 + pulse * 450, 0, Math.PI * 2); ctx.stroke();
            ctx.restore();
          });
        }

        // Center Infollion Logo ("o" mark)
        ctx.save();
        ctx.globalAlpha = pScanner * networkAlpha;
        ctx.translate(sx, sy);
        ctx.scale(1.3, 1.3);
        ctx.strokeStyle = ORANGE; 
        ctx.lineWidth = 4.5;
        ctx.lineCap = "round";
        ctx.lineJoin = "round";
        
        const rOuter = 14;
        const angO = 0.7; 
        const pX = rOuter * Math.cos(angO);
        const pY = rOuter * Math.sin(angO);
        
        ctx.beginPath();
        ctx.moveTo(-24, 18);
        ctx.quadraticCurveTo(-9, 18, -pX, pY);
        ctx.arc(0, 0, rOuter, Math.PI - angO, angO, false);
        ctx.quadraticCurveTo(9, 18, 24, 18);
        ctx.stroke();
        
        const rInner = 5.5;
        const angI = 0.6;
        ctx.beginPath();
        ctx.arc(0, 0, rInner, Math.PI + angI, -angI, true);
        ctx.stroke();
        ctx.restore();
      }

      // ── CONVERSATION PHASE ────────────────────────────────────────────
      if (inConvPhase) {
        const clientConvPos = lerpPt(STICK_HOME, CLIENT_CONV, pConvEnter);
        const expertConvPos = lerpPt(NODES[EXPERT_IDX], EXPERT_CONV, pConvEnter);

        const wobble = confused && !smile ? Math.sin(t * 0.004) * 5 : 0;
        ctx.save();
        ctx.globalAlpha = convAlpha;
        ctx.translate(clientConvPos.x, clientConvPos.y);
        ctx.rotate((wobble * Math.PI) / 180);
        ctx.translate(-clientConvPos.x, -clientConvPos.y);
        drawStick(ctx, clientConvPos.x, clientConvPos.y + 30, ORANGE, true, 3.2);
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = convAlpha;
        // expert character
        const grad = ctx.createRadialGradient(expertConvPos.x, expertConvPos.y, 0, expertConvPos.x, expertConvPos.y, 60);
        grad.addColorStop(0, "rgba(255,106,0,0.3)");
        grad.addColorStop(1, "rgba(255,106,0,0)");
        ctx.fillStyle = grad;
        ctx.beginPath(); ctx.arc(expertConvPos.x, expertConvPos.y, 60, 0, Math.PI * 2); ctx.fill();
        
        // Large Expert Stickman
        drawStick(ctx, expertConvPos.x, expertConvPos.y + 30, ORANGE, true, 3.2);

        const pr = ((t % 3200) / 3200);
        ctx.strokeStyle = ORANGE; ctx.lineWidth = 2;
        ctx.globalAlpha = (1 - pr) * 0.8 * convAlpha;
        ctx.beginPath(); ctx.arc(expertConvPos.x, expertConvPos.y - 12, 32 + pr * 40, 0, Math.PI * 2); ctx.stroke();
        ctx.restore();

        ctx.save();
        ctx.globalAlpha = convAlpha;
        ctx.fillStyle = ORANGE;
        ctx.font = "bold 24px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Consulting", expertConvPos.x, expertConvPos.y + 130);
        ctx.fillText("Client", clientConvPos.x, clientConvPos.y + 130);
        ctx.restore();

        if (waveActive && pConvEnter > 0.5) {
          const wAlpha = clamp01((pConvEnter - 0.5) / 0.5) * convAlpha;
          const phase = (t / 400); 
          const waves = [
            { amp: 18, freq: 2.5, phaseOff: 0,   color: ORANGE,             alpha: 0.9  },
            { amp: 12, freq: 2.5, phaseOff: 1.2,  color: "rgba(255,106,0,0.5)", alpha: 0.6  },
            { amp: 22, freq: 1.8, phaseOff: 2.4,  color: "rgba(255,180,80,0.4)", alpha: 0.5  },
          ];
          waves.forEach(w => {
            drawWave(ctx, clientConvPos.x+12, clientConvPos.y-10, expertConvPos.x-22, expertConvPos.y, w.amp, w.freq, phase+w.phaseOff, w.color, w.alpha*wAlpha);
          });
          const bubbleCount = 4;
          for (let b = 0; b < bubbleCount; b++) {
            const btt = ((t / 1600 + b / bubbleCount) % 1);
            const bx = lerp(clientConvPos.x + 12, expertConvPos.x - 22, btt);
            const by = lerp(clientConvPos.y - 10, expertConvPos.y, btt) + 18 * Math.sin(2.5 * btt * Math.PI * 2 + phase);
            ctx.save();
            ctx.globalAlpha = wAlpha * (0.5 + 0.5 * Math.sin(btt * Math.PI));
            ctx.fillStyle = ORANGE;
            ctx.beginPath(); ctx.arc(bx, by, 4, 0, Math.PI * 2); ctx.fill();
            ctx.restore();
          }
        }
      } else {
        if (pClient > 0 || t >= 2100) {
          const wobble = confused ? Math.sin(t * 0.004) * 5 : 0;
          ctx.save();
          ctx.translate(stickPos.x, stickPos.y);
          ctx.rotate((wobble * Math.PI) / 180);
          ctx.translate(-stickPos.x, -stickPos.y);
          drawStick(ctx, stickPos.x, stickPos.y, ORANGE, smile, 3.2);
          ctx.restore();

          // Label for client in search phase
          ctx.save();
          ctx.globalAlpha = (pClient * (1 - pScanner)) + (pScanner * networkAlpha);
          ctx.fillStyle = ORANGE;
          ctx.font = "bold 24px Inter, sans-serif";
          ctx.textAlign = "center";
          ctx.fillText("Client", stickPos.x, stickPos.y + 105);
          ctx.restore();

          if (confused) {
            const alpha = 0.6 + 0.4 * Math.sin(t * 0.003);
            ctx.save();
            ctx.globalAlpha = alpha;
            ctx.fillStyle = ORANGE;
            ctx.font = "bold 13px Inter, sans-serif";
            ctx.fillText("?", stickPos.x + 14, stickPos.y - 20);
            ctx.restore();
          }
        }
      }

      const pBrand = ease(progress(t, 22000, 23200));
      if (pBrand > 0) {
        const bx = CX, by = CY + 10;
        ctx.save();
        ctx.globalAlpha = pBrand * 0.18;
        const bgGrad = ctx.createRadialGradient(bx, by, 0, bx, by, 130);
        bgGrad.addColorStop(0, ORANGE);
        bgGrad.addColorStop(1, "rgba(255,106,0,0)");
        ctx.fillStyle = bgGrad;
        ctx.beginPath(); ctx.arc(bx, by, 130, 0, Math.PI * 2); ctx.fill();
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = pBrand * 0.7;
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.font = "500 14px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.letterSpacing = "0.15em";
        ctx.fillText("POWERED BY", bx, by - 40);
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = pBrand;
        if (logoImg.complete && logoImg.naturalWidth > 0) {
          const targetW = lerp(180,260, pBrand);
          const aspect = logoImg.naturalHeight / logoImg.naturalWidth;
          const targetH = targetW * aspect;
          ctx.drawImage(logoImg, bx - targetW / 2, by - targetH / 2, targetW, targetH);
        }
        ctx.restore();
        const lineW = 160 * pBrand;
        ctx.save();
        ctx.globalAlpha = pBrand * 0.5;
        ctx.strokeStyle = ORANGE;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(bx - lineW / 2, by + 45);
        ctx.lineTo(bx + lineW / 2, by + 45);
        ctx.stroke();
        ctx.restore();
        ctx.save();
        ctx.globalAlpha = pBrand * 0.65;
        ctx.fillStyle = "rgba(0, 0, 0, 0.4)";
        ctx.font = "400 16px Inter, sans-serif";
        ctx.textAlign = "center";
        ctx.fillText("Expert Network, Reimagined", bx, by + 75);
        ctx.restore();
      }

      rafRef.current = requestAnimationFrame(draw);
    }

    rafRef.current = requestAnimationFrame(draw);
    return () => { if (rafRef.current) cancelAnimationFrame(rafRef.current); };
  }, []);

  return (
    <div className="relative w-full max-w-[1000px] mx-auto" style={{ aspectRatio: "1/1" }}>
      <div className="absolute inset-0 bg-transparent" />
      <canvas
        ref={canvasRef}
        width={W}
        height={H}
        className="relative w-full h-full rounded-3xl"
        style={{ display: "block" }}
      />
    </div>
  );
}
