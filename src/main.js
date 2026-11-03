import "@fontsource/vt323/400.css";
import "@fontsource/ibm-plex-mono/400.css";
import "@fontsource/ibm-plex-mono/600.css";
import "./style.css";

import * as THREE from "three";
import { EffectComposer } from "three/addons/postprocessing/EffectComposer.js";
import { RenderPass } from "three/addons/postprocessing/RenderPass.js";
import { ShaderPass } from "three/addons/postprocessing/ShaderPass.js";
import { OutputPass } from "three/addons/postprocessing/OutputPass.js";

import { createWorld } from "./world.js";
import { FearsShader } from "./fearsShader.js";
import { SECTIONS, LAMP } from "./content.js";

const $ = (s) => document.querySelector(s);
const clamp = THREE.MathUtils.clamp;
const lerp = THREE.MathUtils.lerp;
const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
const reducedMotion = matchMedia("(prefers-reduced-motion: reduce)").matches;
const coarse = matchMedia("(pointer: coarse)").matches;
const small = () => innerWidth <= 760 || innerWidth / innerHeight < 0.9;

const quality = {
  dpr: Math.min(devicePixelRatio, coarse ? 1.5 : 1.75),
  shadow: coarse ? 1024 : 2048,
  msaa: coarse ? 2 : 4,
};

/* ================================================================ renderer */
const canvas = $("#scene");
const renderer = new THREE.WebGLRenderer({ canvas, antialias: false, powerPreference: "high-performance" });
renderer.setPixelRatio(quality.dpr);
renderer.setSize(innerWidth, innerHeight, false);
renderer.toneMapping = THREE.ACESFilmicToneMapping;
renderer.toneMappingExposure = 1.05;
renderer.shadowMap.enabled = true;
renderer.shadowMap.type = THREE.PCFShadowMap;

const scene = new THREE.Scene();
scene.background = new THREE.Color(0x2a2826);
scene.fog = new THREE.Fog(0x8f8a80, 4.5, 11);

const camera = new THREE.PerspectiveCamera(42, innerWidth / innerHeight, 0.03, 40);

const target = new THREE.WebGLRenderTarget(1, 1, { type: THREE.HalfFloatType, samples: quality.msaa });
const composer = new EffectComposer(renderer, target);
composer.addPass(new RenderPass(scene, camera));
composer.addPass(new OutputPass()); // tone map + sRGB, so the VHS pass sees display colors like Godot does
const fears = new ShaderPass(FearsShader);
composer.addPass(fears);

function resizeRenderer() {
  renderer.setSize(innerWidth, innerHeight, false);
  composer.setPixelRatio(quality.dpr);
  composer.setSize(innerWidth, innerHeight);
  fears.uniforms.resolution.value.set(innerWidth, innerHeight);
  camera.aspect = innerWidth / innerHeight;
  camera.fov = lerp(60, 40, aspectT());
  camera.updateProjectionMatrix();
  document.documentElement.style.setProperty("--panel-w", `${panelWidth()}px`);
  document.documentElement.style.setProperty("--sheet-h", `${sheetHeight()}px`);
}

// 0 = tall phone, 1 = wide desktop
function aspectT() {
  return clamp((innerWidth / innerHeight - 0.5) / (1.5 - 0.5), 0, 1);
}
function panelWidth() {
  return Math.round(Math.min(460, innerWidth * 0.42));
}
function sheetHeight() {
  return Math.round(innerHeight * (innerHeight < 560 ? 0.5 : 0.56));
}

/* ================================================================ loading */
const loader = $("#loader");
const log = $("#boot-log");
const fill = $(".fill");
const pctEl = $("#pct");
let shownPct = 0;
let realPct = 0;

function logLine(text, ok = false) {
  const line = document.createElement("div");
  line.innerHTML = ok ? `<span class="ok">[ OK ]</span> ${text}` : text;
  log.appendChild(line);
  while (log.children.length > 14) log.firstChild.remove();
}

// Loader progress is driven by real work: fonts, the photo, each build step,
// shader compilation and a warm-up render.
function makeTracker(totalWeight) {
  let done = 0;
  return (w) => {
    done += w;
    realPct = Math.min(100, (done / totalWeight) * 100);
  };
}

// Timer-driven (not requestAnimationFrame) so loading still finishes in a background tab.
function animateLoader() {
  let last = performance.now();
  return new Promise((resolve) => {
    const tick = () => {
      // never jump: climb toward the real value at most ~75%/s
      const now = performance.now();
      shownPct = Math.min(realPct, shownPct + ((now - last) / 1000) * 75);
      last = now;
      const p = Math.floor(shownPct);
      fill.style.width = `${shownPct}%`;
      pctEl.textContent = p;
      loader.setAttribute("aria-valuenow", p);
      if (shownPct < 100) setTimeout(tick, 16);
      else resolve();
    };
    tick();
  });
}

const nextFrame = () => new Promise((r) => setTimeout(r, 16));

async function boot() {
  resizeRenderer();
  logLine("CPU: Human-Powered @ 4.20 GHz");
  logLine("Memory Test: 640K OK");
  logLine("Detecting desk objects...");
  const shown = animateLoader();

  const WEIGHTS = { fonts: 8, photo: 12, step: 5, compile: 16, warm: 6 };
  const assets = { photo: null };
  const { world, steps } = createWorld({ scene, assets, quality });
  const track = makeTracker(
    WEIGHTS.fonts + WEIGHTS.photo + steps.length * WEIGHTS.step + WEIGHTS.compile + WEIGHTS.warm,
  );

  // fonts + photo download in parallel
  const fontsP = Promise.all([
    document.fonts.load('26px "VT323"'),
    document.fonts.load('14px "IBM Plex Mono"'),
    document.fonts.load('600 14px "IBM Plex Mono"'),
  ]).catch(() => {});
  const photoP = new Promise((resolve) => {
    new THREE.TextureLoader().load(`${import.meta.env.BASE_URL}me.jpg`, resolve, undefined, () => resolve(null));
  });
  await fontsP;
  track(WEIGHTS.fonts);
  logLine("Loading fonts: VT323, IBM Plex Mono", true);
  assets.photo = await photoP;
  track(WEIGHTS.photo);
  logLine("Developing photo: ME.JPG", true);

  for (const s of steps) {
    s.fn();
    track(WEIGHTS.step);
    logLine(s.label, true);
    await nextFrame();
  }

  state.world = world;
  if (coarse) $("#toast").textContent = "Tap any object · use ‹ › to move around";
  setupInteraction(world);
  goOverview(true);
  updateCamera(0, 0);

  logLine("Compiling shaders...");
  try {
    await renderer.compileAsync(scene, camera);
  } catch {
    /* compileAsync is an optimization; rendering compiles anyway */
  }
  track(WEIGHTS.compile);
  logLine("Shaders compiled", true);

  composer.render(0.016);
  await nextFrame();
  composer.render(0.016);
  track(WEIGHTS.warm);
  logLine("Loading MINH_NGUYEN.SYS", true);

  await shown;
  logLine("");
  logLine("READY.");
  await new Promise((r) => setTimeout(r, reducedMotion ? 50 : 380));
  loader.classList.add("done");
  document.body.classList.add("ready");
  setTimeout(() => loader.remove(), 900);
  setTimeout(() => $("#toast").classList.add("show"), 1500);
  setTimeout(() => $("#toast").classList.remove("show"), 7500);

  renderer.setAnimationLoop(frame);
}

/* ================================================================ camera rig */
const state = {
  world: null,
  selected: null, // section id or null
  hovered: null, // interactive item
  pointer: new THREE.Vector2(9, 9),
  pointerSmooth: new THREE.Vector2(),
  pointerDirty: false,
  pointerType: "mouse",
};

const rig = {
  pos: new THREE.Vector3(),
  target: new THREE.Vector3(),
  shift: new THREE.Vector2(),
  from: null,
  to: null,
  t0: 0,
  dur: 1,
};

function overviewPose() {
  const t = aspectT();
  const look = new THREE.Vector3(0.0, lerp(0.22, 0.17, t), lerp(-0.1, -0.16, t));
  const dir = new THREE.Vector3(0.02, lerp(0.95, 0.3, t), 1).normalize();
  const W = lerp(2.1, 2.85, t);
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  const tanH = tanV * camera.aspect;
  const d = Math.max(W / 2 / tanH, 0.62 / tanV);
  return { pos: look.clone().addScaledVector(dir, d), target: look, shift: new THREE.Vector2() };
}

function focusPose(item) {
  const tanV = Math.tan(THREE.MathUtils.degToRad(camera.fov) / 2);
  let availW = innerWidth, availH = innerHeight;
  const shift = new THREE.Vector2();
  if (small()) {
    const S = sheetHeight() + 70;
    availH = innerHeight - S;
    shift.y = S / 2;
  } else {
    const P = panelWidth() + 32;
    availW = innerWidth - P;
    shift.x = P / 2;
  }
  const tanY = tanV * (availH / innerHeight);
  const tanX = tanV * (availW / innerHeight);
  const d = (item.radius * 1.15) / Math.min(tanX, tanY);
  return { pos: item.center.clone().addScaledVector(item.focusDir, d), target: item.center.clone(), shift };
}

function flyTo(pose, dur = 1.25) {
  const now = performance.now() / 1000;
  rig.from = { pos: rig.pos.clone(), target: rig.target.clone(), shift: rig.shift.clone() };
  rig.to = pose;
  rig.t0 = now;
  // reduced motion keeps a (shorter, calmer) move so a tap never just pops
  rig.dur = reducedMotion ? Math.min(dur, 0.8) : dur;
}

const tmpV = new THREE.Vector3();
function updateCamera(now, dt) {
  if (rig.to) {
    const p = clamp((now - rig.t0) / rig.dur, 0, 1);
    const e = easeInOut(p);
    rig.pos.lerpVectors(rig.from.pos, rig.to.pos, e);
    rig.target.lerpVectors(rig.from.target, rig.to.target, e);
    rig.shift.lerpVectors(rig.from.shift, rig.to.shift, e);
    // arc up and back a little so the camera never skims through objects
    const travel = rig.from.pos.distanceTo(rig.to.pos);
    const arc = Math.sin(Math.PI * e) * Math.min(0.35, travel * 0.25);
    rig.pos.y += arc;
    rig.pos.z += arc * 0.6;
    if (p >= 1) {
      rig.pos.copy(rig.to.pos);
      rig.target.copy(rig.to.target);
      rig.shift.copy(rig.to.shift);
    }
  }

  // gentle parallax from the mouse; it is what gives the scene its depth
  const k = 1 - Math.exp(-dt * 3);
  const px = state.pointerType === "mouse" && Math.abs(state.pointer.x) <= 1 ? state.pointer.x : 0;
  const py = state.pointerType === "mouse" && Math.abs(state.pointer.y) <= 1 ? state.pointer.y : 0;
  state.pointerSmooth.x += (px - state.pointerSmooth.x) * k;
  state.pointerSmooth.y += (py - state.pointerSmooth.y) * k;
  const amp = state.selected ? 0.012 : 0.06;
  camera.position.copy(rig.pos);
  camera.lookAt(rig.target);
  tmpV.set(1, 0, 0).applyQuaternion(camera.quaternion);
  camera.position.addScaledVector(tmpV, state.pointerSmooth.x * amp);
  tmpV.set(0, 1, 0).applyQuaternion(camera.quaternion);
  camera.position.addScaledVector(tmpV, state.pointerSmooth.y * amp * 0.5);
  // idle breathing
  if (!reducedMotion) camera.position.y += Math.sin(now * 0.6) * 0.004;
  camera.lookAt(rig.target);

  if (Math.abs(rig.shift.x) > 0.5 || Math.abs(rig.shift.y) > 0.5) {
    camera.setViewOffset(innerWidth, innerHeight, rig.shift.x, rig.shift.y, innerWidth, innerHeight);
  } else if (camera.view?.enabled) {
    camera.clearViewOffset();
  }
}

/* ================================================================ interaction */
const raycaster = new THREE.Raycaster();
let pickables = [];
let items = [];
const byId = new Map();

const tooltip = $("#tooltip");
const panel = $("#panel");
const navLabel = $(".nav-current");
const navMenu = $("#nav-menu");
const navHome = $("#nav-home");
const navToggle = $("#nav-label");

function setupInteraction(world) {
  items = world.interactives;
  for (const it of items) {
    byId.set(it.id, it);
    it.group.traverse((o) => {
      if (o.isMesh || o.isInstancedMesh) pickables.push(o);
    });
  }

  // hotspot dots
  const hsRoot = $("#hotspots");
  items.forEach((it, i) => {
    const b = document.createElement("button");
    b.className = `hs${it.id === "lamp" ? " lamp" : ""}`;
    b.style.setProperty("--d", `${(i * 0.37) % 2.2}s`);
    b.tabIndex = -1;
    b.addEventListener("pointerenter", (e) => {
      if (e.pointerType === "mouse") setHovered(it, e.clientX, e.clientY);
    });
    b.addEventListener("pointerleave", () => setHovered(null));
    b.addEventListener("click", (e) => {
      e.stopPropagation();
      activate(it.id);
    });
    it.hotspotEl = b;
    hsRoot.appendChild(b);
  });

  // nav menu
  SECTIONS.forEach((s) => {
    const li = document.createElement("li");
    const b = document.createElement("button");
    b.innerHTML = `${s.label}<small>${objectName(s.id)}</small>`;
    b.dataset.id = s.id;
    b.addEventListener("click", () => {
      toggleMenu(false);
      select(s.id);
    });
    li.appendChild(b);
    navMenu.appendChild(li);
  });

  canvas.addEventListener("pointermove", onPointerMove);
  canvas.addEventListener("pointerdown", onPointerDown);
  canvas.addEventListener("pointerup", onPointerUp);
  canvas.addEventListener("pointerleave", () => {
    state.pointer.set(9, 9);
    setHovered(null);
  });

  $("#nav-prev").addEventListener("click", () => step(-1));
  $("#nav-next").addEventListener("click", () => step(1));
  navHome.addEventListener("click", () => goOverview());
  navToggle.addEventListener("click", () => toggleMenu());
  panel.querySelector(".close").addEventListener("click", () => goOverview());
  panel.querySelector(".prev").addEventListener("click", () => step(-1));
  panel.querySelector(".next").addEventListener("click", () => step(1));
  document.addEventListener("click", (e) => {
    if (!navMenu.hidden && !e.target.closest("#nav")) toggleMenu(false);
  });

  addEventListener("keydown", (e) => {
    if (e.key === "Escape") {
      if (!navMenu.hidden) toggleMenu(false);
      else goOverview();
    } else if (e.key === "ArrowRight") step(1);
    else if (e.key === "ArrowLeft") step(-1);
  });
}

function objectName(id) {
  return {
    everfit: "dumbbell",
    projects: "computer",
    skills: "keyboard",
    walmart: "mug",
    resume: "paper",
    hobbies: "cactus",
    about: "photo",
    contact: "phone",
    education: "books",
  }[id];
}

function toggleMenu(force) {
  const open = force ?? navMenu.hidden;
  navMenu.hidden = !open;
  navToggle.setAttribute("aria-expanded", String(open));
  if (open) {
    navMenu.querySelectorAll("button").forEach((b) => b.setAttribute("aria-current", String(b.dataset.id === state.selected)));
    (navMenu.querySelector('[aria-current="true"]') || navMenu.querySelector("button")).focus();
  }
}

function pick(clientX, clientY) {
  const ndc = new THREE.Vector2((clientX / innerWidth) * 2 - 1, -(clientY / innerHeight) * 2 + 1);
  raycaster.setFromCamera(ndc, camera);
  const hit = raycaster.intersectObjects(pickables, false)[0];
  return hit ? byId.get(hit.object.userData.sectionId) : null;
}

let down = null;
function onPointerMove(e) {
  state.pointerType = e.pointerType;
  state.pointer.set((e.clientX / innerWidth) * 2 - 1, -(e.clientY / innerHeight) * 2 + 1);
  if (e.pointerType === "mouse") {
    state.lastMouse = [e.clientX, e.clientY];
    state.pointerDirty = true;
  }
}
function onPointerDown(e) {
  down = { x: e.clientX, y: e.clientY, t: performance.now() };
}
function onPointerUp(e) {
  if (!down) return;
  const moved = Math.hypot(e.clientX - down.x, e.clientY - down.y);
  down = null;
  if (moved > 10) return;
  if (!navMenu.hidden) return toggleMenu(false);
  const it = pick(e.clientX, e.clientY);
  if (it) activate(it.id);
  else if (state.selected) goOverview();
}

function setHovered(it, x, y) {
  if (state.hovered !== it) {
    state.hovered = it;
    document.body.classList.toggle("hovering", !!it);
    if (it) {
      const s = it.id === "lamp" ? LAMP : SECTIONS.find((q) => q.id === it.id);
      tooltip.querySelector(".tt-title").textContent = s.label;
      tooltip.querySelector(".tt-hint").textContent = s.hint;
      tooltip.querySelector(".tt-action").textContent =
        it.id === "lamp" ? "click to toggle" : state.selected === it.id ? "you are here" : "click to open";
    }
    tooltip.classList.toggle("show", !!it);
  }
  if (it && x !== undefined) {
    const w = tooltip.offsetWidth, h = tooltip.offsetHeight;
    let tx = x + 18, ty = y + 18;
    if (tx + w > innerWidth - 8) tx = x - w - 18;
    if (ty + h > innerHeight - 8) ty = y - h - 18;
    tooltip.style.transform = `translate3d(${tx}px, ${ty}px, 0)`;
  }
}

function activate(id) {
  if (id === "lamp") {
    const on = state.world.lamp.toggle();
    flashToast(on ? "Lamp on" : "Lamp off");
    return;
  }
  select(id);
}

let toastTimer;
function flashToast(text) {
  const t = $("#toast");
  t.textContent = text;
  t.classList.add("show");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => t.classList.remove("show"), 1400);
}

function step(dir) {
  const ids = SECTIONS.map((s) => s.id);
  const i = state.selected ? ids.indexOf(state.selected) : dir > 0 ? -1 : ids.length;
  select(ids[(i + dir + ids.length) % ids.length]);
}

function select(id) {
  const s = SECTIONS.find((q) => q.id === id);
  const it = byId.get(id);
  if (!s || !it) return;
  $("#toast").classList.remove("show");
  state.selected = id;
  document.body.classList.add("focused");
  flyTo(focusPose(it), state.selectedOnce ? 1.15 : 1.4);
  state.selectedOnce = true;
  state.world.screen.setMode(id === "projects" ? "projects" : "idle", performance.now() / 1000);

  // fill the panel
  const idx = SECTIONS.indexOf(s);
  const prev = SECTIONS[(idx - 1 + SECTIONS.length) % SECTIONS.length];
  const next = SECTIONS[(idx + 1) % SECTIONS.length];
  panel.querySelector(".path").textContent = `C:\\DESK\\${objectName(id).toUpperCase()}.EXE`;
  panel.querySelector(".kicker").textContent = s.kicker;
  panel.querySelector("#panel-title").textContent = s.title;
  panel.querySelector(".content").innerHTML = s.html;
  panel.querySelector(".prev span").textContent = prev.label;
  panel.querySelector(".next span").textContent = next.label;
  const body = panel.querySelector(".body");
  body.scrollTop = 0;
  panel.classList.add("open");
  panel.setAttribute("aria-hidden", "false");
  navLabel.textContent = s.label;
  navHome.hidden = false;
  setHovered(null);
}

function goOverview(instant = false) {
  state.selected = null;
  document.body.classList.remove("focused");
  panel.classList.remove("open");
  panel.setAttribute("aria-hidden", "true");
  navLabel.textContent = coarse ? "Tap an object" : "Look around the desk";
  navHome.hidden = true;
  state.world?.screen.setMode("idle", performance.now() / 1000);
  const pose = overviewPose();
  if (instant) {
    rig.pos.copy(pose.pos);
    rig.target.copy(pose.target);
    rig.shift.copy(pose.shift);
    rig.to = null;
  } else flyTo(pose, 1.2);
}

/* ================================================================ frame loop */
const timer = new THREE.Timer();
timer.connect(document);
const proj = new THREE.Vector3();

function frame() {
  timer.update();
  const dt = Math.min(timer.getDelta(), 0.1);
  const now = performance.now() / 1000;
  const world = state.world;

  updateCamera(now, dt);

  // hover picking (mouse only), once per frame
  if (state.pointerDirty && state.lastMouse) {
    state.pointerDirty = false;
    const it = pick(...state.lastMouse);
    setHovered(it, ...state.lastMouse);
  } else if (state.hovered && state.lastMouse && rig.to) {
    setHovered(pick(...state.lastMouse), ...state.lastMouse);
  }

  // hover glow + lift
  const k = 1 - Math.exp(-dt * 10);
  for (const it of items) {
    const goal = state.hovered === it ? 1 : 0;
    it.glow += (goal - it.glow) * k;
    for (const m of it.glowable) m.emissive.setRGB(0.2 * it.glow, 0.16 * it.glow, 0.09 * it.glow);
    if (it.id !== "projects") it.group.position.y = it.baseY + it.glow * 0.008;

    // hotspot dots follow their objects
    if (!state.selected) {
      proj.copy(it.hotspot).project(camera);
      const visible = proj.z < 1 && Math.abs(proj.x) < 1.05 && Math.abs(proj.y) < 1.05;
      it.hotspotEl.style.display = visible ? "" : "none";
      if (visible) {
        const x = (proj.x * 0.5 + 0.5) * innerWidth;
        const y = (-proj.y * 0.5 + 0.5) * innerHeight;
        it.hotspotEl.style.transform = `translate3d(${x}px, ${y}px, 0)`;
      }
    }
  }

  world.screen.draw(now);
  world.lamp.update(dt);
  for (const u of world.updaters) u(now, dt);

  fears.uniforms.time.value = (now % 100) + 1;
  composer.render(dt);
}

/* ================================================================ resize */
let resizeRaf = 0;
addEventListener("resize", () => {
  cancelAnimationFrame(resizeRaf);
  resizeRaf = requestAnimationFrame(() => {
    resizeRenderer();
    if (!state.world) return;
    const pose = state.selected ? focusPose(byId.get(state.selected)) : overviewPose();
    flyTo(pose, 0.35);
  });
});

boot().catch((err) => {
  console.error(err);
  logLine("");
  logLine("BOOT FAILURE: " + (err?.message || err));
  logLine("This page needs WebGL. Try another browser.");
});
