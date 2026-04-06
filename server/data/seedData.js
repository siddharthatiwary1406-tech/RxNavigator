require('dotenv').config({ path: require('path').join(__dirname, '../.env') });
const mongoose = require('mongoose');
const Drug = require('../models/Drug');

const drugs = [
  // ─── DERMATOLOGY / IMMUNOLOGY ────────────────────────────────────────────
  {
    brandName: 'Dupixent',
    genericName: 'dupilumab',
    manufacturer: 'Sanofi/Regeneron',
    therapeuticArea: 'Dermatology/Pulmonology',
    indication: ['Moderate-to-severe atopic dermatitis (age ≥6 months)', 'Moderate-to-severe asthma (age ≥6 years)', 'Chronic rhinosinusitis with nasal polyposis', 'Eosinophilic esophagitis (age ≥12)', 'Prurigo nodularis (age ≥18)', 'Chronic spontaneous urticaria'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Walgreens Specialty', phone: '1-866-822-9999', website: 'https://www.walgreensspecialty.com', states: [] },
      { name: 'Optum Specialty', phone: '1-855-427-4682', website: 'https://www.optumspecialtypharmacy.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm FDA-approved indication (atopic dermatitis, asthma, CRSwNP, EoE, prurigo nodularis, or CSU)',
      'Document inadequate response or intolerance to conventional therapies (e.g., topical corticosteroids for AD)',
      'No lab work or special testing required before initiation',
      'Enroll patient in Dupixent MyWay program: call 1-844-387-4936 or visit dupixentmyway.com',
      'Write prescription — specify indication, dose, and frequency',
      'Submit to Dupixent-participating specialty pharmacy (Accredo, CVS Specialty, Walgreens Specialty)',
      'AD adult loading dose: 600 mg SC (two 300 mg injections), then 300 mg every other week',
      'Train patient/caregiver on prefilled syringe or autoinjector self-injection technique',
      'Follow up at 4 weeks, 16 weeks to assess clinical response'
    ],
    requiredForms: [
      { name: 'Dupixent MyWay Enrollment Form', url: 'https://www.dupixentmyway.com' },
      { name: 'Prior Authorization Support', url: 'https://www.dupixent.com/hcp/prior-authorization' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10 code (L20.9 for AD, J45.x for asthma)',
        'Documentation of inadequate response to conventional therapy',
        'Baseline severity score (EASI, IGA, ACQ-5)',
        'Patient age confirmation (varies by indication)'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit via UHC provider portal or fax 866-814-1959', 'Include diagnosis, failed prior therapy, severity score'], criteria: ['Confirmed moderate-to-severe AD', 'Failed topical corticosteroids (medium/high potency)', 'No active skin infection'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' },
        { name: 'Cigna', steps: ['Submit via myCigna provider portal or fax 855-216-2687', 'Attach clinical notes and failed therapy dates'], criteria: ['FDA-approved indication required', 'Prior failure of conventional therapy'], phone: '1-800-244-6224', portalUrl: 'https://cignaforhcp.cigna.com' },
        { name: 'Aetna', steps: ['Submit via Aetna provider portal or fax 859-455-8650', 'Include baseline severity and prior treatment dates'], criteria: ['Moderate-to-severe confirmed by physician', 'Trial of topical calcineurin inhibitor or TCS for ≥3 months'], phone: '1-800-451-1527', portalUrl: 'https://www.aetna.com/providers' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Dupixent Prescribing Information', 'FDA Label', 'Dupixent MyWay Program Guide']
  },
  {
    brandName: 'Skyrizi',
    genericName: 'risankizumab-rzaa',
    manufacturer: 'AbbVie',
    therapeuticArea: 'Dermatology/Gastroenterology',
    indication: ['Moderate-to-severe plaque psoriasis (adult)', 'Active psoriatic arthritis', 'Moderately to severely active Crohn\'s disease', 'Moderately to severely active ulcerative colitis'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Walgreens Specialty', phone: '1-866-822-9999', website: 'https://www.walgreensspecialty.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and FDA-approved indication',
      'Screen for TB (tuberculin skin test or IGRA) — treat latent TB before initiating',
      'Test for hepatitis B (HBV) before initiation',
      'Ensure patient is up-to-date on vaccinations before starting',
      'Enroll in myAbbVie Assist: call 1-833-477-9746 or visit myabbvieassist.com',
      'Psoriasis dose: 150 mg SC at weeks 0 and 4, then 150 mg every 12 weeks (maintenance)',
      'IBD dose: 600 mg IV at weeks 0, 4, 8 (induction), then 360 mg SC every 8 weeks (maintenance)',
      'Submit prescription to specialty pharmacy with clinical documentation',
      'Monitor for infections, particularly TB reactivation'
    ],
    requiredForms: [
      { name: 'myAbbVie Assist Enrollment', url: 'https://www.myabbvieassist.com' },
      { name: 'Skyrizi Prescription Support', url: 'https://www.skyrizi.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10 code',
        'Negative TB and HBV screening',
        'Documentation of inadequate response to conventional or biologic therapy',
        'Baseline disease severity documentation (PASI, PGA, CDAI, Mayo score)'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC portal', 'Include TB/HBV screens and prior biologic failure if applicable'], criteria: ['FDA-approved indication', 'Prior TNF failure may be required for PsA/IBD'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' },
        { name: 'BlueCross BlueShield', steps: ['Submit via BCBS provider portal or fax', 'Include diagnosis code and clinical notes'], criteria: ['Step therapy may require prior biologic failure'], phone: '1-800-676-2583', portalUrl: 'https://www.bcbs.com/providers' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Skyrizi Prescribing Information', 'FDA Label', 'AbbVie Medical Information']
  },
  {
    brandName: 'Cosentyx',
    genericName: 'secukinumab',
    manufacturer: 'Novartis',
    therapeuticArea: 'Dermatology/Rheumatology',
    indication: ['Moderate-to-severe plaque psoriasis (adult)', 'Psoriatic arthritis', 'Ankylosing spondylitis', 'Non-radiographic axial spondyloarthritis', 'Active enthesitis-related arthritis (age ≥4)'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Walgreens Specialty', phone: '1-866-822-9999', website: 'https://www.walgreensspecialty.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and FDA-approved indication',
      'Screen for TB and HBV before initiating',
      'Caution in patients with inflammatory bowel disease (Cosentyx may worsen IBD)',
      'Enroll in CoverConnect patient support: call 1-844-268-3672 or secukinumab.com',
      'Psoriasis loading dose: 300 mg SC at weeks 0, 1, 2, 3, and 4, then 300 mg every 4 weeks (maintenance)',
      'PsA without loading: 150 mg SC every 4 weeks (with or without loading)',
      'AS: 150 mg SC at weeks 0, 1, 2, 3, and 4, then 150 mg every 4 weeks',
      'Train patient on prefilled syringe or Sensoready pen self-injection',
      'Monitor for infections and IBD flares'
    ],
    requiredForms: [
      { name: 'CoverConnect Enrollment', url: 'https://www.cosentyx.com/support/coverconnect' },
      { name: 'PA Assistance Form', url: 'https://www.cosentyx.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10 code',
        'TB and HBV screening documentation',
        'Prior conventional therapy failure (methotrexate, NSAIDs)',
        'Baseline PASI/BSA for psoriasis or disease activity score for PsA/AS'
      ],
      payers: [
        { name: 'Cigna', steps: ['Submit PA via myCigna portal', 'Include prior therapy documentation and severity score'], criteria: ['Psoriasis: PASI ≥12 or BSA ≥10%', 'Step therapy required through TNF inhibitor in some plans'], phone: '1-800-244-6224', portalUrl: 'https://cignaforhcp.cigna.com' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Cosentyx Prescribing Information', 'FDA Label', 'Novartis Medical Information']
  },
  {
    brandName: 'Taltz',
    genericName: 'ixekizumab',
    manufacturer: 'Eli Lilly',
    therapeuticArea: 'Dermatology/Rheumatology',
    indication: ['Moderate-to-severe plaque psoriasis (adult)', 'Active psoriatic arthritis', 'Active ankylosing spondylitis', 'Active non-radiographic axial spondyloarthritis'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Lilly Cares Foundation', phone: '1-800-545-5979', website: 'https://www.lillycares.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm FDA-approved indication and disease severity',
      'Screen for TB and HBV before initiating',
      'Caution in IBD patients — ixekizumab may exacerbate IBD',
      'Enroll in Taltz Together support program: call 1-833-4TALTZ4 or taltz.com',
      'Psoriasis: 160 mg SC (two 80 mg injections) at week 0, then 80 mg at weeks 2, 4, 6, 8, 10, 12, then 80 mg every 4 weeks',
      'PsA and AS: 160 mg SC at week 0, then 80 mg every 4 weeks',
      'Administer SC in abdomen, thigh, or upper arm — rotate injection sites',
      'Train on autoinjector pen technique',
      'Monitor for infections, IBD exacerbation, hypersensitivity reactions'
    ],
    requiredForms: [
      { name: 'Taltz Together Enrollment', url: 'https://www.taltz.com/taltz-together' },
      { name: 'PA Support Documentation', url: 'https://www.taltz.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Confirmed moderate-to-severe psoriasis (PASI ≥12, BSA ≥10%, or IGA ≥3)',
        'TB and HBV screening results',
        'Inadequate response to phototherapy or systemic therapy'
      ],
      payers: [
        { name: 'Aetna', steps: ['Submit via Aetna provider portal', 'Include PASI/BSA score and prior treatment failure'], criteria: ['Moderate-to-severe confirmed', 'Trial of topical therapy and/or phototherapy'], phone: '1-800-451-1527', portalUrl: 'https://www.aetna.com/providers' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Taltz Prescribing Information', 'FDA Label', 'Lilly Medical Information']
  },
  {
    brandName: 'Stelara',
    genericName: 'ustekinumab',
    manufacturer: 'Janssen (J&J)',
    therapeuticArea: 'Dermatology/Gastroenterology',
    indication: ['Moderate-to-severe plaque psoriasis (adult and pediatric ≥6 years)', 'Active psoriatic arthritis', 'Moderately to severely active Crohn\'s disease', 'Moderately to severely active ulcerative colitis'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Janssen CarePath', phone: '1-877-CarePath (227-3728)', website: 'https://www.stelara.com/janssen-carepath', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and FDA-approved indication',
      'Screen for TB and HBV before initiating',
      'Evaluate for malignancy history (theoretical TSLP pathway concern)',
      'Enroll in Janssen CarePath: call 1-877-227-3728 or janssencarepath.com',
      'Psoriasis: weight-based SC dosing (≤100 kg: 45 mg at weeks 0 and 4, then 45 mg every 12 weeks; >100 kg: 90 mg)',
      'IBD induction: single weight-based IV infusion (260 mg, 390 mg, or 520 mg), then 90 mg SC every 8 weeks',
      'PsA: 45 mg SC at weeks 0 and 4, then 45 mg every 12 weeks',
      'Biosimilars now available — verify formulary coverage and biosimilar substitution policies',
      'Monitor for serious infections and potential malignancy'
    ],
    requiredForms: [
      { name: 'Janssen CarePath Enrollment', url: 'https://www.janssencarepath.com' },
      { name: 'Stelara PA Support', url: 'https://www.stelara.com/hcp/getting-patients-started' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10',
        'TB and HBV screening documentation',
        'Prior biologic or conventional therapy failure may be required',
        'Weight documentation for dosing'
      ],
      payers: [
        { name: 'Medicare Part D/B', steps: ['Submit PA through Medicare plan portal', 'Psoriasis: Part D; IBD IV induction: Part B (medical benefit)'], criteria: ['FDA-approved indication required', 'Document medical necessity'], phone: '1-800-633-4227', portalUrl: 'https://www.cms.gov' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Stelara Prescribing Information', 'FDA Label', 'Janssen Medical Information']
  },

  // ─── RHEUMATOLOGY ────────────────────────────────────────────────────────
  {
    brandName: 'Humira',
    genericName: 'adalimumab',
    manufacturer: 'AbbVie',
    therapeuticArea: 'Rheumatology/Gastroenterology/Dermatology',
    indication: ['Rheumatoid arthritis', 'Psoriatic arthritis', 'Ankylosing spondylitis', 'Crohn\'s disease', 'Ulcerative colitis', 'Plaque psoriasis', 'Juvenile idiopathic arthritis (age ≥2)', 'Hidradenitis suppurativa', 'Non-infectious uveitis'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'Walgreens Specialty', phone: '1-866-822-9999', website: 'https://www.walgreensspecialty.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Optum Specialty', phone: '1-855-427-4682', website: 'https://www.optumspecialtypharmacy.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and FDA-approved indication',
      'Screen for latent TB (tuberculin skin test or IGRA) — treat latent TB before initiating',
      'Test for hepatitis B virus (HBV) before initiating',
      'Review contraindications: active infection, active TB, NYHA Class III/IV heart failure',
      'Evaluate for demyelinating disease history',
      'Enroll in myAbbVie Assist: call 1-800-222-6885 or myabbvieassist.com',
      'Standard RA dose: 40 mg SC every other week (may increase to weekly if on monotherapy)',
      'Submit prescription to specialty pharmacy with TB/HBV documentation',
      'Note: multiple biosimilars available — check formulary (Hadlima, Hyrimoz, Cyltezo, etc.)',
      'Monitor for infections, TB reactivation, hepatitis B reactivation, and malignancy'
    ],
    requiredForms: [
      { name: 'myAbbVie Assist Enrollment', url: 'https://www.myabbvieassist.com' },
      { name: 'PA Support Documentation', url: 'https://www.humira.com/hcp/getting-patients-started' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10 code',
        'Negative TB and HBV screening results',
        'Documentation of DMARD or conventional therapy failure',
        'Baseline disease activity score (DAS28, CDAI, PASI, etc.)',
        'Biosimilar step therapy may be required by many payers'
      ],
      payers: [
        { name: 'Aetna', steps: ['Submit PA through Aetna provider portal or fax 859-455-8650', 'Include TB/HBV screening results', 'Document prior DMARD failure'], criteria: ['RA: inadequate response to methotrexate or other DMARDs', 'Biosimilar preferred — justify brand-name Humira if required'], phone: '1-800-451-1527', portalUrl: 'https://www.aetna.com/providers' },
        { name: 'UnitedHealthcare', steps: ['Submit via UHC portal', 'Biosimilar preferred products must be tried first per many UHC plans'], criteria: ['Confirmed diagnosis', 'Step therapy compliance'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Humira Prescribing Information', 'FDA Label', 'AbbVie Medical Information']
  },
  {
    brandName: 'Enbrel',
    genericName: 'etanercept',
    manufacturer: 'Amgen/Pfizer',
    therapeuticArea: 'Rheumatology/Dermatology',
    indication: ['Moderate-to-severe rheumatoid arthritis', 'Polyarticular juvenile idiopathic arthritis (age ≥2)', 'Psoriatic arthritis', 'Ankylosing spondylitis', 'Moderate-to-severe plaque psoriasis (age ≥4)'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Enbrel SupportPlus', phone: '1-888-436-2735', website: 'https://www.enbrel.com/support', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and FDA-approved indication',
      'Screen for latent TB and test for HBV before initiating',
      'Review contraindications: sepsis, active infections, heart failure (use cautiously)',
      'Enroll patient in Enbrel SupportPlus program: 1-888-4ENBREL or enbrel.com',
      'RA/PsA/AS adult dose: 50 mg SC once weekly OR 25 mg SC twice weekly',
      'Plaque psoriasis: 50 mg SC twice weekly for 3 months, then 50 mg once weekly',
      'Train on SureClick autoinjector or prefilled syringe',
      'Biosimilar (Erelzi, Eticovo) may be formulary-preferred — verify with pharmacy',
      'Monitor for infections, TB reactivation, heart failure worsening, and demyelination'
    ],
    requiredForms: [
      { name: 'Enbrel SupportPlus Enrollment', url: 'https://www.enbrel.com/support/supportplus' },
      { name: 'PA Request Form', url: 'https://www.enbrel.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10',
        'TB and HBV screening results',
        'Prior DMARD failure (methotrexate preferred for RA)',
        'Baseline disease activity score'
      ],
      payers: [
        { name: 'Cigna', steps: ['Submit via myCigna provider portal', 'Include diagnosis, prior DMARD failure, and TB screen'], criteria: ['RA: failed MTX or other csDMARD', 'Biosimilar consideration required'], phone: '1-800-244-6224', portalUrl: 'https://cignaforhcp.cigna.com' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Enbrel Prescribing Information', 'FDA Label', 'Amgen/Pfizer Medical Information']
  },
  {
    brandName: 'Rinvoq',
    genericName: 'upadacitinib',
    manufacturer: 'AbbVie',
    therapeuticArea: 'Rheumatology/Dermatology/Gastroenterology',
    indication: ['Moderate-to-severe RA (adults)', 'Active psoriatic arthritis', 'Active ankylosing spondylitis', 'Active non-radiographic axSpA', 'Moderate-to-severe atopic dermatitis (age ≥12)', 'Moderately to severely active Crohn\'s disease', 'Moderately to severely active ulcerative colitis'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'myAbbVie Assist', phone: '1-833-477-9746', website: 'https://www.myabbvieassist.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and indication — Rinvoq has a BLACK BOX WARNING for serious infections, malignancy, major adverse cardiovascular events (MACE), and thrombosis',
      'Screen for TB (IGRA or TST) and HBV before initiating',
      'Obtain baseline CBC, lipids, liver enzymes, and creatinine',
      'Avoid in patients with active serious infection, ANC <1000, ALC <500, Hgb <8g/dL',
      'Review cardiovascular risk — use caution in patients ≥65, smokers, or those with CV risk factors',
      'Enroll in myAbbVie Assist program: 1-833-477-9746',
      'RA dose: 15 mg PO once daily; AD dose: 15 mg or 30 mg PO once daily',
      'IBD induction: 45 mg PO once daily for 8 weeks, then maintenance per indication',
      'Do not use with other JAK inhibitors, biologics, or strong immunosuppressants',
      'Monitor CBC, lipids, LFTs at 4–8 weeks after initiation, then every 3 months'
    ],
    requiredForms: [
      { name: 'myAbbVie Assist Enrollment', url: 'https://www.myabbvieassist.com' },
      { name: 'Rinvoq PA Support', url: 'https://www.rinvoq.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10',
        'TB and HBV screening',
        'Baseline labs (CBC, lipids, LFTs)',
        'Prior biologic or csDMARD failure (RA requires MTX failure)',
        'REMS not required but black box warning documentation recommended'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC portal', 'Document prior biologic failure', 'Include baseline lab results'], criteria: ['RA: prior MTX and TNF inhibitor failure', 'JAK inhibitor — may require specific step therapy per plan'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Rinvoq Prescribing Information', 'FDA Label', 'AbbVie Medical Information', 'FDA Black Box Warning Update 2021']
  },
  {
    brandName: 'Xeljanz',
    genericName: 'tofacitinib',
    manufacturer: 'Pfizer',
    therapeuticArea: 'Rheumatology/Gastroenterology/Dermatology',
    indication: ['Moderate-to-severe RA (adults)', 'Active psoriatic arthritis', 'Moderately to severely active ulcerative colitis', 'Active polyarticular juvenile idiopathic arthritis (age ≥2)', 'Active ankylosing spondylitis'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Pfizer RxPathways', phone: '1-844-989-PATH', website: 'https://www.pfizerrxpathways.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis — BLACK BOX WARNING for serious infections, malignancy, MACE, and thrombosis',
      'Screen for TB and HBV before initiating',
      'Obtain baseline CBC, LFTs, lipids, and creatinine',
      'Avoid initiation if ANC <1000, ALC <500, or Hgb <8 g/dL',
      'Cardiovascular risk assessment required — avoid in patients with known MACE risk unless no alternative',
      'Avoid in patients with DVT/PE history (thrombosis risk)',
      'Enroll in Pfizer RxPathways: 1-844-989-PATH',
      'RA: 5 mg PO twice daily (or XR 11 mg once daily); UC induction: 10 mg twice daily for 8 weeks',
      'Reduce dose if on moderate CYP3A4 inhibitors or strong CYP3A4 + CYP2C19 inhibitors',
      'Monitor CBC and lipids at 4–8 weeks, then every 3 months'
    ],
    requiredForms: [
      { name: 'Pfizer RxPathways Enrollment', url: 'https://www.pfizerrxpathways.com' },
      { name: 'Xeljanz PA Request', url: 'https://www.xeljanz.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Confirmed diagnosis with ICD-10',
        'TB and HBV screening documentation',
        'Baseline labs (CBC, lipids, LFTs)',
        'Prior DMARD failure (RA: MTX; UC: conventional therapy)',
        'Cardiovascular risk documentation'
      ],
      payers: [
        { name: 'Aetna', steps: ['Submit via Aetna portal', 'Include TB screen, baseline labs, and prior therapy failure'], criteria: ['RA: inadequate response to MTX', 'JAK inhibitor warnings acknowledged in clinical notes'], phone: '1-800-451-1527', portalUrl: 'https://www.aetna.com/providers' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Xeljanz Prescribing Information', 'FDA Label', 'FDA Black Box Warning Update 2021', 'Pfizer Medical Information']
  },

  // ─── NEUROLOGY / MULTIPLE SCLEROSIS ─────────────────────────────────────
  {
    brandName: 'Ocrevus',
    genericName: 'ocrelizumab',
    manufacturer: 'Genentech/Roche',
    therapeuticArea: 'Neurology/Multiple Sclerosis',
    indication: ['Relapsing forms of multiple sclerosis (RMS) including clinically isolated syndrome, RRMS, and active SPMS', 'Primary progressive multiple sclerosis (PPMS)'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Genentech Access Solutions', phone: '1-888-249-4918', website: 'https://www.ocrevus.com/support', states: [] }
    ],
    prescribingSteps: [
      'Confirm MS diagnosis — MRI with lesions consistent with MS required; classify as RMS or PPMS',
      'Screen for hepatitis B (HBsAg, anti-HBc, anti-HBs) — Ocrevus is CONTRAINDICATED in active HBV; treat HBV before initiating',
      'Obtain baseline CBC and immunoglobulins',
      'Ensure patient is up-to-date on all vaccinations at least 6 weeks before first dose (live vaccines contraindicated during treatment)',
      'Enroll in Genentech Access Solutions: 1-888-249-4918 or ocrevus.com/support',
      'Administer in an infusion center or clinic equipped to manage infusion reactions and anaphylaxis',
      'Initial dose: 300 mg IV infusion at week 0, then second 300 mg IV infusion at week 2',
      'Maintenance: 600 mg IV infusion every 6 months (starting 6 months after first infusion)',
      'Pre-medicate 30 min before each infusion: methylprednisolone 100 mg IV (or equivalent), antihistamine, and consider antipyretic',
      'Monitor patient for at least 1 hour after completion of each infusion for infusion reactions',
      'Monitor for PML (JC virus testing recommended at baseline and periodically)',
      'Monitor for herpes and other opportunistic infections throughout treatment'
    ],
    requiredForms: [
      { name: 'Genentech Access Solutions Enrollment', url: 'https://www.ocrevus.com/support' },
      { name: 'Ocrevus Infusion Order Form', url: 'https://www.ocrevus.com/hcp/getting-started' },
      { name: 'PA Support Documentation', url: 'https://www.ocrevus.com/hcp/access-and-reimbursement' }
    ],
    paRequirements: {
      general: [
        'Confirmed MS diagnosis with MRI documentation',
        'Classify as RMS or PPMS',
        'Negative HBV screening (HBsAg, anti-HBc)',
        'Baseline MRI report',
        'Infusion site confirmation (must be administered in clinical setting)',
        'Prior DMT history (some plans require prior first-line agent failure for RMS)'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC provider portal', 'Include MRI documentation, HBV screen, and MS classification', 'Confirm infusion site'], criteria: ['Confirmed MS diagnosis by neurologist', 'RMS: may require prior first-line DMT failure (interferon beta or glatiramer acetate)', 'PPMS: Ocrevus is only FDA-approved DMT — no step therapy required'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' },
        { name: 'Cigna', steps: ['Submit via myCigna provider portal or fax 855-216-2687', 'Include neurologist diagnosis confirmation and MRI report'], criteria: ['MS confirmed by neurologist', 'HBV screening negative', 'Infusion monitoring plan documented'], phone: '1-800-244-6224', portalUrl: 'https://cignaforhcp.cigna.com' },
        { name: 'Aetna', steps: ['Submit PA via Aetna portal', 'Include baseline MRI, HBV screen, vaccination status'], criteria: ['Confirmed RMS or PPMS', 'PPMS: no step therapy; RMS: may require prior agent trial'], phone: '1-800-451-1527', portalUrl: 'https://www.aetna.com/providers' },
        { name: 'Medicare Part B', steps: ['Ocrevus is covered under Medicare Part B (infusion drug)', 'Submit via CMS-1450 (UB-04) for facility or CMS-1500 for physician office', 'Include ICD-10 diagnosis code and NDC'], criteria: ['MS diagnosis with ICD-10 G35', 'Must be administered in approved infusion setting'], phone: '1-800-633-4227', portalUrl: 'https://www.cms.gov' }
      ]
    },
    lastVerified: new Date('2025-03-15'),
    dataSource: ['Ocrevus Prescribing Information', 'FDA Label', 'Genentech Medical Information', 'National MS Society Guidelines']
  },
  {
    brandName: 'Tysabri',
    genericName: 'natalizumab',
    manufacturer: 'Biogen',
    therapeuticArea: 'Neurology/Gastroenterology',
    indication: ['Relapsing forms of multiple sclerosis', 'Moderately to severely active Crohn\'s disease (inadequate response to TNF inhibitors)'],
    hasREMS: true,
    remsProgram: {
      name: 'TOUCH Prescribing Program (MS) / CD TOUCH Prescribing Program',
      requirements: [
        'Prescribers MUST be enrolled in and certified by the TOUCH Prescribing Program',
        'Patients MUST be enrolled in the TOUCH program before receiving Tysabri',
        'Infusion sites (pharmacies, infusion centers) MUST be registered in TOUCH',
        'Prescribers must re-evaluate patients at 3 months and 6 months after first infusion, then every 6 months thereafter',
        'JC virus antibody testing required at baseline and every 6 months — increased PML risk in JC+ patients',
        'MRI monitoring required — obtain baseline MRI before starting; monitor for PML signs',
        'Prescribers must document benefit/risk discussion with patient in TOUCH system every 6 months',
        'TOUCH authorization required for every infusion prescription',
        'Risk of Progressive Multifocal Leukoencephalopathy (PML) — a potentially fatal brain infection'
      ],
      enrollmentUrl: 'https://www.touchprescribingprogram.com',
      certificationRequired: true
    },
    specialtyPharmacies: [
      { name: 'Accredo Health Group (TOUCH-enrolled)', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty (TOUCH-enrolled)', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] }
    ],
    prescribingSteps: [
      'STEP 1 — Enroll in the TOUCH Prescribing Program at touchprescribingprogram.com (required before prescribing)',
      'STEP 2 — Confirm MS diagnosis and assess appropriateness — typically 2nd-line after DMT failure',
      'STEP 3 — Test JC virus antibody status (STRATIFY JCV) — higher PML risk if JC antibody positive (especially >2 years treatment + prior immunosuppressant use)',
      'STEP 4 — Obtain baseline MRI (brain with and without contrast)',
      'STEP 5 — Screen for HBV and hepatitis C before initiating',
      'STEP 6 — Enroll patient in TOUCH program and complete informed consent for PML risk',
      'STEP 7 — Prescribe Tysabri through a TOUCH-certified infusion center or pharmacy',
      'STEP 8 — Dose: 300 mg IV infusion over 1 hour, every 4 weeks',
      'STEP 9 — Monitor patient for 1 hour post-infusion for hypersensitivity reactions',
      'STEP 10 — Repeat JCV antibody testing every 6 months; obtain MRI every 6–12 months',
      'STEP 11 — Re-evaluate benefit/risk in TOUCH system at 3 months, 6 months, then every 6 months'
    ],
    requiredForms: [
      { name: 'TOUCH Prescriber Enrollment Form', url: 'https://www.touchprescribingprogram.com/register' },
      { name: 'TOUCH Patient Enrollment Form', url: 'https://www.touchprescribingprogram.com/patient' },
      { name: 'TOUCH Patient Status Assessment Form (every 6 months)', url: 'https://www.touchprescribingprogram.com/forms' },
      { name: 'JCV Antibody Test Request (STRATIFY)', url: 'https://www.stratifyjcv.com' }
    ],
    paRequirements: {
      general: [
        'Confirmed MS diagnosis with MRI',
        'TOUCH program enrollment confirmation for prescriber and patient',
        'JCV antibody status documented',
        'Typically requires prior DMT failure (e.g., interferon beta or glatiramer acetate for RMS)',
        'Baseline MRI report'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA with TOUCH enrollment confirmation', 'Include prior DMT failure and MRI documentation', 'JCV antibody status required'], criteria: ['Confirmed RMS with prior DMT failure', 'TOUCH enrollment mandatory'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' }
      ]
    },
    lastVerified: new Date('2025-03-15'),
    dataSource: ['Tysabri Prescribing Information', 'TOUCH Prescribing Program Guidelines', 'FDA REMS Database', 'Biogen Medical Information']
  },
  {
    brandName: 'Aubagio',
    genericName: 'teriflunomide',
    manufacturer: 'Sanofi',
    therapeuticArea: 'Neurology/Multiple Sclerosis',
    indication: ['Relapsing forms of multiple sclerosis including clinically isolated syndrome, relapsing-remitting MS, and active secondary progressive MS'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Walgreens Specialty', phone: '1-866-822-9999', website: 'https://www.walgreensspecialty.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis of relapsing form of MS',
      'Obtain baseline CBC, LFTs, serum creatinine, and blood pressure',
      'Screen for TB and active infections',
      'Conduct pregnancy test for females of reproductive potential — TERATOGENIC (Category X equivalent)',
      'Verify effective contraception is in place and counsel patient on contraception requirements',
      'Review contraindications: hepatic impairment (Child-Pugh B or C), pregnancy, nursing',
      'Enroll in MS LifeLines: 1-888-MS-LINES or mslifelines.com',
      'Initiate at 7 mg or 14 mg orally once daily',
      'Monitor LFTs monthly for first 6 months, then as clinically indicated',
      'Monitor for peripheral neuropathy, skin reactions, and hypertension',
      'Drug elimination procedure (cholestyramine or activated charcoal) available if rapid removal needed (e.g., pregnancy desire)'
    ],
    requiredForms: [
      { name: 'MS LifeLines Enrollment', url: 'https://www.mslifelines.com' },
      { name: 'PA Support Documentation', url: 'https://www.aubagio.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Confirmed MS diagnosis with MRI documentation',
        'Baseline LFTs and CBC',
        'Pregnancy test results (if applicable)',
        'Prior DMT history if step therapy required'
      ],
      payers: [
        { name: 'BlueCross BlueShield', steps: ['Submit PA via BCBS provider portal', 'Include MRI documentation and clinical rationale'], criteria: ['Confirmed relapsing MS', 'May require step therapy through injectable DMTs first'], phone: '1-800-676-2583', portalUrl: 'https://www.bcbs.com/providers' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Aubagio Prescribing Information', 'FDA Label', 'MS LifeLines Program']
  },

  // ─── ONCOLOGY / HEMATOLOGY ──────────────────────────────────────────────
  {
    brandName: 'Revlimid',
    genericName: 'lenalidomide',
    manufacturer: 'Bristol Myers Squibb',
    therapeuticArea: 'Oncology/Hematology',
    indication: ['Multiple myeloma (newly diagnosed and relapsed/refractory)', 'Myelodysplastic syndromes with del(5q)', 'Mantle cell lymphoma (after ≥2 prior therapies)', 'Follicular lymphoma', 'Marginal zone lymphoma'],
    hasREMS: true,
    remsProgram: {
      name: 'REVLIMID REMS',
      requirements: [
        'Prescribers MUST be certified in the REVLIMID REMS program',
        'Patients MUST be enrolled in REVLIMID REMS and comply with all conditions before each prescription',
        'Pharmacies MUST be certified in the REVLIMID REMS program',
        'Females of reproductive potential: 2 negative pregnancy tests required before first dose (24–48 hrs before); monthly tests during therapy',
        'All patients of reproductive potential must use 2 forms of contraception',
        'No blood or sperm donation while on Revlimid',
        'Prescriptions limited to a 28-day supply; no refills allowed',
        'Prescription must be filled within 7 days of authorization number issuance',
        'Thalidomide analogue — teratogenic; treat patients as potential for pregnancy'
      ],
      enrollmentUrl: 'https://www.revlimidrems.com',
      certificationRequired: true
    },
    specialtyPharmacies: [
      { name: 'Accredo Health Group (REMS-certified)', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'BioPlus Specialty Pharmacy', phone: '1-888-514-8082', website: 'https://www.bioplusrx.com', states: [] },
      { name: 'CVS Specialty (REMS-certified)', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] }
    ],
    prescribingSteps: [
      'STEP 1 — Certify as a REVLIMID REMS prescriber at revlimidrems.com (one-time; requires attestation)',
      'STEP 2 — Confirm patient eligibility and enroll patient in REVLIMID REMS',
      'STEP 3 — For female patients of reproductive potential: obtain 2 pregnancy tests (within 10–14 days and 24 hrs before first dose)',
      'STEP 4 — Counsel patient on teratogenicity and mandatory contraception (2 methods for females of reproductive potential)',
      'STEP 5 — Obtain patient signature on Patient-Physician Agreement Form',
      'STEP 6 — Write prescription for no more than 28-day supply — NO refills',
      'STEP 7 — Obtain authorization number: call 1-888-423-5436 or use revlimidrems.com',
      'STEP 8 — Write authorization number on prescription',
      'STEP 9 — Patient fills at REMS-certified specialty pharmacy only within 7 days',
      'STEP 10 — Monthly pregnancy testing for females; monthly REMS compliance verification',
      'STEP 11 — Monitor CBC (lenalidomide commonly causes cytopenias) and renal function; dose adjust for CrCl <60 mL/min'
    ],
    requiredForms: [
      { name: 'REVLIMID REMS Prescriber Enrollment', url: 'https://www.revlimidrems.com/prescriber-enrollment' },
      { name: 'REVLIMID REMS Patient Enrollment', url: 'https://www.revlimidrems.com/patient-enrollment' },
      { name: 'Patient-Physician Agreement Form', url: 'https://www.revlimidrems.com/forms' },
      { name: 'Pregnancy Testing Confirmation Form', url: 'https://www.revlimidrems.com/forms' }
    ],
    paRequirements: {
      general: [
        'Confirmed hematologic malignancy diagnosis with pathology report',
        'REMS enrollment confirmation (prescriber + patient)',
        'Pregnancy test results if applicable',
        'Prior therapy documentation for relapsed/refractory settings'
      ],
      payers: [
        { name: 'Medicare Part D', steps: ['Submit PA through Medicare Part D plan portal', 'Include REMS enrollment confirmation', 'Document indication and prior therapy'], criteria: ['FDA-approved indication required', 'REMS mandatory participation'], phone: '1-800-633-4227', portalUrl: 'https://www.cms.gov' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['REVLIMID Prescribing Information', 'REVLIMID REMS Program', 'FDA REMS Database']
  },
  {
    brandName: 'Keytruda',
    genericName: 'pembrolizumab',
    manufacturer: 'Merck',
    therapeuticArea: 'Oncology',
    indication: ['Melanoma (unresectable or metastatic; adjuvant)', 'Non-small cell lung cancer (NSCLC) — multiple settings', 'Head and neck squamous cell carcinoma (HNSCC)', 'Classical Hodgkin lymphoma', 'MSI-H/dMMR cancer (any solid tumor)', 'Urothelial carcinoma', 'Gastric/gastroesophageal junction adenocarcinoma', 'Esophageal cancer', 'Cervical cancer', 'Hepatocellular carcinoma', 'Merkel cell carcinoma', 'Renal cell carcinoma', 'Endometrial carcinoma', 'Tumor mutational burden-high (TMB-H) cancer', 'Triple-negative breast cancer', 'Colorectal cancer (MSI-H/dMMR)', 'Biliary tract cancer', 'Colorectal cancer 1L'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Merck Access Program', phone: '1-855-257-3932', website: 'https://www.merck.com/product/usa/pi_circulars/k/keytruda/keytruda_pi.pdf', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and FDA-approved indication — Keytruda has 40+ indications; confirm specific indication, line of therapy, and required biomarker testing',
      'Order biomarker testing as required by indication: PD-L1 (TPS or CPS by IHC), MSI-H/dMMR (IHC or PCR), TMB-H (NGS panel), HER2, FGFR2b',
      'For NSCLC: PD-L1 testing required (TPS ≥50% for 1L monotherapy); for gastric: CPS ≥1; for TNBC: CPS ≥10',
      'Review ECOG performance status (must be 0–2 for most indications)',
      'Screen for autoimmune conditions — risk of immune-mediated adverse reactions',
      'Enroll in Merck Access Program or Merck Engage patient support: 1-855-257-3932',
      'Keytruda dose: 200 mg IV every 3 weeks OR 400 mg IV every 6 weeks (fixed dosing)',
      'Administer IV infusion over 30 minutes — do NOT administer as bolus or rapid infusion',
      'Submit to specialty pharmacy or administer via buy-and-bill in infusion setting',
      'Monitor for immune-mediated adverse reactions: pneumonitis, colitis, hepatitis, endocrinopathies, nephritis',
      'Hold or permanently discontinue per immune-related toxicity grading guidelines',
      'Thyroid function testing at baseline and periodically'
    ],
    requiredForms: [
      { name: 'Merck Access Program Enrollment', url: 'https://www.merck.com/product/patients/merck-access-program' },
      { name: 'Keytruda PA Support', url: 'https://www.keytruda.com/hcp/billing-and-reimbursement' },
      { name: 'Biomarker Testing Order (PD-L1/MSI)', url: 'https://www.keytruda.com/hcp/biomarker-testing' }
    ],
    paRequirements: {
      general: [
        'Confirmed cancer diagnosis with pathology report and stage',
        'Biomarker test results (PD-L1, MSI-H, or other indication-specific markers)',
        'ECOG performance status documentation',
        'Prior therapy documentation (for later-line settings)',
        'Indication-specific criteria — consult NCCN guidelines for each cancer type'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC oncology portal', 'Include pathology report, biomarker results, ECOG status', 'Reference specific indication and NCCN guideline support'], criteria: ['FDA-approved indication required', 'Biomarker testing results required for most indications', 'Line of therapy must match FDA approval'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' },
        { name: 'Medicare Part B', steps: ['Keytruda covered under Medicare Part B (infusion drug)', 'Use J-code J9271 (pembrolizumab, 1 mg)', 'Submit via CMS-1500 or UB-04 with appropriate diagnosis codes'], criteria: ['FDA-approved indication', 'HCPCS J-code required'], phone: '1-800-633-4227', portalUrl: 'https://www.cms.gov' }
      ]
    },
    lastVerified: new Date('2025-03-15'),
    dataSource: ['Keytruda Prescribing Information', 'FDA Label', 'NCCN Clinical Practice Guidelines', 'Merck Medical Information']
  },
  {
    brandName: 'Ibrance',
    genericName: 'palbociclib',
    manufacturer: 'Pfizer',
    therapeuticArea: 'Oncology/Breast Cancer',
    indication: ['HR-positive, HER2-negative advanced or metastatic breast cancer (in combination with an aromatase inhibitor or fulvestrant)'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Pfizer RxPathways', phone: '1-844-989-PATH', website: 'https://www.pfizerrxpathways.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm HR+/HER2- advanced or metastatic breast cancer diagnosis with pathology/IHC',
      'Confirm patient is appropriate for combination CDK4/6 inhibitor therapy',
      'Obtain baseline CBC — neutropenia is the most common adverse effect',
      'Enroll in Pfizer RxPathways for patient assistance: 1-844-989-PATH',
      'Ibrance dose: 125 mg PO once daily for 21 days, then 7-day rest (28-day cycle)',
      'Administer with food; take capsules whole (do not open/crush)',
      'Combine with letrozole 2.5 mg daily (postmenopausal, 1L) or fulvestrant 500 mg IM (pre/postmenopausal)',
      'Premenopausal patients: add LHRH agonist (e.g., goserelin, leuprolide)',
      'Monitor CBC at baseline, day 14 of first 2 cycles, then before each cycle',
      'Dose reduce for Grade 3/4 neutropenia per prescribing information'
    ],
    requiredForms: [
      { name: 'Pfizer RxPathways Enrollment', url: 'https://www.pfizerrxpathways.com' },
      { name: 'Ibrance Together Patient Support', url: 'https://www.ibrance.com/patient-support' }
    ],
    paRequirements: {
      general: [
        'Confirmed HR+/HER2- advanced/metastatic breast cancer (pathology/IHC report)',
        'Documentation of concurrent endocrine therapy (aromatase inhibitor or fulvestrant)',
        'Premenopausal status documentation if applicable (add LHRH agonist)',
        'Baseline CBC results'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC portal', 'Include pathology report with HR+/HER2- results and stage documentation'], criteria: ['HR+/HER2- advanced or metastatic breast cancer', 'Combination with endocrine therapy required'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Ibrance Prescribing Information', 'FDA Label', 'Pfizer Medical Information', 'NCCN Breast Cancer Guidelines']
  },
  {
    brandName: 'Imbruvica',
    genericName: 'ibrutinib',
    manufacturer: 'AbbVie/Janssen',
    therapeuticArea: 'Oncology/Hematology',
    indication: ['Mantle cell lymphoma (MCL)', 'Chronic lymphocytic leukemia (CLL)/Small lymphocytic lymphoma (SLL)', 'Waldenström\'s macroglobulinemia', 'Marginal zone lymphoma', 'Chronic graft versus host disease (cGVHD)'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'AbbVie Imbruvica Access', phone: '1-877-877-3536', website: 'https://www.imbruvica.com/support', states: [] }
    ],
    prescribingSteps: [
      'Confirm diagnosis and indication (CLL, MCL, WM, MZL, or cGVHD) with pathology/flow cytometry',
      'Review contraindications: avoid strong CYP3A inhibitors/inducers (significant drug interactions)',
      'Assess cardiac risk — atrial fibrillation and ventricular arrhythmias are known risks; obtain baseline ECG',
      'Check platelet count and bleeding history — increased bleeding risk; hold for surgery',
      'Avoid anticoagulants and antiplatelet drugs when possible; consult hematology if needed',
      'Enroll in Imbruvica Access support: 1-877-877-3536 or imbruvica.com',
      'CLL/SLL dose: 420 mg PO once daily (3 capsules × 140 mg)',
      'MCL: 560 mg PO once daily (4 capsules × 140 mg)',
      'Take at same time each day with water; capsules whole — do not open/chew',
      'Monitor CBC monthly, LFTs periodically, and assess cardiac rhythm as clinically indicated'
    ],
    requiredForms: [
      { name: 'Imbruvica Access Enrollment', url: 'https://www.imbruvica.com/support/financial-assistance' },
      { name: 'PA Support Form', url: 'https://www.imbruvica.com/hcp/getting-started' }
    ],
    paRequirements: {
      general: [
        'Pathology/flow cytometry confirming diagnosis (CLL, MCL, etc.)',
        'Line of therapy documentation',
        'Cardiac assessment (AFib risk)',
        'Drug interaction review (CYP3A4 inhibitors/inducers)'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC portal', 'Include pathology report and prior therapy for relapsed/refractory settings'], criteria: ['FDA-approved indication confirmed', 'CLL: can be used first-line'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Imbruvica Prescribing Information', 'FDA Label', 'AbbVie/Janssen Medical Information', 'NCCN Hematology Guidelines']
  },

  // ─── RARE DISEASE ────────────────────────────────────────────────────────
  {
    brandName: 'Soliris',
    genericName: 'eculizumab',
    manufacturer: 'Alexion/AstraZeneca',
    therapeuticArea: 'Rare Disease/Hematology/Nephrology/Neurology',
    indication: ['Paroxysmal nocturnal hemoglobinuria (PNH)', 'Atypical hemolytic uremic syndrome (aHUS)', 'Generalized myasthenia gravis (gMG)', 'Neuromyelitis optica spectrum disorder (NMOSD)'],
    hasREMS: true,
    remsProgram: {
      name: 'SOLIRIS REMS',
      requirements: [
        'Prescribers must be enrolled in the SOLIRIS REMS program',
        'Patients must receive meningococcal vaccines at least 2 weeks before first dose: MenACWY (Menveo or Menactra) AND MenB (Bexsero or Trumenba)',
        'If immediate treatment required: administer prophylactic antibiotics (penicillin V potassium or amoxicillin) for 2 weeks post-vaccination',
        'Patients must also be vaccinated against H. influenzae type b and S. pneumoniae',
        'Patients must receive a Patient Safety Card and carry it at all times during and after treatment',
        'Counsel patients on signs/symptoms of meningococcal infection: fever, headache, stiff neck, rash',
        'Monitor for early signs of meningococcal infection throughout and up to 8 months after treatment discontinuation'
      ],
      enrollmentUrl: 'https://www.solirisrems.com',
      certificationRequired: true
    },
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'Diplomat Specialty Pharmacy', phone: '1-877-977-9118', website: 'https://www.diplomatpharmacy.com', states: [] },
      { name: 'Biologics Inc.', phone: '1-800-850-4306', website: 'https://www.biologicsinc.com', states: [] }
    ],
    prescribingSteps: [
      'STEP 1 — Confirm rare disease diagnosis (PNH: flow cytometry; aHUS: clinical + genetic; gMG: AChR/MuSK antibodies; NMOSD: AQP4-IgG)',
      'STEP 2 — Enroll in SOLIRIS REMS at solirisrems.com',
      'STEP 3 — Administer meningococcal vaccines (MenACWY + MenB) at least 2 weeks before first infusion',
      'STEP 4 — If urgent: vaccinate immediately and provide prophylactic antibiotics for 2 weeks',
      'STEP 5 — Vaccinate against H. influenzae type b and S. pneumoniae if not current',
      'STEP 6 — Enroll patient in REMS and provide Patient Safety Card',
      'STEP 7 — Submit prescription to REMS-enrolled specialty pharmacy',
      'STEP 8 — PNH dose: 600 mg IV weekly ×4, then 900 mg week 5, then 900 mg every 2 weeks',
      'STEP 9 — Administer IV over 25–45 minutes; monitor for infusion reactions',
      'STEP 10 — Monitor CBC, LDH, urinalysis; monitor for signs of meningococcal infection',
      'STEP 11 — Never abruptly discontinue — serious hemolysis may occur; taper with medical supervision if stopping'
    ],
    requiredForms: [
      { name: 'SOLIRIS REMS Prescriber Enrollment', url: 'https://www.solirisrems.com/enroll-prescriber' },
      { name: 'SOLIRIS REMS Patient Enrollment', url: 'https://www.solirisrems.com/enroll-patient' },
      { name: 'Vaccination Documentation Form', url: 'https://www.solirisrems.com/forms' },
      { name: 'OneSource Patient Support Enrollment', url: 'https://alexion.com/patients-caregivers/onesource' }
    ],
    paRequirements: {
      general: [
        'Laboratory-confirmed rare disease diagnosis',
        'REMS enrollment confirmation',
        'Vaccination documentation (meningococcal MenACWY + MenB)',
        'Letter of medical necessity from specialist (hematologist, nephrologist, or neurologist)'
      ],
      payers: [
        { name: 'Commercial Insurance', steps: ['Submit PA with full clinical documentation', 'Include REMS enrollment and vaccination confirmation', 'Specialist letter of necessity required'], criteria: ['Confirmed rare disease diagnosis', 'REMS participation mandatory'], phone: 'Varies by plan', portalUrl: 'Contact individual payer' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Soliris Prescribing Information', 'SOLIRIS REMS Program', 'FDA REMS Database', 'Alexion Medical Information']
  },

  // ─── ENDOCRINOLOGY / METABOLIC ───────────────────────────────────────────
  {
    brandName: 'Ozempic',
    genericName: 'semaglutide (injection)',
    manufacturer: 'Novo Nordisk',
    therapeuticArea: 'Endocrinology/Cardiology',
    indication: ['Type 2 diabetes mellitus — to improve glycemic control', 'Reduce risk of major adverse cardiovascular events (CV death, non-fatal MI, non-fatal stroke) in adults with T2DM and established cardiovascular disease'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty/Retail', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Novo Nordisk Cares', phone: '1-833-NOVO-411', website: 'https://www.novocare.com', states: [] }
    ],
    prescribingSteps: [
      'Confirm T2DM diagnosis and assess glycemic status (HbA1c, fasting glucose)',
      'Review contraindications: personal/family history of medullary thyroid carcinoma (MTC) or Multiple Endocrine Neoplasia syndrome type 2 (MEN2) — BLACK BOX WARNING',
      'Assess for pancreatitis history — use with caution',
      'Evaluate renal and hepatic function at baseline',
      'Enroll in NovoCare patient support: 1-833-NOVO-411 or novocare.com',
      'Starting dose: 0.25 mg SC once weekly for 4 weeks (initiation dose)',
      'After 4 weeks: increase to 0.5 mg SC once weekly; can increase to 1 mg if needed after 4+ weeks',
      'Max dose: 2 mg SC once weekly',
      'Inject in abdomen, thigh, or upper arm; rotate sites; same day each week',
      'Store in refrigerator (36–46°F); after first use may store at room temp up to 56 days',
      'Note: NOT indicated for weight loss (Wegovy/semaglutide 2.4 mg is FDA-approved for obesity)'
    ],
    requiredForms: [
      { name: 'NovoCare Enrollment', url: 'https://www.novocare.com/ozempic' },
      { name: 'PA Support Form', url: 'https://www.ozempic.com/getting-ozempic/insurance-coverage.html' }
    ],
    paRequirements: {
      general: [
        'Confirmed T2DM diagnosis (ICD-10 E11.x)',
        'Current HbA1c and fasting glucose',
        'Prior metformin trial (most payers require)',
        'Cardiovascular risk assessment (for CV indication)',
        'Contraindication screening documentation (MTC/MEN2 family history)'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC portal', 'Include HbA1c, T2DM diagnosis, and prior metformin/sulfonylurea trial'], criteria: ['T2DM confirmed', 'Prior first-line therapy failure (metformin)', 'CV indication: documented CVD history'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' },
        { name: 'Cigna', steps: ['Submit via myCigna portal', 'Include HbA1c and prior therapy documentation'], criteria: ['T2DM with HbA1c above goal', 'Metformin trial required unless contraindicated'], phone: '1-800-244-6224', portalUrl: 'https://cignaforhcp.cigna.com' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Ozempic Prescribing Information', 'FDA Label', 'Novo Nordisk Medical Information', 'ADA Standards of Care 2025']
  },
  {
    brandName: 'Repatha',
    genericName: 'evolocumab',
    manufacturer: 'Amgen',
    therapeuticArea: 'Cardiology/Endocrinology',
    indication: ['Adults with established cardiovascular disease to reduce MI, stroke, and coronary revascularization', 'Adults with primary hyperlipidemia (heterozygous familial hypercholesterolemia — HeFH) as adjunct to diet and maximally tolerated statin therapy', 'Homozygous familial hypercholesterolemia (HoFH) as adjunct to diet and other LDL-lowering therapies'],
    hasREMS: false,
    specialtyPharmacies: [
      { name: 'Accredo Health Group', phone: '1-800-803-2523', website: 'https://www.accredo.com', states: [] },
      { name: 'CVS Specialty', phone: '1-800-237-2767', website: 'https://www.cvsspecialty.com', states: [] },
      { name: 'Amgen Repatha Copay Card', phone: '1-844-REPATHA', website: 'https://www.repatha.com/support', states: [] }
    ],
    prescribingSteps: [
      'Confirm indication: ASCVD risk reduction OR primary hyperlipidemia (HeFH or HoFH)',
      'Document baseline LDL-C, total cholesterol, and triglycerides',
      'Confirm patient is on maximally tolerated statin therapy (required for non-HoFH indications)',
      'For FH: document LDL receptor mutation or clinical FH criteria (Simon Broome or Dutch Lipid Clinic)',
      'Enroll patient in Repatha patient support: 1-844-REPATHA or repatha.com',
      'Hyperlipidemia/ASCVD dose: 140 mg SC every 2 weeks OR 420 mg SC monthly',
      'HoFH: 420 mg SC monthly',
      'Administer SC in abdomen, thigh, or upper arm; rotate sites',
      'Sureclick autoinjector or prefilled syringe — train patient on self-injection',
      'Repeat fasting lipid panel 4–8 weeks after initiation to assess response'
    ],
    requiredForms: [
      { name: 'Repatha SupportPlus Enrollment', url: 'https://www.repatha.com/support' },
      { name: 'PA Documentation Form', url: 'https://www.repatha.com/hcp' }
    ],
    paRequirements: {
      general: [
        'Baseline LDL-C (typically ≥70 mg/dL on maximally tolerated statin for ASCVD; ≥100 mg/dL for HeFH)',
        'Documentation of maximally tolerated statin therapy with response',
        'ASCVD diagnosis or FH documentation',
        'Statin intolerance documentation if statin-free'
      ],
      payers: [
        { name: 'UnitedHealthcare', steps: ['Submit PA via UHC portal', 'Include lipid panel, statin trial documentation, and ASCVD or FH diagnosis'], criteria: ['ASCVD: LDL ≥70 mg/dL on max statin', 'HeFH: LDL ≥100 mg/dL on max statin', 'Documentation of maximally tolerated statin'], phone: '1-888-638-6613', portalUrl: 'https://www.uhcprovider.com' },
        { name: 'Aetna', steps: ['Submit via Aetna portal', 'Include 2+ statin trials documentation or statin intolerance'], criteria: ['LDL threshold criteria met', 'Maximally tolerated statin required'], phone: '1-800-451-1527', portalUrl: 'https://www.aetna.com/providers' }
      ]
    },
    lastVerified: new Date('2025-03-01'),
    dataSource: ['Repatha Prescribing Information', 'FDA Label', 'Amgen Medical Information', 'ACC/AHA Cholesterol Guidelines']
  }
];

async function seed() {
  try {
    await mongoose.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/specialtyrx');
    console.log('Connected to MongoDB');

    await Drug.deleteMany({});
    console.log('Cleared existing drugs');

    const created = await Drug.insertMany(drugs);
    console.log(`\nSeeded ${created.length} drugs:`);
    created.forEach(d => console.log(`  ✓ ${d.brandName} (${d.genericName}) — ${d.therapeuticArea}${d.hasREMS ? ' [REMS]' : ''}`));

    console.log('\nSeed complete!');
    process.exit(0);
  } catch (err) {
    console.error('Seed error:', err.message);
    process.exit(1);
  }
}

seed();
