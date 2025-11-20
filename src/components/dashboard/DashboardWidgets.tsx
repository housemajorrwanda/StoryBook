import { LuUsers, LuShare2, LuMap, LuActivity } from "react-icons/lu";

interface MetricCardProps {
  title: string;
  value: string;
  icon: React.ReactNode;
  change: string;
  colorClass: string;
}

function MetricCard({ title, value, icon, change, colorClass }: MetricCardProps) {
  const isNegative = change.startsWith("-");

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 flex items-center gap-4">
      <div className={`w-12 h-12 rounded-lg ${colorClass} flex items-center justify-center text-gray-500`}>
        {icon}
      </div>
      <div className="flex-1">
        <p className="text-sm font-medium text-gray-600">{title}</p>
        <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
      </div>
      <span
        className={`text-sm font-semibold ${isNegative ? "text-red-600" : "text-green-600"}`}
      >
        {change}
      </span>
    </div>
  );
}

interface ChartCardProps {
  title: string;
  children: React.ReactNode;
  dropdownValue?: string;
}

function ChartCard({
  title,
  children,
  dropdownValue = "Daily",
}: ChartCardProps) {
  return (
    <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
      <div className="flex items-center justify-between mb-4">
        <h3 className="text-lg font-semibold text-gray-900">{title}</h3>
        <select
          className="text-sm border border-gray-300 rounded-md px-3 py-1 focus:ring-2 focus:ring-gray-800 focus:border-transparent text-gray-600 cursor-pointer outline-none"
          defaultValue="current"
        >
          <option value="current" className="text-gray-600">{dropdownValue}</option>
          <option value="weekly" className="text-gray-600">Weekly</option>
          <option value="monthly" className="text-gray-600">Monthly</option>
        </select>
      </div>
      {children}
    </div>
  );
}

function BarChart() {
  const data = [
    { day: "Mon", submissions: 22 },
    { day: "Tue", submissions: 35 },
    { day: "Wed", submissions: 41 },
    { day: "Thu", submissions: 28 },
    { day: "Fri", submissions: 52 },
    { day: "Sat", submissions: 30 },
    { day: "Sun", submissions: 18 },
  ];

  const maxValue = Math.max(...data.map((d) => d.submissions));

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between text-xs text-gray-500">
        <span>0</span>
        <span>25</span>
        <span>50</span>
      </div>

      <div className="flex items-end justify-between h-32 gap-2">
        {data.map((item) => (
          <div key={item.day} className="flex flex-col items-center flex-1">
            <div className="bg-gray-100 w-full rounded-t-lg" style={{ height: `${(item.submissions / maxValue) * 100}%` }} />
            <span className="text-xs text-gray-600 mt-2">{item.day}</span>
            <span className="text-xs text-gray-400">{item.submissions}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function StatusSummary() {
  const statuses = [
    { label: "Published", value: 68 },
    { label: "Pending Review", value: 21 },
    { label: "Flagged", value: 11 },
  ];

  return (
    <div className="space-y-4">
      {statuses.map((status) => (
        <div key={status.label} className="space-y-2">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <span>{status.label}</span>
            <span className="font-semibold text-gray-900">{status.value}%</span>
          </div>
          <div className="h-2 w-full bg-gray-100 rounded-full">
            <div
              className="h-2 rounded-full bg-gray-400"
              style={{ width: `${status.value}%` }}
            />
          </div>
        </div>
      ))}
      <p className="text-xs text-gray-500">
        The breakdown is based on the last 30 days of submissions.
      </p>
    </div>
  );
}

function TopStoriesTable() {
  const stories = [
    { title: "Letters from Kigali", author: "Marie Umutoni", reads: "4,210" },
    { title: "Guardians of Memory", author: "Didier Nkurikiyimana", reads: "3,884" },
    { title: "Through My Father's Eyes", author: "Chantal Mukamana", reads: "2,671" },
  ];

  return (
    <div className="overflow-hidden rounded-xl border border-gray-200">
      <table className="w-full text-left text-sm">
        <thead className="bg-gray-50 text-xs uppercase tracking-wider text-gray-500">
          <tr>
            <th className="px-4 py-3">Story</th>
            <th className="px-4 py-3">Author</th>
            <th className="px-4 py-3">Reads</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100 bg-white">
          {stories.map((story) => (
            <tr key={story.title}>
              <td className="px-4 py-3 font-medium text-gray-900">{story.title}</td>
              <td className="px-4 py-3 text-gray-600">{story.author}</td>
              <td className="px-4 py-3 text-gray-600">{story.reads}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

function RecentActivity() {
  const items = [
    { name: "Alice Niyonsaba", action: "Shared a testimony", time: "2 hours ago", status: "Published" },
    { name: "Jean Claude", action: "Requested edit", time: "5 hours ago", status: "Pending" },
    { name: "Solange M.", action: "Flagged content", time: "Yesterday", status: "Escalated" },
  ];

  return (
    <div className="space-y-4">
      {items.map((item) => (
        <div key={item.name} className="flex items-center justify-between rounded-xl border border-gray-200 px-4 py-3 bg-white">
          <div>
            <p className="text-sm font-semibold text-gray-900">{item.name}</p>
            <p className="text-xs text-gray-500">{item.action}</p>
          </div>
          <div className="text-right">
            <p className="text-xs text-gray-400">{item.time}</p>
            <span className="inline-flex items-center rounded-full border border-gray-200 px-3 py-0.5 text-xs font-medium text-gray-700">
              {item.status}
            </span>
          </div>
        </div>
      ))}
    </div>
  );
}

const metrics = [
  {
    title: "Total Testimonies",
    value: "1,247",
    change: "+18%",
    colorClass: "bg-gray-400",
    icon: <LuShare2 className="w-5 h-5" />,
  },
  {
    title: "AI Connections",
    value: "3,421",
    change: "+5%",
    colorClass: "bg-green-400",
    icon: <LuActivity className="w-5 h-5" />,
  },
  {
    title: "Locations",
    value: "89",
    change: "+2%",
    colorClass: "bg-purple-400",
    icon: <LuMap className="w-5 h-5" />,
  },
  {
    title: "Active Storytellers",
    value: "342",
    change: "-3%",
    colorClass: "bg-orange-400",
    icon: <LuUsers className="w-5 h-5" />,
  },
];

export default function DashboardWidgets() {
  return (
    <div className="space-y-6">
      {/* Metrics Row */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {metrics.map((metric) => (
          <MetricCard key={metric.title} {...metric} />
        ))}
      </div>
      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Weekly submissions">
          <BarChart />
        </ChartCard>
        <ChartCard title="Publishing status">
          <StatusSummary />
        </ChartCard>
      </div>

      {/* Bottom Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ChartCard title="Top performing stories" dropdownValue="Last 30 days">
          <TopStoriesTable />
        </ChartCard>
        <ChartCard title="Latest activity" dropdownValue="Realtime">
          <RecentActivity />
        </ChartCard>
      </div>
    </div>
  );
}
