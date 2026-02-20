interface AccuracyRingProps {
  score: number;
  size?: number;
}

export default function AccuracyRing({ score, size = 48 }: AccuracyRingProps) {
  const radius = (size - 6) / 2;
  const circumference = 2 * Math.PI * radius;
  const progress = (score / 100) * circumference;

  const getColor = (s: number) => {
    if (s >= 75) return { stroke: "#10b981", text: "text-emerald-600" };
    if (s >= 50) return { stroke: "#3b82f6", text: "text-blue-600" };
    if (s >= 25) return { stroke: "#f59e0b", text: "text-amber-600" };
    return { stroke: "#9ca3af", text: "text-gray-500" };
  };

  const color = getColor(score);
  const half = size / 2;

  return (
    <div className="relative" style={{ width: size, height: size }}>
      <svg width={size} height={size} className="-rotate-90">
        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke="#f3f4f6"
          strokeWidth={3}
        />
        <circle
          cx={half}
          cy={half}
          r={radius}
          fill="none"
          stroke={color.stroke}
          strokeWidth={3}
          strokeDasharray={circumference}
          strokeDashoffset={circumference - progress}
          strokeLinecap="round"
          className="transition-all duration-500"
        />
      </svg>
      <div className="absolute inset-0 flex items-center justify-center">
        <span className={`text-xs font-bold ${color.text}`}>{score}%</span>
      </div>
    </div>
  );
}
