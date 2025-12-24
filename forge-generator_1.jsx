import React, { useState, useEffect, useRef } from 'react';

const FORGE_THEMES = {
  deepOcean: { bg: '#0a1628', primary: '#00d4ff', accent: '#0066cc', glow: 'rgba(0,212,255,0.3)', name: 'Deep Ocean' },
  cosmicDust: { bg: '#0d0a1a', primary: '#a855f7', accent: '#7c3aed', glow: 'rgba(168,85,247,0.3)', name: 'Cosmic Dust' },
  emberForge: { bg: '#1a0a0a', primary: '#ff6b35', accent: '#ff4500', glow: 'rgba(255,107,53,0.3)', name: 'Ember Forge' },
  neonMint: { bg: '#0a1a14', primary: '#00ffaa', accent: '#00cc88', glow: 'rgba(0,255,170,0.3)', name: 'Neon Mint' },
  goldenAbyss: { bg: '#12100a', primary: '#ffd700', accent: '#daa520', glow: 'rgba(255,215,0,0.3)', name: 'Golden Abyss' },
  voidPink: { bg: '#1a0a14', primary: '#ff1493', accent: '#ff69b4', glow: 'rgba(255,20,147,0.3)', name: 'Void Pink' },
};

const VISUAL_STYLES = [
  'Morphing Sphere (Three.js Shader)',
  'Particle Constellation',
  'Fluid Simulation',
  'Generative Mesh',
  'Holographic Prism',
  'Neural Network Graph',
  'Bioluminescent Organisms',
  'Crystal Lattice Structure',
  'Gravitational Waves',
  'Quantum Field Visualization',
];

const INTERACTION_PATTERNS = [
  'Mouse-reactive particles',
  'Magnetic cursor effect',
  'Tilt card parallax',
  'Scroll-triggered reveals',
  'Audio-reactive elements',
  'Gesture recognition',
  'Eye-tracking simulation',
  'Haptic feedback hints',
];

export default function FORGEGenerator() {
  const [step, setStep] = useState(0);
  const [theme, setTheme] = useState('deepOcean');
  const [generating, setGenerating] = useState(false);
  const [copied, setCopied] = useState(false);
  const [particles, setParticles] = useState([]);
  const canvasRef = useRef(null);
  
  const [config, setConfig] = useState({
    projectName: '',
    tagline: '',
    purpose: '',
    targetAudience: '',
    visualStyle: [],
    interactionPatterns: [],
    contentSections: '',
    techConstraints: '',
    specialFeatures: '',
    brandValues: '',
    callToAction: '',
  });

  const [generatedPrompt, setGeneratedPrompt] = useState('');

  const currentTheme = FORGE_THEMES[theme];

  // Particle animation
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    let animationId;
    let particlesArray = [];

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener('resize', resize);

    class Particle {
      constructor() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.vx = (Math.random() - 0.5) * 0.5;
        this.vy = (Math.random() - 0.5) * 0.5;
        this.size = Math.random() * 2 + 0.5;
        this.alpha = Math.random() * 0.5 + 0.1;
      }
      update() {
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width) this.vx *= -1;
        if (this.y < 0 || this.y > canvas.height) this.vy *= -1;
      }
      draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.size, 0, Math.PI * 2);
        ctx.fillStyle = currentTheme.primary + Math.floor(this.alpha * 255).toString(16).padStart(2, '0');
        ctx.fill();
      }
    }

    for (let i = 0; i < 80; i++) {
      particlesArray.push(new Particle());
    }

    const animate = () => {
      ctx.fillStyle = currentTheme.bg + 'cc';
      ctx.fillRect(0, 0, canvas.width, canvas.height);
      
      particlesArray.forEach((p, i) => {
        p.update();
        p.draw();
        particlesArray.slice(i + 1).forEach(p2 => {
          const dx = p.x - p2.x;
          const dy = p.y - p2.y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 120) {
            ctx.beginPath();
            ctx.moveTo(p.x, p.y);
            ctx.lineTo(p2.x, p2.y);
            ctx.strokeStyle = currentTheme.primary + Math.floor((1 - dist / 120) * 40).toString(16).padStart(2, '0');
            ctx.stroke();
          }
        });
      });
      animationId = requestAnimationFrame(animate);
    };
    animate();

    return () => {
      cancelAnimationFrame(animationId);
      window.removeEventListener('resize', resize);
    };
  }, [theme]);

  const generatePrompt = () => {
    setGenerating(true);
    setTimeout(() => {
      const prompt = buildFORGEPrompt(config, currentTheme);
      setGeneratedPrompt(prompt);
      setGenerating(false);
      setStep(4);
    }, 1500);
  };

  const buildFORGEPrompt = (c, t) => {
    return `# ${c.projectName.toUpperCase()} – Premium One-Shot Website

Create a "billion-dollar" single-page web application called ${c.projectName}. ${c.tagline}

${c.purpose}

Target Audience: ${c.targetAudience}

---

## F: Foundation

### Aesthetic Identity
- **Theme**: "${t.name}"
- **Background**: ${t.bg}
- **Primary**: ${t.primary}
- **Accent**: ${t.accent}
- **Vibe**: "${c.brandValues || 'futuristic, mystical, scientific'}"

### Layer Architecture
- **Layer 0 — Background Canvas (z-index: 0)**: Deep gradient + starfield / subtle noise / atmospheric depth
- **Layer 1 — 3D Centerpiece (z-index: 10)**: ${c.visualStyle[0] || 'Morphing Sphere (Three.js)'}
- **Layer 2 — Particle Constellation (z-index: 20)**: Interactive points + connection lines${c.visualStyle.length > 1 ? ` + ${c.visualStyle.slice(1).join(' + ')}` : ''}
- **Layer 3 — Content Overlay (z-index: 30)**: Project cards, header, nav, content sections
- **Layer 4 — UI + Modal Layer (z-index: 40)**: Video modal, audio controls, tooltips, overlays

### Typography
- **Primary Font**: Custom display font (Syne, Clash Display, or Space Grotesk alternatives)
- **H1**: 56px / 64px (desktop) / 38px (mobile) / weight 800
- **H2**: 32px / 40px / weight 700
- **H3**: 24px / 32px / weight 600
- **Body**: 17px / 20px / weight 400
- **Mono accents**: JetBrains Mono or IBM Plex Mono for code-like labels
- **Line-height**: 1.2 for headings, 1.65 for body

### Color System
\`\`\`css
:root {
  --bg-deep: ${t.bg};
  --bg-surface: ${t.bg}ee;
  --primary: ${t.primary};
  --primary-glow: ${t.glow};
  --accent: ${t.accent};
  --text-primary: #ffffff;
  --text-secondary: #a0a0a0;
  --border-subtle: rgba(255,255,255,0.08);
}
\`\`\`

---

## O: Objects

### 3D Centerpiece
${generateVisualStyleSpec(c.visualStyle[0] || 'Morphing Sphere (Three.js Shader)', t)}

### Particle System
**Constellation-style interactive particles with connecting lines (performance-aware)**

Parameters:
- Desktop particle count: 2500 (auto degrade to 700 on mobile < 768px)
- Point size: 1.2 - 2.8 (sizeScale by devicePixelRatio)
- Connection distance threshold: 80 - 140 px
- Color: ${t.primary} with varying alpha

Behavior:
- Gentle drift velocity (0.02 - 0.08 units/frame)
- Mouse influence: attraction while mouse button held, mild repulsion on hover
- When particle enters 3D center area, slight orbit behavior around centerpiece
- Depth layering: particles vary in z-depth for parallax effect

Implementation:
- Points: BufferGeometry positions + velocities + colors
- Lines: Dynamic index buffer calculated each frame for particle pairs within threshold
- Physics: simple velocity integration with friction (damping 0.98)
- Spatial partitioning: grid binning (cell size = connection threshold) for O(n) performance

### Content Sections
${c.contentSections ? c.contentSections.split('\n').map((s, i) => `
**Section ${i + 1}: ${s.trim()}**
- Full viewport height or auto-height
- Reveal animation on scroll (IntersectionObserver)
- Section-specific accent variations
- Background atmospheric effects matching content mood
`).join('') : `
**Hero Section**
- Full viewport height
- Animated headline with character-by-character reveal
- Floating subtext with parallax depth
- Primary CTA with magnetic hover effect

**Features/Projects Grid**
- Masonry or bento-box layout
- Cards with glassmorphism (backdrop-filter: blur(12px))
- Hover: lift + glow + content preview
- Click: modal or slide-over expansion

**About/Story Section**
- Asymmetric text-image layout
- Scroll-triggered text highlights
- Background: subtle gradient shift

**Contact/CTA Section**
- Minimal, focused form or action
- Animated input states
- Success animation on submit
`}

### UI Components

**Navigation**
- Sticky header with backdrop-filter: blur(16px)
- Logo (SVG, animated on hover)
- Nav links with underline slide animation
- Mobile: hamburger → full-screen overlay menu
- Scroll progress indicator (optional)

**Project/Feature Card**
- Size: 340px width (responsive 100% mobile)
- Content:
  - Video element (poster = inline SVG, click-to-play)
  - Title (H3), tagline (16-22 words max)
  - Category tags (pill chips)
  - CTA buttons: "Explore" + "Open Project"
- Hover states:
  - transform: translateY(-12px)
  - box-shadow: 0 20px 60px ${t.glow}
  - border: 1px solid ${t.primary}40
  - Magnetic CTA follows cursor within card bounds

**Buttons**
\`\`\`css
.btn-primary {
  background: linear-gradient(135deg, ${t.primary}, ${t.accent});
  border: none;
  padding: 14px 32px;
  border-radius: 8px;
  font-weight: 600;
  text-transform: uppercase;
  letter-spacing: 0.05em;
  box-shadow: 0 4px 24px ${t.glow};
  transition: transform 180ms ease, box-shadow 180ms ease;
}
.btn-primary:hover {
  transform: translateY(-2px) scale(1.02);
  box-shadow: 0 8px 40px ${t.glow};
}
.btn-secondary {
  background: transparent;
  border: 1px solid ${t.primary}60;
  backdrop-filter: blur(4px);
}
\`\`\`

**Custom Cursor**
- Default: 18px ring, 2px stroke, ${t.primary}
- Hover video: 48px with play icon centered
- Hover CTA: 14px filled dot
- Smooth trailing: lerp factor 0.12

---

## R: Reactions

### Interaction Patterns
${c.interactionPatterns.map(pattern => generateInteractionSpec(pattern, t)).join('\n')}

### Physics Engine (Particle Interaction)
\`\`\`javascript
// Core loop pseudocode
const dt = clock.getDelta();
const damping = 0.98;
const mouseInfluenceRadius = 150;
const mouseStrength = 0.8;

for (let i = 0; i < particleCount; i++) {
  // Apply global forces
  vx[i] += (wind.x + noise(time + i) * 0.01) * dt;
  vy[i] += (wind.y + noise(time + i + 1000) * 0.01) * dt;
  
  // Mouse influence
  const dx = mouseX - x[i];
  const dy = mouseY - y[i];
  const dist = Math.sqrt(dx * dx + dy * dy);
  
  if (dist < mouseInfluenceRadius) {
    const force = (1 - dist / mouseInfluenceRadius) * mouseStrength;
    vx[i] += (mouseDown ? dx : -dx) * force * 0.01;
    vy[i] += (mouseDown ? dy : -dy) * force * 0.01;
  }
  
  // Integration + damping
  vx[i] *= damping;
  vy[i] *= damping;
  x[i] += vx[i];
  y[i] += vy[i];
  
  // Boundary wrap
  if (x[i] < 0) x[i] = width;
  if (x[i] > width) x[i] = 0;
  if (y[i] < 0) y[i] = height;
  if (y[i] > height) y[i] = 0;
}
\`\`\`

### Scroll Behavior
- Sticky header nav (backdrop blur) at top
- Section reveals: IntersectionObserver with threshold 0.15
- Animation: translateY(30px) → 0, opacity 0 → 1, duration 600ms, ease-out
- Lazy-init Three.js/particles after first scroll to center (performance)
- Parallax: background 0.08x, particles 0.25x, content 0.5x

### State Management
\`\`\`javascript
const AppState = {
  activeSection: 'hero',
  activeCardId: null,
  videoPlayingId: null,
  audioMutedGlobal: true,
  modalOpen: false,
  modalContent: null,
  theme: '${theme}',
  scrollProgress: 0,
  mousePosition: { x: 0, y: 0 },
  isLoading: true,
};
\`\`\`

---

## G: Gateway

### Endpoints (Mock/Placeholder)
- Telemetry: \`POST https://api.${c.projectName.toLowerCase().replace(/\s/g, '')}.com/events\`
- Contact: \`POST https://api.${c.projectName.toLowerCase().replace(/\s/g, '')}.com/contact\`

### Data Structures
\`\`\`json
// Project interaction
{
  "event": "project_explore",
  "projectId": "string",
  "userSessionId": "uuid",
  "timestamp": "ISO8601",
  "referrer": "string",
  "scrollDepth": "number"
}

// Contact/Talk request
{
  "event": "contact_request",
  "name": "string",
  "email": "string",
  "message": "string",
  "projectContext": "projectId | null",
  "timestamp": "ISO8601"
}

// Media telemetry
{
  "event": "media_action",
  "type": "video_play | video_pause | audio_toggle",
  "mediaId": "string",
  "muted": "boolean",
  "playbackPosition": "number",
  "timestamp": "ISO8601"
}
\`\`\`

### Error Handling
- Retry: exponential backoff (base 1s, max 3 attempts)
- Offline: queue to localStorage, flush on \`navigator.onLine\`
- Rate limit: max 20 events/min client-side
- User feedback: non-blocking toast with retry option

---

## E: Exclusions

### Technical Constraints
- **Single file**: index.html with inline \`<style>\` and \`<script>\`
- **No external images**: inline SVG only
- **No frameworks**: pure HTML/CSS/JS (except Three.js CDN)
- **CDN allowed**: \`https://cdnjs.cloudflare.com/ajax/libs/three.js/r128/three.min.js\`
- **Responsive**: 768px breakpoint (particle count degrades, layout simplifies)
- **Accessibility**: 
  - Keyboard focus states (visible focus ring matching ${t.primary})
  - \`aria-labels\` on all interactive elements
  - Reduced motion: \`@media (prefers-reduced-motion: reduce)\` disables animations
  - Color contrast: minimum 4.5:1 for text
${c.techConstraints ? `\n**Additional Constraints**:\n${c.techConstraints}` : ''}

### Performance Targets
- First Contentful Paint: < 1.5s
- Time to Interactive: < 3s
- Lighthouse Performance: > 85
- 60fps animations on mid-range devices

---

## Appendix: Implementation Highlights

### Three.js Centerpiece Skeleton
\`\`\`javascript
// Scene setup
const scene = new THREE.Scene();
const camera = new THREE.PerspectiveCamera(45, width/height, 0.1, 1000);
camera.position.z = 4;

const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
renderer.setPixelRatio(Math.min(devicePixelRatio, 2));
renderer.setSize(width, height);

// Lighting
const ambientLight = new THREE.AmbientLight(0x${t.bg.slice(1)}, 0.4);
const directionalLight = new THREE.DirectionalLight(0xffffff, 0.8);
directionalLight.position.set(5, 5, 5);
const pointLight = new THREE.PointLight(0x${t.primary.slice(1)}, 1, 10);
scene.add(ambientLight, directionalLight, pointLight);

// Shader uniforms
const uniforms = {
  time: { value: 0 },
  amplitude: { value: 0.25 },
  mouse: { value: new THREE.Vector3(0, 0, 0) },
  primaryColor: { value: new THREE.Color('${t.primary}') },
  accentColor: { value: new THREE.Color('${t.accent}') }
};

// Animation loop
function animate() {
  requestAnimationFrame(animate);
  uniforms.time.value += 0.01;
  uniforms.amplitude.value = 0.25 + Math.sin(uniforms.time.value * 0.5) * 0.1;
  mesh.rotation.y += 0.003;
  mesh.rotation.x += 0.001;
  renderer.render(scene, camera);
}
\`\`\`

### Video + Audio Controls
\`\`\`javascript
// Click-to-play with global mute respect
videoCards.forEach(card => {
  const video = card.querySelector('video');
  card.addEventListener('click', () => {
    if (video.paused) {
      // Pause all other videos first
      document.querySelectorAll('video').forEach(v => v.pause());
      video.play();
      video.muted = AppState.audioMutedGlobal;
      AppState.videoPlayingId = card.dataset.id;
    } else {
      video.pause();
      AppState.videoPlayingId = null;
    }
  });
});

// Global audio toggle
audioToggle.addEventListener('click', () => {
  AppState.audioMutedGlobal = !AppState.audioMutedGlobal;
  document.querySelectorAll('video').forEach(v => {
    v.muted = AppState.audioMutedGlobal;
  });
});
\`\`\`

### Cursor Implementation
\`\`\`javascript
let cursorX = 0, cursorY = 0;
let targetX = 0, targetY = 0;

document.addEventListener('mousemove', e => {
  targetX = e.clientX;
  targetY = e.clientY;
});

function updateCursor() {
  cursorX += (targetX - cursorX) * 0.12;
  cursorY += (targetY - cursorY) * 0.12;
  cursor.style.transform = \`translate(\${cursorX}px, \${cursorY}px)\`;
  requestAnimationFrame(updateCursor);
}
updateCursor();
\`\`\`

---

## Special Features
${c.specialFeatures || 'None specified — implement core FORGE architecture as defined above.'}

## Call to Action
${c.callToAction || 'Primary CTA: "Explore" / "Get Started" / "Enter"'}

---

**Generated by T.H.E. F.O.R.G.E. | Prompt Architecture System**
*Foundation → Objects → Reactions → Gateway → Exclusions*
`;
  };

  const generateVisualStyleSpec = (style, t) => {
    const specs = {
      'Morphing Sphere (Three.js Shader)': `
**Morphing Sphere — IcosahedronGeometry + noise displacement via ShaderMaterial**

Parameters:
- Geometry: \`IcosahedronGeometry(radius=1.2, detail=6)\`
- Displacement amplitude: 0.18 to 0.45 (pulses with sine wave)
- Rotation speed: 0.02 rad/frame (Y), 0.008 rad/frame (X)
- Shader uniforms: \`time\`, \`amplitude\`, \`mouseInfluence\`, \`primaryColor\`, \`accentColor\`

Vertex Shader:
- 3D Simplex noise for organic displacement
- Displace along normals: \`position += normal * noise(position + time) * amplitude\`
- Mouse-based local displacement via uniform vec3

Fragment Shader:
- Rim lighting using primary color (${t.primary})
- Fresnel effect for glowing edge (power: 2.5)
- Ambient deep tint from background
- Gradient between primary and accent based on normal.y`,

      'Particle Constellation': `
**Particle Constellation — Interactive point cloud with dynamic connections**

Parameters:
- Point count: 3000 (desktop) / 800 (mobile)
- Point sizes: 1.0 - 3.5 (randomized, scaled by devicePixelRatio)
- Connection threshold: 100px
- Colors: ${t.primary} with alpha variation 0.3-0.8

Behavior:
- Brownian motion base velocity
- Mouse attraction/repulsion field
- Z-depth layering for parallax
- Connection lines fade with distance`,

      'Fluid Simulation': `
**Fluid Simulation — WebGL-based Navier-Stokes approximation**

Parameters:
- Resolution: 512x512 simulation grid
- Viscosity: 0.0001
- Diffusion: 0.00001
- Pressure iterations: 20
- Color: ${t.primary} → ${t.accent} gradient based on velocity magnitude

Behavior:
- Mouse creates velocity splats
- Vorticity confinement for swirling patterns
- Color advection follows velocity field
- Rendered as full-screen background`,

      'Generative Mesh': `
**Generative Mesh — Procedural geometry with audio reactivity**

Parameters:
- Base geometry: TorusKnotGeometry or custom parametric surface
- Subdivision level: 64 segments
- Wireframe mode: optional toggle
- Color: ${t.primary} with emission ${t.accent}

Behavior:
- Vertices displaced by noise function
- Optional audio-reactive amplitude modulation
- Smooth rotation on multiple axes
- Metallic/iridescent material`,

      'Holographic Prism': `
**Holographic Prism — Refractive crystal with chromatic dispersion**

Parameters:
- Geometry: DodecahedronGeometry or custom faceted shape
- Refraction ratio: 0.98
- Dispersion: RGB channel offset 0.02
- Fresnel power: 3.0

Behavior:
- Environment map reflection/refraction
- Rainbow edge diffraction effect
- Slow rotation with mouse influence
- Sparkle particles on vertices`,

      'Neural Network Graph': `
**Neural Network Graph — 3D node-link visualization**

Parameters:
- Node count: 60-120 (layered structure)
- Link count: dynamic based on layer connections
- Node size: 0.05-0.15 units
- Colors: ${t.primary} nodes, ${t.accent} links

Behavior:
- Pulse animation along connections (signal flow)
- Hover highlights connected nodes
- Force-directed layout with dampening
- Camera orbits slowly around structure`,

      'Bioluminescent Organisms': `
**Bioluminescent Organisms — Jellyfish/plankton-like entities**

Parameters:
- Entity count: 15-30
- Size range: 0.1-0.5 units
- Glow intensity: 0.6-1.0
- Colors: ${t.primary} with ${t.accent} accents

Behavior:
- Smooth undulating motion (sine waves on vertices)
- Tentacle/appendage physics (verlet integration)
- Depth fog for atmosphere
- Mouse avoidance behavior`,

      'Crystal Lattice Structure': `
**Crystal Lattice — Geometric atomic structure**

Parameters:
- Lattice type: FCC, BCC, or diamond cubic
- Unit cell repetitions: 5x5x5
- Atom radius: 0.08 units
- Bond thickness: 0.02 units

Behavior:
- Slow rotation around center
- Highlight nearest atoms to cursor
- Optional slice plane to reveal interior
- Metallic sphere material with ${t.primary} tint`,

      'Gravitational Waves': `
**Gravitational Waves — Spacetime fabric visualization**

Parameters:
- Grid resolution: 100x100 vertices
- Wave sources: 2-4 orbiting masses
- Wave speed: 0.5 units/second
- Amplitude decay: 1/r falloff

Behavior:
- Concentric ripples emanate from moving sources
- Mouse click adds temporary wave source
- Color mapping: height → ${t.primary} to ${t.accent}
- Subtle grid lines for reference`,

      'Quantum Field Visualization': `
**Quantum Field — Probability density visualization**

Parameters:
- Field resolution: 64x64x64 voxels
- Isosurface threshold: adjustable 0.1-0.9
- Colors: ${t.primary} (positive) / ${t.accent} (negative)
- Opacity: density-mapped

Behavior:
- Time evolution of wave function
- Superposition interference patterns
- Measurement collapse animation on click
- Marching cubes for isosurface extraction`,
    };

    return specs[style] || specs['Morphing Sphere (Three.js Shader)'];
  };

  const generateInteractionSpec = (pattern, t) => {
    const specs = {
      'Mouse-reactive particles': `
### Mouse-Reactive Particles
- Influence radius: 150px
- Attraction force (mouse down): 0.8 strength
- Repulsion force (hover): 0.3 strength
- Smoothing: velocity lerp factor 0.15`,

      'Magnetic cursor effect': `
### Magnetic Cursor Effect
- Detection radius: 80px from button center
- Max displacement: 15px
- Easing: cubic-bezier(0.23, 1, 0.32, 1)
- Return spring: 0.2 stiffness`,

      'Tilt card parallax': `
### Tilt Card Parallax
- Max rotation: 8deg X, 12deg Y
- Perspective: 1000px
- Glare overlay: 0-20% opacity based on angle
- Transition: 400ms ease-out on leave`,

      'Scroll-triggered reveals': `
### Scroll-Triggered Reveals
- Observer threshold: 0.15
- Animation: translateY(40px) → 0, opacity 0 → 1
- Duration: 700ms
- Stagger: 100ms between siblings
- Easing: cubic-bezier(0.16, 1, 0.3, 1)`,

      'Audio-reactive elements': `
### Audio-Reactive Elements
- Frequency bands: bass (0-200Hz), mid (200-2000Hz), high (2000Hz+)
- Smoothing: 0.8 time constant
- Mapping: amplitude → scale/opacity/color intensity
- Fallback: sine wave simulation if no audio`,

      'Gesture recognition': `
### Gesture Recognition
- Swipe detection: 50px threshold, 300ms max duration
- Pinch zoom: scale factor 0.5-3.0
- Two-finger rotate: -180° to +180°
- Touch feedback: ripple effect at touch point`,

      'Eye-tracking simulation': `
### Eye-Tracking Simulation (Mouse-Based)
- "Eyes" follow cursor across page
- Pupil movement: constrained to iris radius
- Blink animation: random interval 3-7s
- Startle response: rapid movement triggers wide-eye`,

      'Haptic feedback hints': `
### Haptic Feedback Hints (Visual)
- Button press: scale 0.95 → 1.0, 120ms
- Error state: horizontal shake 3px, 3 cycles
- Success: pulse glow ${t.primary}, 400ms
- Loading: subtle bounce 2px, infinite`,
    };

    return specs[pattern] || '';
  };

  const copyToClipboard = async () => {
    try {
      await navigator.clipboard.writeText(generatedPrompt);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (err) {
      console.error('Copy failed:', err);
    }
  };

  const updateConfig = (key, value) => {
    setConfig(prev => ({ ...prev, [key]: value }));
  };

  const toggleArrayItem = (key, item) => {
    setConfig(prev => ({
      ...prev,
      [key]: prev[key].includes(item)
        ? prev[key].filter(i => i !== item)
        : [...prev[key], item]
    }));
  };

  const steps = [
    { title: 'Identity', icon: '◆' },
    { title: 'Visuals', icon: '◈' },
    { title: 'Interactions', icon: '◇' },
    { title: 'Output', icon: '⬡' },
  ];

  return (
    <div style={{
      minHeight: '100vh',
      background: currentTheme.bg,
      color: '#fff',
      fontFamily: '"Space Grotesk", system-ui, sans-serif',
      position: 'relative',
      overflow: 'hidden',
    }}>
      {/* Particle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '100%',
          height: '100%',
          pointerEvents: 'none',
          zIndex: 0,
        }}
      />

      {/* Theme Selector */}
      <div style={{
        position: 'fixed',
        top: 20,
        right: 20,
        display: 'flex',
        gap: 8,
        zIndex: 100,
      }}>
        {Object.entries(FORGE_THEMES).map(([key, t]) => (
          <button
            key={key}
            onClick={() => setTheme(key)}
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: `linear-gradient(135deg, ${t.primary}, ${t.accent})`,
              border: theme === key ? '2px solid #fff' : '2px solid transparent',
              cursor: 'pointer',
              transition: 'transform 150ms ease',
              transform: theme === key ? 'scale(1.15)' : 'scale(1)',
            }}
            title={t.name}
          />
        ))}
      </div>

      {/* Main Content */}
      <div style={{
        position: 'relative',
        zIndex: 10,
        maxWidth: 900,
        margin: '0 auto',
        padding: '60px 24px',
      }}>
        {/* Header */}
        <header style={{ textAlign: 'center', marginBottom: 60 }}>
          <div style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 12,
            marginBottom: 16,
          }}>
            <span style={{
              fontSize: 42,
              background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
              WebkitBackgroundClip: 'text',
              WebkitTextFillColor: 'transparent',
              fontWeight: 900,
              letterSpacing: '-0.02em',
            }}>
              FORGE
            </span>
            <span style={{
              fontSize: 14,
              color: currentTheme.primary,
              padding: '4px 10px',
              border: `1px solid ${currentTheme.primary}40`,
              borderRadius: 4,
              fontFamily: 'monospace',
            }}>
              v2.0
            </span>
          </div>
          <h1 style={{
            fontSize: 28,
            fontWeight: 600,
            marginBottom: 12,
            color: '#fff',
          }}>
            Prompt Architecture System
          </h1>
          <p style={{
            fontSize: 15,
            color: '#888',
            maxWidth: 500,
            margin: '0 auto',
            lineHeight: 1.6,
          }}>
            Generate production-grade one-shot prompts for billion-dollar web experiences.
            <br />
            Foundation → Objects → Reactions → Gateway → Exclusions
          </p>
        </header>

        {/* Progress Steps */}
        <div style={{
          display: 'flex',
          justifyContent: 'center',
          gap: 8,
          marginBottom: 48,
        }}>
          {steps.map((s, i) => (
            <button
              key={i}
              onClick={() => i <= step && setStep(i)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 8,
                padding: '10px 20px',
                background: step === i 
                  ? `linear-gradient(135deg, ${currentTheme.primary}20, ${currentTheme.accent}20)`
                  : 'transparent',
                border: `1px solid ${step >= i ? currentTheme.primary : '#333'}40`,
                borderRadius: 8,
                color: step >= i ? currentTheme.primary : '#555',
                cursor: i <= step ? 'pointer' : 'default',
                transition: 'all 200ms ease',
                fontFamily: 'inherit',
                fontSize: 14,
              }}
            >
              <span style={{ fontSize: 16 }}>{s.icon}</span>
              <span>{s.title}</span>
            </button>
          ))}
        </div>

        {/* Step Content */}
        <div style={{
          background: `${currentTheme.bg}ee`,
          backdropFilter: 'blur(12px)',
          border: `1px solid ${currentTheme.primary}20`,
          borderRadius: 16,
          padding: 32,
          boxShadow: `0 20px 60px ${currentTheme.bg}`,
        }}>
          {step === 0 && (
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 24, color: currentTheme.primary }}>
                Project Identity
              </h2>
              
              <div style={{ display: 'grid', gap: 20 }}>
                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                    Project Name *
                  </label>
                  <input
                    value={config.projectName}
                    onChange={e => updateConfig('projectName', e.target.value)}
                    placeholder="e.g., DYAI, Nebula, Quantum"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: '#ffffff08',
                      border: `1px solid ${currentTheme.primary}30`,
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 16,
                      outline: 'none',
                      transition: 'border-color 200ms',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                    Tagline (the soul in one sentence)
                  </label>
                  <input
                    value={config.tagline}
                    onChange={e => updateConfig('tagline', e.target.value)}
                    placeholder="e.g., Where mathematics meets mysticism in digital form"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: '#ffffff08',
                      border: `1px solid ${currentTheme.primary}30`,
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 16,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                    Purpose (what problem does this solve?)
                  </label>
                  <textarea
                    value={config.purpose}
                    onChange={e => updateConfig('purpose', e.target.value)}
                    placeholder="Describe the core mission, what it showcases, what feeling it evokes..."
                    rows={3}
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: '#ffffff08',
                      border: `1px solid ${currentTheme.primary}30`,
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 15,
                      outline: 'none',
                      resize: 'vertical',
                      fontFamily: 'inherit',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                    Target Audience
                  </label>
                  <input
                    value={config.targetAudience}
                    onChange={e => updateConfig('targetAudience', e.target.value)}
                    placeholder="e.g., Tech visionaries, creative professionals, early adopters"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: '#ffffff08',
                      border: `1px solid ${currentTheme.primary}30`,
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 16,
                      outline: 'none',
                    }}
                  />
                </div>

                <div>
                  <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                    Brand Values / Vibe
                  </label>
                  <input
                    value={config.brandValues}
                    onChange={e => updateConfig('brandValues', e.target.value)}
                    placeholder="e.g., futuristic, mystical, scientific, premium, accessible"
                    style={{
                      width: '100%',
                      padding: '14px 16px',
                      background: '#ffffff08',
                      border: `1px solid ${currentTheme.primary}30`,
                      borderRadius: 8,
                      color: '#fff',
                      fontSize: 16,
                      outline: 'none',
                    }}
                  />
                </div>
              </div>

              <button
                onClick={() => setStep(1)}
                disabled={!config.projectName}
                style={{
                  marginTop: 32,
                  width: '100%',
                  padding: '16px 32px',
                  background: config.projectName 
                    ? `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`
                    : '#333',
                  border: 'none',
                  borderRadius: 8,
                  color: '#fff',
                  fontSize: 16,
                  fontWeight: 600,
                  cursor: config.projectName ? 'pointer' : 'not-allowed',
                  transition: 'transform 150ms ease, box-shadow 150ms ease',
                  boxShadow: config.projectName ? `0 8px 32px ${currentTheme.glow}` : 'none',
                }}
              >
                Continue to Visuals →
              </button>
            </div>
          )}

          {step === 1 && (
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 24, color: currentTheme.primary }}>
                Visual Centerpiece
              </h2>
              <p style={{ color: '#888', marginBottom: 20, fontSize: 14 }}>
                Select one or more 3D/visual elements for your experience. First selection becomes the primary centerpiece.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                gap: 12,
                marginBottom: 32,
              }}>
                {VISUAL_STYLES.map(style => (
                  <button
                    key={style}
                    onClick={() => toggleArrayItem('visualStyle', style)}
                    style={{
                      padding: '14px 16px',
                      background: config.visualStyle.includes(style)
                        ? `linear-gradient(135deg, ${currentTheme.primary}30, ${currentTheme.accent}20)`
                        : '#ffffff08',
                      border: `1px solid ${config.visualStyle.includes(style) ? currentTheme.primary : '#333'}`,
                      borderRadius: 8,
                      color: config.visualStyle.includes(style) ? currentTheme.primary : '#999',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      textAlign: 'left',
                    }}
                  >
                    {config.visualStyle.indexOf(style) === 0 && (
                      <span style={{ 
                        display: 'inline-block',
                        background: currentTheme.primary,
                        color: currentTheme.bg,
                        padding: '2px 6px',
                        borderRadius: 4,
                        fontSize: 10,
                        marginRight: 8,
                        fontWeight: 600,
                      }}>
                        PRIMARY
                      </span>
                    )}
                    {style}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                  Content Sections (one per line)
                </label>
                <textarea
                  value={config.contentSections}
                  onChange={e => updateConfig('contentSections', e.target.value)}
                  placeholder={"Hero with animated title\nProject showcase grid\nAbout / Story\nContact / CTA"}
                  rows={4}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#ffffff08',
                    border: `1px solid ${currentTheme.primary}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(0)}
                  style={{
                    padding: '14px 24px',
                    background: 'transparent',
                    border: `1px solid #444`,
                    borderRadius: 8,
                    color: '#888',
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    flex: 1,
                    padding: '16px 32px',
                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: `0 8px 32px ${currentTheme.glow}`,
                  }}
                >
                  Continue to Interactions →
                </button>
              </div>
            </div>
          )}

          {step === 2 && (
            <div>
              <h2 style={{ fontSize: 22, marginBottom: 24, color: currentTheme.primary }}>
                Interaction Patterns
              </h2>
              <p style={{ color: '#888', marginBottom: 20, fontSize: 14 }}>
                Define how users will engage with your experience.
              </p>

              <div style={{
                display: 'grid',
                gridTemplateColumns: 'repeat(auto-fill, minmax(180px, 1fr))',
                gap: 12,
                marginBottom: 32,
              }}>
                {INTERACTION_PATTERNS.map(pattern => (
                  <button
                    key={pattern}
                    onClick={() => toggleArrayItem('interactionPatterns', pattern)}
                    style={{
                      padding: '14px 16px',
                      background: config.interactionPatterns.includes(pattern)
                        ? `linear-gradient(135deg, ${currentTheme.primary}30, ${currentTheme.accent}20)`
                        : '#ffffff08',
                      border: `1px solid ${config.interactionPatterns.includes(pattern) ? currentTheme.primary : '#333'}`,
                      borderRadius: 8,
                      color: config.interactionPatterns.includes(pattern) ? currentTheme.primary : '#999',
                      fontSize: 13,
                      cursor: 'pointer',
                      transition: 'all 150ms ease',
                      textAlign: 'left',
                    }}
                  >
                    {pattern}
                  </button>
                ))}
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                  Special Features / Requirements
                </label>
                <textarea
                  value={config.specialFeatures}
                  onChange={e => updateConfig('specialFeatures', e.target.value)}
                  placeholder="Any unique features, animations, or behaviors not covered above..."
                  rows={3}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#ffffff08',
                    border: `1px solid ${currentTheme.primary}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: 20 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                  Technical Constraints
                </label>
                <textarea
                  value={config.techConstraints}
                  onChange={e => updateConfig('techConstraints', e.target.value)}
                  placeholder="e.g., Must work on Safari, no WebGL fallback needed, max 500kb..."
                  rows={2}
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#ffffff08',
                    border: `1px solid ${currentTheme.primary}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 14,
                    outline: 'none',
                    resize: 'vertical',
                    fontFamily: 'inherit',
                  }}
                />
              </div>

              <div style={{ marginBottom: 24 }}>
                <label style={{ display: 'block', marginBottom: 8, color: '#888', fontSize: 13 }}>
                  Primary Call to Action
                </label>
                <input
                  value={config.callToAction}
                  onChange={e => updateConfig('callToAction', e.target.value)}
                  placeholder='e.g., "Enter the Experience", "Explore", "Get Started"'
                  style={{
                    width: '100%',
                    padding: '14px 16px',
                    background: '#ffffff08',
                    border: `1px solid ${currentTheme.primary}30`,
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                    outline: 'none',
                  }}
                />
              </div>

              <div style={{ display: 'flex', gap: 12 }}>
                <button
                  onClick={() => setStep(1)}
                  style={{
                    padding: '14px 24px',
                    background: 'transparent',
                    border: `1px solid #444`,
                    borderRadius: 8,
                    color: '#888',
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  ← Back
                </button>
                <button
                  onClick={generatePrompt}
                  disabled={generating}
                  style={{
                    flex: 1,
                    padding: '16px 32px',
                    background: `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                    border: 'none',
                    borderRadius: 8,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 600,
                    cursor: 'pointer',
                    boxShadow: `0 8px 32px ${currentTheme.glow}`,
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    gap: 10,
                  }}
                >
                  {generating ? (
                    <>
                      <span style={{
                        width: 18,
                        height: 18,
                        border: '2px solid transparent',
                        borderTopColor: '#fff',
                        borderRadius: '50%',
                        animation: 'spin 0.8s linear infinite',
                      }} />
                      Forging...
                    </>
                  ) : (
                    '⬡ Generate FORGE Prompt'
                  )}
                </button>
              </div>
            </div>
          )}

          {step === 3 && generatedPrompt && (
            <div>
              <div style={{ 
                display: 'flex', 
                justifyContent: 'space-between', 
                alignItems: 'center',
                marginBottom: 20,
              }}>
                <h2 style={{ fontSize: 22, color: currentTheme.primary, margin: 0 }}>
                  Generated FORGE Prompt
                </h2>
                <button
                  onClick={copyToClipboard}
                  style={{
                    padding: '10px 20px',
                    background: copied 
                      ? '#22c55e' 
                      : `linear-gradient(135deg, ${currentTheme.primary}, ${currentTheme.accent})`,
                    border: 'none',
                    borderRadius: 6,
                    color: '#fff',
                    fontSize: 14,
                    fontWeight: 600,
                    cursor: 'pointer',
                    display: 'flex',
                    alignItems: 'center',
                    gap: 8,
                  }}
                >
                  {copied ? '✓ Copied!' : '⎘ Copy to Clipboard'}
                </button>
              </div>

              <div style={{
                background: '#000',
                border: `1px solid ${currentTheme.primary}30`,
                borderRadius: 12,
                padding: 24,
                maxHeight: 500,
                overflow: 'auto',
                fontFamily: '"JetBrains Mono", monospace',
                fontSize: 12,
                lineHeight: 1.6,
                whiteSpace: 'pre-wrap',
                color: '#a0a0a0',
              }}>
                {generatedPrompt}
              </div>

              <div style={{ 
                display: 'flex', 
                gap: 12, 
                marginTop: 24,
              }}>
                <button
                  onClick={() => setStep(0)}
                  style={{
                    padding: '14px 24px',
                    background: 'transparent',
                    border: `1px solid #444`,
                    borderRadius: 8,
                    color: '#888',
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  ← Start New
                </button>
                <button
                  onClick={() => setStep(2)}
                  style={{
                    padding: '14px 24px',
                    background: 'transparent',
                    border: `1px solid ${currentTheme.primary}50`,
                    borderRadius: 8,
                    color: currentTheme.primary,
                    fontSize: 15,
                    cursor: 'pointer',
                  }}
                >
                  ↻ Refine Settings
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <footer style={{
          marginTop: 60,
          textAlign: 'center',
          color: '#444',
          fontSize: 12,
        }}>
          <p style={{ marginBottom: 8 }}>
            <span style={{ color: currentTheme.primary }}>T.H.E. F.O.R.G.E.</span> | Prompt Architecture System
          </p>
          <p>
            Foundation → Objects → Reactions → Gateway → Exclusions
          </p>
        </footer>
      </div>

      <style>{`
        @keyframes spin {
          to { transform: rotate(360deg); }
        }
        input::placeholder, textarea::placeholder {
          color: #555;
        }
        input:focus, textarea:focus {
          border-color: ${currentTheme.primary} !important;
        }
        ::-webkit-scrollbar {
          width: 8px;
        }
        ::-webkit-scrollbar-track {
          background: #111;
        }
        ::-webkit-scrollbar-thumb {
          background: ${currentTheme.primary}40;
          border-radius: 4px;
        }
        ::-webkit-scrollbar-thumb:hover {
          background: ${currentTheme.primary}60;
        }
      `}</style>
    </div>
  );
}
