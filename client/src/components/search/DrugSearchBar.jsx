import { useState, useRef, useEffect } from 'react';
import { Search, X } from 'lucide-react';
import SearchSuggestions from './SearchSuggestions';
import { useSearch } from '../../hooks/useSearch';

export default function DrugSearchBar({ onSubmit, placeholder = 'Ask about any specialty drug...', large = false }) {
  const [query, setQuery] = useState('');
  const [showSuggestions, setShowSuggestions] = useState(false);
  const { suggestions, isSearching, handleSearch } = useSearch();
  const inputRef = useRef(null);
  const containerRef = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (containerRef.current && !containerRef.current.contains(e.target)) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  const handleChange = (e) => {
    const val = e.target.value;
    setQuery(val);
    handleSearch(val);
    setShowSuggestions(val.length >= 2);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (query.trim()) {
      setShowSuggestions(false);
      onSubmit(query.trim());
    }
  };

  const selectSuggestion = (drug) => {
    const q = `How do I prescribe ${drug.brandName} (${drug.genericName})?`;
    setQuery(q);
    setShowSuggestions(false);
    onSubmit(q);
  };

  const inputClass = large
    ? 'w-full pl-5 pr-12 py-4 text-base rounded-xl border-2 border-slate-200 focus:border-accent-500 focus:outline-none shadow-sm'
    : 'w-full pl-4 pr-10 py-2.5 text-sm rounded-lg border border-slate-200 focus:border-accent-500 focus:outline-none';

  return (
    <div ref={containerRef} className="relative w-full">
      <form onSubmit={handleSubmit}>
        <div className="relative">
          <Search className={`absolute left-${large ? '4' : '3'} top-1/2 -translate-y-1/2 text-slate-400 ${large ? 'w-5 h-5' : 'w-4 h-4'}`} />
          <input
            ref={inputRef}
            type="text"
            value={query}
            onChange={handleChange}
            onFocus={() => query.length >= 2 && setShowSuggestions(true)}
            placeholder={placeholder}
            className={`${inputClass} ${large ? 'pl-12' : 'pl-10'}`}
          />
          {query && (
            <button
              type="button"
              onClick={() => { setQuery(''); setShowSuggestions(false); }}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600"
            >
              <X className="w-4 h-4" />
            </button>
          )}
        </div>
      </form>

      {showSuggestions && (
        <SearchSuggestions
          suggestions={suggestions}
          isLoading={isSearching}
          onSelect={selectSuggestion}
        />
      )}
    </div>
  );
}
