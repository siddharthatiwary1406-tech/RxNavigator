import { formatConfidence } from '../../utils/formatters';

const colorMap = {
  green: {
    ring: 'stroke-green-500',
    text: 'text-green-600',
    badge: 'bg-green-100 text-green-700',
    label: 'bg-green-100 border-green-200',
  },
  yellow: {
    ring: 'stroke-yellow-500',
    text: 'text-yellow-600',
    badge: 'bg-yellow-100 text-yellow-700',
    label: 'bg-yellow-100 border-yellow-200',
  },
  orange: {
    ring: 'stroke-orange-500',
    text: 'text-orange-600',
    badge: 'bg-orange-100 text-orange-700',
    label: 'bg-orange-100 border-orange-200',
  },
  red: {
    ring: 'stroke-red-500',
    text: 'text-red-600',
    badge: 'bg-red-100 text-red-700',
    label: 'bg-red-100 border-red-200',
  },
  gray: {
    ring: 'stroke-slate-300',
    text: 'text-slate-500',
    badge: 'bg-slate-100 text-slate-600',
    label: 'bg-slate-100 border-slate-200',
  },
};

export default function ConfidenceScore({ score }) {
  const { label, color } = formatConfidence(score);
  const colors = colorMap[color] || colorMap.gray;

  const pct = score != null ? Math.round(score * 100) : null;

  // SVG ring parameters
  const radius = 20;
  const circumference = 2 * Math.PI * radius;
  const dashOffset = pct != null ? circumference - (pct / 100) * circumference : circumference;

  return (
    <div className="flex items-center gap-3">
      {/* Circular progress indicator */}
      <div className="relative w-12 h-12 flex-shrink-0">
        <svg className="w-12 h-12 -rotate-90" viewBox="0 0 48 48">
          {/* Track */}
          <circle
            cx="24"
            cy="24"
            r={radius}
            fill="none"
            stroke="#e2e8f0"
            strokeWidth="4"
          />
          {/* Progress */}
          {pct != null && (
            <circle
              cx="24"
              cy="24"
              r={radius}
              fill="none"
              strokeWidth="4"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              className={`transition-all duration-500 ${colors.ring}`}
            />
          )}
        </svg>
        <span className={`absolute inset-0 flex items-center justify-center text-xs font-bold ${colors.text}`}>
          {pct != null ? `${pct}%` : '?'}
        </span>
      </div>

      {/* Label badge */}
      <div>
        <p className="text-xs text-slate-500 mb-0.5">Confidence</p>
        <span className={`inline-block text-xs font-semibold px-2 py-0.5 rounded-full border ${colors.label} ${colors.text}`}>
          {label}
        </span>
      </div>
    </div>
  );
}
