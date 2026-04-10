import React, { useEffect, useMemo, useRef, useState } from 'react';
import {
  ArrowRight,
  Zap,
  Star,
  Wrench,
  Cog,
  Shield,
  Lock,
  Hammer,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';
import { useApp } from '../contexts/AppContext';

type BubbleIconType = LucideIcon;

type BubbleSeed = {
  id: string;
  icon: BubbleIconType;
  size: number;
  x: number;
  y: number;
  vx: number;
  vy: number;
};

type BubbleState = BubbleSeed;

const BUBBLE_AREA_SIZE = 360;
const CENTER_X = BUBBLE_AREA_SIZE / 2;
const CENTER_Y = BUBBLE_AREA_SIZE / 2;
const LOGO_COLLISION_RADIUS = 74;
const HERO_LOGO_SIZE = 190;
const MODE_LOGO_SIZE = 120;
const LOGO_SRC = '/fixa-logo.webp';

export const OnboardingScreen: React.FC = () => {
  const { navigate } = useApp();
  const [slide, setSlide] = useState(0);

  const slides = [
    {
      title: 'Trusted Local Tradespeople',
      sub: 'Find verified plumbers, electricians & mechanics near you in minutes.',
    },
    {
      title: 'Safety First, Always',
      sub: 'Live tracking, panic alerts & background-checked providers for total peace of mind.',
    },
    {
      title: 'Pay Securely In-App',
      sub: 'No cash, no surprises. Confirmed prices, insured when paid in-app.',
    },
  ];

  const initialBubbles = useMemo<BubbleSeed[]>(
    () => [
      { id: 'b1', icon: Wrench, size: 76, x: 46, y: 38, vx: 0.45, vy: 0.32 },
      { id: 'b2', icon: Zap, size: 64, x: 274, y: 34, vx: -0.38, vy: 0.28 },
      { id: 'b3', icon: Cog, size: 58, x: 18, y: 102, vx: 0.42, vy: -0.22 },
      { id: 'b4', icon: Shield, size: 62, x: 286, y: 108, vx: -0.34, vy: -0.26 },
      { id: 'b5', icon: Hammer, size: 56, x: 44, y: 246, vx: 0.36, vy: -0.31 },
      { id: 'b6', icon: Lock, size: 54, x: 284, y: 264, vx: -0.29, vy: -0.33 },
      { id: 'b7', icon: Wrench, size: 50, x: 108, y: 26, vx: 0.31, vy: 0.37 },
      { id: 'b8', icon: Shield, size: 48, x: 230, y: 42, vx: -0.27, vy: 0.34 },
      { id: 'b9', icon: Zap, size: 46, x: 314, y: 214, vx: -0.41, vy: 0.22 },
      { id: 'b10', icon: Cog, size: 48, x: 92, y: 292, vx: 0.24, vy: -0.36 },
      { id: 'b11', icon: Hammer, size: 44, x: 18, y: 188, vx: 0.33, vy: 0.25 },
      { id: 'b12', icon: Lock, size: 42, x: 304, y: 174, vx: -0.22, vy: 0.31 },
      { id: 'b13', icon: Wrench, size: 40, x: 138, y: 314, vx: 0.28, vy: -0.24 },
      { id: 'b14', icon: Zap, size: 38, x: 210, y: 308, vx: -0.26, vy: -0.29 },
      { id: 'b15', icon: Shield, size: 52, x: 16, y: 26, vx: 0.35, vy: 0.18 },
      { id: 'b16', icon: Cog, size: 44, x: 314, y: 72, vx: -0.25, vy: 0.27 },
      { id: 'b17', icon: Hammer, size: 36, x: 24, y: 318, vx: 0.32, vy: -0.21 },
      { id: 'b18', icon: Lock, size: 40, x: 314, y: 316, vx: -0.31, vy: -0.23 },
    ],
    []
  );

  const [bubbles, setBubbles] = useState<BubbleState[]>(initialBubbles);
  const animationRef = useRef<number | null>(null);
  const bubbleAreaRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    setBubbles(initialBubbles);
  }, [initialBubbles]);

  useEffect(() => {
    const preloadLogo = new Image();
    preloadLogo.src = LOGO_SRC;
  }, []);

  useEffect(() => {
    const animate = () => {
      setBubbles((prev) =>
        prev.map((bubble) => {
          let nextX = bubble.x + bubble.vx;
          let nextY = bubble.y + bubble.vy;
          let nextVx = bubble.vx * 0.998;
          let nextVy = bubble.vy * 0.998;

          const radius = bubble.size / 2;

          if (nextX - radius <= 0) {
            nextX = radius;
            nextVx = Math.abs(nextVx);
          } else if (nextX + radius >= BUBBLE_AREA_SIZE) {
            nextX = BUBBLE_AREA_SIZE - radius;
            nextVx = -Math.abs(nextVx);
          }

          if (nextY - radius <= 0) {
            nextY = radius;
            nextVy = Math.abs(nextVy);
          } else if (nextY + radius >= BUBBLE_AREA_SIZE) {
            nextY = BUBBLE_AREA_SIZE - radius;
            nextVy = -Math.abs(nextVy);
          }

          const dx = nextX - CENTER_X;
          const dy = nextY - CENTER_Y;
          const distance = Math.sqrt(dx * dx + dy * dy);
          const minDistance = LOGO_COLLISION_RADIUS + radius;

          if (distance < minDistance) {
            const safeDistance = distance || 0.0001;
            const nx = dx / safeDistance;
            const ny = dy / safeDistance;

            nextX = CENTER_X + nx * minDistance;
            nextY = CENTER_Y + ny * minDistance;

            const dot = nextVx * nx + nextVy * ny;
            nextVx = nextVx - 2 * dot * nx;
            nextVy = nextVy - 2 * dot * ny;

            nextVx *= 0.98;
            nextVy *= 0.98;
          }

          return {
            ...bubble,
            x: nextX,
            y: nextY,
            vx: nextVx,
            vy: nextVy,
          };
        })
      );

      animationRef.current = requestAnimationFrame(animate);
    };

    animationRef.current = requestAnimationFrame(animate);

    return () => {
      if (animationRef.current) cancelAnimationFrame(animationRef.current);
    };
  }, []);

  const handleBubbleTap = (clientX: number, clientY: number) => {
    const area = bubbleAreaRef.current;
    if (!area) return;

    const rect = area.getBoundingClientRect();
    const scaleX = BUBBLE_AREA_SIZE / rect.width;
    const scaleY = BUBBLE_AREA_SIZE / rect.height;

    const tapX = (clientX - rect.left) * scaleX;
    const tapY = (clientY - rect.top) * scaleY;

    const influenceRadius = 95;
    const maxPush = 2.8;

    setBubbles((prev) =>
      prev.map((bubble) => {
        const dx = bubble.x - tapX;
        const dy = bubble.y - tapY;
        const distance = Math.sqrt(dx * dx + dy * dy);

        if (distance > influenceRadius) {
          return bubble;
        }

        const safeDistance = Math.max(distance, 0.001);
        const nx = dx / safeDistance;
        const ny = dy / safeDistance;
        const strength = (1 - safeDistance / influenceRadius) * maxPush;

        let nextVx = bubble.vx + nx * strength;
        let nextVy = bubble.vy + ny * strength;

        if (distance < 14) {
          nextVx += (Math.random() - 0.5) * 0.8;
          nextVy += (Math.random() - 0.5) * 0.8;
        }

        const maxSpeed = 4.2;
        const speed = Math.sqrt(nextVx * nextVx + nextVy * nextVy);

        if (speed > maxSpeed) {
          nextVx = (nextVx / speed) * maxSpeed;
          nextVy = (nextVy / speed) * maxSpeed;
        }

        return {
          ...bubble,
          vx: nextVx,
          vy: nextVy,
        };
      })
    );
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--teal)' }}>
      <style>
        {`
          @keyframes centerPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.025); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          padding: '32px 24px',
          textAlign: 'center',
          overflow: 'hidden',
        }}
      >
        <div
          ref={bubbleAreaRef}
          onPointerDown={(e) => handleBubbleTap(e.clientX, e.clientY)}
          style={{
            position: 'relative',
            width: BUBBLE_AREA_SIZE,
            height: BUBBLE_AREA_SIZE,
            maxWidth: '100%',
            margin: '0 auto 24px',
            touchAction: 'manipulation',
            userSelect: 'none',
            WebkitUserSelect: 'none',
            cursor: 'pointer',
          }}
        >
          {bubbles.map((bubble) => {
            const Icon = bubble.icon;

            return (
              <div
                key={bubble.id}
                title={bubble.id}
                style={{
                  position: 'absolute',
                  width: bubble.size,
                  height: bubble.size,
                  left: bubble.x - bubble.size / 2,
                  top: bubble.y - bubble.size / 2,
                  borderRadius: '50%',
                  background: 'rgba(235, 248, 250, 0.16)',
                  backdropFilter: 'blur(10px)',
                  WebkitBackdropFilter: 'blur(10px)',
                  border: '1px solid rgba(255,255,255,0.16)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 22px rgba(0,0,0,0.10)',
                  zIndex: 1,
                  pointerEvents: 'none',
                }}
              >
                <Icon
                  size={bubble.size * 0.36}
                  color="rgba(255,255,255,0.95)"
                  strokeWidth={2.15}
                />
              </div>
            );
          })}

          <div
            style={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              width: HERO_LOGO_SIZE,
              height: HERO_LOGO_SIZE,
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              animation: 'centerPulse 4s ease-in-out infinite',
              zIndex: 2,
              pointerEvents: 'none',
            }}
          >
            <img
              src={LOGO_SRC}
              alt="Fixa Logo"
              loading="eager"
              draggable={false}
              style={{
                width: HERO_LOGO_SIZE,
                height: HERO_LOGO_SIZE,
                maxWidth: '100%',
                maxHeight: '100%',
                objectFit: 'contain',
                display: 'block',
                filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.35))',
              }}
            />
          </div>
        </div>

        <h2
          style={{
            fontFamily: 'var(--font-head)',
            fontWeight: 900,
            fontSize: 26,
            color: 'white',
            marginBottom: 12,
            lineHeight: 1.2,
          }}
        >
          {slides[slide].title}
        </h2>

        <p
          style={{
            color: 'rgba(255,255,255,0.82)',
            fontSize: 16,
            lineHeight: 1.6,
            maxWidth: 320,
          }}
        >
          {slides[slide].sub}
        </p>

        <div style={{ display: 'flex', gap: 10, marginTop: 28 }}>
          {slides.map((_, i) => (
            <div
              key={i}
              onClick={() => setSlide(i)}
              style={{
                width: i === slide ? 28 : 8,
                height: 8,
                borderRadius: 4,
                background: i === slide ? 'var(--yellow)' : 'rgba(255,255,255,0.3)',
                cursor: 'pointer',
                transition: 'all 0.3s',
              }}
            />
          ))}
        </div>
      </div>

      <div style={{ background: 'white', borderRadius: '32px 32px 0 0', padding: '32px 24px 40px' }}>
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginBottom: 24 }}>
          {[
            'ID Verified Providers',
            'In-App Payments',
            'Live Job Tracking',
            'Panic Button',
            'Reviews & Rankings',
          ].map((f) => (
            <span key={f} className="badge badge-teal">
              {f}
            </span>
          ))}
        </div>

        <button className="btn btn-primary btn-full btn-lg" onClick={() => navigate('mode-select')}>
          Get Started <ArrowRight size={18} />
        </button>

        <p
          style={{
            textAlign: 'center',
            fontSize: 12,
            color: 'var(--text-muted)',
            lineHeight: 1.6,
            marginTop: 16,
          }}
        >
          By continuing you agree to our Terms of Service & Privacy Policy.
          <br />
          All data processed in accordance with POPIA.
        </p>
      </div>
    </div>
  );
};

export const ModeSelectScreen: React.FC = () => {
  const { setMode, navigate } = useApp();

  useEffect(() => {
    const preloadLogo = new Image();
    preloadLogo.src = LOGO_SRC;
  }, []);

  const choose = (mode: 'consumer' | 'provider') => {
    setMode(mode);
    navigate('auth');
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', height: '100vh', background: 'var(--bg)' }}>
      <div style={{ background: 'var(--teal)', padding: '24px 20px 28px', textAlign: 'center', flexShrink: 0 }}>
        <img
          src={LOGO_SRC}
          alt="Fixa Logo"
          loading="eager"
          draggable={false}
          style={{
            width: MODE_LOGO_SIZE,
            height: MODE_LOGO_SIZE,
            objectFit: 'contain',
            margin: '0 auto',
            display: 'block',
          }}
        />
      </div>

      <div
        style={{
          flex: 1,
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'center',
          padding: '24px',
          gap: 20,
          maxWidth: 520,
          margin: '0 auto',
          width: '100%',
        }}
      >
        <div style={{ textAlign: 'center', marginBottom: 8 }}>
          <h2
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
              fontSize: 24,
              color: 'var(--text-primary)',
            }}
          >
            How are you using FIXA?
          </h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: 15, marginTop: 6 }}>
            Choose your role to continue to sign in or sign up
          </p>
        </div>

        <button
          onClick={() => choose('consumer')}
          className="card card-clickable"
          style={{
            padding: 24,
            textAlign: 'left',
            border: '2px solid var(--border)',
            cursor: 'pointer',
            background: 'white',
          }}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'var(--teal-light)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Star size={26} color="var(--teal)" />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
              fontSize: 20,
              color: 'var(--text-primary)',
              marginBottom: 6,
            }}
          >
            I need a service
          </div>

          <div style={{ fontSize: 14, color: 'var(--text-secondary)', lineHeight: 1.6 }}>
            Find and book verified tradespeople near you. Plumbers, electricians, mechanics & more.
          </div>

          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--teal)',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: 14,
              gap: 6,
            }}
          >
            Continue as Customer <ArrowRight size={15} />
          </div>
        </button>

        <button
          onClick={() => choose('provider')}
          style={{
            background: 'var(--teal)',
            borderRadius: 'var(--radius-lg)',
            padding: 24,
            cursor: 'pointer',
            textAlign: 'left',
            border: 'none',
            boxShadow: 'var(--shadow-md)',
            transition: 'transform 0.2s',
          }}
          onMouseEnter={(e) => (e.currentTarget.style.transform = 'translateY(-2px)')}
          onMouseLeave={(e) => (e.currentTarget.style.transform = 'translateY(0)')}
        >
          <div
            style={{
              width: 52,
              height: 52,
              borderRadius: 14,
              background: 'rgba(255,255,255,0.18)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              marginBottom: 14,
            }}
          >
            <Zap size={26} color="var(--yellow)" />
          </div>

          <div
            style={{
              fontFamily: 'var(--font-head)',
              fontWeight: 900,
              fontSize: 20,
              color: 'white',
              marginBottom: 6,
            }}
          >
            I'm a service provider
          </div>

          <div style={{ fontSize: 14, color: 'rgba(255,255,255,0.85)', lineHeight: 1.6 }}>
            Join FIXA to receive job leads, grow your business and get paid securely in-app.
          </div>

          <div
            style={{
              marginTop: 14,
              display: 'flex',
              alignItems: 'center',
              color: 'var(--yellow)',
              fontFamily: 'var(--font-head)',
              fontWeight: 700,
              fontSize: 14,
              gap: 6,
            }}
          >
            Continue as Provider <ArrowRight size={15} />
          </div>
        </button>
      </div>
    </div>
  );
};