import { useState, useCallback, useRef } from 'react';

export function useAgent() {
  const [messages, setMessages] = useState([]);
  const [toolCalls, setToolCalls] = useState([]);
  const [result, setResult] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);
  const abortRef = useRef(null);

  const query = useCallback(async (queryText) => {
    setIsLoading(true);
    setError(null);
    setResult(null);
    setToolCalls([]);

    const token = localStorage.getItem('token');

    try {
      const response = await fetch('/api/agent/query', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`
        },
        body: JSON.stringify({ query: queryText }),
        signal: abortRef.current?.signal
      });

      if (!response.ok) {
        const err = await response.json();
        throw new Error(err.error || 'Query failed');
      }

      const reader = response.body.getReader();
      const decoder = new TextDecoder();
      let buffer = '';

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;

        buffer += decoder.decode(value, { stream: true });
        const lines = buffer.split('\n');
        buffer = lines.pop();

        for (const line of lines) {
          if (line.startsWith('data: ')) {
            try {
              const event = JSON.parse(line.slice(6));
              handleEvent(event);
            } catch {
              // skip malformed lines
            }
          }
        }
      }
    } catch (err) {
      if (err.name !== 'AbortError') {
        setError(err.message);
      }
    } finally {
      setIsLoading(false);
    }
  }, []);

  const handleEvent = (event) => {
    switch (event.type) {
      case 'tool_call':
        setToolCalls(prev => {
          const existing = prev.findIndex(t => t.tool === event.tool && t.status === 'running');
          if (event.status === 'done' && existing !== -1) {
            return prev.map((t, i) => i === existing ? { ...t, status: 'done' } : t);
          }
          if (event.status === 'running') {
            return [...prev, { tool: event.tool, status: 'running', message: event.message }];
          }
          return prev;
        });
        break;
      case 'complete':
        setResult({ data: event.data, toolsUsed: event.toolsUsed, responseTimeMs: event.responseTimeMs });
        break;
      case 'error':
        setError(event.message);
        break;
    }
  };

  const reset = () => {
    setMessages([]);
    setToolCalls([]);
    setResult(null);
    setError(null);
    setIsLoading(false);
  };

  return { messages, toolCalls, result, isLoading, error, query, reset };
}
