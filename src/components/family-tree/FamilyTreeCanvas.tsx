"use client";

import {
  useRef,
  useState,
  useCallback,
  useLayoutEffect,
  type ReactElement,
} from "react";
import { FamilyMember, FamilyRelation, RelationType } from "@/types/family-tree";

// ── Layout constants ──────────────────────────────────────────────────────────

const NW = 160;   // node width
const NH = 88;    // node height
const HGAP = 56;  // horizontal gap between siblings
const VGAP = 110; // vertical gap between generations

// ── Tree layout (Reingold-Tilford style) ──────────────────────────────────────

interface NodeLayout { id: number; x: number; y: number; member: FamilyMember; }

function buildLayout(members: FamilyMember[], relations: FamilyRelation[]): NodeLayout[] {
  if (!members.length) return [];

  const childrenOf = new Map<number, number[]>();
  const hasParent = new Set<number>();
  const memberSet = new Set(members.map((m) => m.id));

  for (const r of relations) {
    if (!memberSet.has(r.fromMemberId) || !memberSet.has(r.toMemberId)) continue;
    if (r.relationType === "parent") {
      const arr = childrenOf.get(r.fromMemberId) ?? [];
      if (!arr.includes(r.toMemberId)) arr.push(r.toMemberId);
      childrenOf.set(r.fromMemberId, arr);
      hasParent.add(r.toMemberId);
    } else if (r.relationType === "child") {
      const arr = childrenOf.get(r.toMemberId) ?? [];
      if (!arr.includes(r.fromMemberId)) arr.push(r.fromMemberId);
      childrenOf.set(r.toMemberId, arr);
      hasParent.add(r.fromMemberId);
    }
  }

  const subtreeW = (id: number): number => {
    const kids = (childrenOf.get(id) ?? []).filter((k) => memberSet.has(k));
    if (!kids.length) return NW;
    return Math.max(NW, kids.reduce((s, k) => s + subtreeW(k) + HGAP, -HGAP));
  };

  const positions = new Map<number, { x: number; y: number }>();
  let nextX = 0;

  const place = (id: number, depth: number, left: number): number => {
    const kids = (childrenOf.get(id) ?? []).filter((k) => memberSet.has(k));
    if (!kids.length) {
      positions.set(id, { x: left, y: depth * (NH + VGAP) });
      nextX = Math.max(nextX, left + NW);
      return left + NW / 2;
    }
    let cur = left;
    const centers: number[] = [];
    for (const kid of kids) {
      const sw = subtreeW(kid);
      centers.push(place(kid, depth + 1, cur));
      cur += sw + HGAP;
    }
    const cx = (centers[0] + centers[centers.length - 1]) / 2;
    positions.set(id, { x: cx - NW / 2, y: depth * (NH + VGAP) });
    nextX = Math.max(nextX, cur - HGAP);
    return cx;
  };

  const roots = members.filter((m) => !hasParent.has(m.id));
  let cursor = 0;
  for (const root of roots) {
    const sw = subtreeW(root.id);
    place(root.id, 0, cursor);
    cursor += sw + HGAP * 2;
  }
  for (const m of members) {
    if (!positions.has(m.id)) {
      positions.set(m.id, { x: cursor, y: 0 });
      cursor += NW + HGAP;
    }
  }

  return members.map((m) => {
    const p = positions.get(m.id) ?? { x: 0, y: 0 };
    return { id: m.id, x: p.x, y: p.y, member: m };
  });
}

// ── Gender palette ────────────────────────────────────────────────────────────

const GENDER_PALETTE: Record<string, { bg: string; accent: string; text: string; initBg: string; initText: string }> = {
  male:    { bg: "#eff6ff", accent: "#3b82f6", text: "#1e40af", initBg: "#dbeafe", initText: "#1d4ed8" },
  female:  { bg: "#fdf2f8", accent: "#ec4899", text: "#9d174d", initBg: "#fce7f3", initText: "#be185d" },
  other:   { bg: "#f5f3ff", accent: "#8b5cf6", text: "#5b21b6", initBg: "#ede9fe", initText: "#6d28d9" },
  unknown: { bg: "#f9fafb", accent: "#6b7280", text: "#374151", initBg: "#f3f4f6", initText: "#4b5563" },
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface FamilyTreeCanvasProps {
  members: FamilyMember[];
  relations: FamilyRelation[];
  selectedMemberId?: number | null;
  onSelectMember?: (member: FamilyMember) => void;
  readOnly?: boolean;
}

// ── Main component ────────────────────────────────────────────────────────────

export default function FamilyTreeCanvas({
  members,
  relations,
  selectedMemberId,
  onSelectMember,
  readOnly = false,
}: FamilyTreeCanvasProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 60, y: 60 });
  const [zoom, setZoom] = useState(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  const lastTouchDist = useRef<number | null>(null);

  const nodes = buildLayout(members, relations);
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  // Auto-fit when tree changes
  useLayoutEffect(() => {
    if (!nodes.length || !containerRef.current) return;
    const maxX = Math.max(...nodes.map((n) => n.x + NW)) + 80;
    const maxY = Math.max(...nodes.map((n) => n.y + NH)) + 80;
    const cW = containerRef.current.clientWidth;
    const cH = containerRef.current.clientHeight;
    const z = Math.min(1, Math.max(0.25, Math.min((cW - 80) / maxX, (cH - 80) / maxY)));
    setPan({ x: Math.max(30, (cW - maxX * z) / 2), y: 48 });
    setZoom(z);
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [members.length, relations.length]);

  // ── Pan / zoom handlers ───────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as Element).closest("[data-node]")) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    setPan((p) => ({ x: p.x + e.clientX - lastPos.current.x, y: p.y + e.clientY - lastPos.current.y }));
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);
  const onMouseUp = useCallback(() => { dragging.current = false; }, []);
  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    setZoom((z) => Math.min(2.5, Math.max(0.2, z * (1 - e.deltaY * 0.001))));
  }, []);
  const onTouchStart = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      if ((e.touches[0].target as Element).closest("[data-node]")) return;
      dragging.current = true;
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
      lastTouchDist.current = null;
    } else if (e.touches.length === 2) {
      dragging.current = false;
      lastTouchDist.current = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
    }
  }, []);
  const onTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging.current) {
      setPan((p) => ({ x: p.x + e.touches[0].clientX - lastPos.current.x, y: p.y + e.touches[0].clientY - lastPos.current.y }));
      lastPos.current = { x: e.touches[0].clientX, y: e.touches[0].clientY };
    } else if (e.touches.length === 2 && lastTouchDist.current != null) {
      const d = Math.hypot(e.touches[0].clientX - e.touches[1].clientX, e.touches[0].clientY - e.touches[1].clientY);
      setZoom((z) => Math.min(2.5, Math.max(0.2, z * (d / lastTouchDist.current!))));
      lastTouchDist.current = d;
    }
  }, []);
  const onTouchEnd = useCallback(() => { dragging.current = false; lastTouchDist.current = null; }, []);

  const fitToView = useCallback(() => {
    if (!nodes.length || !containerRef.current) return;
    const maxX = Math.max(...nodes.map((n) => n.x + NW)) + 80;
    const maxY = Math.max(...nodes.map((n) => n.y + NH)) + 80;
    const cW = containerRef.current.clientWidth;
    const cH = containerRef.current.clientHeight;
    const z = Math.min(1, Math.max(0.25, Math.min((cW - 80) / maxX, (cH - 80) / maxY)));
    setPan({ x: Math.max(30, (cW - maxX * z) / 2), y: 48 });
    setZoom(z);
  }, [nodes]);

  // ── Empty state ───────────────────────────────────────────────────────────
  if (!members.length) {
    return (
      <div className="flex flex-col items-center justify-center h-72 rounded-2xl border-2 border-dashed border-emerald-100 bg-gradient-to-b from-emerald-50/40 to-white gap-4">
        <div className="relative">
          <div className="w-16 h-16 rounded-full bg-white border-2 border-emerald-100 shadow-sm flex items-center justify-center">
            <svg viewBox="0 0 32 32" className="w-8 h-8" fill="none">
              <circle cx="16" cy="8" r="5" stroke="#10b981" strokeWidth="2"/>
              <circle cx="7" cy="22" r="4" stroke="#6ee7b7" strokeWidth="1.5"/>
              <circle cx="25" cy="22" r="4" stroke="#6ee7b7" strokeWidth="1.5"/>
              <line x1="16" y1="13" x2="7" y2="18" stroke="#a7f3d0" strokeWidth="1.5"/>
              <line x1="16" y1="13" x2="25" y2="18" stroke="#a7f3d0" strokeWidth="1.5"/>
            </svg>
          </div>
        </div>
        <div className="text-center">
          <p className="text-sm font-semibold text-gray-700">
            {readOnly ? "No members in this tree" : "Add your first family member"}
          </p>
          <p className="text-xs text-gray-400 mt-1">
            {readOnly ? "" : "Use the button above to add members, then connect them"}
          </p>
        </div>
      </div>
    );
  }

  // ── Build edges ───────────────────────────────────────────────────────────
  const edges: ReactElement[] = [];

  for (const rel of relations) {
    const from = nodeMap.get(rel.fromMemberId);
    const to = nodeMap.get(rel.toMemberId);
    if (!from || !to) continue;

    if (rel.relationType === "parent" || rel.relationType === "child") {
      // Determine parent/child correctly
      const parent = rel.relationType === "parent" ? from : to;
      const child  = rel.relationType === "parent" ? to   : from;

      const px = parent.x + NW / 2;
      const py = parent.y + NH;      // bottom of parent
      const cx = child.x  + NW / 2;
      const cy = child.y;            // top of child

      // Elbow connector: vertical down, horizontal across, vertical down
      const midY = py + (cy - py) * 0.5;

      edges.push(
        <g key={`e-${rel.id}`}>
          {/* Vertical stem from parent */}
          <line x1={px} y1={py} x2={px} y2={midY} stroke="#d1d5db" strokeWidth={2} strokeLinecap="round" />
          {/* Horizontal connector */}
          <line x1={px} y1={midY} x2={cx} y2={midY} stroke="#d1d5db" strokeWidth={2} strokeLinecap="round" />
          {/* Vertical to child */}
          <line x1={cx} y1={midY} x2={cx} y2={cy} stroke="#d1d5db" strokeWidth={2} strokeLinecap="round" />
          {/* Arrow tip */}
          <polygon
            points={`${cx - 5},${cy - 8} ${cx + 5},${cy - 8} ${cx},${cy - 1}`}
            fill="#d1d5db"
          />
        </g>
      );
    } else if (rel.relationType === "spouse") {
      // Horizontal heart connector between spouses
      const x1 = from.x + NW;
      const x2 = to.x;
      const y  = from.y + NH / 2;
      const mx = (x1 + x2) / 2;
      edges.push(
        <g key={`e-${rel.id}`}>
          <line x1={x1} y1={y} x2={x2} y2={y} stroke="#f9a8d4" strokeWidth={2} strokeDasharray="5 3" strokeLinecap="round" />
          {/* Heart symbol */}
          <text x={mx} y={y + 5} textAnchor="middle" fontSize={13} fill="#ec4899" opacity={0.8}>♥</text>
        </g>
      );
    } else if (rel.relationType === "sibling") {
      const x1 = from.x + NW / 2;
      const x2 = to.x + NW / 2;
      const y  = Math.min(from.y, to.y) - 20;
      edges.push(
        <g key={`e-${rel.id}`}>
          <path d={`M ${x1} ${from.y} Q ${x1} ${y} ${(x1+x2)/2} ${y} Q ${x2} ${y} ${x2} ${to.y}`}
            fill="none" stroke="#fbbf24" strokeWidth={2} strokeDasharray="5 3" strokeLinecap="round" />
          <text x={(x1+x2)/2} y={y - 4} textAnchor="middle" fontSize={9} fill="#d97706" fontWeight={600} opacity={0.8}>sibling</text>
        </g>
      );
    }
  }

  // ── Draw nodes ────────────────────────────────────────────────────────────
  const nodeEls: ReactElement[] = nodes.map((node) => {
    const m = node.member;
    const isSelected = m.id === selectedMemberId;
    const pal = GENDER_PALETTE[m.gender ?? "unknown"] ?? GENDER_PALETTE.unknown;
    const initials = m.name.split(" ").slice(0, 2).map((w) => w[0]).join("").toUpperCase();
    const label = m.name.length > 16 ? m.name.slice(0, 15) + "…" : m.name;

    return (
      <g
        key={node.id}
        data-node="true"
        transform={`translate(${node.x},${node.y})`}
        onClick={() => onSelectMember?.(m)}
        style={{ cursor: onSelectMember ? "pointer" : "default" }}
      >
        {/* Outer glow ring when selected */}
        {isSelected && (
          <rect x={-5} y={-5} width={NW + 10} height={NH + 10} rx={21}
            fill="none" stroke={pal.accent} strokeWidth={3} opacity={0.35} />
        )}

        {/* Card shadow layer */}
        <rect x={2} y={4} width={NW} height={NH} rx={16}
          fill={isSelected ? pal.accent : "#00000010"} opacity={isSelected ? 0.18 : 1} />

        {/* Card background */}
        <rect x={0} y={0} width={NW} height={NH} rx={16}
          fill={isSelected ? pal.accent : "white"}
          stroke={isSelected ? pal.accent : "#e5e7eb"}
          strokeWidth={1.5}
        />

        {/* Top color strip */}
        <rect x={0} y={0} width={NW} height={6} rx={16}
          fill={pal.accent} opacity={isSelected ? 0.5 : 0.25} />
        <rect x={0} y={3} width={NW} height={3}
          fill={pal.accent} opacity={isSelected ? 0.5 : 0.25} />

        {/* Avatar */}
        {m.photoUrl ? (
          <>
            <clipPath id={`c-${node.id}`}><circle cx={32} cy={NH / 2 + 3} r={22} /></clipPath>
            <circle cx={32} cy={NH / 2 + 3} r={23} fill={isSelected ? "rgba(255,255,255,0.2)" : pal.initBg} />
            <image href={m.photoUrl} x={10} y={NH / 2 - 19}
              width={44} height={44} clipPath={`url(#c-${node.id})`}>
              <title>{m.name}</title>
            </image>
          </>
        ) : (
          <>
            <circle cx={32} cy={NH / 2 + 3} r={22}
              fill={isSelected ? "rgba(255,255,255,0.18)" : pal.initBg} />
            <text x={32} y={NH / 2 + 9} textAnchor="middle"
              fontSize={15} fontWeight={800}
              fill={isSelected ? "white" : pal.initText}
            >{initials}</text>
          </>
        )}

        {/* Name */}
        <text x={64} y={NH / 2 - 4} fontSize={12} fontWeight={700}
          fill={isSelected ? "white" : "#111827"}>{label}</text>

        {/* Dates */}
        <text x={64} y={NH / 2 + 11} fontSize={9.5}
          fill={isSelected ? "rgba(255,255,255,0.7)" : "#9ca3af"}>
          {m.birthDate
            ? `${m.birthDate}${!m.isAlive ? ` – ${m.deathDate ?? "?"}` : ""}`
            : m.isAlive ? "Living" : "Deceased"}
        </text>

        {/* RIP pill */}
        {!m.isAlive && (
          <>
            <rect x={NW - 32} y={8} width={26} height={14} rx={7}
              fill={isSelected ? "rgba(255,255,255,0.2)" : "#fee2e2"} />
            <text x={NW - 19} y={19} textAnchor="middle" fontSize={8} fontWeight={700}
              fill={isSelected ? "#fca5a5" : "#ef4444"}>RIP</text>
          </>
        )}

        {/* Testimony badge */}
        {m.testimonyId && (
          <>
            <circle cx={NW - 10} cy={NH - 11} r={7}
              fill={isSelected ? "rgba(255,255,255,0.2)" : "#cffafe"} />
            <text x={NW - 10} y={NH - 7} textAnchor="middle" fontSize={8}
              fill={isSelected ? "#a5f3fc" : "#0e7490"}>📖</text>
          </>
        )}
      </g>
    );
  });

  // ── Render ────────────────────────────────────────────────────────────────
  return (
    <div ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-gray-200 select-none"
      style={{ height: "clamp(300px, 60vh, 560px)", background: "linear-gradient(160deg,#f0fdf4 0%,#f9fafb 40%,#eff6ff 100%)" }}
    >
      {/* Subtle dot-grid background */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none opacity-40" xmlns="http://www.w3.org/2000/svg">
        <defs>
          <pattern id="dots" x="0" y="0" width="24" height="24" patternUnits="userSpaceOnUse">
            <circle cx="1" cy="1" r="1" fill="#d1d5db" />
          </pattern>
        </defs>
        <rect width="100%" height="100%" fill="url(#dots)" />
      </svg>

      {/* Controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1.5">
        <button type="button" onClick={() => setZoom((z) => Math.min(2.5, z + 0.15))}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-white shadow-sm text-lg leading-none font-light transition-all hover:scale-105 active:scale-95">
          +
        </button>
        <button type="button" onClick={() => setZoom((z) => Math.max(0.2, z - 0.15))}
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl flex items-center justify-center text-gray-600 hover:bg-white shadow-sm text-lg leading-none font-light transition-all hover:scale-105 active:scale-95">
          −
        </button>
        <button type="button" onClick={fitToView} title="Fit to view"
          className="w-8 h-8 bg-white/90 backdrop-blur-sm border border-gray-200 rounded-xl flex items-center justify-center text-gray-500 hover:bg-white shadow-sm transition-all hover:scale-105 active:scale-95">
          <svg viewBox="0 0 16 16" className="w-4 h-4" fill="none" stroke="currentColor" strokeWidth="1.5">
            <path d="M1 5V2h3M12 2h3v3M15 11v3h-3M4 14H1v-3"/>
          </svg>
        </button>
      </div>

      {/* Hint badge */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 bg-white/80 backdrop-blur-sm px-2.5 py-1.5 rounded-full border border-gray-100 shadow-sm">
          <svg viewBox="0 0 16 16" className="w-3 h-3 shrink-0" fill="currentColor">
            <path d="M8 0a8 8 0 100 16A8 8 0 008 0zm.75 11.5h-1.5v-5h1.5v5zm0-6.5h-1.5V3.5h1.5V5z"/>
          </svg>
          Drag · Scroll to zoom · Tap a member
        </div>
      </div>

      {/* Generation count badge */}
      {(() => {
        const maxGen = nodes.length ? Math.round(Math.max(...nodes.map((n) => n.y)) / (NH + VGAP)) + 1 : 0;
        return maxGen > 1 ? (
          <div className="absolute top-3 left-1/2 -translate-x-1/2 z-10 pointer-events-none">
            <span className="text-[10px] font-semibold text-gray-500 bg-white/85 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
              {maxGen} generations
            </span>
          </div>
        ) : null;
      })()}

      {/* SVG canvas */}
      <svg
        width="100%" height="100%"
        className="absolute inset-0 cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <defs>
          <filter id="card-shadow">
            <feDropShadow dx="0" dy="2" stdDeviation="4" floodColor="#00000014" />
          </filter>
          <filter id="card-shadow-selected">
            <feDropShadow dx="0" dy="6" stdDeviation="10" floodColor="#00000030" />
          </filter>
        </defs>

        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* Edges first (behind nodes) */}
          {edges}

          {/* Nodes */}
          <g filter="url(#card-shadow)">
            {nodeEls}
          </g>
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 z-10 flex flex-wrap gap-1.5 pointer-events-none">
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100 shadow-sm">
          <span className="w-3 h-0.5 bg-gray-300 inline-block rounded" />
          parent/child
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100 shadow-sm">
          <span className="text-pink-400 text-[10px] leading-none">♥</span>
          spouse
        </div>
        <div className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 bg-white/85 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100 shadow-sm">
          <span className="text-[9px]">📖</span>
          testimony
        </div>
      </div>

      {/* Member count badge */}
      <div className="absolute bottom-3 right-3 z-10 pointer-events-none">
        <div className="text-[10px] font-semibold text-gray-500 bg-white/85 backdrop-blur-sm px-2.5 py-1 rounded-full border border-gray-100 shadow-sm">
          {members.length} {members.length === 1 ? "member" : "members"}
        </div>
      </div>
    </div>
  );
}
