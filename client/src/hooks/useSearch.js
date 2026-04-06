import { useState, useCallback } from 'react';
import { useQuery } from '@tanstack/react-query';
import { drugsApi } from '../services/api';

export function useSearch() {
  const [searchTerm, setSearchTerm] = useState('');
  const [debouncedTerm, setDebouncedTerm] = useState('');

  const { data, isLoading } = useQuery({
    queryKey: ['drug-search', debouncedTerm],
    queryFn: () => drugsApi.search(debouncedTerm).then(r => r.data.data),
    enabled: debouncedTerm.length >= 2,
    staleTime: 30000
  });

  const handleSearch = useCallback((value) => {
    setSearchTerm(value);
    const timer = setTimeout(() => setDebouncedTerm(value), 300);
    return () => clearTimeout(timer);
  }, []);

  return {
    searchTerm,
    suggestions: data || [],
    isSearching: isLoading,
    handleSearch,
    setSearchTerm
  };
}
