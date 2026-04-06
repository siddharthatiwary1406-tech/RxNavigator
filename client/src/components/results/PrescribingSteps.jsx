export default function PrescribingSteps({ steps }) {
  if (!steps || steps.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        No prescribing steps available.
      </div>
    );
  }

  return (
    <ol className="space-y-4">
      {steps.map((step, index) => (
        <li key={index} className="flex gap-4">
          <span className="flex-shrink-0 w-8 h-8 rounded-full bg-accent-500 text-white text-sm font-bold flex items-center justify-center">
            {index + 1}
          </span>
          <div className="flex-1 pt-1">
            <p className="text-sm text-slate-700 leading-relaxed">{step}</p>
          </div>
        </li>
      ))}
    </ol>
  );
}
