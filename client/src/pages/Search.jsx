import { useEffect, useRef } from 'react';
import { useSearchParams } from 'react-router-dom';
import { SearchIcon, Sparkles } from 'lucide-react';
import DrugSearchBar from '../components/search/DrugSearchBar';
import ChatInterface from '../components/chat/ChatInterface';
import AnswerCard from '../components/results/AnswerCard';
import { useAgent } from '../hooks/useAgent';

export default function Search() {
  const { toolCalls, result, isLoading, error, query: agentQuery, reset } = useAgent();
  const [searchParams] = useSearchParams();
  const initialQueryHandled = useRef(false);
  const currentQueryRef = useRef('');

  // If navigated with ?q= (e.g. from Home page category cards), fire the query once
  useEffect(() => {
    const q = searchParams.get('q');
    if (q && !initialQueryHandled.current) {
      initialQueryHandled.current = true;
      currentQueryRef.current = q;
      agentQuery(q);
    }
  }, [searchParams, agentQuery]);

  const handleQuery = (text) => {
    currentQueryRef.current = text;
    agentQuery(text);
  };

  return (
    <div className="h-[calc(100vh-64px)] flex flex-col lg:flex-row overflow-hidden bg-slate-50">
      {/* Left panel — chat */}
      <div className="w-full lg:w-1/3 flex-shrink-0 flex flex-col p-4 lg:p-5 h-64 lg:h-full">
        <ChatInterface
          onQuery={handleQuery}
          toolCalls={toolCalls}
          isLoading={isLoading}
          error={error}
          currentQuery={currentQueryRef.current}
        />
      </div>

      {/* Right panel — results */}
      <div className="flex-1 overflow-y-auto p-4 lg:p-5 flex flex-col gap-5">
        {/* Top search bar for the right panel */}
        <div className="max-w-2xl">
          <DrugSearchBar
            onSubmit={handleQuery}
            placeholder="Search a drug or ask a prescribing question..."
          />
        </div>

        {/* Result or placeholder */}
        {result ? (
          <div className="max-w-3xl">
            <AnswerCard result={result} queryId={result.queryId} />
          </div>
        ) : !isLoading && !error ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center py-16 max-w-md mx-auto">
            <div className="w-16 h-16 rounded-2xl bg-primary-600/10 flex items-center justify-center mb-4">
              <Sparkles className="w-8 h-8 text-primary-600" />
            </div>
            <h2 className="text-lg font-semibold text-primary-600 mb-2">Ask about any specialty drug</h2>
            <p className="text-slate-500 text-sm leading-relaxed mb-6">
              Get instant answers on prescribing steps, REMS requirements, prior authorization,
              and specialty pharmacy options.
            </p>
            <div className="w-full">
              <DrugSearchBar
                onSubmit={handleQuery}
                placeholder="e.g. How do I prescribe Humira?"
                large
              />
            </div>
            <div className="mt-6 flex flex-wrap gap-2 justify-center">
              {[
                'Ocrevus REMS requirements',
                'Prescribing Enbrel',
                'Sprycel prior auth',
                'Humira specialty pharmacy',
              ].map(suggestion => (
                <button
                  key={suggestion}
                  onClick={() => handleQuery(suggestion)}
                  className="text-xs bg-white border border-slate-200 text-slate-600 hover:border-accent-400 hover:text-accent-500 px-3 py-1.5 rounded-full transition-colors"
                >
                  {suggestion}
                </button>
              ))}
            </div>
          </div>
        ) : null}

        {/* Error state in right panel */}
        {error && !isLoading && (
          <div className="max-w-md bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700 flex items-start gap-3">
            <Search className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Search failed</p>
              <p>{error}</p>
              <button
                onClick={reset}
                className="mt-3 text-xs underline text-red-600 hover:text-red-800"
              >
                Try again
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
