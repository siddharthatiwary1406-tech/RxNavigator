import { CheckCircle, Loader2, AlertCircle } from 'lucide-react';
import { getToolLabel } from '../../utils/formatters';

export default function StreamingText({ toolCalls = [], isLoading, error }) {
  if (error) {
    return (
      <div className="flex items-start gap-2 bg-red-50 border border-red-200 rounded-lg p-3 text-sm">
        <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
        <p className="text-red-700">{error}</p>
      </div>
    );
  }

  if (!isLoading && toolCalls.length === 0) return null;

  return (
    <div className="space-y-2">
      {toolCalls.map((tc, index) => {
        const isDone = tc.status === 'done';
        return (
          <div
            key={index}
            className={`flex items-center gap-2.5 rounded-lg px-3 py-2 text-xs transition-all ${
              isDone
                ? 'bg-green-50 text-green-700'
                : 'bg-blue-50 text-blue-700'
            }`}
          >
            {isDone ? (
              <CheckCircle className="w-3.5 h-3.5 text-green-500 flex-shrink-0" />
            ) : (
              <Loader2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 animate-spin" />
            )}
            <span className="font-medium">
              {tc.message || getToolLabel(tc.tool)}
              {isDone ? '' : '...'}
            </span>
          </div>
        );
      })}

      {isLoading && toolCalls.length === 0 && (
        <div className="flex items-center gap-2.5 bg-blue-50 rounded-lg px-3 py-2 text-xs text-blue-700">
          <Loader2 className="w-3.5 h-3.5 text-blue-500 flex-shrink-0 animate-spin" />
          <span className="font-medium">Consulting the SpecialtyRx knowledge base...</span>
        </div>
      )}
    </div>
  );
}
