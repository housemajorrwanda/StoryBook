"use client";

import Link from "next/link";
import {
  LuUsers,
  LuShare2,
  LuActivity,
  LuArrowUpRight,
  LuTrendingUp,
  LuMapPin,
  LuLink,
  LuFileText,
  LuMic,
  LuVideo,
} from "react-icons/lu";
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
} from "recharts";
import {
  useTestimonyAnalytics,
  useMostConnected,
} from "@/hooks/useTestimonies";
import {
  MostConnectedTestimony,
  TestimonyAnalytics,
} from "@/types/testimonies";

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string | number;
  sub?: string;
  icon: React.ReactNode;
  accent: string;
  badge?: string;
  badgeColor?: string;
}

function MetricCard({
  title,
  value,
  sub,
  icon,
  accent,
  badge,
  badgeColor = "bg-green-50 text-green-700",
}: MetricCardProps) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div
          className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center shrink-0`}
        >
          {icon}
        </div>
        {badge && (
          <span
            className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${badgeColor}`}
          >
            <LuArrowUpRight className="w-3 h-3" />
            {badge}
          </span>
        )}
      </div>
      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">
          {value.toLocaleString()}
        </p>
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{title}</p>
        {sub && <p className="text-[11px] text-gray-300 mt-0.5">{sub}</p>}
      </div>
    </div>
  );
}

function MetricCardSkeleton() {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 animate-pulse">
      <div className="flex items-start justify-between">
        <div className="w-10 h-10 rounded-xl bg-gray-100" />
        <div className="w-14 h-6 rounded-lg bg-gray-100" />
      </div>
      <div>
        <div className="w-20 h-7 rounded bg-gray-100 mb-2" />
        <div className="w-28 h-3 rounded bg-gray-100" />
      </div>
    </div>
  );
}

// ─── Card wrapper ─────────────────────────────────────────────────────────────

function Card({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-6 flex flex-col gap-5">
      <div className="flex items-center justify-between">
        <h3 className="text-sm font-semibold text-gray-900">{title}</h3>
        {action && (
          <span className="text-xs text-gray-400 font-medium">{action}</span>
        )}
      </div>
      {children}
    </div>
  );
}

// ─── Publishing Status — Donut chart ─────────────────────────────────────────

const DONUT_COLORS = ["#111827", "#fbbf24", "#f87171"];

function DonutTooltip({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { name: string; value: number; payload: { pct: number } }[];
}) {
  if (!active || !payload?.length) return null;
  const { name, value, payload: p } = payload[0];
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900">{name}</p>
      <p className="text-gray-500">
        {value} &middot; {p.pct}%
      </p>
    </div>
  );
}

function PublishingStatus({ analytics }: { analytics: TestimonyAnalytics }) {
  const total = analytics.total || 1;
  const approved = analytics.approved ?? 0;
  const pending = analytics.pending ?? 0;
  const rejected = analytics.rejected ?? 0;

  const data = [
    {
      name: "Approved",
      value: approved,
      pct: Math.round((approved / total) * 100),
      color: "text-gray-900",
    },
    {
      name: "Pending",
      value: pending,
      pct: Math.round((pending / total) * 100),
      color: "text-amber-500",
    },
    {
      name: "Rejected",
      value: rejected,
      pct: Math.round((rejected / total) * 100),
      color: "text-red-400",
    },
  ];

  return (
    <div className="flex items-center gap-6">
      {/* Donut */}
      <div className="shrink-0" style={{ width: 160, height: 160 }}>
        <ResponsiveContainer width="100%" height="100%">
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              innerRadius={48}
              outerRadius={72}
              paddingAngle={2}
              dataKey="value"
              strokeWidth={0}
            >
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={DONUT_COLORS[i]} />
              ))}
            </Pie>
            <Tooltip content={<DonutTooltip />} />
          </PieChart>
        </ResponsiveContainer>
      </div>

      {/* Legend */}
      <div className="flex flex-col gap-3 flex-1">
        {data.map((d, i) => (
          <div key={d.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span
                className="w-2.5 h-2.5 rounded-full shrink-0"
                style={{ background: DONUT_COLORS[i] }}
              />
              <span className="text-xs font-medium text-gray-500">
                {d.name}
              </span>
            </div>
            <div className="flex items-baseline gap-1.5">
              <span className={`text-base font-black leading-none ${d.color}`}>
                {d.value}
              </span>
              <span className="text-[10px] text-gray-400 font-medium">
                {d.pct}%
              </span>
            </div>
          </div>
        ))}
        <div className="mt-1 pt-3 border-t border-gray-100 flex items-baseline justify-between">
          <span className="text-[10px] text-gray-400 uppercase tracking-wider font-semibold">
            Total
          </span>
          <span className="text-lg font-black text-gray-900">
            {analytics.total}
          </span>
        </div>
      </div>
    </div>
  );
}

// ─── Submission Types — Bar chart ─────────────────────────────────────────────

const BAR_COLORS = ["#111827", "#f59e0b", "#3b82f6"];

function BarTooltip({
  active,
  payload,
  label,
}: {
  active?: boolean;
  payload?: { value: number }[];
  label?: string;
}) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-white border border-gray-100 rounded-xl shadow-lg px-3 py-2 text-xs">
      <p className="font-semibold text-gray-900">{label}</p>
      <p className="text-gray-500">{payload[0].value} testimonies</p>
    </div>
  );
}

function SubmissionTypes({ analytics }: { analytics: TestimonyAnalytics }) {
  const data = [
    {
      name: "Written",
      count: analytics.byType?.written ?? 0,
      icon: LuFileText,
    },
    { name: "Audio", count: analytics.byType?.audio ?? 0, icon: LuMic },
    { name: "Video", count: analytics.byType?.video ?? 0, icon: LuVideo },
  ];

  return (
    <div className="flex flex-col gap-4">
      {/* Bar chart */}
      <div style={{ height: 140 }}>
        <ResponsiveContainer width="100%" height="100%">
          <BarChart data={data} barCategoryGap="30%" barGap={4}>
            <CartesianGrid
              vertical={false}
              stroke="#f3f4f6"
              strokeDasharray="0"
            />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: "#9ca3af", fontWeight: 600 }}
              axisLine={false}
              tickLine={false}
            />
            <YAxis
              tick={{ fontSize: 10, fill: "#d1d5db" }}
              axisLine={false}
              tickLine={false}
              width={28}
              allowDecimals={false}
            />
            <Tooltip
              content={<BarTooltip />}
              cursor={{ fill: "#f9fafb", radius: 6 }}
            />
            <Bar dataKey="count" radius={[6, 6, 0, 0]}>
              {data.map((entry, i) => (
                <Cell key={entry.name} fill={BAR_COLORS[i]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* Stat pills */}
      <div className="grid grid-cols-3 gap-2">
        {data.map((d, i) => {
          const Icon = d.icon;
          return (
            <div
              key={d.name}
              className="flex items-center gap-2 p-2.5 rounded-xl bg-gray-50 border border-gray-100"
            >
              <Icon
                className="w-4 h-4 shrink-0"
                style={{ color: BAR_COLORS[i] }}
              />
              <div className="min-w-0">
                <p className="text-[10px] text-gray-400 font-semibold truncate">
                  {d.name}
                </p>
                <p className="text-sm font-black text-gray-900 leading-none">
                  {d.count}
                </p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function ChartSkeleton() {
  return (
    <div className="flex items-center gap-6 animate-pulse">
      <div className="w-40 h-40 rounded-full bg-gray-100 shrink-0" />
      <div className="flex-1 flex flex-col gap-3">
        {[1, 2, 3].map((i) => (
          <div key={i} className="flex justify-between items-center">
            <div className="w-20 h-3 rounded bg-gray-100" />
            <div className="w-10 h-3 rounded bg-gray-100" />
          </div>
        ))}
        <div className="mt-1 pt-3 border-t border-gray-100">
          <div className="w-16 h-5 rounded bg-gray-100 ml-auto" />
        </div>
      </div>
    </div>
  );
}

function TypesSkeleton() {
  return (
    <div className="flex flex-col gap-4 animate-pulse">
      <div className="h-[140px] w-full rounded-xl bg-gray-50" />
      <div className="grid grid-cols-3 gap-2">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-12 rounded-xl bg-gray-100" />
        ))}
      </div>
    </div>
  );
}

// ─── Most Connected Stories ───────────────────────────────────────────────────

function MostConnectedTable({ items }: { items: MostConnectedTestimony[] }) {
  if (items.length === 0) {
    return (
      <div className="text-center py-8">
        <p className="text-sm text-gray-400">No connected testimonies yet.</p>
      </div>
    );
  }

  const typeIcon = (type: string | null) => {
    if (type === "audio") return <LuMic className="w-3 h-3 text-amber-500" />;
    if (type === "video") return <LuVideo className="w-3 h-3 text-blue-500" />;
    return <LuFileText className="w-3 h-3 text-gray-400" />;
  };

  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {items.slice(0, 5).map((item, i) => (
        <div
          key={item.id}
          className="flex items-center gap-4 py-3 first:pt-0 last:pb-0"
        >
          <span className="w-5 text-[11px] font-bold text-gray-300 shrink-0 text-right">
            {String(i + 1).padStart(2, "0")}
          </span>
          {item.images[0] ? (
            // eslint-disable-next-line @next/next/no-img-element
            <img
              src={item.images[0].imageUrl}
              alt={item.eventTitle}
              className="w-8 h-8 rounded-lg object-cover shrink-0"
            />
          ) : (
            <div className="w-8 h-8 rounded-lg bg-gray-100 flex items-center justify-center shrink-0">
              {typeIcon(item.submissionType)}
            </div>
          )}
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">
              {item.eventTitle}
            </p>
            <div className="flex items-center gap-1.5 mt-0.5">
              <LuMapPin className="w-3 h-3 text-gray-300 shrink-0" />
              <p className="text-xs text-gray-400 truncate">{item.location}</p>
            </div>
          </div>
          <div className="flex flex-col items-end gap-1 shrink-0">
            <div className="flex items-center gap-1">
              <LuLink className="w-3 h-3 text-green-500" />
              <span className="text-sm font-semibold text-gray-900">
                {item.connectionsCount}
              </span>
            </div>
            <div className="flex items-center gap-1">
              <LuTrendingUp className="w-3 h-3 text-gray-300" />
              <span className="text-[11px] text-gray-400">
                {item.impressions.toLocaleString()}
              </span>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}

function TableSkeleton() {
  return (
    <div className="flex flex-col divide-y divide-gray-50 animate-pulse">
      {[1, 2, 3].map((i) => (
        <div key={i} className="flex items-center gap-4 py-3 first:pt-0">
          <div className="w-5 h-3 bg-gray-100 rounded" />
          <div className="w-8 h-8 rounded-lg bg-gray-100 shrink-0" />
          <div className="flex-1">
            <div className="w-40 h-3.5 bg-gray-100 rounded mb-1.5" />
            <div className="w-28 h-3 bg-gray-100 rounded" />
          </div>
          <div className="w-8 h-5 bg-gray-100 rounded" />
        </div>
      ))}
    </div>
  );
}

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DashboardWidgets() {
  const { data: analytics, isLoading: analyticsLoading } =
    useTestimonyAnalytics();
  const { data: mostConnected, isLoading: mostConnectedLoading } =
    useMostConnected();

  return (
    <div className="space-y-6">
      {/* Welcome banner */}
      <div className="bg-gray-900 rounded-2xl px-7 py-6 flex items-center justify-between overflow-hidden relative">
        <div className="relative z-10">
          <p className="text-xs font-semibold text-gray-400 uppercase tracking-widest mb-1">
            Welcome back
          </p>
          <h2 className="text-xl font-bold text-white leading-tight">
            Kwibuka Archive Platform
          </h2>
          <p className="text-sm text-gray-400 mt-1 max-w-xs">
            Here&apos;s what&apos;s happening with your archive today.
          </p>
        </div>
        {analytics && !analyticsLoading && analytics.lastWeek != null && (
          <div className="relative z-10 hidden sm:flex flex-col items-end gap-1">
            <p className="text-3xl font-black text-white leading-none">
              {analytics.lastWeek}
            </p>
            <p className="text-xs text-gray-400">new this week</p>
          </div>
        )}
        {/* Decorative circles */}
        <div className="absolute right-8 -top-8 w-40 h-40 rounded-full bg-white/3 pointer-events-none" />
        <div className="absolute right-16 -bottom-10 w-28 h-28 rounded-full bg-white/3 pointer-events-none" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {analyticsLoading || !analytics ? (
          Array.from({ length: 4 }).map((_, i) => (
            <MetricCardSkeleton key={i} />
          ))
        ) : (
          <>
            <MetricCard
              title="Total Testimonies"
              value={analytics.total ?? 0}
              sub={
                analytics.drafts != null
                  ? `${analytics.drafts} drafts`
                  : undefined
              }
              accent="bg-gray-50"
              icon={<LuShare2 className="w-5 h-5 text-gray-700" />}
              badge={
                analytics.lastWeek != null
                  ? `+${analytics.lastWeek} this week`
                  : undefined
              }
            />
            <MetricCard
              title="AI Connections"
              value={analytics.connections?.total ?? 0}
              sub={
                analytics.connections?.averageScore != null
                  ? `Avg. score ${analytics.connections.averageScore.toFixed(1)}`
                  : undefined
              }
              accent="bg-green-50"
              icon={<LuActivity className="w-5 h-5 text-green-600" />}
            />
            <MetricCard
              title="Active Storytellers"
              value={analytics.users?.total ?? 0}
              accent="bg-orange-50"
              icon={<LuUsers className="w-5 h-5 text-orange-500" />}
            />
            <MetricCard
              title="Pending Review"
              value={analytics.pending ?? 0}
              sub={
                analytics.rejected != null
                  ? `${analytics.rejected} rejected`
                  : undefined
              }
              accent="bg-amber-50"
              icon={<LuTrendingUp className="w-5 h-5 text-amber-500" />}
              badge={
                (analytics.pending ?? 0) > 0 ? "Needs attention" : undefined
              }
              badgeColor="bg-amber-50 text-amber-700"
            />
          </>
        )}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Publishing Status" action="All time">
          {analyticsLoading || !analytics ? (
            <ChartSkeleton />
          ) : (
            <PublishingStatus analytics={analytics} />
          )}
        </Card>

        <Card title="Submission Types" action="All time">
          {analyticsLoading || !analytics ? (
            <TypesSkeleton />
          ) : (
            <SubmissionTypes analytics={analytics} />
          )}
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 gap-4">
        <Card title="Most Connected Testimonies" action="By AI connections">
          {mostConnectedLoading ? (
            <TableSkeleton />
          ) : (
            <MostConnectedTable items={mostConnected ?? []} />
          )}
          <Link
            href="/dashboard/all-testimonies"
            className="mt-1 text-xs font-medium text-gray-400 hover:text-gray-900 transition-colors"
          >
            View all testimonies →
          </Link>
        </Card>
      </div>
    </div>
  );
}
