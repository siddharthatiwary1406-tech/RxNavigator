import { useState } from 'react';
import { ThumbsUp, ThumbsDown, Flag } from 'lucide-react';
import { feedbackApi } from '../../services/api';

export default function FeedbackButtons({ queryId }) {
  const [submitted, setSubmitted] = useState(false);
  const [selected, setSelected] = useState(null);

  const submit = async (rating, flaggedOutdated = false) => {
    if (!queryId || submitted) return;
    setSelected(rating);
    try {
      await feedbackApi.submit({ queryId, rating, flaggedOutdated });
      setSubmitted(true);
    } catch {
      setSelected(null);
    }
  };

  if (submitted) {
    return <span className="text-xs text-slate-400">Thanks for your feedback!</span>;
  }

  return (
    <div className="flex items-center gap-2 text-slate-500">
      <span className="text-xs mr-1">Was this helpful?</span>
      <button
        onClick={() => submit('up')}
        className={`p-1 rounded hover:text-green-600 transition-colors ${selected === 'up' ? 'text-green-600' : ''}`}
        title="Helpful"
      >
        <ThumbsUp className="w-4 h-4" />
      </button>
      <button
        onClick={() => submit('down')}
        className={`p-1 rounded hover:text-red-500 transition-colors ${selected === 'down' ? 'text-red-500' : ''}`}
        title="Not helpful"
      >
        <ThumbsDown className="w-4 h-4" />
      </button>
      <button
        onClick={() => submit('down', true)}
        className="p-1 rounded hover:text-amber-500 transition-colors ml-2 text-xs flex items-center gap-1"
        title="Flag as outdated"
      >
        <Flag className="w-3 h-3" /> Outdated
      </button>
    </div>
  );
}
