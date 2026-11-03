import * as THREE from "three";
import {
  mugTexture,
  createScreen,
  caseFrontTexture,
  paperTexture,
  spineTexture,
  corkTexture,
  createClock,
  stickyTexture,
  noiseTexture,
} from "./textures.js";

// Units are meters. The desk top sits at y = 0, the wall behind it at z ≈ -0.75,
// and the front edge of the desk at z = 0.55.

const mat = (color, o = {}) =>
  new THREE.MeshStandardMaterial({ color, roughness: 0.82, metalness: 0, ...o });

function mesh(geo, material, { cast = true, receive = true } = {}) {
  const m = new THREE.Mesh(geo, material);
  m.castShadow = cast;
  m.receiveShadow = receive;
  return m;
}

function box(w, h, d, material, x = 0, y = 0, z = 0, o) {
  const m = mesh(new THREE.BoxGeometry(w, h, d), material, o);
  m.position.set(x, y, z);
  return m;
}

// A box whose back face shrinks toward a point below center: the shape of a CRT.
function taperedBox(w, h, d, backScale, drop = 0.08) {
  const g = new THREE.BoxGeometry(w, h, d, 1, 1, 1);
  const p = g.attributes.position;
  for (let i = 0; i < p.count; i++) {
    if (p.getZ(i) < 0) {
      p.setX(i, p.getX(i) * backScale);
      p.setY(i, p.getY(i) * backScale - h * drop);
    }
  }
  g.computeVertexNormals();
  return g;
}

// Cylinder between two points.
function rod(a, b, r, material, seg = 8) {
  const dir = new THREE.Vector3().subVectors(b, a);
  const m = mesh(new THREE.CylinderGeometry(r, r, dir.length(), seg), material);
  m.position.copy(a).addScaledVector(dir, 0.5);
  m.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir.normalize());
  return m;
}

export function createWorld({ scene, assets, quality }) {
  const world = {
    interactives: [], // { id, group, focusDir (local), center, radius }
    updaters: [],
    screen: null,
    lamp: null,
  };

  const C = {
    wall: 0xc8c2b3,
    panel: 0x8e8c87,
    trim: 0x3d3a37,
    desk: 0x8b8da3,
    beige: 0xd9cfb3,
    beigeDark: 0xb9ae90,
    black: 0x1d1d20,
  };

  // Interactive objects get their own material copies so hover highlights
  // never leak onto other objects sharing a material.
  function register(id, group, focusDir, opts = {}) {
    group.updateMatrixWorld(true);
    const materials = new Set();
    group.traverse((o) => {
      if (o.isMesh || o.isInstancedMesh) {
        if (opts.clone !== false) {
          o.material = Array.isArray(o.material) ? o.material.map((m) => m.clone()) : o.material.clone();
        }
        (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => materials.add(m));
        o.userData.sectionId = id;
      }
    });
    // Only materials without their own glow get the hover highlight.
    const glowable = [...materials].filter((m) => m.emissive && m.emissive.getHex() === 0);
    const bbox = new THREE.Box3().setFromObject(group);
    const center = opts.center ?? bbox.getCenter(new THREE.Vector3());
    const radius = opts.radius ?? bbox.getSize(new THREE.Vector3()).length() / 2;
    world.interactives.push({
      id,
      group,
      focusDir: new THREE.Vector3(...focusDir).normalize().applyQuaternion(group.quaternion),
      center,
      radius,
      hotspot: opts.hotspot ?? center.clone().add(new THREE.Vector3(0, bbox.max.y - center.y + 0.03, 0)),
      glowable,
      baseY: group.position.y,
      lift: 0,
      glow: 0,
    });
  }

  const steps = [];
  const step = (label, fn) => steps.push({ label, fn });

  /* ------------------------------------------------------------ room */
  step("Building the cubicle", () => {
    const floor = mesh(new THREE.PlaneGeometry(14, 14), mat(0x3b3a41), { cast: false });
    floor.rotation.x = -Math.PI / 2;
    floor.position.y = -0.76;
    scene.add(floor);

    const wallTex = noiseTexture("#c8c2b3", 7);
    wallTex.repeat.set(6, 4);
    const wall = mesh(new THREE.PlaneGeometry(10, 5), mat(0xffffff, { map: wallTex }), { cast: false });
    wall.position.set(0, 1.6, -0.82);
    scene.add(wall);

    const fabric = noiseTexture("#8e8c87", 22);
    fabric.repeat.set(8, 3);
    const panelMat = mat(0xffffff, { map: fabric, roughness: 0.95 });
    const trimMat = mat(C.trim, { roughness: 0.6 });

    // back partition, rail and posts
    scene.add(box(3.7, 1.2, 0.05, panelMat, 0, -0.16, -0.77));
    scene.add(box(3.74, 0.035, 0.08, trimMat, 0, 0.456, -0.77));
    for (const x of [-1.85, -0.62, 0.62, 1.85]) scene.add(box(0.035, 1.24, 0.08, trimMat, x, -0.15, -0.765));
    // side partitions
    for (const x of [-1.86, 1.86]) {
      scene.add(box(0.05, 1.2, 1.05, panelMat, x, -0.16, -0.27));
      scene.add(box(0.08, 0.035, 1.07, trimMat, x, 0.456, -0.27));
      scene.add(box(0.08, 1.24, 0.035, trimMat, x, -0.15, 0.25));
    }

    // desk
    const deskTex = noiseTexture("#8b8da3", 9);
    deskTex.repeat.set(4, 2);
    scene.add(box(3.66, 0.04, 1.32, mat(0xffffff, { map: deskTex, roughness: 0.7 }), 0, -0.02, -0.11));
    scene.add(box(3.66, 0.046, 0.02, mat(0x6c6e83, { roughness: 0.6 }), 0, -0.021, 0.555));
    scene.add(box(3.5, 0.6, 0.03, mat(0x55576a), 0, -0.36, 0.45));

    // corkboard + clock on the wall
    const cork = box(0.56, 0.34, 0.02, [
      mat(0x6b4a2b), mat(0x6b4a2b), mat(0x6b4a2b), mat(0x6b4a2b),
      mat(0xffffff, { map: corkTexture(), roughness: 0.95 }), mat(0x6b4a2b),
    ], 0.5, 0.68, -0.8);
    scene.add(cork);

    const clock = createClock();
    world.updaters.push(() => clock.draw());
    const clockGroup = new THREE.Group();
    clockGroup.position.set(1.22, 0.74, -0.8);
    const rim = mesh(new THREE.CylinderGeometry(0.1, 0.1, 0.03, 40), mat(0x2a2827, { roughness: 0.5 }));
    rim.rotation.x = Math.PI / 2;
    const face = mesh(new THREE.CircleGeometry(0.088, 40), mat(0xffffff, { map: clock.texture, roughness: 0.4 }));
    face.position.z = 0.0155;
    clockGroup.add(rim, face);
    scene.add(clockGroup);
  });

  /* ------------------------------------------------------------ lights */
  step("Turning on the lights", () => {
    scene.add(new THREE.HemisphereLight(0xece4d4, 0x4a4656, 0.75));

    // overhead office light: its falloff darkens the wall toward the top, like the reference
    const ceiling = new THREE.PointLight(0xfff2e0, 3.2, 0, 2);
    ceiling.position.set(0.1, 1.3, 0.9);
    scene.add(ceiling);

    const key = new THREE.DirectionalLight(0xfff0dc, 1.15);
    key.position.set(-1.6, 3.2, 2.6);
    key.target.position.set(0, 0, -0.2);
    key.castShadow = true;
    key.shadow.mapSize.set(quality.shadow, quality.shadow);
    const s = key.shadow.camera;
    s.left = -2.2; s.right = 2.2; s.top = 1.6; s.bottom = -1.6; s.near = 0.5; s.far = 8;
    key.shadow.bias = -0.0004;
    key.shadow.normalBias = 0.02;
    key.shadow.radius = 4;
    scene.add(key, key.target);

    const fill = new THREE.DirectionalLight(0xc9d2ff, 0.35);
    fill.position.set(2.5, 1.2, 1.5);
    scene.add(fill);
  });

  /* ------------------------------------------------------------ computer (projects) */
  step("Booting the CRT", () => {
    const g = new THREE.Group();
    g.position.set(-0.68, 0, -0.33);
    const plastic = mat(C.beige, { roughness: 0.6 });
    const plasticDark = mat(C.beigeDark, { roughness: 0.7 });

    // desktop case
    const front = mat(0xffffff, { map: caseFrontTexture(), roughness: 0.6 });
    g.add(box(0.72, 0.16, 0.5, [plastic, plastic, plastic, plasticDark, front, plasticDark], 0, 0.08, 0));
    g.add(mesh(new THREE.CylinderGeometry(0.13, 0.15, 0.025, 24), plasticDark).translateY(0.172));

    // monitor
    const mon = new THREE.Group();
    mon.position.set(0, 0.42, -0.02);
    mon.add(mesh(taperedBox(0.56, 0.47, 0.44, 0.6), plastic));
    // bezel recess + curved glass
    mon.add(box(0.47, 0.37, 0.004, mat(0x1b1a18, { roughness: 0.5 }), 0, 0.02, 0.2225));
    const screen = createScreen();
    world.screen = screen;
    const sg = new THREE.PlaneGeometry(0.44, 0.34, 16, 12);
    const sp = sg.attributes.position;
    for (let i = 0; i < sp.count; i++) {
      const x = sp.getX(i) / 0.22, y = sp.getY(i) / 0.17;
      sp.setZ(i, 0.014 * (1 - x * x * 0.6) * (1 - y * y * 0.6));
    }
    sg.computeVertexNormals();
    const screenMesh = mesh(sg, new THREE.MeshBasicMaterial({ map: screen.texture, color: 0xd8ffe0 }), { cast: false });
    screenMesh.position.set(0, 0.02, 0.2252);
    mon.add(screenMesh);
    // power LED + brand badge + sticky note
    mon.add(box(0.012, 0.006, 0.004, mat(0x46ff6a, { emissive: 0x46ff6a, emissiveIntensity: 2 }), 0.21, -0.2, 0.2225));
    mon.add(box(0.06, 0.012, 0.003, plasticDark, -0.18, -0.2, 0.2225));
    const sticky = mesh(new THREE.PlaneGeometry(0.075, 0.075), mat(0xffffff, { map: stickyTexture(), roughness: 0.9 }), { cast: false });
    sticky.position.set(0.245, 0.17, 0.2275);
    sticky.rotation.z = -0.12;
    mon.add(sticky);
    g.add(mon);

    const glow = new THREE.PointLight(0x7dffa0, 0.06, 1.2, 2);
    glow.position.set(0, 0.42, 0.35);
    g.add(glow);

    scene.add(g);
    const center = new THREE.Vector3(-0.68, 0.44, -0.12);
    register("projects", g, [0.04, 0.1, 1], { center, radius: 0.37, hotspot: new THREE.Vector3(-0.68, 0.7, -0.2) });
  });

  /* ------------------------------------------------------------ keyboard (skills) + mouse */
  step("Plugging in the keyboard", () => {
    const g = new THREE.Group();
    g.position.set(-0.66, 0, 0.22);
    g.rotation.y = 0.04;
    const tilt = new THREE.Group();
    tilt.rotation.x = 0.07;
    tilt.position.y = 0.018;
    g.add(tilt);
    tilt.add(box(0.68, 0.028, 0.22, mat(C.beige, { roughness: 0.6 }), 0, 0, 0));

    const keyGeo = new THREE.BoxGeometry(0.026, 0.014, 0.026);
    const keys = [];
    const pitch = 0.031;
    const rows = [14, 14, 13, 12];
    rows.forEach((n, r) => {
      for (let i = 0; i < n; i++) keys.push([-0.31 + r * 0.008 + i * pitch, -0.062 + r * pitch + 0.03, i === 0 || i === n - 1]);
    });
    for (let i = 0; i < 12; i++) keys.push([-0.3 + i * pitch + (i > 3 ? 0.01 : 0) + (i > 7 ? 0.01 : 0), -0.075, i === 0]);
    for (let c = 0; c < 4; c++) for (let r = 0; r < 5; r++) keys.push([0.19 + c * pitch, -0.075 + r * pitch, c === 3]);
    const inst = new THREE.InstancedMesh(keyGeo, mat(0xc9bd9c, { roughness: 0.55 }), keys.length);
    const m4 = new THREE.Matrix4();
    const light = new THREE.Color(0xd6cbad), dark = new THREE.Color(0x9c9277), orange = new THREE.Color(0xd2854a);
    keys.forEach(([x, z, mod], i) => {
      m4.makeTranslation(x, 0.018, z);
      inst.setMatrixAt(i, m4);
      inst.setColorAt(i, i === 0 ? orange : mod ? dark : light);
    });
    inst.material.color.set(0xffffff);
    inst.castShadow = true;
    inst.receiveShadow = true;
    tilt.add(inst);
    tilt.add(box(0.2, 0.014, 0.026, mat(0xd6cbad, { roughness: 0.55 }), -0.07, 0.018, 0.068 + 0.024));
    scene.add(g);
    register("skills", g, [0, 1.2, 0.8], { radius: 0.36 });

    // mouse pad, mouse and cord (decor)
    const pad = mesh(new THREE.CylinderGeometry(0.12, 0.12, 0.004, 40), mat(0x2b2c37, { roughness: 0.95 }), { cast: false });
    pad.scale.set(1.25, 1, 1);
    pad.position.set(-0.06, 0.002, 0.33);
    scene.add(pad);
    const mouse = mesh(new THREE.SphereGeometry(1, 16, 10), mat(C.beige, { roughness: 0.5 }));
    mouse.scale.set(0.032, 0.018, 0.05);
    mouse.position.set(-0.03, 0.006, 0.34);
    scene.add(mouse);
    const cord = new THREE.CatmullRomCurve3([
      new THREE.Vector3(-0.03, 0.006, 0.29),
      new THREE.Vector3(-0.05, 0.003, 0.15),
      new THREE.Vector3(-0.15, 0.003, 0.0),
      new THREE.Vector3(-0.26, 0.005, -0.2),
      new THREE.Vector3(-0.3, 0.06, -0.45),
    ]);
    scene.add(mesh(new THREE.TubeGeometry(cord, 60, 0.003, 6), mat(0x8a8268)));
  });

  /* ------------------------------------------------------------ lamp (toggle) */
  step("Bending the desk lamp", () => {
    const g = new THREE.Group();
    g.position.set(0.04, 0, -0.5);
    scene.add(g);
    const metal = mat(C.black, { roughness: 0.35, metalness: 0.6 });
    g.add(mesh(new THREE.CylinderGeometry(0.07, 0.082, 0.022, 28), metal).translateY(0.011));
    g.add(mesh(new THREE.SphereGeometry(0.016, 12, 8), metal).translateY(0.03));
    const base = new THREE.Vector3(0, 0.03, 0);
    const elbow = new THREE.Vector3(-0.03, 0.35, -0.05);
    const head = new THREE.Vector3(0.08, 0.47, 0.14);
    for (const dx of [-0.011, 0.011]) {
      g.add(rod(base.clone().setX(dx), elbow.clone().setX(elbow.x + dx), 0.0055, metal));
      g.add(rod(elbow.clone().setX(elbow.x + dx), head.clone().setX(head.x + dx), 0.0055, metal));
    }
    // springs
    g.add(rod(new THREE.Vector3(0.0, 0.08, 0.02), new THREE.Vector3(-0.02, 0.28, -0.02), 0.0035, mat(0x777777, { metalness: 0.8, roughness: 0.3 })));
    const axle = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.04, 12), metal);
    axle.rotation.z = Math.PI / 2;
    axle.position.copy(elbow);
    g.add(axle);

    const shade = new THREE.Group();
    shade.position.copy(head);
    g.add(shade);
    g.updateMatrixWorld(true);
    const aim = new THREE.Vector3(0.24, 0, -0.18);
    shade.lookAt(aim);
    const cone = new THREE.Group();
    cone.rotation.x = -Math.PI / 2;
    shade.add(cone);
    const outer = mesh(new THREE.CylinderGeometry(0.03, 0.085, 0.13, 28, 1, true), metal);
    outer.position.y = -0.05;
    const innerMat = mat(0xf3e6c9, { side: THREE.BackSide, emissive: 0xffc985, emissiveIntensity: 0.6 });
    const inner = mesh(new THREE.CylinderGeometry(0.029, 0.084, 0.128, 28, 1, true), innerMat, { cast: false });
    inner.position.y = -0.05;
    const cap = mesh(new THREE.SphereGeometry(0.032, 16, 8, 0, Math.PI * 2, 0, Math.PI / 2), metal);
    cap.position.y = 0.012;
    const bulbMat = new THREE.MeshStandardMaterial({ color: 0xfff4dd, emissive: 0xffd9a0, emissiveIntensity: 3 });
    const bulb = mesh(new THREE.SphereGeometry(0.024, 16, 12), bulbMat, { cast: false });
    bulb.position.y = -0.05;
    cone.add(outer, inner, cap, bulb);

    const spot = new THREE.SpotLight(0xffd8a0, 2.4, 3, 0.7, 0.6, 2);
    spot.castShadow = true;
    spot.shadow.mapSize.set(quality.shadow / 2, quality.shadow / 2);
    spot.shadow.bias = -0.0006;
    spot.shadow.normalBias = 0.01;
    spot.shadow.camera.near = 0.05;
    const aimLocal = aim.clone().sub(g.position);
    spot.position.copy(head).addScaledVector(aimLocal.clone().sub(head).normalize(), 0.05);
    spot.target.position.copy(aimLocal);
    g.add(spot, spot.target);
    const bounce = new THREE.PointLight(0xffd29a, 0.12, 0.8, 2);
    bounce.position.copy(head).add(new THREE.Vector3(0.03, -0.08, 0.04));
    g.add(bounce);

    let on = true;
    world.lamp = {
      toggle() {
        on = !on;
        return on;
      },
      update(dt) {
        const k = 1 - Math.exp(-dt * 14);
        spot.intensity += ((on ? 2.4 : 0) - spot.intensity) * k;
        bounce.intensity += ((on ? 0.12 : 0) - bounce.intensity) * k;
        bulbMat.emissiveIntensity += ((on ? 3 : 0) - bulbMat.emissiveIntensity) * k;
        innerMat.emissiveIntensity += ((on ? 0.6 : 0) - innerMat.emissiveIntensity) * k;
      },
    };
    register("lamp", g, [0.1, 0.3, 1], { radius: 0.3, clone: false });
  });

  /* ------------------------------------------------------------ mug (walmart) */
  step("Pouring the coffee", () => {
    const g = new THREE.Group();
    g.position.set(0.3, 0, -0.34);
    g.rotation.y = -0.12;
    const r = 0.045, h = 0.105;
    const white = mat(0xf4f2ec, { roughness: 0.35 });
    const wall = mesh(
      new THREE.CylinderGeometry(r, r, h - 0.012, 56, 1, true, Math.PI, Math.PI * 2),
      mat(0xffffff, { map: mugTexture(), roughness: 0.35 }),
    );
    wall.position.y = 0.012 + (h - 0.012) / 2;
    const profile = [];
    for (let i = 0; i <= 8; i++) {
      const a = (i / 8) * (Math.PI / 2);
      profile.push(new THREE.Vector2(r - 0.012 + Math.sin(a) * 0.012, 0.012 - Math.cos(a) * 0.012));
    }
    profile.unshift(new THREE.Vector2(0, 0));
    const bottom = mesh(new THREE.LatheGeometry(profile, 56), white);
    const innerWall = mesh(new THREE.CylinderGeometry(r - 0.005, r - 0.005, h - 0.014, 56, 1, true), mat(0xe8e4da, { roughness: 0.4, side: THREE.BackSide }));
    innerWall.position.y = 0.014 + (h - 0.014) / 2;
    const rim = mesh(new THREE.TorusGeometry(r - 0.0025, 0.0026, 8, 56), white);
    rim.rotation.x = Math.PI / 2;
    rim.position.y = h;
    const coffee = mesh(new THREE.CircleGeometry(r - 0.005, 40), mat(0x2b1a10, { roughness: 0.15 }), { cast: false });
    coffee.rotation.x = -Math.PI / 2;
    coffee.position.y = h - 0.022;
    const handle = mesh(new THREE.TorusGeometry(0.028, 0.0068, 10, 28, Math.PI), white);
    handle.rotation.z = -Math.PI / 2;
    handle.scale.set(1, 1.15, 1);
    handle.position.set(r - 0.004, 0.056, 0);
    g.add(wall, bottom, innerWall, rim, coffee, handle);
    scene.add(g);

    // register before adding steam so the sprites don't inflate the bounds
    register("walmart", g, [0, 0.32, 1], { radius: 0.085, center: new THREE.Vector3(0.3, 0.06, -0.34) });

    // steam: soft sprites drifting up
    const puff = document.createElement("canvas");
    puff.width = puff.height = 64;
    const pc = puff.getContext("2d");
    const grad = pc.createRadialGradient(32, 32, 0, 32, 32, 32);
    grad.addColorStop(0, "rgba(255,255,255,1)");
    grad.addColorStop(1, "rgba(255,255,255,0)");
    pc.fillStyle = grad;
    pc.fillRect(0, 0, 64, 64);
    const puffTex = new THREE.CanvasTexture(puff);
    const wisps = [];
    for (let i = 0; i < 7; i++) {
      const w = new THREE.Sprite(new THREE.SpriteMaterial({ map: puffTex, transparent: true, opacity: 0, depthWrite: false }));
      w.userData.phase = i / 7;
      g.add(w);
      wisps.push(w);
    }
    world.updaters.push((t) => {
      for (const w of wisps) {
        const p = (t * 0.16 + w.userData.phase) % 1;
        w.position.set(Math.sin(p * 6 + w.userData.phase * 9) * 0.014, h - 0.01 + p * 0.13, Math.cos(p * 5) * 0.006);
        w.scale.setScalar(0.025 + p * 0.05);
        w.material.opacity = Math.sin(p * Math.PI) * 0.16;
      }
    });
  });

  /* ------------------------------------------------------------ cactus (hobbies) */
  step("Watering the cactus", () => {
    const g = new THREE.Group();
    g.position.set(0.56, 0, -0.5);
    const clay = mat(0xa5573b, { roughness: 0.9 });
    g.add(mesh(new THREE.CylinderGeometry(0.046, 0.036, 0.075, 18), clay).translateY(0.0375));
    g.add(mesh(new THREE.CylinderGeometry(0.051, 0.051, 0.016, 18), clay).translateY(0.072));
    const soil = mesh(new THREE.CircleGeometry(0.044, 18), mat(0x3a2a1e), { cast: false });
    soil.rotation.x = -Math.PI / 2;
    soil.position.y = 0.079;
    g.add(soil);
    const green = mat(0x5d8a48, { roughness: 0.7, flatShading: true });
    const body = mesh(new THREE.CapsuleGeometry(0.027, 0.08, 4, 10), green);
    body.position.y = 0.135;
    g.add(body);
    const arm1 = mesh(new THREE.CapsuleGeometry(0.013, 0.03, 3, 8), green);
    arm1.rotation.z = Math.PI / 2;
    arm1.position.set(0.035, 0.13, 0);
    const arm2 = mesh(new THREE.CapsuleGeometry(0.013, 0.035, 3, 8), green);
    arm2.position.set(0.053, 0.155, 0);
    const arm3 = mesh(new THREE.CapsuleGeometry(0.011, 0.02, 3, 8), green);
    arm3.rotation.z = Math.PI / 2;
    arm3.position.set(-0.033, 0.15, 0.004);
    const arm4 = mesh(new THREE.CapsuleGeometry(0.011, 0.022, 3, 8), green);
    arm4.position.set(-0.047, 0.165, 0.004);
    g.add(arm1, arm2, arm3, arm4);
    const flower = mesh(new THREE.ConeGeometry(0.012, 0.014, 6), mat(0xe36d8c, { flatShading: true }));
    flower.rotation.x = Math.PI;
    flower.position.y = 0.205;
    g.add(flower);
    scene.add(g);
    register("hobbies", g, [0, 0.35, 1], { radius: 0.12 });
  });

  /* ------------------------------------------------------------ picture frame (about) */
  step("Framing the photo", () => {
    const g = new THREE.Group();
    g.position.set(0.82, 0, -0.55);
    g.rotation.y = -0.22;
    const tilt = new THREE.Group();
    tilt.rotation.x = -0.12;
    g.add(tilt);
    const wood = mat(0xb08a5a, { roughness: 0.7 });
    const W = 0.13, H = 0.165;
    tilt.add(box(W, H, 0.016, wood, 0, H / 2, 0));
    tilt.add(box(W - 0.024, H - 0.024, 0.002, mat(0xefe9dc), 0, H / 2, 0.0085));
    const pw = W - 0.04, ph = H - 0.04;
    const photo = assets.photo;
    if (photo) {
      const imgAspect = photo.image.width / photo.image.height;
      const planeAspect = pw / ph;
      photo.colorSpace = THREE.SRGBColorSpace;
      photo.repeat.set(planeAspect / imgAspect, 1);
      photo.offset.set((1 - photo.repeat.x) / 2, 0);
    }
    const pic = mesh(new THREE.PlaneGeometry(pw, ph), mat(0xffffff, { map: photo, roughness: 0.3 }), { cast: false });
    pic.position.set(0, H / 2, 0.0098);
    tilt.add(pic);
    const leg = box(0.03, 0.12, 0.006, wood, 0, 0.06, -0.04);
    leg.rotation.x = 0.4;
    g.add(leg);
    scene.add(g);
    register("about", g, [0, 0.12, 1], { radius: 0.13 });
  });

  /* ------------------------------------------------------------ paper + pencil (résumé) */
  step("Printing the résumé", () => {
    const g = new THREE.Group();
    g.position.set(0.36, 0, 0.26);
    g.rotation.y = -0.2;
    const blank = mat(0xf1eee6, { roughness: 0.9 });
    const under = box(0.21, 0.0015, 0.297, blank, 0.012, 0.00075, -0.006);
    under.rotation.y = 0.08;
    g.add(under);
    const top = mat(0xffffff, { map: paperTexture(), roughness: 0.9 });
    g.add(box(0.21, 0.0015, 0.297, [blank, blank, top, blank, blank, blank], 0, 0.0023, 0));

    const pencil = new THREE.Group();
    pencil.position.set(0.04, 0.0075, 0.1);
    pencil.rotation.y = 0.6;
    const bodyGeo = new THREE.CylinderGeometry(0.0045, 0.0045, 0.15, 6);
    const body = mesh(bodyGeo, mat(0xe8b62c, { flatShading: true, roughness: 0.5 }));
    body.rotation.z = Math.PI / 2;
    const tip = mesh(new THREE.ConeGeometry(0.0045, 0.022, 6), mat(0xdcb58a, { flatShading: true }));
    tip.rotation.z = -Math.PI / 2;
    tip.position.x = 0.086;
    const lead = mesh(new THREE.ConeGeometry(0.0016, 0.007, 6), mat(0x222222));
    lead.rotation.z = -Math.PI / 2;
    lead.position.x = 0.0955;
    const ferrule = mesh(new THREE.CylinderGeometry(0.0047, 0.0047, 0.012, 10), mat(0xb8b8b0, { metalness: 0.7, roughness: 0.3 }));
    ferrule.rotation.z = Math.PI / 2;
    ferrule.position.x = -0.081;
    const eraser = mesh(new THREE.CylinderGeometry(0.0045, 0.0045, 0.01, 10), mat(0xe48b8b));
    eraser.rotation.z = Math.PI / 2;
    eraser.position.x = -0.092;
    pencil.add(body, tip, lead, ferrule, eraser);
    g.add(pencil);
    scene.add(g);
    register("resume", g, [0, 1.6, 0.55], { radius: 0.18 });
  });

  /* ------------------------------------------------------------ phone (contact) */
  step("Connecting the phone line", () => {
    const g = new THREE.Group();
    g.position.set(0.55, 0, -0.12);
    g.rotation.y = 0.12;
    const plastic = mat(0x2a2a2f, { roughness: 0.45 });
    g.add(box(0.2, 0.045, 0.22, plastic, 0, 0.0225, 0));
    const slope = box(0.19, 0.02, 0.12, plastic, 0, 0.05, 0.045);
    slope.rotation.x = 0.28;
    g.add(slope);
    // keypad
    const keyGeo = new THREE.BoxGeometry(0.022, 0.008, 0.016);
    const keys = new THREE.InstancedMesh(keyGeo, mat(0xd39a6c, { roughness: 0.5 }), 12);
    const m4 = new THREE.Matrix4();
    for (let i = 0; i < 12; i++) {
      m4.makeTranslation(-0.032 + (i % 3) * 0.032, 0.012, -0.036 + Math.floor(i / 3) * 0.024);
      keys.setMatrixAt(i, m4);
    }
    keys.castShadow = true;
    slope.add(keys);
    g.add(box(0.012, 0.006, 0.008, mat(0xff3b2f, { emissive: 0xff3b2f, emissiveIntensity: 1.5 }), 0.075, 0.055, 0.1));
    // cradle + handset
    g.add(box(0.035, 0.03, 0.06, plastic, -0.075, 0.06, -0.065));
    g.add(box(0.035, 0.03, 0.06, plastic, 0.075, 0.06, -0.065));
    const handset = new THREE.Group();
    handset.position.set(0, 0.085, -0.065);
    handset.add(box(0.21, 0.026, 0.04, plastic, 0, 0.0, 0));
    handset.add(box(0.055, 0.04, 0.066, plastic, -0.09, -0.008, 0));
    handset.add(box(0.055, 0.04, 0.066, plastic, 0.09, -0.008, 0));
    g.add(handset);
    // coiled cord
    const A = new THREE.Vector3(-0.12, 0.07, -0.065), B = new THREE.Vector3(-0.15, 0.004, 0.14);
    const axis = new THREE.Vector3().subVectors(B, A);
    const u = new THREE.Vector3(0, 1, 0).cross(axis).normalize();
    const v = new THREE.Vector3().crossVectors(axis, u).normalize();
    const pts = [];
    for (let i = 0; i <= 260; i++) {
      const t = i / 260;
      const sag = Math.sin(t * Math.PI) * -0.03;
      const p = A.clone().lerp(B, t).add(new THREE.Vector3(-0.03 * Math.sin(t * Math.PI), sag, 0));
      const a = t * Math.PI * 2 * 22;
      p.addScaledVector(u, Math.cos(a) * 0.007).addScaledVector(v, Math.sin(a) * 0.007);
      pts.push(p);
    }
    g.add(mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3(pts), 900, 0.0018, 5), plastic));
    scene.add(g);
    register("contact", g, [0, 1, 0.9], { radius: 0.17 });
  });

  /* ------------------------------------------------------------ books + grad cap (education) */
  step("Stacking the books", () => {
    const g = new THREE.Group();
    g.position.set(1.27, 0, -0.44);
    g.rotation.y = 0.14;
    const pages = mat(0xece4cf, { roughness: 0.9 });
    const books = [
      { s: [0.26, 0.045, 0.18], cover: "#7a2b2b", text: "DENISON · B.A. COMPUTER SCIENCE", fg: "#e6c46a", r: 0.0 },
      { s: [0.23, 0.04, 0.165], cover: "#2c4569", text: "RESEARCH · PREFERENCE LEARNING", fg: "#e9e2cf", r: 0.07 },
      { s: [0.21, 0.036, 0.15], cover: "#45573a", text: "CODERSCHOOL · FULL STACK", fg: "#efe6c8", r: -0.05 },
    ];
    let y = 0;
    for (const b of books) {
      const cover = mat(b.cover, { roughness: 0.7 });
      const spine = mat(0xffffff, { map: spineTexture(b.text, b.cover, b.fg), roughness: 0.7 });
      const m = box(...b.s, [pages, pages, cover, cover, spine, pages], 0, y + b.s[1] / 2, 0);
      m.rotation.y = b.r;
      g.add(m);
      y += b.s[1];
    }
    // graduation cap
    const capMat = mat(0x18181b, { roughness: 0.6 });
    const cap = new THREE.Group();
    cap.position.set(0.0, y, 0);
    cap.rotation.y = 0.6;
    cap.add(mesh(new THREE.CylinderGeometry(0.048, 0.052, 0.04, 20), capMat).translateY(0.02));
    cap.add(box(0.15, 0.006, 0.15, capMat, 0, 0.043, 0));
    const gold = mat(0xd6a842, { roughness: 0.5, metalness: 0.3 });
    cap.add(mesh(new THREE.CylinderGeometry(0.008, 0.008, 0.006, 10), gold).translateY(0.049));
    cap.add(rod(new THREE.Vector3(0, 0.048, 0), new THREE.Vector3(0.07, 0.047, 0.03), 0.0018, gold));
    cap.add(rod(new THREE.Vector3(0.07, 0.047, 0.03), new THREE.Vector3(0.073, 0.0, 0.032), 0.0022, gold));
    cap.add(mesh(new THREE.CylinderGeometry(0.004, 0.006, 0.02, 8), gold).translateX(0.073).translateY(0.0).translateZ(0.032));
    g.add(cap);
    scene.add(g);
    register("education", g, [-0.25, 0.45, 1], { radius: 0.2 });
  });

  /* ------------------------------------------------------------ dumbbell (everfit) */
  step("Racking the dumbbell", () => {
    const g = new THREE.Group();
    g.position.set(0.95, 0, 0.2);
    g.rotation.y = -0.35;
    const R = 0.042;
    const y = R * 0.866;
    const chrome = mat(0xc9c9cc, { metalness: 0.85, roughness: 0.28 });
    const handle = mesh(new THREE.CylinderGeometry(0.012, 0.012, 0.17, 14), chrome);
    handle.rotation.z = Math.PI / 2;
    handle.position.y = y;
    g.add(handle);
    const rubber = mat(0x2a2a2e, { roughness: 0.8, flatShading: true });
    const plateGeo = new THREE.CylinderGeometry(R, R, 0.055, 6).rotateZ(Math.PI / 2);
    for (const x of [-0.11, 0.11]) {
      const p = mesh(plateGeo, rubber);
      p.position.set(x, y, 0);
      g.add(p);
      const ring = mesh(new THREE.CylinderGeometry(0.018, 0.018, 0.058, 14).rotateZ(Math.PI / 2), chrome);
      ring.position.set(x, y, 0);
      g.add(ring);
    }
    // a little Everfit-teal stripe on each plate
    const teal = mat(0x2fc4b2, { roughness: 0.6, emissive: 0x0c3a35 });
    for (const x of [-0.11, 0.11]) g.add(box(0.057, 0.01, 0.024, teal, x, y * 2 - 0.002, 0));
    scene.add(g);
    register("everfit", g, [0.1, 0.75, 1], { radius: 0.17 });
  });

  /* ------------------------------------------------------------ paper stacks + tray (decor) */
  step("Filing the paperwork", () => {
    const sheetGeo = new THREE.BoxGeometry(1, 1, 1);
    const stacks = [
      { x: -1.5, z: -0.42, n: 46, w: 0.25, d: 0.32, ry: 0.06 },
      { x: -1.54, z: -0.03, n: 16, w: 0.24, d: 0.31, ry: -0.08 },
    ];
    const total = stacks.reduce((a, s) => a + s.n, 0);
    const inst = new THREE.InstancedMesh(sheetGeo, mat(0xffffff, { roughness: 0.9 }), total);
    const m4 = new THREE.Matrix4();
    const q = new THREE.Quaternion();
    const white = new THREE.Color(0xeeeae0), manila = new THREE.Color(0xd8c38c), grey = new THREE.Color(0xd5d3cc);
    let i = 0;
    for (const s of stacks) {
      let y = 0;
      for (let k = 0; k < s.n; k++) {
        const th = 0.0065 + Math.random() * 0.002;
        q.setFromEuler(new THREE.Euler(0, s.ry + (Math.random() - 0.5) * 0.12, 0));
        m4.compose(
          new THREE.Vector3(s.x + (Math.random() - 0.5) * 0.02, y + th / 2, s.z + (Math.random() - 0.5) * 0.02),
          q,
          new THREE.Vector3(s.w, th, s.d),
        );
        inst.setMatrixAt(i, m4);
        inst.setColorAt(i, Math.random() < 0.18 ? manila : Math.random() < 0.3 ? grey : white);
        y += th;
        i++;
      }
    }
    inst.castShadow = inst.receiveShadow = true;
    scene.add(inst);

    // two-tier letter tray on the right
    const tray = new THREE.Group();
    tray.position.set(1.6, 0, 0.02);
    tray.rotation.y = -0.12;
    const dark = mat(0x34343a, { roughness: 0.5 });
    for (const yy of [0.004, 0.11]) {
      tray.add(box(0.27, 0.008, 0.34, dark, 0, yy, 0));
      for (let k = 0; k < 6; k++) tray.add(box(0.235, 0.004, 0.3, mat(k % 3 ? 0xeeeae0 : 0xd8c38c, { roughness: 0.9 }), (Math.random() - 0.5) * 0.01, yy + 0.008 + k * 0.004, (Math.random() - 0.5) * 0.01));
    }
    for (const [x, z] of [[-0.13, -0.16], [0.13, -0.16], [-0.13, 0.16], [0.13, 0.16]]) tray.add(box(0.012, 0.13, 0.012, dark, x, 0.065, z));
    scene.add(tray);
  });

  return { world, steps };
}
