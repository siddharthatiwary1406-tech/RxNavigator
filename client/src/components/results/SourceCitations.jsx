import { ExternalLink, Calendar, BookOpen } from 'lucide-react';
import { formatDate } from '../../utils/formatters';

export default function SourceCitations({ sources, lastVerified }) {
  return (
    <div className="space-y-3">
      {/* Last verified date */}
      {lastVerified && (
        <div className="flex items-center gap-2 text-xs text-slate-500">
          <Calendar className="w-3.5 h-3.5" />
          <span>Last verified: <span className="font-medium text-slate-600">{formatDate(lastVerified)}</span></span>
        </div>
      )}

      {/* Sources list */}
      {sources && sources.length > 0 ? (
        <div>
          <div className="flex items-center gap-1.5 mb-2">
            <BookOpen className="w-3.5 h-3.5 text-slate-400" />
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wide">Sources</span>
          </div>
          <ul className="space-y-1.5">
            {sources.map((source, index) => (
              <li key={index} className="flex items-start gap-2">
                <span className="text-xs text-slate-400 mt-0.5 flex-shrink-0">{index + 1}.</span>
                {source.startsWith('http') ? (
                  <a
                    href={source}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs text-accent-500 hover:text-accent-600 hover:underline flex items-center gap-1 break-all"
                  >
                    {source}
                    <ExternalLink className="w-3 h-3 flex-shrink-0" />
                  </a>
                ) : (
                  <span className="text-xs text-slate-600 leading-relaxed">{source}</span>
                )}
              </li>
            ))}
          </ul>
        </div>
      ) : (
        <p className="text-xs text-slate-400">No sources available.</p>
      )}
    </div>
  );
}
