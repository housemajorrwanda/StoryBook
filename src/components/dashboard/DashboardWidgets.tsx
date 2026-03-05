import { LuUsers, LuShare2, LuMap, LuActivity, LuArrowUpRight, LuArrowDownRight, LuTrendingUp } from "react-icons/lu";

// ─── Metric Card ─────────────────────────────────────────────────────────────

interface MetricCardProps {
  title: string;
  value: string;
  change: string;
  icon: React.ReactNode;
  accent: string;
}

function MetricCard({ title, value, change, icon, accent }: MetricCardProps) {
  const isPositive = !change.startsWith("-");

  return (
    <div className="bg-white rounded-2xl border border-gray-100 p-5 flex flex-col gap-4 hover:shadow-sm transition-shadow duration-200">
      <div className="flex items-start justify-between">
        <div className={`w-10 h-10 rounded-xl ${accent} flex items-center justify-center shrink-0`}>
          {icon}
        </div>
        <span
          className={`inline-flex items-center gap-1 text-xs font-semibold px-2 py-1 rounded-lg ${
            isPositive
              ? "bg-green-50 text-green-700"
              : "bg-red-50 text-red-600"
          }`}
        >
          {isPositive ? (
            <LuArrowUpRight className="w-3 h-3" />
          ) : (
            <LuArrowDownRight className="w-3 h-3" />
          )}
          {change}
        </span>
      </div>

      <div>
        <p className="text-2xl font-bold text-gray-900 leading-none">{value}</p>
        <p className="text-xs text-gray-400 mt-1.5 font-medium">{title}</p>
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

// ─── Bar Chart ───────────────────────────────────────────────────────────────

function BarChart() {
  const data = [
    { day: "Mon", value: 22 },
    { day: "Tue", value: 35 },
    { day: "Wed", value: 41 },
    { day: "Thu", value: 28 },
    { day: "Fri", value: 52 },
    { day: "Sat", value: 30 },
    { day: "Sun", value: 18 },
  ];
  const max = Math.max(...data.map((d) => d.value));

  return (
    <div className="flex items-end justify-between h-28 gap-1.5">
      {data.map((item) => {
        const pct = (item.value / max) * 100;
        return (
          <div key={item.day} className="flex-1 flex flex-col items-center gap-1.5 group">
            <div className="w-full flex items-end" style={{ height: "80px" }}>
              <div
                className="w-full rounded-t-lg bg-gray-900 group-hover:bg-gray-700 transition-colors duration-150 min-h-1"
                style={{ height: `${pct}%` }}
              />
            </div>
            <span className="text-[10px] text-gray-400 font-medium">{item.day}</span>
          </div>
        );
      })}
    </div>
  );
}

// ─── Status Summary ───────────────────────────────────────────────────────────

function StatusSummary() {
  const statuses = [
    { label: "Published",      value: 68, color: "bg-gray-900" },
    { label: "Pending Review", value: 21, color: "bg-amber-400" },
    { label: "Flagged",        value: 11, color: "bg-red-400"  },
  ];

  return (
    <div className="flex flex-col gap-4">
      {statuses.map((s) => (
        <div key={s.label} className="flex flex-col gap-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-gray-500 font-medium">{s.label}</span>
            <span className="text-gray-900 font-semibold">{s.value}%</span>
          </div>
          <div className="h-1.5 w-full bg-gray-100 rounded-full overflow-hidden">
            <div
              className={`h-1.5 rounded-full ${s.color} transition-all duration-500`}
              style={{ width: `${s.value}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-[11px] text-gray-400 pt-1">Based on the last 30 days of submissions.</p>
    </div>
  );
}

// ─── Top Stories ──────────────────────────────────────────────────────────────

function TopStoriesTable() {
  const stories = [
    { title: "Letters from Kigali",        author: "Marie Umutoni",        reads: "4,210" },
    { title: "Guardians of Memory",         author: "Didier Nkurikiyimana", reads: "3,884" },
    { title: "Through My Father's Eyes",    author: "Chantal Mukamana",     reads: "2,671" },
  ];

  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {stories.map((s, i) => (
        <div key={s.title} className="flex items-center gap-4 py-3 first:pt-0 last:pb-0">
          <span className="w-5 text-[11px] font-bold text-gray-300 shrink-0 text-right">
            {String(i + 1).padStart(2, "0")}
          </span>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{s.title}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{s.author}</p>
          </div>
          <div className="flex items-center gap-1 shrink-0">
            <LuTrendingUp className="w-3 h-3 text-green-500" />
            <span className="text-sm font-semibold text-gray-900">{s.reads}</span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Recent Activity ──────────────────────────────────────────────────────────

function RecentActivity() {
  const items = [
    {
      name: "Alice Niyonsaba",
      action: "Shared a testimony",
      time: "2h ago",
      status: "Published",
      dot: "bg-green-500",
    },
    {
      name: "Jean Claude",
      action: "Requested edit",
      time: "5h ago",
      status: "Pending",
      dot: "bg-amber-400",
    },
    {
      name: "Solange M.",
      action: "Flagged content",
      time: "Yesterday",
      status: "Escalated",
      dot: "bg-red-400",
    },
  ];

  return (
    <div className="flex flex-col divide-y divide-gray-50">
      {items.map((item) => (
        <div key={item.name} className="flex items-center gap-4 py-3.5 first:pt-0 last:pb-0">
          {/* Avatar */}
          <div className="w-8 h-8 rounded-xl bg-gray-100 flex items-center justify-center text-xs font-bold text-gray-500 shrink-0">
            {item.name.charAt(0)}
          </div>

          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-gray-900 truncate">{item.name}</p>
            <p className="text-xs text-gray-400 mt-0.5 truncate">{item.action}</p>
          </div>

          <div className="flex flex-col items-end gap-1.5 shrink-0">
            <span className="text-[10px] text-gray-400">{item.time}</span>
            <span className={`inline-flex items-center gap-1 text-[10px] font-semibold text-gray-600`}>
              <span className={`w-1.5 h-1.5 rounded-full ${item.dot}`} />
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

// ─── Metrics data ─────────────────────────────────────────────────────────────

const metrics = [
  {
    title: "Total Testimonies",
    value: "1,247",
    change: "+18%",
    accent: "bg-gray-50",
    icon: <LuShare2 className="w-5 h-5 text-gray-700" />,
  },
  {
    title: "AI Connections",
    value: "3,421",
    change: "+5%",
    accent: "bg-green-50",
    icon: <LuActivity className="w-5 h-5 text-green-600" />,
  },
  {
    title: "Locations",
    value: "89",
    change: "+2%",
    accent: "bg-purple-50",
    icon: <LuMap className="w-5 h-5 text-purple-600" />,
  },
  {
    title: "Active Storytellers",
    value: "342",
    change: "-3%",
    accent: "bg-orange-50",
    icon: <LuUsers className="w-5 h-5 text-orange-500" />,
  },
];

// ─── Main export ──────────────────────────────────────────────────────────────

export default function DashboardWidgets() {
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
        {/* Decorative circles */}
        <div className="absolute right-8 -top-8 w-40 h-40 rounded-full bg-white/3 pointer-events-none" />
        <div className="absolute right-16 -bottom-10 w-28 h-28 rounded-full bg-white/3 pointer-events-none" />
      </div>

      {/* Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {metrics.map((m) => (
          <MetricCard key={m.title} {...m} />
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Weekly Submissions" action="This week">
          <BarChart />
        </Card>
        <Card title="Publishing Status" action="Last 30 days">
          <StatusSummary />
        </Card>
      </div>

      {/* Bottom row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <Card title="Top Performing Stories" action="By reads">
          <TopStoriesTable />
        </Card>
        <Card title="Latest Activity" action="Real-time">
          <RecentActivity />
        </Card>
      </div>
    </div>
  );
}
