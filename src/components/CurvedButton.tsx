"use client";

import Link from "next/link";
import { useEffect, useId, useMemo, useRef, useState, type CSSProperties } from "react";

const round2 = (n: number): number => Math.round(n * 100) / 100;

const hexToRgba = (hex: string, alpha: number): string => {
  let h = String(hex).replace("#", "");
  if (h.length === 3) h = h.split("").map((c) => c + c).join("");
  const n = parseInt(h.slice(0, 6), 16);
  if (Number.isNaN(n)) return hex;
  return `rgba(${(n >> 16) & 255}, ${(n >> 8) & 255}, ${n & 255}, ${alpha})`;
};

type ShadowSize = "none" | "sm" | "md" | "lg";

const SHADOWS: Record<Exclude<ShadowSize, "none">, [number, number, number]> = {
  sm: [5, 12, 0.3],
  md: [10, 24, 0.4],
  lg: [16, 40, 0.52],
};

interface Geometry {
  straight: boolean;
  W: number;
  T: number;
  svgH: number;
  R?: number;
  dir?: number;
  point: (u: number, v: number) => [number, number];
}

// Same arc-mapping approach as CurvedInput: bends a flat W x T bar into a
// circular arc with the given sagitta (`bend`, in px).
const buildGeometry = (width: number, bend: number, thickness: number, pad: number): Geometry => {
  const W = width;
  const T = thickness;
  const s = Math.max(-W * 0.35, Math.min(bend, W * 0.35));
  const a = Math.abs(s);
  const dir = s >= 0 ? 1 : -1;
  const svgH = T + a + pad * 2;

  if (a < 0.75) {
    const midY = pad + T / 2;
    return { straight: true, W, T, svgH, point: (u, v) => [u, midY + v] };
  }

  const R = (W * W * 0.25 + a * a) / (2 * a);
  const cx = W / 2;
  const apexY = pad + T / 2 + (dir > 0 ? 0 : a);
  const cy = apexY + dir * R;
  const phi = Math.asin(Math.min(1, W / (2 * R)));

  return {
    straight: false,
    W,
    T,
    svgH,
    R,
    dir,
    point: (u, v) => {
      const th = ((u - cx) / cx) * phi;
      const rho = R - dir * v;
      return [cx + rho * Math.sin(th), cy - dir * rho * Math.cos(th)];
    },
  };
};

const fmt = (g: Geometry, u: number, v: number): string => {
  const [x, y] = g.point(u, v);
  return `${round2(x)} ${round2(y)}`;
};

const edgeSeg = (g: Geometry, uTo: number, v: number, ltr: boolean): string => {
  if (g.straight) return `L ${fmt(g, uTo, v)}`;
  const rho = round2(g.R! - g.dir! * v);
  const sweep = ltr === g.dir! > 0 ? 1 : 0;
  return `A ${rho} ${rho} 0 0 ${sweep} ${fmt(g, uTo, v)}`;
};

const bentRectPath = (g: Geometry, u0: number, u1: number, vTop: number, vBot: number, radius: number): string => {
  const rc = Math.max(0, Math.min(radius, (vBot - vTop) / 2, (u1 - u0) / 2));
  return [
    `M ${fmt(g, u0 + rc, vTop)}`,
    edgeSeg(g, u1 - rc, vTop, true),
    `Q ${fmt(g, u1, vTop)} ${fmt(g, u1, vTop + rc)}`,
    `L ${fmt(g, u1, vBot - rc)}`,
    `Q ${fmt(g, u1, vBot)} ${fmt(g, u1 - rc, vBot)}`,
    edgeSeg(g, u0 + rc, vBot, false),
    `Q ${fmt(g, u0, vBot)} ${fmt(g, u0, vBot - rc)}`,
    `L ${fmt(g, u0, vTop + rc)}`,
    `Q ${fmt(g, u0, vTop)} ${fmt(g, u0 + rc, vTop)}`,
    "Z",
  ].join(" ");
};

const bentLinePath = (g: Geometry, u0: number, u1: number, v: number): string =>
  `M ${fmt(g, u0, v)} ${edgeSeg(g, u1, v, true)}`;

interface CurvedButtonProps {
  href: string;
  children: string;
  width?: number | string;
  bend?: number;
  height?: number;
  cornerRadius?: number;
  fontSize?: number;
  backgroundColor?: string;
  textColor?: string;
  shadowSize?: ShadowSize;
  shadowColor?: string;
  className?: string;
}

export default function CurvedButton({
  href,
  children,
  width = 280,
  bend = 22,
  height = 64,
  cornerRadius = 32,
  fontSize = 16,
  backgroundColor = "#cdf68c",
  textColor = "#0a291a",
  shadowSize = "md",
  shadowColor = "#0b0e2a",
  className = "",
}: CurvedButtonProps) {
  const uid = useId0();
  const textPathId = `cb-text-${uid}`;
  const rootRef = useRef<HTMLAnchorElement | null>(null);
  const [w, setW] = useState(0);

  useEffect(() => {
    const el = rootRef.current;
    if (!el) return;
    const ro = new ResizeObserver((entries) => setW(Math.round(entries[0]?.contentRect?.width ?? el.clientWidth)));
    ro.observe(el);
    return () => ro.disconnect();
  }, []);

  const pad = 8;
  const geom = useMemo(() => (w > 2 ? buildGeometry(w, bend, height, pad) : null), [w, bend, height]);

  const shadow = shadowSize === "none" ? null : SHADOWS[shadowSize];
  const svgStyle: CSSProperties | undefined = shadow
    ? { filter: `drop-shadow(0 ${shadow[0]}px ${shadow[1]}px ${hexToRgba(shadowColor, shadow[2])})` }
    : undefined;

  const buttonPath = geom ? bentRectPath(geom, 0, geom.W, -geom.T / 2, geom.T / 2, cornerRadius) : "";
  const textPath = geom ? bentLinePath(geom, 0, geom.W, fontSize * 0.34) : "";

  return (
    <Link
      ref={rootRef}
      href={href}
      className={`group relative block w-full max-w-full ${className}`.trim()}
      style={{ width: typeof width === "number" ? `${width}px` : width }}
    >
      {geom && (
        <svg
          className="block w-full h-auto overflow-visible cursor-pointer"
          width={geom.W}
          height={round2(geom.svgH)}
          viewBox={`0 0 ${geom.W} ${round2(geom.svgH)}`}
          style={svgStyle}
        >
          <path
            className="transition-[filter] duration-200 ease-in-out group-hover:brightness-110 group-active:brightness-95"
            d={buttonPath}
            fill={backgroundColor}
          />
          <path id={textPathId} d={textPath} fill="none" />
          <text
            fill={textColor}
            textAnchor="middle"
            style={{ fontSize: `${fontSize}px`, fontWeight: 600, pointerEvents: "none" }}
          >
            <textPath href={`#${textPathId}`} startOffset="50%">
              {children}
            </textPath>
          </text>
        </svg>
      )}
    </Link>
  );
}

let idCounter = 0;
function useId0() {
  const ref = useRef<number | null>(null);
  if (ref.current === null) ref.current = idCounter++;
  return ref.current;
}
