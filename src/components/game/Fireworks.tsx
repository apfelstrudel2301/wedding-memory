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
}

const COLORS = [
  '#FFD700', '#FF6B6B', '#4ECDC4', '#45B7D1',
  '#F7DC6F', '#BB8FCE', '#FF8C42', '#98D8C8',
];

function createBurst(x: number, y: number, count: number): Particle[] {
  const particles: Particle[] = [];
  for (let i = 0; i < count; i++) {
    const angle = (Math.PI * 2 * i) / count + (Math.random() - 0.5) * 0.3;
    const speed = 2 + Math.random() * 4;
    particles.push({
      x,
      y,
      vx: Math.cos(angle) * speed,
      vy: Math.sin(angle) * speed,
      life: 1,
      maxLife: 0.6 + Math.random() * 0.4,
      color: COLORS[Math.floor(Math.random() * COLORS.length)],
      size: 2 + Math.random() * 3,
    });
  }
  return particles;
}

export function Fireworks({ active }: { active: boolean }) {
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

    // Create 3 bursts at different positions
    particles.push(...createBurst(w * 0.5, h * 0.4, 40));
    particles.push(...createBurst(w * 0.3, h * 0.35, 25));
    particles.push(...createBurst(w * 0.7, h * 0.35, 25));

    const decay = 0.015;
    const gravity = 0.06;

    function animate() {
      ctx!.clearRect(0, 0, w, h);

      particles = particles.filter(p => p.life > 0);

      for (const p of particles) {
        p.x += p.vx;
        p.y += p.vy;
        p.vy += gravity;
        p.vx *= 0.99;
        p.life -= decay;

        const alpha = Math.max(0, p.life / p.maxLife);
        ctx!.globalAlpha = alpha;
        ctx!.fillStyle = p.color;
        ctx!.beginPath();
        ctx!.arc(p.x, p.y, p.size * alpha, 0, Math.PI * 2);
        ctx!.fill();
      }

      ctx!.globalAlpha = 1;

      if (particles.length > 0) {
        animRef.current = requestAnimationFrame(animate);
      }
    }

    animRef.current = requestAnimationFrame(animate);

    return () => {
      cancelAnimationFrame(animRef.current);
    };
  }, [active]);

  if (!active) return null;

  return <canvas ref={canvasRef} className={styles.canvas} />;
}
