import React, { useCallback, useMemo, useRef, useState } from 'react';
import {
  Wrench,
  Zap,
  Cog,
  Shield,
  Hammer,
  Lock,
  HardHat,
} from 'lucide-react';
import type { LucideIcon } from 'lucide-react';

type TradeBubble = {
  icon: LucideIcon;
  label: string;
  size: number;
  top?: string;
  bottom?: string;
  left?: string;
  right?: string;
  delay: string;
  duration: string;
};

type BubbleOffset = {
  x: number;
  y: number;
};

const trades: TradeBubble[] = [
  {
    icon: Wrench,
    label: 'Plumbing 1',
    size: 74,
    top: '4%',
    left: '14%',
    delay: '0s',
    duration: '5.2s',
  },
  {
    icon: Zap,
    label: 'Electrical 1',
    size: 62,
    top: '6%',
    right: '14%',
    delay: '0.8s',
    duration: '5.8s',
  },
  {
    icon: Cog,
    label: 'Mechanical 1',
    size: 58,
    top: '18%',
    left: '2%',
    delay: '1.3s',
    duration: '4.9s',
  },
  {
    icon: Shield,
    label: 'Security 1',
    size: 60,
    top: '22%',
    right: '2%',
    delay: '1.7s',
    duration: '5.5s',
  },
  {
    icon: Hammer,
    label: 'Handyman 1',
    size: 56,
    bottom: '22%',
    left: '8%',
    delay: '0.5s',
    duration: '5.1s',
  },
  {
    icon: Lock,
    label: 'Access 1',
    size: 54,
    bottom: '14%',
    right: '12%',
    delay: '1.1s',
    duration: '4.7s',
  },
  {
    icon: HardHat,
    label: 'Construction 1',
    size: 66,
    bottom: '8%',
    left: '28%',
    delay: '2s',
    duration: '5.6s',
  },
  {
    icon: Wrench,
    label: 'Plumbing 2',
    size: 50,
    top: '12%',
    left: '32%',
    delay: '0.4s',
    duration: '4.8s',
  },
  {
    icon: Shield,
    label: 'Security 2',
    size: 48,
    top: '14%',
    right: '32%',
    delay: '1.4s',
    duration: '5.3s',
  },
  {
    icon: Zap,
    label: 'Electrical 2',
    size: 44,
    bottom: '28%',
    right: '28%',
    delay: '2.2s',
    duration: '5s',
  },
  {
    icon: Cog,
    label: 'Mechanical 2',
    size: 46,
    bottom: '26%',
    left: '30%',
    delay: '0.9s',
    duration: '5.7s',
  },
  {
    icon: Hammer,
    label: 'Handyman 2',
    size: 42,
    top: '34%',
    left: '12%',
    delay: '1.9s',
    duration: '4.6s',
  },
];

function clamp(value: number, min: number, max: number) {
  return Math.max(min, Math.min(max, value));
}

function percentToPx(value: string | undefined, total: number) {
  if (!value) return 0;
  return (parseFloat(value) / 100) * total;
}

export default function TradeBubbles() {
  const containerRef = useRef<HTMLDivElement | null>(null);

  const [offsets, setOffsets] = useState<BubbleOffset[]>(
    () => trades.map(() => ({ x: 0, y: 0 }))
  );

  const initialOffsets = useMemo(
    () => trades.map(() => ({ x: 0, y: 0 })),
    []
  );

  const getBasePosition = useCallback(
    (trade: TradeBubble, width: number, height: number) => {
      let x = 0;
      let y = 0;

      if (trade.left !== undefined) {
        x = percentToPx(trade.left, width);
      } else if (trade.right !== undefined) {
        x = width - percentToPx(trade.right, width) - trade.size;
      }

      if (trade.top !== undefined) {
        y = percentToPx(trade.top, height);
      } else if (trade.bottom !== undefined) {
        y = height - percentToPx(trade.bottom, height) - trade.size;
      }

      return { x, y };
    },
    []
  );

  const repelFromPoint = useCallback((clientX: number, clientY: number) => {
    const container = containerRef.current;
    if (!container) return;

    const rect = container.getBoundingClientRect();
    const tapX = clientX - rect.left;
    const tapY = clientY - rect.top;

    const influenceRadius = 95;
    const pushStrength = 44;

    setOffsets((prev) =>
      trades.map((trade, index) => {
        const base = getBasePosition(trade, rect.width, rect.height);
        const currentX = base.x + prev[index].x;
        const currentY = base.y + prev[index].y;

        const centerX = currentX + trade.size / 2;
        const centerY = currentY + trade.size / 2;

        const dx = centerX - tapX;
        const dy = centerY - tapY;
        const distance = Math.hypot(dx, dy);

        if (distance > influenceRadius) {
          return {
            x: prev[index].x * 0.92,
            y: prev[index].y * 0.92,
          };
        }

        const safeDistance = Math.max(distance, 0.001);
        const force = (1 - safeDistance / influenceRadius) * pushStrength;

        let pushX = (dx / safeDistance) * force;
        let pushY = (dy / safeDistance) * force;

        if (distance < 18) {
          pushX += (Math.random() - 0.5) * 16;
          pushY += (Math.random() - 0.5) * 16;
        }

        const proposedX = prev[index].x + pushX;
        const proposedY = prev[index].y + pushY;

        const minX = -base.x;
        const maxX = rect.width - trade.size - base.x;
        const minY = -base.y;
        const maxY = rect.height - trade.size - base.y;

        return {
          x: clamp(proposedX, minX, maxX),
          y: clamp(proposedY, minY, maxY),
        };
      })
    );

    window.setTimeout(() => {
      setOffsets((current) =>
        current.map((offset) => ({
          x: offset.x * 0.78,
          y: offset.y * 0.78,
        }))
      );
    }, 140);

    window.setTimeout(() => {
      setOffsets((current) =>
        current.map((offset) => ({
          x: offset.x * 0.55,
          y: offset.y * 0.55,
        }))
      );
    }, 260);

    window.setTimeout(() => {
      setOffsets((current) =>
        current.map((offset) => ({
          x: Math.abs(offset.x) < 0.8 ? 0 : offset.x * 0.35,
          y: Math.abs(offset.y) < 0.8 ? 0 : offset.y * 0.35,
        }))
      );
    }, 420);

    window.setTimeout(() => {
      setOffsets((current) =>
        current.map((offset) => ({
          x: Math.abs(offset.x) < 0.5 ? 0 : offset.x * 0.18,
          y: Math.abs(offset.y) < 0.5 ? 0 : offset.y * 0.18,
        }))
      );
    }, 620);

    window.setTimeout(() => {
      setOffsets((current) =>
        current.map((offset) => ({
          x: Math.abs(offset.x) < 0.25 ? 0 : offset.x * 0.08,
          y: Math.abs(offset.y) < 0.25 ? 0 : offset.y * 0.08,
        }))
      );
    }, 820);
  }, [getBasePosition]);

  return (
    <>
      <style>
        {`
          @keyframes bubbleFloat {
            0% { transform: translateY(0px) translateX(0px) scale(1); }
            25% { transform: translateY(-8px) translateX(4px) scale(1.03); }
            50% { transform: translateY(-14px) translateX(-3px) scale(1); }
            75% { transform: translateY(-6px) translateX(5px) scale(0.98); }
            100% { transform: translateY(0px) translateX(0px) scale(1); }
          }

          @keyframes centerPulse {
            0% { transform: translate(-50%, -50%) scale(1); }
            50% { transform: translate(-50%, -50%) scale(1.03); }
            100% { transform: translate(-50%, -50%) scale(1); }
          }
        `}
      </style>

      <div
        ref={containerRef}
        onPointerDown={(e) => repelFromPoint(e.clientX, e.clientY)}
        style={{
          position: 'relative',
          width: 340,
          height: 340,
          margin: '0 auto 24px',
          maxWidth: '100%',
          touchAction: 'manipulation',
          userSelect: 'none',
          WebkitUserSelect: 'none',
        }}
      >
        <div
          style={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            width: 140,
            height: 140,
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
            src="/fixa-logo.png"
            alt="Fixa Logo"
            style={{
              width: 185,
              height: 'auto',
              display: 'block',
              filter: 'drop-shadow(0 12px 28px rgba(0,0,0,0.35))',
            }}
          />
        </div>

        {trades.map((trade, index) => {
          const Icon = trade.icon;
          const offset = offsets[index];

          return (
            <div
              key={trade.label}
              title={trade.label}
              style={{
                position: 'absolute',
                width: trade.size,
                height: trade.size,
                zIndex: 1,
                transition: 'transform 260ms cubic-bezier(0.22, 1, 0.36, 1)',
                transform: `translate(${offset.x}px, ${offset.y}px)`,
                ...(trade.top !== undefined ? { top: trade.top } : {}),
                ...(trade.bottom !== undefined ? { bottom: trade.bottom } : {}),
                ...(trade.left !== undefined ? { left: trade.left } : {}),
                ...(trade.right !== undefined ? { right: trade.right } : {}),
              }}
            >
              <div
                style={{
                  width: '100%',
                  height: '100%',
                  borderRadius: '50%',
                  background: 'rgba(235, 252, 252, 0.22)',
                  backdropFilter: 'blur(8px)',
                  WebkitBackdropFilter: 'blur(8px)',
                  border: '1px solid rgba(255,255,255,0.18)',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  boxShadow: '0 8px 24px rgba(0,0,0,0.12)',
                  animation: `bubbleFloat ${trade.duration} ease-in-out infinite`,
                  animationDelay: trade.delay,
                  pointerEvents: 'none',
                }}
              >
                <Icon
                  size={trade.size * 0.38}
                  color="rgba(255,255,255,0.92)"
                  strokeWidth={2.2}
                />
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}