import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {
  Syringe, Dna, Stethoscope, Brain, Microscope, Activity,
  Search, ArrowRight, Clock, ChevronRight
} from 'lucide-react';
import Layout from '../components/layout/Layout';
import DrugSearchBar from '../components/search/DrugSearchBar';
import { useAuth } from '../context/AuthContext';
import { historyApi } from '../services/api';
import { formatDate, formatConfidence } from '../utils/formatters';

const CATEGORIES = [
  {
    label: 'Oncology',
    icon: Dna,
    query: 'How do I prescribe specialty oncology drugs?',
    color: 'bg-purple-50 text-purple-700 border-purple-200 hover:bg-purple-100',
  },
  {
    label: 'Rheumatology',
    icon: Activity,
    query: 'REMS and prescribing requirements for rheumatology biologics',
    color: 'bg-blue-50 text-blue-700 border-blue-200 hover:bg-blue-100',
  },
  {
    label: 'Dermatology',
    icon: Stethoscope,
    query: 'Specialty dermatology drugs prescribing steps',
    color: 'bg-pink-50 text-pink-700 border-pink-200 hover:bg-pink-100',
  },
  {
    label: 'Neurology',
    icon: Brain,
    query: 'Neurology specialty drugs prior authorization requirements',
    color: 'bg-indigo-50 text-indigo-700 border-indigo-200 hover:bg-indigo-100',
  },
  {
    label: 'Rare Disease',
    icon: Microscope,
    query: 'Rare disease orphan drug prescribing requirements',
    color: 'bg-teal-50 text-teal-700 border-teal-200 hover:bg-teal-100',
  },
];

export default function Home() {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [recentQueries, setRecentQueries] = useState([]);

  useEffect(() => {
    if (user) {
      historyApi.getAll()
        .then(res => setRecentQueries((res.data.queries || []).slice(0, 5)))
        .catch(() => {});
    }
  }, [user]);

  const handleSearch = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  const handleCategoryClick = (query) => {
    navigate(`/search?q=${encodeURIComponent(query)}`);
  };

  return (
    <Layout>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary-600 to-primary-700 text-white pt-20 pb-24 px-4">
        <div className="max-w-3xl mx-auto text-center">
          <div className="inline-flex items-center gap-2 bg-white/10 text-white text-xs font-medium px-3 py-1.5 rounded-full mb-6">
            <Syringe className="w-3.5 h-3.5" />
            For Licensed Healthcare Providers
          </div>

          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold leading-tight mb-4">
            Know exactly how to prescribe{' '}
            <span className="text-accent-400">any specialty drug</span>
          </h1>

          <p className="text-primary-100 text-base sm:text-lg mb-10 max-w-xl mx-auto leading-relaxed">
            Instant AI-powered answers on REMS requirements, prior authorization, specialty pharmacies,
            and step-by-step prescribing guidance — all in one place.
          </p>

          {/* Search bar */}
          <div className="max-w-2xl mx-auto">
            <DrugSearchBar
              onSubmit={handleSearch}
              placeholder="Ask about any specialty drug... e.g. 'How do I prescribe Ocrevus?'"
              large
            />
          </div>

          <p className="text-primary-200 text-xs mt-4">
            Powered by FDA data, REMS databases, and real-time web search
          </p>
        </div>
      </section>

      {/* Feature blurb */}
      <section className="bg-white border-b border-slate-100 py-8 px-4">
        <div className="max-w-4xl mx-auto grid grid-cols-1 sm:grid-cols-3 gap-6 text-center">
          {[
            { icon: Search, title: 'Prescribing Steps', desc: 'Numbered step-by-step guidance for any specialty drug' },
            { icon: Activity, title: 'REMS & PA Checks', desc: 'Instantly surface REMS requirements and prior auth criteria' },
            { icon: Stethoscope, title: 'Specialty Pharmacies', desc: 'Find dispensing pharmacies by state and payer' },
          ].map(({ icon: Icon, title, desc }) => (
            <div key={title} className="flex flex-col items-center gap-2 px-4">
              <div className="w-10 h-10 rounded-xl bg-accent-500/10 flex items-center justify-center">
                <Icon className="w-5 h-5 text-accent-500" />
              </div>
              <p className="font-semibold text-primary-600 text-sm">{title}</p>
              <p className="text-xs text-slate-500 leading-relaxed">{desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Category quick-access */}
      <section className="py-12 px-4 bg-slate-50">
        <div className="max-w-4xl mx-auto">
          <h2 className="text-lg font-semibold text-primary-600 mb-5 text-center">Browse by Specialty</h2>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3">
            {CATEGORIES.map(({ label, icon: Icon, query, color }) => (
              <button
                key={label}
                onClick={() => handleCategoryClick(query)}
                className={`flex flex-col items-center gap-2 border rounded-xl px-3 py-4 text-sm font-medium transition-colors ${color}`}
              >
                <Icon className="w-6 h-6" />
                {label}
                <ChevronRight className="w-3.5 h-3.5 opacity-60" />
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Recent queries (logged-in users only) */}
      {user && recentQueries.length > 0 && (
        <section className="py-10 px-4 bg-white border-t border-slate-100">
          <div className="max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-primary-600 flex items-center gap-2">
                <Clock className="w-4 h-4" /> Recent Queries
              </h2>
              <button
                onClick={() => navigate('/history')}
                className="text-xs text-accent-500 hover:text-accent-600 flex items-center gap-1"
              >
                View all <ArrowRight className="w-3 h-3" />
              </button>
            </div>
            <ul className="space-y-2">
              {recentQueries.map((q) => {
                const conf = formatConfidence(q.confidenceScore);
                return (
                  <li key={q._id}>
                    <button
                      onClick={() => navigate(`/search?q=${encodeURIComponent(q.query)}`)}
                      className="w-full flex items-center gap-3 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-4 py-3 text-left transition-colors group"
                    >
                      <Search className="w-4 h-4 text-slate-400 flex-shrink-0" />
                      <span className="flex-1 text-sm text-slate-700 truncate">{q.query}</span>
                      {q.confidenceScore != null && (
                        <span className={`text-xs font-medium px-2 py-0.5 rounded-full bg-${conf.color}-100 text-${conf.color}-700 flex-shrink-0`}>
                          {conf.label}
                        </span>
                      )}
                      <span className="text-xs text-slate-400 flex-shrink-0">{formatDate(q.createdAt)}</span>
                      <ArrowRight className="w-3.5 h-3.5 text-slate-300 group-hover:text-accent-500 transition-colors" />
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </section>
      )}

      {/* CTA for non-logged-in */}
      {!user && (
        <section className="py-14 px-4 bg-white border-t border-slate-100 text-center">
          <h2 className="text-xl font-bold text-primary-600 mb-3">Ready to get started?</h2>
          <p className="text-slate-500 text-sm mb-6 max-w-md mx-auto">
            Create a free account to save your query history and get personalized prescribing guidance.
          </p>
          <div className="flex items-center justify-center gap-3 flex-wrap">
            <button
              onClick={() => navigate('/register')}
              className="bg-primary-600 hover:bg-primary-700 text-white text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Create Free Account
            </button>
            <button
              onClick={() => navigate('/login')}
              className="border border-primary-600 text-primary-600 hover:bg-primary-50 text-sm font-semibold px-6 py-2.5 rounded-lg transition-colors"
            >
              Sign In
            </button>
          </div>
        </section>
      )}
    </Layout>
  );
}
