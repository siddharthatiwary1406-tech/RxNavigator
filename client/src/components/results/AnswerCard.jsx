import { useState } from 'react';
import {
  ListOrdered, Building2, ShieldAlert, ClipboardList, FileText,
  AlertCircle, Download, ExternalLink, Clock, Wrench, TriangleAlert
} from 'lucide-react';
import PrescribingSteps from './PrescribingSteps';
import PharmacyList from './PharmacyList';
import REMSInfo from './REMSInfo';
import PARequirements from './PARequirements';
import SourceCitations from './SourceCitations';
import ConfidenceScore from './ConfidenceScore';
import FeedbackButtons from '../common/FeedbackButtons';

const TABS = [
  { id: 'steps',     label: 'Steps',           icon: ListOrdered },
  { id: 'pharmacies',label: 'Pharmacies',      icon: Building2 },
  { id: 'rems',      label: 'REMS',            icon: ShieldAlert },
  { id: 'priorauth', label: 'Prior Auth',      icon: ClipboardList },
  { id: 'forms',     label: 'Forms & Sources', icon: FileText },
  { id: 'warnings',  label: 'Warnings',        icon: TriangleAlert },
];

function DrugStatusBadge({ status }) {
  const map = {
    approved:       'bg-green-100 text-green-700 border-green-200',
    pending:        'bg-amber-100 text-amber-700 border-amber-200',
    rejected:       'bg-red-100 text-red-700 border-red-200',
    info_requested: 'bg-blue-100 text-blue-700 border-blue-200',
  };
  const labels = {
    approved: 'Verified & Approved',
    pending: 'Pending Review',
    rejected: 'Rejected',
    info_requested: 'More Info Requested',
  };
  const cls = map[status] || 'bg-slate-100 text-slate-600 border-slate-200';
  return (
    <span className={`inline-flex items-center px-2.5 py-1 rounded-full text-xs font-semibold border ${cls}`}>
      {labels[status] || status}
    </span>
  );
}

export default function AnswerCard({ result, queryId }) {
  const [activeTab, setActiveTab] = useState('steps');

  if (!result) return null;

  const { data = {}, drugMeta, toolsUsed = [], responseTimeMs } = result;
  const {
    prescribingSteps,
    remsRequired,
    remsDetails,
    specialtyPharmacies,
    paRequirements,
    requiredForms,
    confidenceScore,
    sources,
    lastVerified,
    importantWarnings,
  } = data;

  return (
    <div className="bg-white rounded-2xl shadow-sm border border-slate-200 overflow-hidden">
      {/* Drug identity header — only shown when data came from DB */}
      {drugMeta && (
        <div className="px-5 py-4 border-b border-slate-100 flex items-start justify-between gap-4 bg-slate-50/60">
          <div>
            <h2 className="text-base font-bold text-slate-800 leading-tight">{drugMeta.brandName}</h2>
            <p className="text-xs text-slate-500 mt-0.5">
              {drugMeta.genericName}
              {drugMeta.manufacturer && <span className="text-slate-400"> · {drugMeta.manufacturer}</span>}
            </p>
          </div>
          <DrugStatusBadge status={drugMeta.status} />
        </div>
      )}

      {/* Tab bar */}
      <div className="border-b border-slate-200 bg-slate-50 overflow-x-auto">
        <nav className="flex min-w-max px-2 pt-2 gap-1">
          {TABS.map(({ id, label, icon: Icon }) => {
            const isActive = activeTab === id;
            const hasREMSDot = id === 'rems' && remsRequired;
            const hasWarningsDot = id === 'warnings' && importantWarnings?.length > 0;
            return (
              <button
                key={id}
                onClick={() => setActiveTab(id)}
                className={`relative flex items-center gap-1.5 px-3 py-2 text-xs font-medium rounded-t-lg border-b-2 transition-colors whitespace-nowrap ${
                  isActive
                    ? 'border-accent-500 text-accent-500 bg-white'
                    : 'border-transparent text-slate-500 hover:text-slate-700 hover:bg-slate-100'
                }`}
              >
                <Icon className={`w-3.5 h-3.5 ${hasWarningsDot && !isActive ? 'text-red-400' : ''}`} />
                {label}
                {hasREMSDot && (
                  <span className="absolute -top-0.5 right-0.5 w-2 h-2 rounded-full bg-amber-500" />
                )}
                {hasWarningsDot && (
                  <span className="ml-1 px-1.5 py-0.5 bg-red-100 text-red-600 text-[10px] font-bold rounded-full leading-none">
                    {importantWarnings.length}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Tab content */}
      <div className="p-5">
        {activeTab === 'steps' && (
          <PrescribingSteps steps={prescribingSteps} />
        )}
        {activeTab === 'pharmacies' && (
          <PharmacyList pharmacies={specialtyPharmacies} />
        )}
        {activeTab === 'rems' && (
          <REMSInfo remsRequired={remsRequired} remsDetails={remsDetails} />
        )}
        {activeTab === 'priorauth' && (
          <PARequirements paRequirements={paRequirements} />
        )}
        {activeTab === 'forms' && (
          <div className="space-y-6">
            {/* Required forms */}
            {requiredForms && requiredForms.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-slate-700 mb-3">Required Forms</h4>
                <ul className="space-y-2">
                  {requiredForms.map((form, index) => (
                    <li key={index} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                      <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
                      <span className="text-sm text-slate-700 flex-1">{typeof form === 'string' ? form : form.name}</span>
                      {typeof form === 'object' && form.url && (
                        <a
                          href={form.url}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="flex items-center gap-1 text-xs text-accent-500 hover:text-accent-600"
                        >
                          {form.url.endsWith('.pdf') ? (
                            <Download className="w-3.5 h-3.5" />
                          ) : (
                            <ExternalLink className="w-3.5 h-3.5" />
                          )}
                          {form.url.endsWith('.pdf') ? 'Download' : 'Open'}
                        </a>
                      )}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <SourceCitations sources={sources} lastVerified={lastVerified} />
          </div>
        )}
        {activeTab === 'warnings' && (
          <div>
            {importantWarnings && importantWarnings.length > 0 ? (
              <div className="space-y-3">
                {importantWarnings.map((warning, i) => (
                  <div key={i} className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-4">
                    <AlertCircle className="w-4 h-4 text-red-500 flex-shrink-0 mt-0.5" />
                    <p className="text-sm text-red-700 leading-relaxed">{warning}</p>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-10 text-center">
                <TriangleAlert className="w-8 h-8 text-slate-300 mb-2" />
                <p className="text-sm text-slate-400">No warnings reported for this drug.</p>
              </div>
            )}
          </div>
        )}
      </div>

      {/* Footer: confidence + feedback + meta */}
      <div className="border-t border-slate-100 bg-slate-50 px-5 py-3 flex flex-wrap items-center justify-between gap-3">
        <div className="flex items-center gap-4 flex-wrap">
          <ConfidenceScore score={confidenceScore} />
          {toolsUsed && toolsUsed.length > 0 && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Wrench className="w-3.5 h-3.5" />
              <span>{toolsUsed.length} tool{toolsUsed.length !== 1 ? 's' : ''} used</span>
            </div>
          )}
          {responseTimeMs && (
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Clock className="w-3.5 h-3.5" />
              <span>{(responseTimeMs / 1000).toFixed(1)}s</span>
            </div>
          )}
        </div>
        <FeedbackButtons queryId={queryId} />
      </div>
    </div>
  );
}
