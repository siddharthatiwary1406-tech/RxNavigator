import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import { Plus, Building2, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp } from 'lucide-react';

function StatusBadge({ status }) {
  const styles = {
    approved: 'bg-green-100 text-green-700',
    pending:  'bg-amber-100 text-amber-700',
    rejected: 'bg-red-100 text-red-700',
  };
  const icons = {
    approved: <CheckCircle className="w-3 h-3" />,
    pending:  <Clock className="w-3 h-3" />,
    rejected: <XCircle className="w-3 h-3" />,
  };
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${styles[status] || 'bg-slate-100 text-slate-600'}`}>
      {icons[status]} {status}
    </span>
  );
}

const emptyForm = {
  brandName: '', genericName: '', manufacturer: '', therapeuticArea: '',
  indication: '', prescribingSteps: '', hasREMS: false
};

export default function PharmaPortal() {
  const { user } = useAuth();
  const [submissions, setSubmissions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState(emptyForm);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  const fetchSubmissions = () => {
    setLoading(true);
    api.get('/pharma/drugs')
      .then(res => setSubmissions(res.data.data))
      .catch(() => setError('Failed to load submissions'))
      .finally(() => setLoading(false));
  };

  useEffect(() => { fetchSubmissions(); }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setSaving(true);
    setError(null);
    try {
      const payload = {
        ...form,
        indication: form.indication ? form.indication.split('\n').filter(Boolean) : [],
        prescribingSteps: form.prescribingSteps ? form.prescribingSteps.split('\n').filter(Boolean) : [],
      };
      await api.post('/pharma/drugs', payload);
      setSuccess('Drug submitted successfully! It will be reviewed by our admin team.');
      setForm(emptyForm);
      setShowForm(false);
      fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.error || 'Submission failed');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex items-start justify-between mb-8">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <Building2 className="w-7 h-7 text-primary-600" />
            <h1 className="text-2xl font-bold text-slate-800">Pharma Portal</h1>
          </div>
          <p className="text-slate-500 text-sm">
            Welcome, <span className="font-medium">{user?.companyName || user?.firstName}</span>. Submit drug information for review and approval.
          </p>
        </div>
        <button
          onClick={() => setShowForm(v => !v)}
          className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors"
        >
          <Plus className="w-4 h-4" />
          {showForm ? 'Cancel' : 'Submit Drug'}
          {showForm ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
        </button>
      </div>

      {/* Info banner */}
      <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 text-sm text-blue-700 mb-6">
        <p className="font-medium mb-1">How submissions work</p>
        <p className="text-xs text-blue-600">Drug submissions start as <strong>Pending</strong> and are reviewed by our clinical team. Once <strong>Approved</strong>, the drug becomes searchable by healthcare providers. You can resubmit rejected drugs after making corrections.</p>
      </div>

      {success && (
        <div className="mb-4 bg-green-50 border border-green-200 rounded-xl p-4 text-green-700 text-sm flex items-center gap-2">
          <CheckCircle className="w-4 h-4 shrink-0" />{success}
          <button onClick={() => setSuccess(null)} className="ml-auto text-green-500 hover:text-green-700">✕</button>
        </div>
      )}

      {error && (
        <div className="mb-4 bg-red-50 border border-red-200 rounded-xl p-4 text-red-700 text-sm">
          {error}
          <button onClick={() => setError(null)} className="ml-2 underline">Dismiss</button>
        </div>
      )}

      {/* Submit Form */}
      {showForm && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 mb-6">
          <h2 className="text-lg font-semibold text-slate-800 mb-4">Submit New Drug</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Brand Name <span className="text-red-500">*</span></label>
                <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" value={form.brandName} onChange={e => setForm(f => ({ ...f, brandName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Generic Name <span className="text-red-500">*</span></label>
                <input required className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" value={form.genericName} onChange={e => setForm(f => ({ ...f, genericName: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Manufacturer</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" value={form.manufacturer} onChange={e => setForm(f => ({ ...f, manufacturer: e.target.value }))} />
              </div>
              <div>
                <label className="block text-xs font-medium text-slate-600 mb-1">Therapeutic Area</label>
                <input className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" value={form.therapeuticArea} onChange={e => setForm(f => ({ ...f, therapeuticArea: e.target.value }))} />
              </div>
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Indications (one per line)</label>
              <textarea rows={3} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" value={form.indication} onChange={e => setForm(f => ({ ...f, indication: e.target.value }))} placeholder="Moderate-to-severe plaque psoriasis&#10;Atopic dermatitis" />
            </div>
            <div>
              <label className="block text-xs font-medium text-slate-600 mb-1">Prescribing Steps (one per line)</label>
              <textarea rows={4} className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400" value={form.prescribingSteps} onChange={e => setForm(f => ({ ...f, prescribingSteps: e.target.value }))} placeholder="Step 1: Confirm diagnosis&#10;Step 2: Check contraindications" />
            </div>
            <div className="flex items-center gap-2">
              <input type="checkbox" id="hasREMS" checked={form.hasREMS} onChange={e => setForm(f => ({ ...f, hasREMS: e.target.checked }))} className="accent-amber-500" />
              <label htmlFor="hasREMS" className="text-sm text-slate-700">This drug has a REMS program</label>
            </div>
            <div className="flex gap-3 pt-2">
              <button type="submit" disabled={saving} className="px-4 py-2 bg-accent-500 text-white text-sm font-medium rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2">
                {saving && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
                Submit for Review
              </button>
              <button type="button" onClick={() => { setShowForm(false); setForm(emptyForm); }} className="px-4 py-2 border border-slate-300 text-slate-600 text-sm rounded-lg hover:bg-slate-50">Cancel</button>
            </div>
          </form>
        </div>
      )}

      {/* Submissions Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        <div className="px-5 py-3 border-b border-slate-100 bg-slate-50">
          <h2 className="text-sm font-semibold text-slate-700">My Submissions ({submissions.length})</h2>
        </div>
        {loading ? (
          <div className="flex items-center justify-center h-32">
            <div className="w-6 h-6 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : submissions.length === 0 ? (
          <p className="px-5 py-10 text-center text-slate-400 text-sm">No submissions yet. Click "Submit Drug" to get started.</p>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Brand Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Generic</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Therapeutic Area</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Submitted</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {submissions.map(drug => (
                <tr key={drug._id} className="hover:bg-slate-50">
                  <td className="px-4 py-3 font-medium text-slate-800">{drug.brandName}</td>
                  <td className="px-4 py-3 text-slate-500">{drug.genericName}</td>
                  <td className="px-4 py-3 text-slate-500">{drug.therapeuticArea || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={drug.status} /></td>
                  <td className="px-4 py-3 text-slate-400 text-xs">{new Date(drug.lastVerified).toLocaleDateString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
