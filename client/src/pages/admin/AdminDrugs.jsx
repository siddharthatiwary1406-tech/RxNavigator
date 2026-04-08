import { useEffect, useState, useCallback } from 'react';
import { adminDrugsApi } from '../../services/adminApi';
import DrugForm from './DrugForm';
import {
  Plus, Pencil, Trash2, X, Search, ChevronLeft, ChevronRight,
  AlertTriangle, CheckCircle, XCircle, MessageSquare, Send
} from 'lucide-react';

const STATUS_TABS = [
  { label: 'All',           value: '' },
  { label: 'Pending',       value: 'pending' },
  { label: 'Approved',      value: 'approved' },
  { label: 'Rejected',      value: 'rejected' },
  { label: 'Info Requested',value: 'info_requested' },
];

const STATUS_STYLES = {
  approved:       'bg-green-100 text-green-700',
  pending:        'bg-amber-100 text-amber-700',
  rejected:       'bg-red-100 text-red-700',
  info_requested: 'bg-blue-100 text-blue-700',
};
const STATUS_LABELS = {
  approved: 'Approved',
  pending: 'Pending',
  rejected: 'Rejected',
  info_requested: 'Info Requested',
};

function StatusBadge({ status }) {
  return (
    <span className={`px-2 py-0.5 rounded-full text-xs font-medium ${STATUS_STYLES[status] || 'bg-slate-100 text-slate-600'}`}>
      {STATUS_LABELS[status] || status || '—'}
    </span>
  );
}

function SlideOver({ open, title, onClose, children }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={onClose} />
      <div className="w-[520px] bg-white shadow-2xl flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 shrink-0">
          <h2 className="font-semibold text-slate-800">{title}</h2>
          <button onClick={onClose} className="text-slate-400 hover:text-slate-600"><X className="w-5 h-5" /></button>
        </div>
        {children}
      </div>
    </div>
  );
}

function ReviewThread({ drug, onSend, sending }) {
  const [message, setMessage] = useState('');

  const handleSend = async () => {
    if (!message.trim()) return;
    await onSend(message);
    setMessage('');
  };

  return (
    <div className="flex flex-col h-full">
      {/* Drug info header */}
      <div className="px-6 py-3 bg-slate-50 border-b border-slate-100">
        <p className="text-sm font-semibold text-slate-800">{drug.brandName} <span className="font-normal text-slate-500">/ {drug.genericName}</span></p>
        {drug.manufacturer && <p className="text-xs text-slate-400">{drug.manufacturer}</p>}
        <div className="mt-1"><StatusBadge status={drug.status} /></div>
      </div>

      {/* Thread */}
      <div className="flex-1 overflow-y-auto px-6 py-4 space-y-3">
        {(!drug.reviewMessages || drug.reviewMessages.length === 0) ? (
          <p className="text-sm text-slate-400 text-center py-8">No messages yet. Send a question below.</p>
        ) : (
          drug.reviewMessages.map((msg, i) => (
            <div key={i} className={`flex ${msg.from === 'admin' ? 'justify-end' : 'justify-start'}`}>
              <div className={`max-w-[80%] rounded-xl px-4 py-2.5 text-sm ${
                msg.from === 'admin'
                  ? 'bg-primary-600 text-white rounded-br-sm'
                  : 'bg-slate-100 text-slate-800 rounded-bl-sm'
              }`}>
                <p className="leading-relaxed">{msg.message}</p>
                <p className={`text-[10px] mt-1 ${msg.from === 'admin' ? 'text-primary-200' : 'text-slate-400'}`}>
                  {msg.from === 'admin' ? 'Admin' : 'Pharma'} · {new Date(msg.createdAt).toLocaleString()}
                </p>
              </div>
            </div>
          ))
        )}
      </div>

      {/* Compose */}
      <div className="px-6 py-4 border-t border-slate-200">
        <p className="text-xs text-slate-400 mb-2">
          Send a question — pharma company will be notified and can respond in their portal. Status will change to <strong>Info Requested</strong>.
        </p>
        <div className="flex gap-2">
          <textarea
            rows={3}
            className="flex-1 border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary-400 resize-none"
            placeholder="e.g. Please provide clinical trial references for the listed indications..."
            value={message}
            onChange={e => setMessage(e.target.value)}
          />
          <button
            onClick={handleSend}
            disabled={sending || !message.trim()}
            className="self-end p-2.5 bg-primary-600 text-white rounded-lg hover:bg-primary-700 disabled:opacity-40 transition-colors"
          >
            {sending
              ? <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
              : <Send className="w-4 h-4" />}
          </button>
        </div>
      </div>
    </div>
  );
}

export default function AdminDrugs() {
  const [drugs, setDrugs] = useState([]);
  const [total, setTotal] = useState(0);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [sending, setSending] = useState(false);
  const [modal, setModal] = useState(null); // 'create' | 'edit' | 'review'
  const [selected, setSelected] = useState(null);
  const [confirmDelete, setConfirmDelete] = useState(null);
  const [error, setError] = useState(null);

  const fetchDrugs = useCallback(() => {
    setLoading(true);
    adminDrugsApi.list({ q: search || undefined, status: statusFilter || undefined, page, limit: 15 })
      .then(res => {
        setDrugs(res.data.data);
        setTotal(res.data.total);
        setPages(res.data.pages);
      })
      .catch(err => setError(err.response?.data?.error || 'Failed to load drugs'))
      .finally(() => setLoading(false));
  }, [search, statusFilter, page]);

  useEffect(() => { fetchDrugs(); }, [fetchDrugs]);

  const openCreate = () => { setSelected(null); setModal('create'); };
  const openEdit = (drug) => { setSelected(drug); setModal('edit'); };
  const openReview = (drug) => { setSelected(drug); setModal('review'); };
  const closeModal = () => { setModal(null); setSelected(null); };

  const handleSave = async (data) => {
    setSaving(true);
    setError(null);
    try {
      if (modal === 'edit' && selected?._id) {
        await adminDrugsApi.update(selected._id, data);
      } else {
        await adminDrugsApi.create(data);
      }
      closeModal();
      fetchDrugs();
    } catch (err) {
      setError(err.response?.data?.error || 'Save failed');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      await adminDrugsApi.remove(id);
      setConfirmDelete(null);
      fetchDrugs();
    } catch (err) {
      setError(err.response?.data?.error || 'Delete failed');
    }
  };

  const handleApprove = async (id) => {
    try { await adminDrugsApi.approve(id); fetchDrugs(); }
    catch (err) { setError(err.response?.data?.error || 'Approve failed'); }
  };

  const handleReject = async (id) => {
    try { await adminDrugsApi.reject(id); fetchDrugs(); }
    catch (err) { setError(err.response?.data?.error || 'Reject failed'); }
  };

  const handleRequestInfo = async (message) => {
    if (!selected) return;
    setSending(true);
    try {
      await adminDrugsApi.requestInfo(selected._id, message);
      // Refresh the selected drug data
      const res = await adminDrugsApi.list({ q: selected.brandName, limit: 1 });
      const updated = res.data.data.find(d => d._id === selected._id);
      if (updated) setSelected(updated);
      fetchDrugs();
    } catch (err) {
      setError(err.response?.data?.error || 'Failed to send message');
    } finally {
      setSending(false);
    }
  };

  return (
    <div className="p-8">
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-slate-800">Drug Database</h1>
          <p className="text-sm text-slate-500 mt-1">{total} drugs total</p>
        </div>
        <button onClick={openCreate} className="flex items-center gap-2 px-4 py-2 bg-accent-500 text-white rounded-lg text-sm font-medium hover:bg-accent-600 transition-colors">
          <Plus className="w-4 h-4" /> Add Drug
        </button>
      </div>

      {error && (
        <div className="mb-4 flex items-center gap-2 bg-red-50 border border-red-200 rounded-lg px-4 py-3 text-red-700 text-sm">
          <AlertTriangle className="w-4 h-4 shrink-0" />
          {error}
          <button onClick={() => setError(null)} className="ml-auto"><X className="w-4 h-4" /></button>
        </div>
      )}

      {/* Status filter tabs */}
      <div className="flex gap-1 mb-4 flex-wrap">
        {STATUS_TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => { setStatusFilter(tab.value); setPage(1); }}
            className={`px-3 py-1.5 rounded-lg text-xs font-medium transition-colors ${
              statusFilter === tab.value
                ? 'bg-primary-600 text-white'
                : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-50'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-slate-400" />
        <input
          className="w-full pl-9 pr-4 py-2.5 border border-slate-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-accent-400 bg-white"
          placeholder="Search drugs by name..."
          value={search}
          onChange={e => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      {/* Table */}
      <div className="bg-white border border-slate-200 rounded-xl overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center h-40">
            <div className="w-7 h-7 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
          </div>
        ) : (
          <table className="w-full text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Brand Name</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Generic</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Area</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Status</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">REMS</th>
                <th className="px-4 py-3 text-left font-semibold text-slate-600">Verified</th>
                <th className="px-4 py-3 text-right font-semibold text-slate-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {drugs.map(drug => (
                <tr key={drug._id} className={`hover:bg-slate-50 transition-colors ${
                  drug.status === 'pending' ? 'bg-amber-50/40' :
                  drug.status === 'info_requested' ? 'bg-blue-50/40' : ''
                }`}>
                  <td className="px-4 py-3 font-medium text-slate-800">
                    {drug.brandName}
                    {drug.addedVia === 'pharma' && (
                      <span className="ml-1.5 px-1.5 py-0.5 bg-purple-100 text-purple-700 rounded text-[10px] font-semibold">Pharma</span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-500">{drug.genericName}</td>
                  <td className="px-4 py-3 text-slate-500 truncate max-w-[120px]">{drug.therapeuticArea || '—'}</td>
                  <td className="px-4 py-3"><StatusBadge status={drug.status} /></td>
                  <td className="px-4 py-3">
                    {drug.hasREMS
                      ? <span className="px-2 py-0.5 bg-amber-100 text-amber-700 rounded-full text-xs font-medium">REMS</span>
                      : <span className="text-slate-300 text-xs">—</span>}
                  </td>
                  <td className="px-4 py-3 text-slate-400 text-xs">
                    {drug.lastVerified ? new Date(drug.lastVerified).toLocaleDateString() : '—'}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex items-center justify-end gap-1">
                      {/* Approve/Reject/Ask for pending or info_requested */}
                      {(drug.status === 'pending' || drug.status === 'info_requested') && !confirmDelete && (
                        <>
                          {drug.status === 'pending' && (
                            <button
                              onClick={() => handleApprove(drug._id)}
                              className="p-1.5 text-green-600 hover:bg-green-50 rounded transition-colors"
                              title="Approve"
                            >
                              <CheckCircle className="w-4 h-4" />
                            </button>
                          )}
                          {drug.status === 'pending' && (
                            <button
                              onClick={() => handleReject(drug._id)}
                              className="p-1.5 text-red-500 hover:bg-red-50 rounded transition-colors"
                              title="Reject"
                            >
                              <XCircle className="w-4 h-4" />
                            </button>
                          )}
                          <button
                            onClick={() => openReview(drug)}
                            className="p-1.5 text-blue-500 hover:bg-blue-50 rounded transition-colors"
                            title="Request more info / view thread"
                          >
                            <MessageSquare className="w-4 h-4" />
                          </button>
                        </>
                      )}
                      {confirmDelete === drug._id ? (
                        <>
                          <span className="text-xs text-red-600 mr-1">Delete?</span>
                          <button onClick={() => handleDelete(drug._id)} className="px-2 py-1 bg-red-500 text-white rounded text-xs hover:bg-red-600">Yes</button>
                          <button onClick={() => setConfirmDelete(null)} className="px-2 py-1 bg-slate-200 text-slate-700 rounded text-xs hover:bg-slate-300">No</button>
                        </>
                      ) : (
                        <>
                          <button onClick={() => openEdit(drug)} className="p-1.5 text-slate-400 hover:text-accent-600 hover:bg-accent-50 rounded transition-colors">
                            <Pencil className="w-4 h-4" />
                          </button>
                          <button onClick={() => setConfirmDelete(drug._id)} className="p-1.5 text-slate-400 hover:text-red-600 hover:bg-red-50 rounded transition-colors">
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
              {!drugs.length && (
                <tr>
                  <td colSpan={7} className="px-4 py-10 text-center text-slate-400 text-sm">No drugs found</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      {pages > 1 && (
        <div className="flex items-center justify-between mt-4">
          <span className="text-sm text-slate-500">Page {page} of {pages}</span>
          <div className="flex gap-2">
            <button disabled={page <= 1} onClick={() => setPage(p => p - 1)} className="p-2 border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50">
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button disabled={page >= pages} onClick={() => setPage(p => p + 1)} className="p-2 border border-slate-300 rounded-lg disabled:opacity-40 hover:bg-slate-50">
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>
        </div>
      )}

      {/* Drug form slide-over */}
      <SlideOver
        open={modal === 'create' || modal === 'edit'}
        title={modal === 'edit' ? `Edit: ${selected?.brandName}` : 'Add New Drug'}
        onClose={closeModal}
      >
        <DrugForm initialData={selected} onSubmit={handleSave} onCancel={closeModal} loading={saving} />
      </SlideOver>

      {/* Review / Request Info slide-over */}
      <SlideOver
        open={modal === 'review'}
        title={`Review Thread — ${selected?.brandName || ''}`}
        onClose={closeModal}
      >
        {selected && (
          <ReviewThread drug={selected} onSend={handleRequestInfo} sending={sending} />
        )}
      </SlideOver>
    </div>
  );
}
