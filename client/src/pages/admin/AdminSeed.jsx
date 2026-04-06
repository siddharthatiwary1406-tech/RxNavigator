import { useState } from 'react';
import { adminDrugsApi } from '../../services/adminApi';
import { Globe, Sparkles, CheckCircle, AlertTriangle, ExternalLink } from 'lucide-react';

export default function AdminSeed() {
  const [drugName, setDrugName] = useState('');
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);

  const handleSeed = async (e) => {
    e.preventDefault();
    if (!drugName.trim()) return;
    setLoading(true);
    setResult(null);
    setError(null);
    try {
      const res = await adminDrugsApi.seed(drugName.trim());
      setResult(res.data.data);
    } catch (err) {
      setError(err.response?.data?.error || 'Seed failed. Try a different drug name.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-8 max-w-2xl">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Seed Drug from Web</h1>
        <p className="text-sm text-slate-500 mt-1">
          Searches the web (FDA, Drugs.com, RxList) and uses AI to extract and save structured drug data.
        </p>
      </div>

      <form onSubmit={handleSeed} className="bg-white border border-slate-200 rounded-xl p-6 space-y-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">Drug Name</label>
          <input
            className="w-full border border-slate-300 rounded-lg px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
            placeholder="e.g. Ozempic, Skyrizi, Entresto..."
            value={drugName}
            onChange={e => setDrugName(e.target.value)}
            disabled={loading}
          />
          <p className="text-xs text-slate-400 mt-1">Use the brand name for best results</p>
        </div>

        <button
          type="submit"
          disabled={loading || !drugName.trim()}
          className="w-full flex items-center justify-center gap-2 py-2.5 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 disabled:opacity-50 transition-colors"
        >
          {loading ? (
            <>
              <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              Searching web &amp; extracting data...
            </>
          ) : (
            <>
              <Globe className="w-4 h-4" />
              Seed from Web
            </>
          )}
        </button>
      </form>

      {/* Info box */}
      <div className="mt-4 bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 flex gap-3">
        <Sparkles className="w-4 h-4 shrink-0 mt-0.5" />
        <div>
          <p className="font-medium">How it works</p>
          <p className="text-xs mt-0.5 text-blue-600">Tavily searches FDA.gov, Drugs.com, and RxList. Claude AI extracts prescribing steps, REMS details, specialty pharmacies, and PA requirements into the database. If the drug already exists, it will be updated.</p>
        </div>
      </div>

      {/* Error */}
      {error && (
        <div className="mt-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
        </div>
      )}

      {/* Success result */}
      {result && (
        <div className="mt-4 bg-green-50 border border-green-200 rounded-xl p-5 space-y-3">
          <div className="flex items-center gap-2 text-green-700">
            <CheckCircle className="w-5 h-5" />
            <span className="font-semibold">Drug saved successfully!</span>
          </div>

          <div className="grid grid-cols-2 gap-3 text-sm">
            <div><span className="text-slate-500">Brand Name:</span> <span className="font-medium">{result.brandName}</span></div>
            <div><span className="text-slate-500">Generic:</span> <span className="font-medium">{result.genericName}</span></div>
            <div><span className="text-slate-500">Area:</span> <span className="font-medium">{result.therapeuticArea || '—'}</span></div>
            <div><span className="text-slate-500">REMS:</span> <span className={`font-medium ${result.hasREMS ? 'text-amber-600' : 'text-slate-500'}`}>{result.hasREMS ? 'Yes' : 'No'}</span></div>
          </div>

          {result.prescribingSteps?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">Prescribing Steps ({result.prescribingSteps.length})</p>
              <ul className="text-xs text-slate-600 space-y-0.5 list-disc list-inside">
                {result.prescribingSteps.slice(0, 4).map((s, i) => <li key={i}>{s}</li>)}
                {result.prescribingSteps.length > 4 && <li className="text-slate-400">+{result.prescribingSteps.length - 4} more</li>}
              </ul>
            </div>
          )}

          {result.dataSource?.length > 0 && (
            <div>
              <p className="text-xs font-semibold text-slate-600 mb-1">Sources</p>
              <div className="space-y-0.5">
                {result.dataSource.slice(0, 3).map((src, i) => (
                  <a key={i} href={src} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-xs text-accent-600 hover:underline truncate">
                    <ExternalLink className="w-3 h-3 shrink-0" />
                    {src}
                  </a>
                ))}
              </div>
            </div>
          )}

          <a
            href={`/admin/drugs`}
            className="inline-block mt-2 text-xs text-accent-600 hover:underline"
          >
            View in Drug Database →
          </a>
        </div>
      )}
    </div>
  );
}
