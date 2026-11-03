import * as THREE from "three";

// Port of "Fears to Fathom Shader" by theCube (godotshaders.com, CC0).
// Same defaults and same math as the Godot canvas_item shader; it runs on the
// final display-referred (sRGB) image, like Godot's screen texture.
// Extra: a light grade (saturation + lifted blacks) to match the reference shot.

export const FearsShader = {
  name: "FearsToFathomShader",
  uniforms: {
    tDiffuse: { value: null },
    resolution: { value: new THREE.Vector2(1, 1) }, // CSS pixels, so the blur is 1px at any DPR
    time: { value: 0 },
    aberration_strength: { value: 3.0 },
    blur_strength: { value: 2.0 },
    noise_strength: { value: 0.048 },
    vignette_strength: { value: 0.78 },
    scanline_strength: { value: 0.016 },
    distortion_strength: { value: 0.1 },
    ghost_strength: { value: 0.12 },
    flicker_strength: { value: 0.005 },
    saturation: { value: 0.86 },
    lift: { value: 0.03 },
  },
  vertexShader: /* glsl */ `
    varying vec2 vUv;
    void main() {
      vUv = uv;
      gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
    }
  `,
  fragmentShader: /* glsl */ `
    precision highp float;
    uniform sampler2D tDiffuse;
    uniform vec2 resolution;
    uniform float time;
    uniform float aberration_strength;
    uniform float blur_strength;
    uniform float noise_strength;
    uniform float vignette_strength;
    uniform float scanline_strength;
    uniform float distortion_strength;
    uniform float ghost_strength;
    uniform float flicker_strength;
    uniform float saturation;
    uniform float lift;
    varying vec2 vUv;

    float rand(vec2 co) {
      return fract(sin(dot(co, vec2(12.9898, 78.233))) * 43758.5453);
    }

    vec3 blur_sample(vec2 uv) {
      vec2 texel = 1.0 / resolution;
      vec3 col = texture2D(tDiffuse, uv).rgb;
      col += texture2D(tDiffuse, uv + vec2(texel.x, 0.0)).rgb;
      col += texture2D(tDiffuse, uv - vec2(texel.x, 0.0)).rgb;
      col += texture2D(tDiffuse, uv + vec2(0.0, texel.y)).rgb;
      col += texture2D(tDiffuse, uv - vec2(0.0, texel.y)).rgb;
      return col / 5.0;
    }

    void main() {
      // Godot's SCREEN_UV has y pointing down
      vec2 uv = vec2(vUv.x, 1.0 - vUv.y);
      float TIME = time;

      float wave = sin(uv.y * 200.0 + TIME * 10.0) * 0.002 * distortion_strength;
      uv.x += wave;
      uv.y += (rand(vec2(uv.y * 100.0, TIME * 10.0)) - 0.5) * 0.002;

      vec2 suv = vec2(uv.x, 1.0 - uv.y); // back to texture space for sampling
      vec2 offset = (suv - 0.5) * 0.004 * aberration_strength;
      float r = texture2D(tDiffuse, suv + offset).r;
      float g = texture2D(tDiffuse, suv).g;
      float b = texture2D(tDiffuse, suv - offset).b;
      vec3 col = vec3(r, g, b);

      col = mix(col, blur_sample(suv), blur_strength);

      vec2 ghost_uv = suv;
      ghost_uv.x -= 0.01;
      vec3 ghost_col = texture2D(tDiffuse, ghost_uv).rgb;
      col = mix(col, ghost_col, ghost_strength);

      // grade toward the reference: slightly muted, lifted blacks
      float luma = dot(col, vec3(0.299, 0.587, 0.114));
      col = mix(vec3(luma), col, saturation);
      col = col * (1.0 - lift) + lift;

      float scanline = sin(uv.y * 800.0 + sin(TIME * 5.0) * 10.0) * 0.5 + 0.5;
      col *= 1.0 - scanline * scanline_strength;

      float noise = (rand(uv * TIME * 50.0) - 0.5) * 2.0 * noise_strength;
      col += noise;

      float dist = distance(uv, vec2(0.5));
      float vignette = smoothstep(0.6, 0.9, dist);
      col *= mix(1.0, 1.0 - vignette, vignette_strength);

      float flicker = 1.0 + flicker_strength * (sin(TIME * 50.0) + (rand(vec2(TIME * 10.0, 0.0)) - 0.5));
      col *= flicker;

      gl_FragColor = vec4(col, 1.0);
    }
  `,
};
