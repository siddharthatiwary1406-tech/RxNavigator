import { CheckCircle, XCircle, Phone, ExternalLink, ClipboardList, User } from 'lucide-react';
import { formatPhone } from '../../utils/formatters';

export default function PARequirements({ paRequirements }) {
  if (!paRequirements) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        Prior authorization information not available.
      </div>
    );
  }

  const { required, payer, steps, criteria, phone, portalUrl } = paRequirements;

  if (required === false) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <span className="font-semibold text-green-700 text-sm">No Prior Authorization Required</span>
          {payer && (
            <p className="text-xs text-green-600 mt-0.5">Payer: {payer}</p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-5">
      {/* PA Required header */}
      <div className="flex items-start gap-3 bg-blue-50 border border-blue-200 rounded-xl p-4">
        <ClipboardList className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-blue-800 text-sm">Prior Authorization Required</span>
          {payer && (
            <div className="flex items-center gap-1.5 mt-1">
              <User className="w-3.5 h-3.5 text-blue-500" />
              <p className="text-xs text-blue-700">Payer: <span className="font-medium">{payer}</span></p>
            </div>
          )}
        </div>
      </div>

      {/* PA Steps */}
      {steps && steps.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-3">Authorization Steps</h4>
          <ol className="space-y-3">
            {steps.map((step, index) => (
              <li key={index} className="flex gap-3">
                <span className="flex-shrink-0 w-6 h-6 rounded-full bg-primary-600 text-white text-xs font-bold flex items-center justify-center">
                  {index + 1}
                </span>
                <p className="text-sm text-slate-600 leading-relaxed pt-0.5">{step}</p>
              </li>
            ))}
          </ol>
        </div>
      )}

      {/* Clinical Criteria */}
      {criteria && criteria.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">Clinical Criteria</h4>
          <ul className="space-y-2">
            {criteria.map((item, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                <CheckCircle className="w-4 h-4 text-accent-500 flex-shrink-0 mt-0.5" />
                <span className="leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Contact & Portal */}
      <div className="flex flex-wrap gap-3 pt-1">
        {phone && (
          <a
            href={`tel:${phone}`}
            className="inline-flex items-center gap-2 border border-slate-200 text-slate-700 text-sm px-3 py-1.5 rounded-lg hover:bg-slate-50 transition-colors"
          >
            <Phone className="w-3.5 h-3.5 text-accent-500" />
            {formatPhone(phone)}
          </a>
        )}
        {portalUrl && (
          <a
            href={portalUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 bg-accent-500 text-white text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-accent-600 transition-colors"
          >
            <ExternalLink className="w-3.5 h-3.5" />
            PA Portal
          </a>
        )}
      </div>
    </div>
  );
}
