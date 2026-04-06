import { CheckCircle, AlertTriangle, ExternalLink, ShieldAlert } from 'lucide-react';

export default function REMSInfo({ remsRequired, remsDetails }) {
  if (!remsRequired) {
    return (
      <div className="flex items-center gap-3 bg-green-50 border border-green-200 rounded-xl p-4">
        <CheckCircle className="w-5 h-5 text-green-600 flex-shrink-0" />
        <div>
          <span className="font-semibold text-green-700 text-sm">No REMS Required</span>
          <p className="text-xs text-green-600 mt-0.5">
            This drug does not have an active Risk Evaluation and Mitigation Strategy program.
          </p>
        </div>
      </div>
    );
  }

  const details = remsDetails || {};

  return (
    <div className="space-y-4">
      {/* Header warning box */}
      <div className="flex items-start gap-3 bg-amber-50 border border-amber-300 rounded-xl p-4">
        <AlertTriangle className="w-5 h-5 text-amber-600 flex-shrink-0 mt-0.5" />
        <div className="flex-1">
          <span className="font-semibold text-amber-800 text-sm">REMS Program Required</span>
          {details.programName && (
            <p className="text-xs text-amber-700 mt-0.5 font-medium">{details.programName}</p>
          )}
        </div>
      </div>

      {/* Certification warning */}
      {details.certificationRequired && (
        <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-lg p-3">
          <ShieldAlert className="w-4 h-4 text-red-600 flex-shrink-0 mt-0.5" />
          <p className="text-xs text-red-700 font-medium">
            Prescriber certification is required before dispensing this medication.
          </p>
        </div>
      )}

      {/* Requirements list */}
      {details.requirements && details.requirements.length > 0 && (
        <div>
          <h4 className="text-sm font-semibold text-slate-700 mb-2">REMS Requirements</h4>
          <ul className="space-y-2">
            {details.requirements.map((req, index) => (
              <li key={index} className="flex items-start gap-2 text-sm text-slate-600">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-500 flex-shrink-0 mt-2" />
                <span className="leading-relaxed">{req}</span>
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Enrollment URL */}
      {details.enrollmentUrl && (
        <a
          href={details.enrollmentUrl}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-2 bg-accent-500 text-white text-sm font-medium px-4 py-2 rounded-lg hover:bg-accent-600 transition-colors"
        >
          <ExternalLink className="w-4 h-4" />
          Enroll in REMS Program
        </a>
      )}
    </div>
  );
}
