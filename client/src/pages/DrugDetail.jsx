import { useEffect, useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  ArrowLeft, AlertCircle, Pill, Building2, Tag, FileText,
  ListOrdered, ShieldAlert, ClipboardList, Building
} from 'lucide-react';
import { drugsApi } from '../services/api';
import Layout from '../components/layout/Layout';
import PrescribingSteps from '../components/results/PrescribingSteps';
import PharmacyList from '../components/results/PharmacyList';
import REMSInfo from '../components/results/REMSInfo';
import PARequirements from '../components/results/PARequirements';

function Section({ icon: Icon, title, children }) {
  return (
    <div className="bg-white border border-slate-200 rounded-xl shadow-sm overflow-hidden">
      <div className="flex items-center gap-2.5 px-5 py-3.5 border-b border-slate-100 bg-slate-50">
        <Icon className="w-4 h-4 text-accent-500" />
        <h2 className="text-sm font-semibold text-primary-600">{title}</h2>
      </div>
      <div className="p-5">{children}</div>
    </div>
  );
}

export default function DrugDetail() {
  const { id } = useParams();
  const [drug, setDrug] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!id) return;
    setLoading(true);
    drugsApi.getById(id)
      .then(res => setDrug(res.data.drug || res.data))
      .catch(err => setError(err.response?.data?.message || 'Drug not found.'))
      .finally(() => setLoading(false));
  }, [id]);

  if (loading) {
    return (
      <Layout>
        <div className="flex justify-center py-20">
          <div className="w-8 h-8 border-4 border-accent-500 border-t-transparent rounded-full animate-spin" />
        </div>
      </Layout>
    );
  }

  if (error || !drug) {
    return (
      <Layout>
        <div className="max-w-2xl mx-auto px-4 py-16">
          <div className="flex items-start gap-3 bg-red-50 border border-red-200 rounded-xl p-5 text-sm text-red-700">
            <AlertCircle className="w-5 h-5 text-red-500 flex-shrink-0 mt-0.5" />
            <div>
              <p className="font-semibold mb-1">Drug not found</p>
              <p>{error || 'The requested drug could not be loaded.'}</p>
              <Link to="/" className="inline-flex items-center gap-1.5 mt-3 text-sm text-accent-500 hover:text-accent-600">
                <ArrowLeft className="w-3.5 h-3.5" /> Back to home
              </Link>
            </div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="max-w-4xl mx-auto px-4 py-8">
        {/* Back */}
        <Link
          to="/"
          className="inline-flex items-center gap-1.5 text-sm text-slate-500 hover:text-accent-500 mb-6 transition-colors"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </Link>

        {/* Drug header */}
        <div className="bg-primary-600 text-white rounded-2xl p-6 mb-6 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Pill className="w-5 h-5 text-accent-400" />
                <h1 className="text-2xl font-bold">{drug.brandName}</h1>
              </div>
              {drug.genericName && (
                <p className="text-primary-100 text-sm">Generic: <span className="text-white font-medium">{drug.genericName}</span></p>
              )}
            </div>
            <div className="flex flex-col gap-1.5 text-sm">
              {drug.manufacturer && (
                <div className="flex items-center gap-2 text-primary-100">
                  <Building className="w-4 h-4" />
                  {drug.manufacturer}
                </div>
              )}
              {drug.therapeuticArea && (
                <div className="flex items-center gap-2 text-primary-100">
                  <Tag className="w-4 h-4" />
                  {drug.therapeuticArea}
                </div>
              )}
            </div>
          </div>

          {/* Indications */}
          {drug.indications && drug.indications.length > 0 && (
            <div className="mt-4 pt-4 border-t border-white/20">
              <p className="text-xs font-semibold text-primary-200 uppercase tracking-wide mb-2">Indications</p>
              <div className="flex flex-wrap gap-2">
                {drug.indications.map(ind => (
                  <span key={ind} className="bg-white/15 text-white text-xs px-2.5 py-1 rounded-full">
                    {ind}
                  </span>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Content sections */}
        <div className="space-y-5">
          {/* Prescribing Steps */}
          {drug.prescribingSteps && drug.prescribingSteps.length > 0 && (
            <Section icon={ListOrdered} title="Prescribing Steps">
              <PrescribingSteps steps={drug.prescribingSteps} />
            </Section>
          )}

          {/* REMS */}
          <Section icon={ShieldAlert} title="REMS Requirements">
            <REMSInfo
              remsRequired={drug.remsRequired}
              remsDetails={drug.remsDetails}
            />
          </Section>

          {/* Prior Auth */}
          {drug.paRequirements && (
            <Section icon={ClipboardList} title="Prior Authorization">
              <PARequirements paRequirements={drug.paRequirements} />
            </Section>
          )}

          {/* Specialty Pharmacies */}
          {drug.specialtyPharmacies && drug.specialtyPharmacies.length > 0 && (
            <Section icon={Building2} title="Specialty Pharmacies">
              <PharmacyList pharmacies={drug.specialtyPharmacies} />
            </Section>
          )}

          {/* Required Forms */}
          {drug.requiredForms && drug.requiredForms.length > 0 && (
            <Section icon={FileText} title="Required Forms">
              <ul className="space-y-2">
                {drug.requiredForms.map((form, index) => (
                  <li key={index} className="flex items-center gap-3 bg-slate-50 border border-slate-200 rounded-lg p-3">
                    <FileText className="w-4 h-4 text-primary-500 flex-shrink-0" />
                    <span className="text-sm text-slate-700 flex-1">
                      {typeof form === 'string' ? form : form.name}
                    </span>
                    {typeof form === 'object' && form.url && (
                      <a
                        href={form.url}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-xs text-accent-500 hover:text-accent-600 underline"
                      >
                        View
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Section>
          )}
        </div>
      </div>
    </Layout>
  );
}
