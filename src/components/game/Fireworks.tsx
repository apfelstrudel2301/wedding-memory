import { useEffect, useRef } from 'react';
import styles from './Fireworks.module.css';

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  trail: { x: number; y: number; alpha: number }[];
}

interface Heart {
  x: number;
  y: number;
  vy: number;
  swayOffset: number;
  swaySpeed: number;
  swayAmount: number;
  life: number;
  maxLife: number;
  color: string;
  size: number;
  rotation: number;
  rotationSpeed: number;
}

const HEART_COLORS = ['#FF69B4', '#FF1493', '#FF6B6B', '#E91E63', '#F48FB1', '#FFD700'];

function drawHeart(ctx: CanvasRenderingContext2D, x: number, y: number, size: number, rotation: number) {
  ctx.save();
  ctx.translate(x, y);
  ctx.rotate(rotation);
  ctx.beginPath();
  const s = size;
  ctx.moveTo(0, s * 0.3);
  ctx.bezierCurveTo(-s * 0.5, -s * 0.3, -s, s * 0.05, 0, s);
  ctx.bezierCurveTo(s, s * 0.05, s * 0.5, -s * 0.3, 0, s * 0.3);
  ctx.closePath();
  ctx.fill();
  ctx.restore();
}

function createHeart(x: number, y: number): Heart {
  return {
    x,
    y,
    vy: -(0.6 + Math.random() * 1.0),
    swayOffset: Math.random() * Math.PI * 2,
    swaySpeed: 1.5 + Math.random() * 1.5,
    swayAmount: 15 + Math.random() * 20,
    life: 1,
    maxLife: 0.8 + Math.random() * 0.2,
    color: HEART_COLORS[Math.floor(Math.random() * HEART_COLORS.length)],
    size: 10 + Math.random() * 12,
    rotation: (Math.random() - 0.5) * 0.3,
    rotationSpeed: (Math.random() - 0.5) * 0.02,
  };
}

const COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#F7DC6F', '#BB8FCE', '#FF8C42', '#98D8C8',
  '#FF69B4', '#00CED1', '#FFA500', '#7FFF00',
];

function createBurst(x: number, y: number, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 2.5 + Math.random() * 5;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.65 + Math.random() * 0.35,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 2.5 + Math.random() * 3.5,
      trail: [],
    });
  }
  return particles;
}

function createHighBurst(x: number, y: number, count: number): Particle[] {
  const particles: Particle[] = [];
  const burstColor = COLORS[Math.floor(Math.random() * COLORS.length)];
  const useSingleColor = Math.random() > 0.5;
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.4;
    const speed = 3 + Math.random() * 6;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.7 + Math.random() * 0.3,
      color: useSingleColor ? burstColor : COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 2.5 + Math.random() * 4,
      trail: [],
    });
  }
  return particles;
}

export function Fireworks({ active, intensity = 'normal' }: { active: boolean; intensity?: 'normal' | 'high' }) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animRef = useRef<number>(0);

  useEffect(() => {
    if (!active) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = canvas.offsetWidth * window.devicePixelRatio;
    canvas.height = canvas.offsetHeight * window.devicePixelRatio;
    ctx.scale(window.devicePixelRatio, window.devicePixelRatio);

    const w = canvas.offsetWidth;
    const h = canvas.offsetHeight;

    let particles: Particle[] = [];
    let hearts: Heart[] = [];
    const isHigh = intensity === 'high';
    let frameCount = 0;

    // Spawn initial hearts
    const initialHeartCount = isHigh ? 8 : 4;
    for (let i = 0; i < initialHeartCount; i++) {
      const heart = createHeart(
        Math.random() * w,
        h * (0.5 + Math.random() * 0.5)
      );
      hearts.push(heart);
    }

    if (!isHigh) {
      // Normal match fireworks
      particles.push(...createBurst(w * 0.5, h * 0.35, 55));
      particles.push(...createBurst(w * 0.3, h * 0.3, 35));
      particles.push(...createBurst(w * 0.7, h * 0.3, 35));
      particles.push(...createBurst(w * 0.4, h * 0.45, 25));
      particles.push(...createBurst(w * 0.6, h * 0.45, 25));
    } else {
      // Game-over: initial wave
      particles.push(...createHighBurst(w * 0.5, h * 0.3, 80));
      particles.push(...createHighBurst(w * 0.25, h * 0.4, 50));
      particles.push(...createHighBurst(w * 0.75, h * 0.4, 50));
    }

    const decay = isHigh ? 0.012 : 0.013;
    const gravity = isHigh ? 0.04 : 0.05;

    // Schedule additional waves for high intensity
    const waveTimers: number[] = [];
    if (isHigh) {
      const waves = [
        { time: 600, bursts: [{ x: 0.4, y: 0.25, n: 60 }, { x: 0.6, y: 0.35, n: 60 }] },
        { time: 1200, bursts: [{ x: 0.2, y: 0.3, n: 55 }, { x: 0.8, y: 0.3, n: 55 }, { x: 0.5, y: 0.2, n: 70 }] },
        { time: 1800, bursts: [{ x: 0.35, y: 0.25, n: 50 }, { x: 0.65, y: 0.25, n: 50 }] },
        { time: 2400, bursts: [{ x: 0.15, y: 0.35, n: 45 }, { x: 0.5, y: 0.2, n: 80 }, { x: 0.85, y: 0.35, n: 45 }] },
        { time: 3000, bursts: [{ x: 0.3, y: 0.3, n: 60 }, { x: 0.7, y: 0.3, n: 60 }] },
        { time: 3600, bursts: [{ x: 0.5, y: 0.15, n: 90 }, { x: 0.2, y: 0.4, n: 40 }, { x: 0.8, y: 0.4, n: 40 }] },
        { time: 4200, bursts: [{ x: 0.4, y: 0.2, n: 55 }, { x: 0.6, y: 0.2, n: 55 }] },
        { time: 4800, bursts: [{ x: 0.5, y: 0.25, n: 100 }, { x: 0.3, y: 0.35, n: 50 }, { x: 0.7, y: 0.35, n: 50 }] },
      ];

      for (const wave of waves) {
        const tid = window.setTimeout(() => {
          for (const b of wave.bursts) {
            particles.push(...createHighBurst(w * b.x, h * b.y, b.n));
          }
        }, wave.time);
        waveTimers.push(tid);
      }
    }

    function animate() {
      ctx!.clearRect(0, 0, w, h);
      frameCount++;

      // Spawn new hearts periodically
      const heartInterval = isHigh ? 8 : 15;
      if (frameCount % heartInterval === 0) {
        hearts.push(createHeart(Math.random() * w, h + 10));
      }

      particles = particles.filter(p => p.life > 0);
      hearts = hearts.filter(heart => heart.life > 0);

      for (const p of particles) {
        // Store trail point
        if (isHigh) {
          p.trail.push({ x: p.x, y: p.y, alpha: p.life / p.maxLife });
          if (p.trail.length > 5) p.trail.shift();
        }

        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= 0.99;
        p.life -= decay;

        const alpha = Math.max(0, p.life / p.maxLife);

        // Draw trail for high intensity
        if (isHigh && p.trail.length > 1) {
          for (let i = 0; i < p.trail.length - 1; i++) {
            const t = p.trail[i];
            const trailAlpha = t.alpha * (i / p.trail.length) * 0.4;
            ctx!.globalAlpha = trailAlpha;
            ctx!.fillStyle = p.color;
            ctx!.beginPath();
            ctx!.arc(t.x, t.y, p.size * alpha * 0.6, 0, Math.PI * 2);
            ctx!.fill();
          }
        }

        // Draw particle with glow
        const glowAlpha = isHigh ? 0.3 : 0.2;
        const glowSize = isHigh ? 2.5 : 2;
        ctx!.globalAlpha = alpha * glowAlpha;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * alpha * glowSize, 0, Math.PI * 2);
        ctx!.fill();

        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx!.fill();
      }

      // Update and draw hearts
      const heartDecay = isHigh ? 0.005 : 0.008;
      for (const heart of hearts) {
        heart.y += heart.vy;
        heart.x += Math.sin(frameCount * 0.03 * heart.swaySpeed + heart.swayOffset) * heart.swayAmount * 0.02;
        heart.rotation += heart.rotationSpeed;
        heart.life -= heartDecay;

        const alpha = Math.max(0, heart.life / heart.maxLife);

        // Glow
        ctx!.globalAlpha = alpha * 0.15;
        ctx!.fillStyle = heart.color;
        drawHeart(ctx!, heart.x, heart.y, heart.size * 1.8, heart.rotation);

        // Heart
        ctx!.globalAlpha = alpha * 0.85;
        ctx!.fillStyle = heart.color;
        drawHeart(ctx!, heart.x, heart.y, heart.size, heart.rotation);
      }

      ctx!.globalAlpha = 1;

      if (particles.length > 0 || hearts.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
      for (const tid of waveTimers) clearTimeout(tid);
    };
  }, [active, intensity]);

  if (!active) return null;

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
