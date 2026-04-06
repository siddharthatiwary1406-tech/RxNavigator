import { Phone, ExternalLink, MapPin } from 'lucide-react';
import { formatPhone } from '../../utils/formatters';

export default function PharmacyList({ pharmacies }) {
  if (!pharmacies || pharmacies.length === 0) {
    return (
      <div className="py-8 text-center text-slate-400 text-sm">
        No specialty pharmacies found for this drug.
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
      {pharmacies.map((pharmacy, index) => (
        <div
          key={index}
          className="bg-white border border-slate-200 rounded-xl p-4 shadow-sm hover:shadow-md transition-shadow"
        >
          <h3 className="font-semibold text-primary-600 text-sm mb-3 leading-tight">
            {pharmacy.name}
          </h3>

          <div className="space-y-2">
            {pharmacy.phone && (
              <div className="flex items-center gap-2 text-slate-600">
                <Phone className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
                <a
                  href={`tel:${pharmacy.phone}`}
                  className="text-xs hover:text-accent-500 transition-colors"
                >
                  {formatPhone(pharmacy.phone)}
                </a>
              </div>
            )}

            {pharmacy.website && (
              <div className="flex items-center gap-2 text-slate-600">
                <ExternalLink className="w-3.5 h-3.5 text-accent-500 flex-shrink-0" />
                <a
                  href={pharmacy.website}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-xs hover:text-accent-500 transition-colors truncate"
                >
                  {pharmacy.website.replace(/^https?:\/\//, '')}
                </a>
              </div>
            )}

            {pharmacy.states && pharmacy.states.length > 0 && (
              <div className="flex items-start gap-2 mt-3">
                <MapPin className="w-3.5 h-3.5 text-slate-400 flex-shrink-0 mt-0.5" />
                <div className="flex flex-wrap gap-1">
                  {pharmacy.states.map((state) => (
                    <span
                      key={state}
                      className="inline-block bg-slate-100 text-slate-600 text-xs px-1.5 py-0.5 rounded"
                    >
                      {state}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      ))}
    </div>
  );
}
