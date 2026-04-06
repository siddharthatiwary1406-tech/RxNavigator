import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Clock, ChevronDown, ChevronUp, Search, Wrench, AlertCircle } from 'lucide-react';
import { historyApi } from '../services/api';
import { formatDate, formatConfidence } from '../utils/formatters';
import AnswerCard from '../components/results/AnswerCard';

const confidenceBadge = (score) => {
  const { label, color } = formatConfidence(score);
  const colorMap = {
    green: 'bg-green-100 text-green-700',
    yellow: 'bg-yellow-100 text-yellow-700',
    orange: 'bg-orange-100 text-orange-700',
    red: 'bg-red-100 text-red-700',
    gray: 'bg-slate-100 text-slate-500',
  };
  return (
    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${colorMap[color] || colorMap.gray}`}>
      {label}
    </span>
  );
};

function HistoryItem({ item }) {
  const [expanded, setExpanded] = useState(false);
  const navigate = useNavigate();

  const tools = item.toolsUsed || [];

  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      {/* Summary row */}
      <button
        onClick={() => setExpanded(v => !v)}
        className="w-full flex items-start gap-3 px-5 py-4 text-left hover:bg-slate-50 transition-colors"
      >
        <Search className="w-4 h-4 text-slate-400 flex-shrink-0 mt-1" />
        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium text-primary-600 truncate">{item.query}</p>
          <div className="flex flex-wrap items-center gap-2 mt-1.5">
            <span className="flex items-center gap-1 text-xs text-slate-400">
              <Clock className="w-3 h-3" />
              {formatDate(item.createdAt)}
            </span>
            {item.confidenceScore != null && confidenceBadge(item.confidenceScore)}
            {tools.length > 0 && (
              <span className="flex items-center gap-1 text-xs text-slate-400">
                <Wrench className="w-3 h-3" />
                {tools.length} tool{tools.length !== 1 ? 's' : ''}
              </span>
            )}
          </div>
          {tools.length > 0 && (
            <div className="flex flex-wrap gap-1 mt-2">
              {tools.map(t => (
                <span
                  key={t}
                  className="text-xs bg-slate-100 text-slate-600 px-1.5 py-0.5 rounded"
                >
                  {t}
                </span>
              ))}
            </div>
          )}
        </div>
        <div className="flex-shrink-0 text-slate-400">
          {expanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </div>
      </button>

      {/* Expanded result */}
      {expanded && item.result && (
        <div className="border-t border-slate-100 p-4">
          <AnswerCard
            result={{ data: item.result, toolsUsed: item.toolsUsed, responseTimeMs: item.responseTimeMs }}
            queryId={item._id}
          />
        </div>
      )}
    </div>
  );
}

export default function History() {
  const [queries, setQueries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    historyApi.getAll()
      .then(res => setQueries(res.data.queries || []))
      .catch(err => setError(err.response?.data?.message || 'Failed to load history.'))
      .finally(() => setLoading(false));
  }, []);

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="flex items-center gap-3 mb-6">
        <Clock className="w-5 h-5 text-primary-600" />
        <h1 className="text-xl font-bold text-primary-600">Query History</h1>
      </div>

      {loading && (
        <div className="flex justify-center py-16">
          <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>
      )}

      {error && !loading && (
        <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-xl p-4 text-sm text-red-700">
          <AlertCircle className="w-4 h-4 flex-shrink-0 mt-0.5 text-red-500" />
          {error}
        </div>
      )}

      {!loading && !error && queries.length === 0 && (
        <div className="text-center py-16 text-slate-400">
          <Search className="w-10 h-10 mx-auto mb-3 text-slate-300" />
          <p className="text-sm font-medium text-slate-500">No queries yet</p>
          <p className="text-xs mt-1">Your search history will appear here.</p>
        </div>
      )}

      {!loading && queries.length > 0 && (
        <div className="space-y-3">
          {queries.map(item => (
            <HistoryItem key={item._id} item={item} />
          ))}
        </div>
      )}
    </div>
  );
}
