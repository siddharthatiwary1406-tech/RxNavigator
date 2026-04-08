import { useEffect, useState, useCallback } from 'react';
import { adminSearchLogsApi } from '../../services/adminApi';
import { ChevronLeft, ChevronRight, AlertTriangle } from 'lucide-react';

const SOURCE_TABS = [
  { label: 'All', value: '' },
  { label: 'Database', value: 'database' },
  { label: 'Web', value: 'web' },
  { label: 'Not Found', value: 'not_found' },
];

function SourceBadge({ source }) {
  const styles = {
    database: 'bg-green-100 text-green-700',
    web:      'bg-blue-100 text-blue-700',
    not_found:'bg-red-100 text-red-700',
  };
  const labels = { database: 'Database', web: 'Web', not_found: 'Not Found' };
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${styles[source] || 'bg-slate-100 text-slate-600'}`}>
      {labels[source] || source || '—'}
    </span>
  );
}

export default function AdminSearchLogs() {
  const [logs, setLogs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [sourceFilter, setSourceFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const fetchLogs = useCallback(() => {
    setLoading(true);
    adminSearchLogsApi.get({ source: sourceFilter || undefined, page, limit: 25 })
      .then(res => {
        setLogs(res.data.data);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to load logs'))
      .finally(() => setLoading(false));
  }, [sourceFilter, page]);

  useEffect(() => { fetchLogs(); }, [fetchLogs]);

  return (
    <div className="p-8">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-slate-800">Search Logs</h1>
        <p className="text-sm text-slate-500 mt-1">{total} total queries — <span className="text-red-500 font-medium">red rows = not found (needs manual input)</span></p>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />{error}
        </div>
      )}

      {/* Source filter tabs */}
      <div className="flex gap-1 mb-4">
        {SOURCE_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setSourceFilter(tab.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              sourceFilter === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Doctor</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Drug Searched</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Result Source</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Confidence</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {logs.map(log => (
                <tr
                  key={log._id}
                  className={`transition-colors ${log.resultSource === 'not_found' ? 'bg-red-50 hover:bg-red-100' : 'hover:bg-slate-50'}`}
                >
                  <td className="px-4 py-3">
                    <p className="font-medium text-slate-800">
                      {log.userId ? `${log.userId.firstName} ${log.userId.lastName}` : 'Unknown'}
                    </p>
                    <p className="text-xs text-slate-400">{log.userId?.email || ''}</p>
                    {log.userId?.specialty && (
                      <p className="text-xs text-slate-400">{log.userId.specialty}</p>
                    )}
                  </td>
                  <td className="px-4 py-3 font-medium text-slate-700">
                    {log.drugMentioned || <span className="text-slate-300">—</span>}
                  </td>
                  <td className="px-4 py-3">
                    <SourceBadge source={log.resultSource} />
                  </td>
                  <td className="px-4 py-3 text-slate-600">
                    {log.agentResponse?.confidenceScore != null
                      ? `${Math.round(log.agentResponse.confidenceScore * 100)}%`
                      : '—'}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {new Date(log.createdAt).toLocaleString()}
                  </td>
                </tr>
              ))}
              {!logs.length && (
                <tr>
                  <td colSpan={5} className="px-4 py-10 text-center text-slate-400 text-sm">No search logs found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="p-2 border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
