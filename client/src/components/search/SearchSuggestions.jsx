import LoadingSpinner from '../common/LoadingSpinner';
import { ShieldAlert } from 'lucide-react';

export default function SearchSuggestions({ suggestions, isLoading, onSelect }) {
  if (isLoading) {
    return (
      <div className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg p-3 flex items-center gap-2">
        <LoadingSpinner size="sm" />
        <span className="text-sm text-slate-500">Searching...</span>
      </div>
    );
  }

  if (!suggestions.length) return null;

  return (
    <ul className="absolute z-50 w-full mt-1 bg-white border border-slate-200 rounded-lg shadow-lg overflow-hidden">
      {suggestions.map((drug) => (
        <li key={drug._id}>
          <button
            type="button"
            onClick={() => onSelect(drug)}
            className="w-full text-left px-4 py-3 hover:bg-slate-50 transition-colors flex items-start justify-between gap-2"
          >
            <div>
              <p className="text-sm font-semibold text-slate-800">{drug.brandName}</p>
              <p className="text-xs text-slate-500">{drug.genericName} · {drug.therapeuticArea}</p>
            </div>
            {drug.hasREMS && (
              <span className="flex items-center gap-1 text-xs font-medium text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full whitespace-nowrap">
                <ShieldAlert className="w-3 h-3" /> REMS
              </span>
            )}
          </button>
        </li>
      ))}
    </ul>
  );
}
