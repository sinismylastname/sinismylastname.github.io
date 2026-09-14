import type { AeroEnvironment, Color3 } from "../data/aeroEnvironment";
import type { AeroQuality } from "./aeroQuality";
import type { AeroPointerLightState } from "./aeroPointerLight";
import type { AeroGLContext } from "./aeroWebGLSupport";

const NEUTRAL_POINTER_LIGHT: AeroPointerLightState = { x: 0.5, y: 0.5, active: false };

const VERTEX_SHADER = `
  attribute vec2 aPosition;
  void main() {
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const FRAGMENT_SHADER = `
  precision mediump float;
  uniform vec2 uResolution;
  uniform float uTime;
  uniform vec3 uSkyTop;
  uniform vec3 uSkyHorizon;
  uniform vec3 uWaterColor;
  uniform vec2 uSunDirection;
  uniform float uSunIntensity;
  uniform vec2 uMoonDirection;
  uniform float uMoonIntensity;
  uniform vec3 uGroundBounce;
  uniform vec3 uSpecularColor;
  uniform float uStarIntensity;
  uniform float uCausticIntensity;
  uniform vec2 uPointerLightPosition;
  uniform float uPointerLightStrength;
  uniform float uBubbleCount;

  vec3 waveSample(vec2 point, float time) {
    float height = 0.0;
    float gradientX = 0.0;
    float gradientY = 0.0;

    vec2 firstDirection = vec2(1.04, 0.22);
    float firstFrequency = 2.7;
    float firstPhase = dot(point, firstDirection) * firstFrequency + time * 0.16;
    float firstSine = sin(firstPhase);
    float firstAmplitude = 0.040;
    height += firstSine * firstAmplitude;
    float firstGradient = cos(firstPhase) * firstAmplitude * firstFrequency;
    gradientX += firstGradient * firstDirection.x;
    gradientY += firstGradient * firstDirection.y;

    #if AERO_WAVE_OCTAVES > 1
    vec2 secondDirection = vec2(-0.36, 1.18);
    float secondFrequency = 2.1;
    float secondPhase = dot(point, secondDirection) * secondFrequency + time * 0.11;
    float secondSine = sin(secondPhase);
    float secondAmplitude = 0.025;
    height += secondSine * secondAmplitude;
    float secondGradient = cos(secondPhase) * secondAmplitude * secondFrequency;
    gradientX += secondGradient * secondDirection.x;
    gradientY += secondGradient * secondDirection.y;
    #endif

    #if AERO_WAVE_OCTAVES > 2
    vec2 thirdDirection = vec2(1.55, -0.72);
    float thirdFrequency = 2.4;
    float thirdPhase = dot(point, thirdDirection) * thirdFrequency - time * 0.08;
    float thirdCosine = cos(thirdPhase);
    float thirdAmplitude = 0.017;
    height += thirdCosine * thirdAmplitude;
    float thirdGradient = -sin(thirdPhase) * thirdAmplitude * thirdFrequency;
    gradientX += thirdGradient * thirdDirection.x;
    gradientY += thirdGradient * thirdDirection.y;
    #endif

    return vec3(height, gradientX, gradientY);
  }

  #ifdef AERO_CAUSTICS
  float causticPattern(vec2 point, float time) {
    float first = sin(point.x * 8.0 + sin(point.y * 2.6 + time * 0.08) * 1.8 + time * 0.12);
    float second = sin(point.y * 13.0 - sin(point.x * 1.8 - time * 0.06) * 1.4 - time * 0.09);
    return pow(0.5 + 0.5 * first * second, 7.0);
  }
  #endif

  #ifdef AERO_GPU_BUBBLES
  vec4 bubbleContribution(vec2 uv, vec2 center, float radius, float phase, float time, float aspect) {
    vec2 offset = (uv - center) * vec2(aspect, 1.0);
    float distanceToCenter = length(offset);
    float edge = 1.0 - smoothstep(radius * 0.78, radius, distanceToCenter);
    if (edge <= 0.0) return vec4(0.0);
    vec2 sphereOffset = offset / max(radius, 0.0001);
    float depth = sqrt(max(0.0, 1.0 - dot(sphereOffset, sphereOffset)));
    vec3 normal = normalize(vec3(sphereOffset, depth));
    vec3 viewDirection = vec3(0.0, 0.0, 1.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.2);
    float rim = smoothstep(0.58, 0.96, length(sphereOffset));
    vec3 reflected = mix(uSkyHorizon, uSkyTop, 0.42 + 0.32 * normal.y);
    reflected = mix(reflected, uWaterColor, smoothstep(0.35, 0.9, center.y));
    float sunGlint = pow(max(dot(normal, normalize(vec3(uSunDirection, 0.68))), 0.0), 28.0) * uSunIntensity;
    float moonGlint = pow(max(dot(normal, normalize(vec3(uMoonDirection, 0.7))), 0.0), 32.0) * uMoonIntensity;
    float shimmer = 0.5 + 0.5 * sin(phase + time * 0.08 + uv.x * 8.0);
    vec3 bubbleColor = mix(vec3(0.48, 0.88, 0.94), reflected, 0.22) * (0.42 + fresnel * 0.38);
    bubbleColor += uSpecularColor * (rim * 0.78 + sunGlint * 0.86 + moonGlint * 0.5);
    bubbleColor += vec3(0.22, 0.56, 0.60) * fresnel * shimmer * 0.16;
    return vec4(bubbleColor, edge * (0.18 + fresnel * 0.38));
  }
  #endif

  #ifdef AERO_HERO_ORB
  vec4 heroOrbContribution(vec2 uv, float time, float aspect) {
    vec2 center = vec2(0.84, 0.73);
    float radius = 0.105;
    vec2 offset = (uv - center) * vec2(aspect, 1.0);
    float distanceToCenter = length(offset);
    float edge = 1.0 - smoothstep(radius * 0.82, radius, distanceToCenter);
    if (edge <= 0.0) return vec4(0.0);
    vec2 sphereOffset = offset / radius;
    float sphereDepth = sqrt(max(0.0, 1.0 - dot(sphereOffset, sphereOffset)));
    vec3 normal = normalize(vec3(sphereOffset, sphereDepth));
    vec3 viewDirection = vec3(0.0, 0.0, 1.0);
    float fresnel = pow(1.0 - max(dot(normal, viewDirection), 0.0), 2.4);
    vec3 environment = mix(uSkyHorizon, uSkyTop, 0.48 + normal.y * 0.28);
    environment = mix(environment, uWaterColor, smoothstep(0.2, 0.92, center.y) * 0.35);
    #ifdef AERO_REFRACTION
    vec3 refracted = refract(vec3(0.0, 0.0, -1.0), normal, 0.88);
    environment += uWaterColor * max(refracted.y, 0.0) * 0.16;
    #endif
    float sunGlint = pow(max(dot(normal, normalize(vec3(uSunDirection, 0.72))), 0.0), 44.0) * uSunIntensity;
    float moonGlint = pow(max(dot(normal, normalize(vec3(uMoonDirection, 0.72))), 0.0), 42.0) * uMoonIntensity;
    float pointerGlint = 0.0;
    #ifdef AERO_POINTER_LIGHT
    vec2 pointerOffset = (uv - uPointerLightPosition) * vec2(aspect, 1.0);
    pointerGlint = pow(max(dot(normal, normalize(vec3(pointerOffset, 0.42))), 0.0), 30.0) * uPointerLightStrength;
    #endif
    float highlight = smoothstep(0.15, 0.0, length(sphereOffset - vec2(-0.28, 0.3))) * 0.52;
    vec3 orbColor = environment * (0.54 + fresnel * 0.54) + uSpecularColor * (fresnel * 0.58 + sunGlint * 0.88 + moonGlint * 0.44 + pointerGlint * 0.66 + highlight);
    float orbAlpha = edge * (0.56 + fresnel * 0.32);
    return vec4(orbColor, orbAlpha);
  }
  #endif

  void main() {
    vec2 uv = gl_FragCoord.xy / max(uResolution, vec2(1.0));
    const float horizonY = 0.535;
    float waterAmount = 1.0 - smoothstep(horizonY - 0.028, horizonY + 0.052, uv.y);
    float depth = clamp((horizonY - uv.y) / horizonY, 0.0, 1.0);
    float aspect = uResolution.x / max(uResolution.y, 1.0);
    vec2 point = (uv - vec2(0.5, horizonY)) * vec2(aspect, 1.0);
    point.y *= mix(1.15, 0.72, depth);

    vec3 waveSampled = waveSample(point, uTime);
    float wave = waveSampled.x;
    vec3 normal = normalize(vec3(-waveSampled.y * 30.0, -waveSampled.z * 30.0, 1.0));

    vec3 sunDirection = normalize(vec3(uSunDirection.x, max(uSunDirection.y, 0.08), 0.68));
    float sunLight = clamp(uSunIntensity * (0.72 + 0.28 * max(uSunDirection.y, 0.0)), 0.0, 1.2);
    float sunDot = max(dot(normal, sunDirection), 0.0);
    float sunDotSquared = sunDot * sunDot;
    float broadSpecular = sunDotSquared * sunDotSquared * sunLight;
    float tightSpecular = sunDotSquared * sunDotSquared;
    tightSpecular *= tightSpecular * sunDotSquared * sunLight;
    float movingReflection = 0.5 + 0.5 * sin(point.x * 6.0 + point.y * 3.5 + uTime * 0.14);
    float reflectionRibbon = pow(movingReflection, 7.0) * (0.35 + 0.65 * broadSpecular);
    float rippleSignal = sin(point.y * 18.0 + sin(point.x * 2.4 + uTime * 0.10) * 1.4 + uTime * 0.08);
    float rippleHighlight = (1.0 - smoothstep(0.0, 0.16, abs(rippleSignal))) * depth;
    float longRippleSignal = sin(point.y * 12.0 + sin(point.x * 1.8 + uTime * 0.06) * 1.1);
    float longRipple = (1.0 - smoothstep(0.0, 0.12, abs(longRippleSignal))) * depth;

    vec3 sky = mix(uSkyHorizon, uSkyTop, smoothstep(0.54, 1.0, uv.y));
    vec3 horizonWater = mix(uSkyHorizon, uWaterColor, 0.54);
    vec3 deepWater = mix(vec3(0.012, 0.30, 0.46), uWaterColor, 0.42) + uGroundBounce * 0.08;
    vec3 water = mix(horizonWater, deepWater, smoothstep(0.0, 0.9, depth));
    water += uWaterColor * wave * 1.35;
    water += uSpecularColor * (broadSpecular * 0.42 + tightSpecular * 0.95 + reflectionRibbon * 0.18 + rippleHighlight * 0.16 + longRipple * 0.09);
    water += uGroundBounce * (0.025 + depth * 0.075);

    #ifdef AERO_POINTER_LIGHT
    float pointerDistance = length(uv - uPointerLightPosition);
    float pointerGlow = 1.0 - smoothstep(0.0, 0.46, pointerDistance);
    water += uSpecularColor * pointerGlow * uPointerLightStrength * 0.24;
    #endif

    #ifdef AERO_CAUSTICS
    float caustics = causticPattern(point, uTime) * uCausticIntensity * depth;
    water += vec3(0.24, 0.82, 0.68) * caustics * 0.15;
    #endif

    float horizonGlow = 1.0 - smoothstep(0.0, 0.075, abs(uv.y - horizonY));
    float horizonLine = exp(-abs(uv.y - (horizonY + wave * 0.30)) * 110.0);
    vec3 color = mix(sky, water, waterAmount);
    color += mix(uSkyHorizon, uSpecularColor, 0.38) * (horizonGlow * 0.22 + horizonLine * 0.22);

    #ifdef AERO_GPU_BUBBLES
    if (uBubbleCount > 0.5) {
      vec4 bubble = bubbleContribution(uv, vec2(0.10, 0.16), 0.022, 0.8, uTime, aspect);
      color = mix(color, bubble.rgb, bubble.a);
      bubble = bubbleContribution(uv, vec2(0.20, 0.67), 0.014, 2.4, uTime, aspect);
      color = mix(color, bubble.rgb, bubble.a);
      bubble = bubbleContribution(uv, vec2(0.69, 0.31), 0.018, 3.6, uTime, aspect);
      color = mix(color, bubble.rgb, bubble.a);
      bubble = bubbleContribution(uv, vec2(0.88, 0.17), 0.026, 4.5, uTime, aspect);
      color = mix(color, bubble.rgb, bubble.a);
      if (uBubbleCount > 4.5) {
        bubble = bubbleContribution(uv, vec2(0.76, 0.62), 0.012, 5.2, uTime, aspect);
        color = mix(color, bubble.rgb, bubble.a);
        bubble = bubbleContribution(uv, vec2(0.48, 0.79), 0.020, 6.1, uTime, aspect);
        color = mix(color, bubble.rgb, bubble.a);
      }
    }
    #endif

    #ifdef AERO_HERO_ORB
    vec4 heroOrb = heroOrbContribution(uv, uTime, aspect);
    color = mix(color, heroOrb.rgb, heroOrb.a);
    #endif

    float alpha = mix(0.08, 0.94, waterAmount);
    gl_FragColor = vec4(color, alpha);
  }
`;

function compileShader(gl: AeroGLContext, type: number, source: string) {
  const shader = gl.createShader(type);
  if (!shader) throw new Error("Unable to create Aero shader.");
  gl.shaderSource(shader, source);
  gl.compileShader(shader);
  if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
    const message = gl.getShaderInfoLog(shader) ?? "Unknown shader compilation error.";
    gl.deleteShader(shader);
    throw new Error(message);
  }
  return shader;
}

function createProgram(gl: AeroGLContext, waveOctaves: number, gpuBubblesEnabled: boolean, causticsEnabled: boolean, heroOrbEnabled: boolean, refractionEnabled: boolean, pointerLightEnabled: boolean) {
  const vertexShader = compileShader(gl, gl.VERTEX_SHADER, VERTEX_SHADER);
  const defines = [
    `#define AERO_WAVE_OCTAVES ${Math.max(1, Math.min(3, Math.floor(waveOctaves)))}`,
    gpuBubblesEnabled ? "#define AERO_GPU_BUBBLES" : "",
    causticsEnabled ? "#define AERO_CAUSTICS" : "",
    heroOrbEnabled ? "#define AERO_HERO_ORB" : "",
    refractionEnabled && heroOrbEnabled ? "#define AERO_REFRACTION" : "",
    pointerLightEnabled ? "#define AERO_POINTER_LIGHT" : "",
  ].filter(Boolean).join("\n");
  const fragmentSource = `${defines}${defines ? "\n" : ""}${FRAGMENT_SHADER}`;
  const fragmentShader = compileShader(gl, gl.FRAGMENT_SHADER, fragmentSource);
  const program = gl.createProgram();
  if (!program) throw new Error("Unable to create Aero shader program.");
  gl.attachShader(program, vertexShader);
  gl.attachShader(program, fragmentShader);
  gl.linkProgram(program);
  gl.deleteShader(vertexShader);
  gl.deleteShader(fragmentShader);
  if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
    const message = gl.getProgramInfoLog(program) ?? "Unknown shader link error.";
    gl.deleteProgram(program);
    throw new Error(message);
  }
  return program;
}

type EnvironmentUniformLocations = {
  resolution: WebGLUniformLocation | null;
  time: WebGLUniformLocation | null;
  skyTop: WebGLUniformLocation | null;
  skyHorizon: WebGLUniformLocation | null;
  waterColor: WebGLUniformLocation | null;
  sunDirection: WebGLUniformLocation | null;
  sunIntensity: WebGLUniformLocation | null;
  moonDirection: WebGLUniformLocation | null;
  moonIntensity: WebGLUniformLocation | null;
  groundBounce: WebGLUniformLocation | null;
  specularColor: WebGLUniformLocation | null;
  starIntensity: WebGLUniformLocation | null;
  causticIntensity: WebGLUniformLocation | null;
  pointerLightPosition: WebGLUniformLocation | null;
  pointerLightStrength: WebGLUniformLocation | null;
  bubbleCount: WebGLUniformLocation | null;
};

function clampUnit(value: number) {
  return Math.max(0, Math.min(1, value));
}

export class AeroRenderer {
  private readonly canvas: HTMLCanvasElement;
  private readonly gl: AeroGLContext;
  private readonly quality: AeroQuality;
  private readonly bubbleCount: number;
  private readonly pointerLightEnabled: boolean;
  private readonly program: WebGLProgram;
  private readonly buffer: WebGLBuffer;
  private readonly uniformLocations: EnvironmentUniformLocations;
  private readonly positionLocation: number;
  private pointerLightX = 0.5;
  private pointerLightY = 0.5;
  private pointerLightStrength = 0;
  private lastDisplayWidth = 0;
  private lastDisplayHeight = 0;
  private lastDpr = 0;
  private environment: AeroEnvironment;

  constructor(
    canvas: HTMLCanvasElement,
    gl: AeroGLContext,
    quality: AeroQuality,
    environment: AeroEnvironment,
    bubbleCount = 0,
    heroOrbEnabled = false,
    refractionEnabled = false,
    pointerLightEnabled = false,
    causticsEnabled = false,
  ) {
    this.canvas = canvas;
    this.gl = gl;
    this.quality = quality;
    this.environment = environment;
    this.bubbleCount = Math.max(0, Math.min(6, Math.floor(bubbleCount)));
    this.pointerLightEnabled = pointerLightEnabled;
    this.program = createProgram(gl, quality.waveOctaves, this.bubbleCount > 0, causticsEnabled, heroOrbEnabled, refractionEnabled, pointerLightEnabled);
    const buffer = gl.createBuffer();
    if (!buffer) {
      gl.deleteProgram(this.program);
      throw new Error("Unable to create Aero fullscreen buffer.");
    }
    this.buffer = buffer;
    this.positionLocation = gl.getAttribLocation(this.program, "aPosition");
    this.uniformLocations = {
      resolution: gl.getUniformLocation(this.program, "uResolution"),
      time: gl.getUniformLocation(this.program, "uTime"),
      skyTop: gl.getUniformLocation(this.program, "uSkyTop"),
      skyHorizon: gl.getUniformLocation(this.program, "uSkyHorizon"),
      waterColor: gl.getUniformLocation(this.program, "uWaterColor"),
      sunDirection: gl.getUniformLocation(this.program, "uSunDirection"),
      sunIntensity: gl.getUniformLocation(this.program, "uSunIntensity"),
      moonDirection: gl.getUniformLocation(this.program, "uMoonDirection"),
      moonIntensity: gl.getUniformLocation(this.program, "uMoonIntensity"),
      groundBounce: gl.getUniformLocation(this.program, "uGroundBounce"),
      specularColor: gl.getUniformLocation(this.program, "uSpecularColor"),
      starIntensity: gl.getUniformLocation(this.program, "uStarIntensity"),
      causticIntensity: gl.getUniformLocation(this.program, "uCausticIntensity"),
      pointerLightPosition: gl.getUniformLocation(this.program, "uPointerLightPosition"),
      pointerLightStrength: gl.getUniformLocation(this.program, "uPointerLightStrength"),
      bubbleCount: gl.getUniformLocation(this.program, "uBubbleCount"),
    };
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer);
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 3, -1, -1, 3]), gl.STATIC_DRAW);
    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
  }

  setEnvironment(environment: AeroEnvironment) {
    this.environment = environment;
  }

  resize(force = false) {
    const displayWidth = Math.max(1, this.canvas.clientWidth || window.innerWidth);
    const displayHeight = Math.max(1, this.canvas.clientHeight || window.innerHeight);
    const dpr = Math.min(window.devicePixelRatio || 1, this.quality.dprCap);
    const widthChanged = Math.abs(displayWidth - this.lastDisplayWidth) > 2;
    const heightChanged = Math.abs(displayHeight - this.lastDisplayHeight) > 80;
    const dprChanged = Math.abs(dpr - this.lastDpr) > 0.01;
    if (!force && this.lastDisplayWidth > 0 && !widthChanged && !heightChanged && !dprChanged) {
      return false;
    }
    const width = Math.max(1, Math.floor(displayWidth * dpr));
    const height = Math.max(1, Math.floor(displayHeight * dpr));
    if (this.canvas.width !== width || this.canvas.height !== height) {
      this.canvas.width = width;
      this.canvas.height = height;
    }
    this.gl.viewport(0, 0, width, height);
    this.lastDisplayWidth = displayWidth;
    this.lastDisplayHeight = displayHeight;
    this.lastDpr = dpr;
    return true;
  }

  private setColor(location: WebGLUniformLocation | null, color: Color3) {
    if (location !== null) this.gl.uniform3f(location, color[0], color[1], color[2]);
  }

  private updatePointerLight(pointerLight: AeroPointerLightState) {
    const targetX = clampUnit(pointerLight.x);
    const targetY = clampUnit(1 - pointerLight.y);
    const targetStrength = pointerLight.active ? 1 : 0;
    const positionSmoothing = pointerLight.active ? 0.16 : 0.12;
    this.pointerLightX += (targetX - this.pointerLightX) * positionSmoothing;
    this.pointerLightY += (targetY - this.pointerLightY) * positionSmoothing;
    this.pointerLightStrength += (targetStrength - this.pointerLightStrength) * 0.16;
  }

  private uploadEnvironment(timeSeconds: number, pointerLight: AeroPointerLightState) {
    const { gl } = this;
    const locations = this.uniformLocations;
    const environment = this.environment;
    const causticIntensity = Math.min(Math.max(environment.causticIntensity, 0), this.quality.causticIntensity);
    if (this.pointerLightEnabled) this.updatePointerLight(pointerLight);

    if (locations.time !== null) gl.uniform1f(locations.time, timeSeconds);
    if (locations.pointerLightPosition !== null) gl.uniform2f(locations.pointerLightPosition, this.pointerLightX, this.pointerLightY);
    if (locations.pointerLightStrength !== null) gl.uniform1f(locations.pointerLightStrength, this.pointerLightStrength);
    if (locations.bubbleCount !== null) gl.uniform1f(locations.bubbleCount, this.bubbleCount);
    if (locations.skyTop !== null) gl.uniform3f(locations.skyTop, ...environment.skyTop);
    if (locations.skyHorizon !== null) gl.uniform3f(locations.skyHorizon, ...environment.skyHorizon);
    if (locations.waterColor !== null) gl.uniform3f(locations.waterColor, ...environment.waterColor);
    if (locations.sunDirection !== null) gl.uniform2f(locations.sunDirection, ...environment.sunDirection);
    if (locations.sunIntensity !== null) gl.uniform1f(locations.sunIntensity, environment.sunIntensity);
    if (locations.moonDirection !== null) gl.uniform2f(locations.moonDirection, ...environment.moonDirection);
    if (locations.moonIntensity !== null) gl.uniform1f(locations.moonIntensity, environment.moonIntensity);
    this.setColor(locations.groundBounce, environment.groundBounce);
    this.setColor(locations.specularColor, environment.specularColor);
    if (locations.starIntensity !== null) gl.uniform1f(locations.starIntensity, environment.starIntensity);
    if (locations.causticIntensity !== null) gl.uniform1f(locations.causticIntensity, causticIntensity);
  }

  render(timeSeconds = 0, pointerLight: AeroPointerLightState = NEUTRAL_POINTER_LIGHT) {
    this.gl.useProgram(this.program);
    this.gl.bindBuffer(this.gl.ARRAY_BUFFER, this.buffer);
    this.gl.enableVertexAttribArray(this.positionLocation);
    this.gl.vertexAttribPointer(this.positionLocation, 2, this.gl.FLOAT, false, 0, 0);
    if (this.uniformLocations.resolution !== null) {
      this.gl.uniform2f(this.uniformLocations.resolution, this.canvas.width, this.canvas.height);
    }
    this.uploadEnvironment(timeSeconds, pointerLight);
    this.gl.clearColor(0, 0, 0, 0);
    this.gl.clear(this.gl.COLOR_BUFFER_BIT);
    this.gl.drawArrays(this.gl.TRIANGLES, 0, 3);
  }

  dispose() {
    this.gl.deleteBuffer(this.buffer);
    this.gl.deleteProgram(this.program);
  }
}
