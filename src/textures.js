import * as THREE from "three";

// All textures are drawn on canvases, so the scene needs no image downloads
// besides the portrait photo.

function canvas(w, h) {
  const c = document.createElement("canvas");
  c.width = w;
  c.height = h;
  return [c, c.getContext("2d")];
}

function toTexture(c, { srgb = true, repeat = false } = {}) {
  const t = new THREE.CanvasTexture(c);
  if (srgb) t.colorSpace = THREE.SRGBColorSpace;
  t.anisotropy = 4;
  if (repeat) t.wrapS = t.wrapT = THREE.RepeatWrapping;
  return t;
}

function grain(ctx, w, h, amount = 10, alpha = 1) {
  const img = ctx.getImageData(0, 0, w, h);
  const d = img.data;
  for (let i = 0; i < d.length; i += 4) {
    const n = (Math.random() - 0.5) * amount;
    d[i] += n;
    d[i + 1] += n;
    d[i + 2] += n;
    d[i + 3] = d[i + 3] * alpha;
  }
  ctx.putImageData(img, 0, 0);
}

function roundRect(ctx, x, y, w, h, r) {
  ctx.beginPath();
  ctx.roundRect(x, y, w, h, r);
}

/* ---------- Walmart-style spark mug print ---------- */
// Canvas aspect matches the mug's circumference : height, so the spark stays round.
// u = 0.5 is the front of the mug (see the cylinder's thetaStart in world.js).
export function mugTexture() {
  const W = 1024, H = 362;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = "#f4f2ec";
  ctx.fillRect(0, 0, W, H);

  const cx = W / 2, cy = H / 2 - 6, S = 118;
  ctx.fillStyle = "#ffc220";
  for (let i = 0; i < 6; i++) {
    const a = -Math.PI / 2 + (i * Math.PI) / 3;
    ctx.save();
    ctx.translate(cx, cy);
    ctx.rotate(a + Math.PI / 2);
    // one petal: narrow near the center, wide and rounded at the tip
    const r0 = S * 0.3, r1 = S * 0.98, w0 = S * 0.07, w1 = S * 0.13;
    ctx.beginPath();
    ctx.moveTo(-w0, -r0);
    ctx.lineTo(-w1, -r1 + w1);
    ctx.quadraticCurveTo(-w1, -r1, 0, -r1);
    ctx.quadraticCurveTo(w1, -r1, w1, -r1 + w1);
    ctx.lineTo(w0, -r0);
    ctx.quadraticCurveTo(0, -r0 + w0 * 0.8, -w0, -r0);
    ctx.fill();
    ctx.restore();
  }
  // the little dot next to the bottom-right petal
  ctx.beginPath();
  ctx.arc(cx + S * 0.5, cy + S * 0.92, S * 0.07, 0, Math.PI * 2);
  ctx.fill();
  grain(ctx, W, H, 6);
  return toTexture(c);
}

/* ---------- CRT terminal screen (redrawn every few frames) ---------- */
export function createScreen() {
  const W = 512, H = 400;
  const [c, ctx] = canvas(W, H);
  const tex = toTexture(c);
  tex.anisotropy = 1;

  const idleScript = [
    ["MINH-OS 1.0  (C) 2026 MEO SYSTEMS", 0],
    ["", 0],
    ["C:\\> whoami", 1],
    ["minh nguyen // software engineer", 0],
    ["walmart global tech, sunnyvale ca", 0],
    ["", 0],
    ["C:\\> type hello.txt", 1],
    ["click anything on the desk.", 0],
    ["every object is a section.", 0],
    ["", 0],
  ];
  const projScript = [
    ["C:\\MINH\\PROJECTS> dir", 1],
    ["", 0],
    [" ATHENA     <DIR>   AI JOB TRACKER", 0],
    [" 8BITDRIFT  <DIR>   1-BIT DRIVING", 0],
    [" JEVSUME    <DIR>   ATS REVIEW", 0],
    [" THREADBOT  <DIR>   CRON POSTER", 0],
    [" ENCRYPT    <DIR>   AES WEBAPP", 0],
    ["", 0],
    ["      5 dir(s)   ∞ ideas free", 0],
    ["", 0],
  ];

  let mode = "idle";
  let start = 0;
  let lastDraw = -1;

  function setMode(m, now) {
    if (m === mode) return;
    mode = m;
    start = now;
  }

  function draw(now) {
    if (now - lastDraw < 0.06) return;
    lastDraw = now;
    const t = now - start;
    const script = mode === "projects" ? projScript : idleScript;
    const speed = mode === "projects" ? 70 : 34; // characters per second

    ctx.fillStyle = "#07120b";
    ctx.fillRect(0, 0, W, H);
    // phosphor bloom at the center
    const g = ctx.createRadialGradient(W / 2, H / 2, 20, W / 2, H / 2, W * 0.7);
    g.addColorStop(0, "rgba(60,140,80,0.22)");
    g.addColorStop(1, "rgba(0,0,0,0)");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, W, H);

    ctx.font = '26px "VT323", monospace';
    ctx.textBaseline = "top";
    ctx.shadowColor = "rgba(120,255,150,0.8)";
    ctx.shadowBlur = 8;
    ctx.fillStyle = "#8dffa8";

    let budget = Math.floor(t * speed);
    let y = 22;
    let cursorX = 26, cursorY = y;
    const total = script.reduce((n, [s]) => n + s.length + 4, 0);
    for (const [line, typed] of script) {
      if (budget <= 0) break;
      const shown = typed ? line.slice(0, budget) : budget > 0 ? line : "";
      budget -= typed ? line.length + 4 : 4 + line.length / 6;
      ctx.fillText(shown, 26, y);
      cursorX = 26 + ctx.measureText(shown).width;
      cursorY = y;
      y += 32;
    }
    if (budget > 0) {
      cursorX = 26 + ctx.measureText("C:\\> ").width;
      cursorY = y;
      ctx.fillText("C:\\> ", 26, y);
    }
    if (Math.floor(now * 2) % 2 === 0) ctx.fillRect(cursorX + 2, cursorY + 2, 13, 22);
    ctx.shadowBlur = 0;

    // scanlines baked into the screen
    ctx.fillStyle = "rgba(0,0,0,0.22)";
    for (let i = 0; i < H; i += 4) ctx.fillRect(0, i, W, 2);

    // restart the idle loop after a pause
    if (mode === "idle" && t * speed > total + speed * 6) start = now;
    tex.needsUpdate = true;
  }

  return { texture: tex, draw, setMode };
}

/* ---------- PC case front panel ---------- */
export function caseFrontTexture() {
  const W = 1024, H = 240;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = "#d8cfb2";
  ctx.fillRect(0, 0, W, H);
  // vent grille on the left
  ctx.fillStyle = "#8f866c";
  for (let x = 40; x < 420; x += 16) ctx.fillRect(x, 50, 8, 150);
  // drive bays
  for (const [y] of [[48], [128]]) {
    ctx.fillStyle = "#c9bf9f";
    ctx.fillRect(560, y, 300, 62);
    ctx.fillStyle = "#3a352c";
    ctx.fillRect(600, y + 26, 220, 9);
    ctx.fillStyle = "#b5ab8c";
    ctx.fillRect(790, y + 44, 40, 10);
  }
  // power button + LEDs
  ctx.fillStyle = "#bdb293";
  ctx.beginPath();
  ctx.arc(930, 80, 22, 0, Math.PI * 2);
  ctx.fill();
  ctx.fillStyle = "#e0482f";
  ctx.fillRect(915, 150, 12, 7);
  ctx.fillStyle = "#53d36a";
  ctx.fillRect(940, 150, 12, 7);
  grain(ctx, W, H, 10);
  return toTexture(c);
}

/* ---------- résumé sheet on the desk ---------- */
export function paperTexture() {
  const W = 512, H = 724;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = "#f3f0e8";
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = "#24221e";
  ctx.font = "bold 34px Georgia, serif";
  ctx.textAlign = "center";
  ctx.fillText("MINH NGUYEN", W / 2, 72);
  ctx.font = "15px Georgia, serif";
  ctx.fillText("Software Engineer (Full Stack)", W / 2, 100);
  ctx.textAlign = "left";
  const sections = ["EXPERIENCE", "PROJECTS", "EDUCATION", "SKILLS"];
  let y = 140;
  for (const s of sections) {
    ctx.font = "bold 16px Georgia, serif";
    ctx.fillStyle = "#24221e";
    ctx.fillText(s, 44, y);
    ctx.fillRect(44, y + 6, W - 88, 2);
    y += 26;
    const n = s === "EXPERIENCE" ? 9 : 4;
    for (let i = 0; i < n; i++) {
      ctx.fillStyle = "rgba(40,38,34,0.45)";
      const len = (W - 110) * (0.55 + Math.random() * 0.45);
      ctx.fillRect(i % 4 === 0 ? 44 : 60, y, len, 6);
      y += 15;
    }
    y += 20;
  }
  grain(ctx, W, H, 8);
  return toTexture(c);
}

/* ---------- book spine ---------- */
export function spineTexture(text, bg, fg) {
  const W = 512, H = 64;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = bg;
  ctx.fillRect(0, 0, W, H);
  ctx.fillStyle = fg;
  ctx.fillRect(0, 8, W, 3);
  ctx.fillRect(0, H - 11, W, 3);
  ctx.font = 'bold 30px Georgia, serif';
  ctx.textAlign = "center";
  ctx.textBaseline = "middle";
  ctx.fillText(text, W / 2, H / 2 + 1);
  grain(ctx, W, H, 14);
  return toTexture(c);
}

/* ---------- corkboard with notes ---------- */
export function corkTexture() {
  const W = 768, H = 500;
  const [c, ctx] = canvas(W, H);
  ctx.fillStyle = "#a9794a";
  ctx.fillRect(0, 0, W, H);
  for (let i = 0; i < 9000; i++) {
    ctx.fillStyle = Math.random() > 0.5 ? "rgba(80,50,25,0.35)" : "rgba(220,180,130,0.3)";
    ctx.fillRect(Math.random() * W, Math.random() * H, 2, 2);
  }
  const notes = [
    { x: 60, y: 60, r: -0.06, c: "#f2e27a", t: ["SHIP IT", "(safely)"] },
    { x: 290, y: 50, r: 0.05, c: "#f6f3ea", t: ["650M+", "msgs / day"] },
    { x: 520, y: 80, r: -0.03, c: "#9fd3c7", t: ["LGTM", "✓✓"] },
    { x: 120, y: 270, r: 0.04, c: "#f4a7a0", t: ["leetcode", "every day"] },
    { x: 400, y: 280, r: -0.05, c: "#f2e27a", t: ["Java 8→21", "done ✓"] },
  ];
  for (const n of notes) {
    ctx.save();
    ctx.translate(n.x + 85, n.y + 75);
    ctx.rotate(n.r);
    ctx.fillStyle = "rgba(0,0,0,0.25)";
    ctx.fillRect(-80, -66, 170, 150);
    ctx.fillStyle = n.c;
    ctx.fillRect(-85, -75, 170, 150);
    ctx.fillStyle = "#2a2622";
    ctx.font = '40px "VT323", monospace';
    ctx.textAlign = "center";
    ctx.fillText(n.t[0], 0, -5);
    ctx.font = '30px "VT323", monospace';
    ctx.fillText(n.t[1], 0, 35);
    ctx.fillStyle = "#c0392b";
    ctx.beginPath();
    ctx.arc(0, -60, 9, 0, Math.PI * 2);
    ctx.fill();
    ctx.restore();
  }
  // wooden frame
  ctx.strokeStyle = "#6b4a2b";
  ctx.lineWidth = 26;
  ctx.strokeRect(0, 0, W, H);
  grain(ctx, W, H, 10);
  return toTexture(c);
}

/* ---------- wall clock (live time) ---------- */
export function createClock() {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  const tex = toTexture(c);
  let lastSec = -1;
  function draw() {
    const now = new Date();
    const sec = now.getSeconds();
    if (sec === lastSec) return;
    lastSec = sec;
    ctx.clearRect(0, 0, S, S);
    ctx.fillStyle = "#efeadc";
    ctx.beginPath();
    ctx.arc(S / 2, S / 2, S / 2 - 4, 0, Math.PI * 2);
    ctx.fill();
    ctx.strokeStyle = "#2b2926";
    ctx.lineCap = "round";
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2;
      ctx.lineWidth = i % 3 === 0 ? 7 : 3;
      ctx.beginPath();
      ctx.moveTo(S / 2 + Math.sin(a) * 100, S / 2 - Math.cos(a) * 100);
      ctx.lineTo(S / 2 + Math.sin(a) * 114, S / 2 - Math.cos(a) * 114);
      ctx.stroke();
    }
    const hand = (a, len, w, col) => {
      ctx.strokeStyle = col;
      ctx.lineWidth = w;
      ctx.beginPath();
      ctx.moveTo(S / 2, S / 2);
      ctx.lineTo(S / 2 + Math.sin(a) * len, S / 2 - Math.cos(a) * len);
      ctx.stroke();
    };
    const h = now.getHours() % 12, m = now.getMinutes();
    hand(((h + m / 60) / 12) * Math.PI * 2, 60, 9, "#2b2926");
    hand(((m + sec / 60) / 60) * Math.PI * 2, 92, 6, "#2b2926");
    hand((sec / 60) * Math.PI * 2, 100, 2, "#b03a2e");
    tex.needsUpdate = true;
  }
  draw();
  return { texture: tex, draw };
}

/* ---------- sticky note on the monitor ---------- */
export function stickyTexture() {
  const S = 256;
  const [c, ctx] = canvas(S, S);
  ctx.fillStyle = "#f2e27a";
  ctx.fillRect(0, 0, S, S);
  ctx.fillStyle = "rgba(0,0,0,0.08)";
  ctx.fillRect(0, 0, S, 30);
  ctx.fillStyle = "#2a2622";
  ctx.font = '54px "VT323", monospace';
  ctx.textAlign = "center";
  ctx.fillText("TODO:", S / 2, 100);
  ctx.fillText("hire me", S / 2, 160);
  ctx.font = '60px "VT323", monospace';
  ctx.fillText(":)", S / 2, 215);
  return toTexture(c);
}

/* ---------- subtle surface noise (desk, wall) ---------- */
export function noiseTexture(base, amount = 12, size = 256) {
  const [c, ctx] = canvas(size, size);
  ctx.fillStyle = base;
  ctx.fillRect(0, 0, size, size);
  grain(ctx, size, size, amount);
  return toTexture(c, { repeat: true });
}
