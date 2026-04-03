"use client";

import { useRef, useState, useCallback } from "react";
import { FamilyMember, FamilyRelation, RelationType } from "@/types/family-tree";
import { User } from "lucide-react";

// ── Layout engine ─────────────────────────────────────────────────────────────

interface NodeLayout {
  id: number;
  x: number;
  y: number;
  member: FamilyMember;
}

const NODE_W = 140;
const NODE_H = 80;
const H_GAP = 60;
const V_GAP = 100;

function layoutTree(members: FamilyMember[], relations: FamilyRelation[]): NodeLayout[] {
  if (members.length === 0) return [];

  // Build adjacency: parent → children
  const childrenOf = new Map<number, number[]>();
  const parentOf = new Map<number, number>();
  const spousePairs = new Set<string>();

  for (const rel of relations) {
    if (rel.relationType === "parent") {
      // fromMember is parent of toMember
      const arr = childrenOf.get(rel.fromMemberId) ?? [];
      arr.push(rel.toMemberId);
      childrenOf.set(rel.fromMemberId, arr);
      parentOf.set(rel.toMemberId, rel.fromMemberId);
    }
    if (rel.relationType === "spouse") {
      const key = [rel.fromMemberId, rel.toMemberId].sort().join("-");
      spousePairs.add(key);
    }
  }

  // Find roots (members with no parent)
  const roots = members.filter((m) => !parentOf.has(m.id)).map((m) => m.id);

  const positions = new Map<number, { x: number; y: number }>();
  let nextX = 0;

  function placeSubtree(id: number, depth: number): number {
    // Return the center-x used
    const children = childrenOf.get(id) ?? [];
    if (children.length === 0) {
      const x = nextX;
      nextX += NODE_W + H_GAP;
      positions.set(id, { x, y: depth * (NODE_H + V_GAP) });
      return x + NODE_W / 2;
    }

    const childCenters: number[] = [];
    for (const child of children) {
      childCenters.push(placeSubtree(child, depth + 1));
    }
    const leftmost = childCenters[0];
    const rightmost = childCenters[childCenters.length - 1];
    const cx = (leftmost + rightmost) / 2;
    positions.set(id, { x: cx - NODE_W / 2, y: depth * (NODE_H + V_GAP) });
    return cx;
  }

  for (const root of roots) {
    placeSubtree(root, 0);
    nextX += H_GAP;
  }

  // Place any members not yet positioned (isolated)
  for (const m of members) {
    if (!positions.has(m.id)) {
      positions.set(m.id, { x: nextX, y: 0 });
      nextX += NODE_W + H_GAP;
    }
  }

  return members.map((m) => {
    const pos = positions.get(m.id) ?? { x: 0, y: 0 };
    return { id: m.id, x: pos.x, y: pos.y, member: m };
  });
}

// ── Relation line color ────────────────────────────────────────────────────────

const RELATION_COLORS: Record<RelationType, string> = {
  parent: "#6366f1",
  child: "#6366f1",
  spouse: "#ec4899",
  sibling: "#f59e0b",
};

const RELATION_LABELS: Record<RelationType, string> = {
  parent: "parent of",
  child: "child of",
  spouse: "spouse",
  sibling: "sibling",
};

// ── Props ─────────────────────────────────────────────────────────────────────

interface FamilyTreeCanvasProps {
  members: FamilyMember[];
  relations: FamilyRelation[];
  selectedMemberId?: number | null;
  onSelectMember?: (member: FamilyMember) => void;
  /** Read-only mode (public view) */
  readOnly?: boolean;
}

// ── Component ─────────────────────────────────────────────────────────────────

export default function FamilyTreeCanvas({
  members,
  relations,
  selectedMemberId,
  onSelectMember,
  readOnly = false,
}: FamilyTreeCanvasProps) {
  const svgRef = useRef<SVGSVGElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [pan, setPan] = useState({ x: 40, y: 40 });
  const [zoom, setZoom] = useState(1);
  const dragging = useRef(false);
  const lastPos = useRef({ x: 0, y: 0 });
  // Touch pinch-zoom
  const lastTouchDist = useRef<number | null>(null);

  const nodes = layoutTree(members, relations);

  // ── Mouse pan ──────────────────────────────────────────────────────────────
  const onMouseDown = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if ((e.target as SVGElement).closest("[data-node]")) return;
    dragging.current = true;
    lastPos.current = { x: e.clientX, y: e.clientY };
  }, []);

  const onMouseMove = useCallback((e: React.MouseEvent<SVGSVGElement>) => {
    if (!dragging.current) return;
    const dx = e.clientX - lastPos.current.x;
    const dy = e.clientY - lastPos.current.y;
    lastPos.current = { x: e.clientX, y: e.clientY };
    setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
  }, []);

  const onMouseUp = useCallback(() => { dragging.current = false; }, []);

  const onWheel = useCallback((e: React.WheelEvent<SVGSVGElement>) => {
    e.preventDefault();
    setZoom((z) => Math.min(2, Math.max(0.35, z - e.deltaY * 0.001)));
  }, []);

  // ── Touch pan + pinch-zoom ─────────────────────────────────────────────────
  const onTouchStart = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    if (e.touches.length === 1) {
      const t = e.touches[0];
      if ((t.target as SVGElement).closest("[data-node]")) return;
      dragging.current = true;
      lastPos.current = { x: t.clientX, y: t.clientY };
      lastTouchDist.current = null;
    } else if (e.touches.length === 2) {
      dragging.current = false;
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      lastTouchDist.current = Math.hypot(dx, dy);
    }
  }, []);

  const onTouchMove = useCallback((e: React.TouchEvent<SVGSVGElement>) => {
    e.preventDefault();
    if (e.touches.length === 1 && dragging.current) {
      const t = e.touches[0];
      const dx = t.clientX - lastPos.current.x;
      const dy = t.clientY - lastPos.current.y;
      lastPos.current = { x: t.clientX, y: t.clientY };
      setPan((p) => ({ x: p.x + dx, y: p.y + dy }));
    } else if (e.touches.length === 2 && lastTouchDist.current !== null) {
      const dx = e.touches[0].clientX - e.touches[1].clientX;
      const dy = e.touches[0].clientY - e.touches[1].clientY;
      const dist = Math.hypot(dx, dy);
      const delta = dist - lastTouchDist.current;
      lastTouchDist.current = dist;
      setZoom((z) => Math.min(2, Math.max(0.35, z + delta * 0.005)));
    }
  }, []);

  const onTouchEnd = useCallback(() => {
    dragging.current = false;
    lastTouchDist.current = null;
  }, []);

  if (members.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center h-64 text-gray-400 gap-3 rounded-2xl border-2 border-dashed border-gray-200 bg-gray-50">
        <div className="w-14 h-14 rounded-full bg-gray-100 flex items-center justify-center">
          <User className="w-6 h-6 text-gray-300" />
        </div>
        <p className="text-sm font-medium text-gray-400">
          {readOnly ? "No members in this tree" : "Add members to start building your tree"}
        </p>
      </div>
    );
  }

  // Build node map for quick lookup
  const nodeMap = new Map(nodes.map((n) => [n.id, n]));

  return (
    <div
      ref={containerRef}
      className="relative w-full overflow-hidden rounded-2xl border border-gray-200 bg-gray-50 select-none h-[300px] sm:h-[400px] md:h-[480px]"
    >

      {/* Zoom controls */}
      <div className="absolute top-3 right-3 z-10 flex flex-col gap-1">
        <button
          type="button"
          onClick={() => setZoom((z) => Math.min(2, z + 0.15))}
          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm text-lg font-light leading-none"
        >+</button>
        <button
          type="button"
          onClick={() => setZoom((z) => Math.max(0.35, z - 0.15))}
          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-600 hover:bg-gray-50 shadow-sm text-lg font-light leading-none"
        >−</button>
        <button
          type="button"
          onClick={() => { setPan({ x: 40, y: 40 }); setZoom(1); }}
          className="w-8 h-8 bg-white border border-gray-200 rounded-lg flex items-center justify-center text-gray-400 hover:bg-gray-50 shadow-sm text-[10px] font-semibold"
          title="Reset view"
        >↺</button>
      </div>

      {/* Pan hint — shown briefly */}
      <div className="absolute top-3 left-3 z-10 pointer-events-none">
        <span className="text-[10px] font-medium text-gray-400 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100">
          Drag to pan · Pinch or scroll to zoom
        </span>
      </div>

      <svg
        ref={svgRef}
        width="100%"
        height="100%"
        className="cursor-grab active:cursor-grabbing touch-none"
        onMouseDown={onMouseDown}
        onMouseMove={onMouseMove}
        onMouseUp={onMouseUp}
        onMouseLeave={onMouseUp}
        onWheel={onWheel}
        onTouchStart={onTouchStart}
        onTouchMove={onTouchMove}
        onTouchEnd={onTouchEnd}
      >
        <g transform={`translate(${pan.x},${pan.y}) scale(${zoom})`}>
          {/* ── Relation lines ──────────────────────────────────────────── */}
          {relations.map((rel) => {
            const from = nodeMap.get(rel.fromMemberId);
            const to = nodeMap.get(rel.toMemberId);
            if (!from || !to) return null;

            const x1 = from.x + NODE_W / 2;
            const y1 = from.y + NODE_H / 2;
            const x2 = to.x + NODE_W / 2;
            const y2 = to.y + NODE_H / 2;
            const mx = (x1 + x2) / 2;
            const my = (y1 + y2) / 2;
            const color = RELATION_COLORS[rel.relationType as RelationType] ?? "#94a3b8";

            // Curved path
            const d = `M ${x1} ${y1} Q ${mx} ${my - 20} ${x2} ${y2}`;

            return (
              <g key={rel.id}>
                <path
                  d={d}
                  fill="none"
                  stroke={color}
                  strokeWidth={2}
                  strokeOpacity={0.6}
                  strokeDasharray={rel.relationType === "spouse" ? "5 3" : undefined}
                />
                {/* Label at midpoint */}
                <text
                  x={mx}
                  y={my - 26}
                  textAnchor="middle"
                  fontSize={9}
                  fill={color}
                  fontWeight={600}
                  opacity={0.85}
                >
                  {RELATION_LABELS[rel.relationType as RelationType] ?? rel.relationType}
                </text>
              </g>
            );
          })}

          {/* ── Member nodes ────────────────────────────────────────────── */}
          {nodes.map((node) => {
            const isSelected = node.id === selectedMemberId;
            const m = node.member;
            const initials = m.name
              .split(" ")
              .slice(0, 2)
              .map((w) => w[0])
              .join("")
              .toUpperCase();

            return (
              <g
                key={node.id}
                data-node="true"
                transform={`translate(${node.x},${node.y})`}
                style={{ cursor: onSelectMember ? "pointer" : "default" }}
                onClick={() => onSelectMember?.(m)}
              >
                {/* Shadow */}
                <rect
                  x={2}
                  y={3}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  fill="rgba(0,0,0,0.07)"
                />
                {/* Card */}
                <rect
                  x={0}
                  y={0}
                  width={NODE_W}
                  height={NODE_H}
                  rx={14}
                  fill={isSelected ? "#1f2937" : "white"}
                  stroke={isSelected ? "#1f2937" : "#e5e7eb"}
                  strokeWidth={isSelected ? 2 : 1}
                />

                {/* Avatar circle */}
                {m.photoUrl ? (
                  <clipPath id={`clip-${node.id}`}>
                    <circle cx={28} cy={NODE_H / 2} r={18} />
                  </clipPath>
                ) : null}

                {m.photoUrl ? (
                  <image
                    href={m.photoUrl}
                    x={10}
                    y={NODE_H / 2 - 18}
                    width={36}
                    height={36}
                    clipPath={`url(#clip-${node.id})`}
                  />
                ) : (
                  <>
                    <circle
                      cx={28}
                      cy={NODE_H / 2}
                      r={18}
                      fill={
                        m.gender === "male"
                          ? (isSelected ? "#60a5fa" : "#dbeafe")
                          : m.gender === "female"
                          ? (isSelected ? "#f472b6" : "#fce7f3")
                          : (isSelected ? "#9ca3af" : "#f3f4f6")
                      }
                    />
                    <text
                      x={28}
                      y={NODE_H / 2 + 4}
                      textAnchor="middle"
                      fontSize={12}
                      fontWeight={700}
                      fill={isSelected ? "white" : "#374151"}
                    >
                      {initials}
                    </text>
                  </>
                )}

                {/* Name */}
                <text
                  x={52}
                  y={NODE_H / 2 - 8}
                  fontSize={11}
                  fontWeight={600}
                  fill={isSelected ? "white" : "#111827"}
                >
                  {m.name.length > 14 ? m.name.slice(0, 13) + "…" : m.name}
                </text>

                {/* Dates */}
                <text
                  x={52}
                  y={NODE_H / 2 + 7}
                  fontSize={9}
                  fill={isSelected ? "#d1d5db" : "#6b7280"}
                >
                  {m.birthDate ?? "?"}
                  {!m.isAlive && m.deathDate ? ` – ${m.deathDate}` : m.isAlive ? "" : " – ?"}
                </text>

                {/* Deceased badge */}
                {!m.isAlive && (
                  <rect
                    x={NODE_W - 28}
                    y={6}
                    width={22}
                    height={12}
                    rx={6}
                    fill={isSelected ? "#6b7280" : "#f3f4f6"}
                  />
                )}
                {!m.isAlive && (
                  <text
                    x={NODE_W - 17}
                    y={16}
                    textAnchor="middle"
                    fontSize={7}
                    fill={isSelected ? "#e5e7eb" : "#9ca3af"}
                    fontWeight={600}
                  >
                    RIP
                  </text>
                )}

                {/* Testimony dot */}
                {m.testimonyId && (
                  <circle
                    cx={NODE_W - 10}
                    cy={NODE_H - 12}
                    r={5}
                    fill={isSelected ? "#a5f3fc" : "#06b6d4"}
                  >
                    <title>Has linked testimony</title>
                  </circle>
                )}
              </g>
            );
          })}
        </g>
      </svg>

      {/* Legend */}
      <div className="absolute bottom-3 left-3 flex flex-wrap gap-2.5 pointer-events-none">
        {(["parent", "spouse", "sibling"] as RelationType[]).map((r) => (
          <span key={r} className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100">
            <span
              className="w-4 h-0.5 rounded-full inline-block"
              style={{ background: RELATION_COLORS[r] }}
            />
            {r}
          </span>
        ))}
        <span className="flex items-center gap-1.5 text-[10px] font-medium text-gray-500 bg-white/80 backdrop-blur-sm px-2 py-1 rounded-full border border-gray-100">
          <span className="w-2 h-2 rounded-full bg-cyan-500 inline-block" />
          has testimony
        </span>
      </div>
    </div>
  );
}
