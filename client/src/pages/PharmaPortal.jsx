import { useState, useEffect } from 'react';
import { useAuth } from '../hooks/useAuth';
import api from '../services/api';
import {
  Plus, Building2, CheckCircle, Clock, XCircle, ChevronDown, ChevronUp,
  MessageSquare, Send, Trash2, Info
} from 'lucide-react';

const STATUS_STYLES = {
  approved:       'bg-green-100 text-green-700',
  pending:        'bg-amber-100 text-amber-700',
  rejected:       'bg-red-100 text-red-700',
  info_requested: 'bg-blue-100 text-blue-700',
};
const STATUS_ICONS = {
  approved:       <CheckCircle className="w-3 h-3" />,
  pending:        <Clock className="w-3 h-3" />,
  rejected:       <XCircle className="w-3 h-3" />,
  info_requested: <Info className="w-3 h-3" />,
};
const STATUS_LABELS = {
  approved: 'Approved',
  pending: 'Pending Review',
  rejected: 'Rejected',
  info_requested: 'More Info Requested',
};

function StatusBadge({ status }) {
  return (
    <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      {STATUS_ICONS[status]} {STATUS_LABELS[status] || status}
    </span>
  );
}

const emptyPharmacy = { name: '', phone: '', website: '' };

const emptyForm = {
  brandName: '', genericName: '', manufacturer: '', therapeuticArea: '',
  indication: '', prescribingSteps: '', hasREMS: false,
  specialtyPharmacies: [],
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
  const [expandedId, setExpandedId] = useState(null);
  const [replyText, setReplyText] = useState({});
  const [replying, setReplying] = useState(false);

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
        specialtyPharmacies: form.specialtyPharmacies.filter(p => p.name.trim()),
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

  const addPharmacy = () => {
    setForm(f => ({ ...f, specialtyPharmacies: [...f.specialtyPharmacies, { ...emptyPharmacy }] }));
  };

  const removePharmacy = (idx) => {
    setForm(f => ({ ...f, specialtyPharmacies: f.specialtyPharmacies.filter((_, i) => i !== idx) }));
  };

  const updatePharmacy = (idx, field, value) => {
    setForm(f => ({
      ...f,
      specialtyPharmacies: f.specialtyPharmacies.map((p, i) => i === idx ? { ...p, [field]: value } : p)
    }));
  };

  const handleReply = async (drugId) => {
    const message = replyText[drugId]?.trim();
    if (!message) return;
    setReplying(true);
    try {
      await api.post(`/pharma/drugs/${drugId}/respond`, { message });
      setReplyText(prev => ({ ...prev, [drugId]: '' }));
      setSuccess('Response sent. Admin will be notified.');
      fetchSubmissions();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send response');
    } finally {
      setReplying(false);
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
        <p className="text-xs text-blue-600">Drug submissions start as <strong>Pending</strong> and are reviewed by our clinical team. Once <strong>Approved</strong>, the drug becomes searchable by healthcare providers. If admin requests more information, you'll see a thread below your submission to respond.</p>
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

            {/* Specialty Pharmacies */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-xs font-medium text-slate-600">Specialty Pharmacies</label>
                <button type="button" onClick={addPharmacy} className="flex items-center gap-1 text-xs text-accent-600 hover:text-accent-700 font-medium">
                  <Plus className="w-3 h-3" /> Add Pharmacy
                </button>
              </div>
              {form.specialtyPharmacies.length === 0 && (
                <p className="text-xs text-slate-400 italic">No specialty pharmacies added. Click "Add Pharmacy" to include distribution partners.</p>
              )}
              <div className="space-y-2">
                {form.specialtyPharmacies.map((ph, idx) => (
                  <div key={idx} className="flex gap-2 items-start bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <div className="grid grid-cols-3 gap-2 flex-1">
                      <input
                        className="border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
                        placeholder="Pharmacy name *"
                        value={ph.name}
                        onChange={e => updatePharmacy(idx, 'name', e.target.value)}
                      />
                      <input
                        className="border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
                        placeholder="Phone"
                        value={ph.phone}
                        onChange={e => updatePharmacy(idx, 'phone', e.target.value)}
                      />
                      <input
                        className="border border-slate-300 rounded px-2 py-1.5 text-xs focus:outline-none focus:ring-1 focus:ring-accent-400"
                        placeholder="Website URL"
                        value={ph.website}
                        onChange={e => updatePharmacy(idx, 'website', e.target.value)}
                      />
                    </div>
                    <button type="button" onClick={() => removePharmacy(idx)} className="text-slate-400 hover:text-red-500 mt-1">
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
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
          <div className="divide-y divide-slate-100">
            {submissions.map(drug => {
              const isExpanded = expandedId === drug._id;
              const hasThread = drug.reviewMessages && drug.reviewMessages.length > 0;
              const needsResponse = drug.status === 'info_requested';

              return (
                <div key={drug._id}>
                  {/* Row */}
                  <div
                    className={`flex items-center gap-4 px-5 py-3.5 cursor-pointer hover:bg-slate-50 transition-colors ${needsResponse ? 'bg-blue-50/50' : ''}`}
                    onClick={() => setExpandedId(isExpanded ? null : drug._id)}
                  >
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <span className="font-medium text-slate-800 text-sm">{drug.brandName}</span>
                        {needsResponse && (
                          <span className="flex items-center gap-1 text-[10px] font-semibold text-blue-600 bg-blue-100 px-1.5 py-0.5 rounded">
                            <MessageSquare className="w-2.5 h-2.5" /> Response needed
                          </span>
                        )}
                        {hasThread && !needsResponse && (
                          <span className="text-[10px] text-slate-400">{drug.reviewMessages.length} message{drug.reviewMessages.length !== 1 ? 's' : ''}</span>
                        )}
                      </div>
                      <p className="text-xs text-slate-400 mt-0.5">
                        {drug.genericName}
                        {drug.therapeuticArea && <span> · {drug.therapeuticArea}</span>}
                      </p>
                    </div>
                    <div className="flex items-center gap-3 shrink-0">
                      <StatusBadge status={drug.status} />
                      <span className="text-xs text-slate-400">{new Date(drug.lastVerified).toLocaleDateString()}</span>
                      {isExpanded ? <ChevronUp className="w-4 h-4 text-slate-400" /> : <ChevronDown className="w-4 h-4 text-slate-400" />}
                    </div>
                  </div>

                  {/* Expanded thread */}
                  {isExpanded && (
                    <div className="px-5 pb-4 bg-slate-50/80 border-t border-slate-100">
                      {/* Thread */}
                      {hasThread && (
                        <div className="space-y-2 pt-3 mb-3">
                          <p className="text-xs font-semibold text-slate-500 uppercase tracking-wide mb-2">Review Thread</p>
                          {drug.reviewMessages.map((msg, i) => (
                            <div key={i} className={`flex ${msg.from === 'pharma' ? 'justify-end' : 'justify-start'}`}>
                              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                                msg.from === 'pharma'
                                  ? 'bg-accent-500 text-white rounded-br-sm'
                                  : 'bg-white border border-slate-200 text-slate-800 rounded-bl-sm'
                              }`}>
                                <p className="leading-relaxed">{msg.message}</p>
                                <p className={`text-[10px] mt-1 ${msg.from === 'pharma' ? 'text-accent-100' : 'text-slate-400'}`}>
                                  {msg.from === 'pharma' ? 'You' : 'Admin'} · {new Date(msg.createdAt).toLocaleString()}
                                </p>
                              </div>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Response input — only when info_requested */}
                      {needsResponse && (
                        <div className="mt-3">
                          <p className="text-xs text-blue-700 font-medium mb-2">Admin has requested more information. Please respond below:</p>
                          <div className="flex gap-2">
                            <textarea
                              rows={3}
                              className="flex-1 border border-blue-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400 resize-none bg-white"
                              placeholder="Type your response here..."
                              value={replyText[drug._id] || ''}
                              onChange={e => setReplyText(prev => ({ ...prev, [drug._id]: e.target.value }))}
                            />
                            <button
                              onClick={() => handleReply(drug._id)}
                              disabled={replying || !replyText[drug._id]?.trim()}
                              className="self-end p-2.5 bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-40 transition-colors"
                            >
                              {replying
                                ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                : <Send className="w-4 h-4" />}
                            </button>
                          </div>
                        </div>
                      )}

                      {!hasThread && !needsResponse && (
                        <p className="text-xs text-slate-400 pt-3 text-center">No admin messages yet. You'll be notified if more information is needed.</p>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
