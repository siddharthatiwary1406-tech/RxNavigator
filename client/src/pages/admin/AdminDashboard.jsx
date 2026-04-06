import { useEffect, useState } from 'react';
import { adminAnalyticsApi } from '../../services/adminApi';
import { Activity, Users, Pill, Clock, TrendingUp, Wrench } from 'lucide-react';

function StatCard({ icon: Icon, label, value, sub, color = 'accent' }) {
  const colors = {
    accent: 'bg-accent-50 text-accent-700 border-accent-200',
    blue: 'bg-blue-50 text-blue-700 border-blue-200',
    amber: 'bg-amber-50 text-amber-700 border-amber-200',
    green: 'bg-green-50 text-green-700 border-green-200'
  };
  return (
    <div className={`rounded-xl border p-5 ${colors[color]}`}>
      <div className="flex items-center gap-3 mb-2">
        <Icon className="w-5 h-5 opacity-70" />
        <span className="text-sm font-medium opacity-70">{label}</span>
      </div>
      <p className="text-3xl font-bold">{value}</p>
      {sub && <p className="text-xs mt-1 opacity-60">{sub}</p>}
    </div>
  );
}

function BarChart({ data, labelKey = '_id', valueKey = 'count', title }) {
  if (!data?.length) return <p className="text-sm text-slate-400 py-4">No data yet</p>;
  const max = Math.max(...data.map(d => d[valueKey]));
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-600 mb-3">{title}</h3>
      <div className="space-y-2">
        {data.map((d, i) => (
          <div key={i} className="flex items-center gap-3">
            <span className="text-xs text-slate-500 w-28 shrink-0 truncate">{d[labelKey] || 'Unknown'}</span>
            <div className="flex-1 bg-slate-100 rounded-full h-5 overflow-hidden">
              <div
                className="h-5 bg-accent-500 rounded-full transition-all"
                style={{ width: `${Math.max(4, (d[valueKey] / max) * 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-slate-600 w-6 text-right">{d[valueKey]}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

function QueriesChart({ data }) {
  if (!data?.length) return <p className="text-sm text-slate-400 py-4">No query data yet</p>;
  const max = Math.max(...data.map(d => d.count));
  return (
    <div>
      <h3 className="text-sm font-semibold text-slate-600 mb-3">Queries per Day (Last 30 Days)</h3>
      <div className="flex items-end gap-1 h-32">
        {data.map((d, i) => (
          <div key={i} className="flex-1 flex flex-col items-center gap-1 group relative">
            <div
              className="w-full bg-accent-500 rounded-t hover:bg-accent-600 transition-colors"
              style={{ height: `${Math.max(4, (d.count / max) * 112)}px` }}
            />
            <div className="absolute bottom-full mb-1 hidden group-hover:block bg-slate-800 text-white text-xs px-2 py-1 rounded whitespace-nowrap">
              {d._id}: {d.count}
            </div>
          </div>
        ))}
      </div>
      <div className="flex justify-between mt-1">
        <span className="text-xs text-slate-400">{data[0]?._id}</span>
        <span className="text-xs text-slate-400">{data[data.length - 1]?._id}</span>
      </div>
    </div>
  );
}

export default function AdminDashboard() {
  const [analytics, setAnalytics] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    adminAnalyticsApi.get()
      .then(res => setAnalytics(res.data.data))
      .catch(err => setError(err.response?.data?.error || 'Failed to load analytics'))
      .finally(() => setLoading(false));
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center h-64">
      <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
    </div>
  );

  if (error) return (
    <div className="p-8">
      <div className="bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">{error}</div>
    </div>
  );

  const { summary, queriesPerDay, topDrugs, toolUsage } = analytics;

  return (
    <div className="p-8 space-y-8">
      <div>
        <h1 className="text-2xl font-bold text-slate-800">Admin Dashboard</h1>
        <p className="text-sm text-slate-500 mt-1">Usage analytics and system overview</p>
      </div>

      {/* Summary cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        <StatCard icon={Activity} label="Total Queries" value={summary.totalQueries.toLocaleString()} color="accent" />
        <StatCard icon={Users} label="Total Users" value={summary.totalUsers} sub={`${summary.adminCount} admin(s)`} color="blue" />
        <StatCard icon={Pill} label="Drugs in DB" value={summary.totalDrugs} color="green" />
        <StatCard icon={TrendingUp} label="Avg Confidence" value={`${(summary.avgConfidence * 100).toFixed(0)}%`} color="amber" />
      </div>

      <div className="grid grid-cols-2 gap-4">
        <StatCard icon={Clock} label="Avg Response Time" value={`${(summary.avgResponseTimeMs / 1000).toFixed(1)}s`} color="blue" />
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <QueriesChart data={queriesPerDay} />
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6">
          <BarChart data={topDrugs} labelKey="_id" valueKey="count" title="Top Searched Drugs" />
        </div>
      </div>

      {/* Tool usage */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <div className="flex items-center gap-2 mb-4">
          <Wrench className="w-4 h-4 text-slate-500" />
          <h2 className="text-sm font-semibold text-slate-700">Agent Tool Usage</h2>
        </div>
        <BarChart data={toolUsage} labelKey="_id" valueKey="count" title="" />
      </div>
    </div>
  );
}
