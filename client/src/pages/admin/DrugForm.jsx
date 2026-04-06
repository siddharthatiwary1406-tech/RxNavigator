import { useState } from 'react';
import { X, Plus } from 'lucide-react';

function TagInput({ label, items, onChange }) {
  const [input, setInput] = useState('');
  const add = () => {
    const val = input.trim();
    if (val && !items.includes(val)) onChange([...items, val]);
    setInput('');
  };
  const remove = (i) => onChange(items.filter((_, idx) => idx !== i));
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}</label>
      <div className="flex gap-2 mb-2">
        <input
          className="flex-1 border border-slate-300 rounded-lg px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
          value={input}
          onChange={e => setInput(e.target.value)}
          onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), add())}
          placeholder="Type and press Enter or Add"
        />
        <button type="button" onClick={add} className="px-3 py-1.5 bg-accent-500 text-white rounded-lg text-sm hover:bg-accent-600">
          <Plus className="w-4 h-4" />
        </button>
      </div>
      <div className="flex flex-wrap gap-1">
        {items.map((item, i) => (
          <span key={i} className="flex items-center gap-1 bg-slate-100 border border-slate-200 text-xs px-2 py-0.5 rounded-full">
            {item.length > 40 ? item.slice(0, 40) + '…' : item}
            <button type="button" onClick={() => remove(i)} className="text-slate-400 hover:text-red-500"><X className="w-3 h-3" /></button>
          </span>
        ))}
      </div>
    </div>
  );
}

function Field({ label, name, value, onChange, type = 'text', required }) {
  return (
    <div>
      <label className="block text-xs font-medium text-slate-600 mb-1">{label}{required && <span className="text-red-500 ml-0.5">*</span>}</label>
      <input
        type={type}
        name={name}
        value={value || ''}
        onChange={onChange}
        required={required}
        className="w-full border border-slate-300 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-accent-400"
      />
    </div>
  );
}

const emptyDrug = {
  brandName: '', genericName: '', manufacturer: '', therapeuticArea: '',
  indication: [], hasREMS: false, prescribingSteps: [], requiredForms: [],
  remsProgram: { name: '', requirements: [], enrollmentUrl: '', certificationRequired: false },
  specialtyPharmacies: [], paRequirements: { general: [], payers: [] }, dataSource: []
};

export default function DrugForm({ initialData, onSubmit, onCancel, loading }) {
  const [form, setForm] = useState(() => ({ ...emptyDrug, ...initialData }));

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));
  const setNested = (parent, key, val) => setForm(f => ({ ...f, [parent]: { ...f[parent], [key]: val } }));

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    set(name, type === 'checkbox' ? checked : value);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(form);
  };

  return (
    <form onSubmit={handleSubmit} className="flex flex-col h-full">
      <div className="flex-1 overflow-y-auto p-6 space-y-5">
        <div className="grid grid-cols-2 gap-4">
          <Field label="Brand Name" name="brandName" value={form.brandName} onChange={handleChange} required />
          <Field label="Generic Name" name="genericName" value={form.genericName} onChange={handleChange} required />
          <Field label="Manufacturer" name="manufacturer" value={form.manufacturer} onChange={handleChange} />
          <Field label="Therapeutic Area" name="therapeuticArea" value={form.therapeuticArea} onChange={handleChange} />
        </div>

        <TagInput label="Indications" items={form.indication || []} onChange={v => set('indication', v)} />
        <TagInput label="Prescribing Steps" items={form.prescribingSteps || []} onChange={v => set('prescribingSteps', v)} />

        {/* REMS */}
        <div className="border border-amber-200 rounded-lg p-4 bg-amber-50 space-y-3">
          <div className="flex items-center gap-2">
            <input type="checkbox" id="hasREMS" checked={!!form.hasREMS} onChange={e => set('hasREMS', e.target.checked)} className="accent-amber-500" />
            <label htmlFor="hasREMS" className="text-sm font-medium text-amber-800">Has REMS Program</label>
          </div>
          {form.hasREMS && (
            <>
              <Field label="REMS Program Name" name="name" value={form.remsProgram?.name} onChange={e => setNested('remsProgram', 'name', e.target.value)} />
              <Field label="Enrollment URL" name="enrollmentUrl" value={form.remsProgram?.enrollmentUrl} onChange={e => setNested('remsProgram', 'enrollmentUrl', e.target.value)} />
              <div className="flex items-center gap-2">
                <input type="checkbox" id="certReq" checked={!!form.remsProgram?.certificationRequired} onChange={e => setNested('remsProgram', 'certificationRequired', e.target.checked)} className="accent-amber-500" />
                <label htmlFor="certReq" className="text-sm text-amber-800">Certification Required</label>
              </div>
              <TagInput label="REMS Requirements" items={form.remsProgram?.requirements || []} onChange={v => setNested('remsProgram', 'requirements', v)} />
            </>
          )}
        </div>

        {/* PA Requirements */}
        <TagInput label="General PA Requirements" items={form.paRequirements?.general || []} onChange={v => setForm(f => ({ ...f, paRequirements: { ...f.paRequirements, general: v } }))} />

        {/* Data Sources */}
        <TagInput label="Data Sources (URLs)" items={form.dataSource || []} onChange={v => set('dataSource', v)} />
      </div>

      <div className="p-4 border-t border-slate-200 flex gap-3 justify-end shrink-0 bg-white">
        <button type="button" onClick={onCancel} className="px-4 py-2 text-sm text-slate-600 border border-slate-300 rounded-lg hover:bg-slate-50">
          Cancel
        </button>
        <button
          type="submit"
          disabled={loading}
          className="px-4 py-2 text-sm bg-accent-500 text-white rounded-lg hover:bg-accent-600 disabled:opacity-50 flex items-center gap-2"
        >
          {loading && <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />}
          {initialData?._id ? 'Update Drug' : 'Create Drug'}
        </button>
      </div>
    </form>
  );
}
