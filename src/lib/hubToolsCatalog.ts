export interface HubToolEntry {
  slug: string;
  name: string;
  description: string;
  category: string;
  hub: 'wellness' | 'startup' | 'freelancer';
  url: string;
  tags: string[];
}

export const HUB_TOOLS_CATALOG: HubToolEntry[] = [
  // --- Wellness Hub (14 Tools) ---
  {
    slug: 'tool-jaw-align',
    name: 'Jaw Alignment Webcam Game',
    description: 'Real-time webcam tracking to detect TMJ clenching and guide jaw alignment.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-jaw-align',
    tags: ['tmj', 'jaw alignment', 'webcam', 'posture', 'wellness']
  },
  {
    slug: 'tool-blink-monitor',
    name: 'Eye Strain & Blink Counter',
    description: 'Tracks blink frequency via computer vision to prevent dry eyes and digital eye fatigue.',
    category: 'Vision / Optometry',
    hub: 'wellness',
    url: '/hubs/wellness#tool-blink-monitor',
    tags: ['blink counter', 'eye strain', 'computer vision', 'optometry']
  },
  {
    slug: 'tool-tech-neck',
    name: 'Tech Neck Posture Alarm',
    description: 'Monitors cervical spine flexion and sounds an audio cue when your neck droops.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-tech-neck',
    tags: ['posture', 'tech neck', 'ergonomics', 'spine']
  },
  {
    slug: 'tool-proximity',
    name: 'Screen Distance Checker',
    description: 'Calibrates optimal viewing distance to protect against myopia and screen fatigue.',
    category: 'Vision / Optometry',
    hub: 'wellness',
    url: '/hubs/wellness#tool-proximity',
    tags: ['screen distance', 'myopia', 'eye health', 'ergonomics']
  },
  {
    slug: 'tool-stress',
    name: 'Mental Stress Face Tracker',
    description: 'Analyzes micro-tensions in facial musculature to gauge cognitive stress load.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-stress',
    tags: ['stress tracker', 'facial analysis', 'biofeedback', 'wellness']
  },
  {
    slug: 'tool-nsdr',
    name: 'Mood Fixer & Yoga Plan',
    description: 'Guided non-sleep deep rest (NSDR) audio and physiological reset protocols.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-nsdr',
    tags: ['nsdr', 'deep rest', 'meditation', 'relaxation']
  },
  {
    slug: 'tool-caffeine',
    name: 'Coffee Sleep Calculator',
    description: 'Models caffeine half-life and calculates your optimal afternoon cutoff time.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-caffeine',
    tags: ['caffeine', 'half life', 'sleep calculator', 'adenosine']
  },
  {
    slug: 'tool-zeigarnik',
    name: 'Brain Fog & Mental RAM Calculator',
    description: 'Quantifies cognitive debt caused by unfinished tasks and open mental loops.',
    category: 'Brain / Cognition',
    hub: 'wellness',
    url: '/hubs/wellness#tool-zeigarnik',
    tags: ['zeigarnik', 'brain fog', 'mental ram', 'cognition']
  },
  {
    slug: 'tool-mind-clear',
    name: 'Brain Dump Note & Trash',
    description: 'Local distraction notepad with an intentional destroy animation to clear working memory.',
    category: 'Brain / Cognition',
    hub: 'wellness',
    url: '/hubs/wellness#tool-mind-clear',
    tags: ['brain dump', 'notes', 'working memory', 'focus']
  },
  {
    slug: 'tool-chronotype',
    name: 'Best Time to Work Calculator',
    description: 'Maps your biological circadian rhythm to peak cognitive execution blocks.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-chronotype',
    tags: ['chronotype', 'circadian rhythm', 'productivity', 'energy']
  },
  {
    slug: 'tool-cognitive-debt',
    name: 'Phone Distraction Calculator',
    description: 'Measures hours lost to context switching and notification disruptions.',
    category: 'Brain / Cognition',
    hub: 'wellness',
    url: '/hubs/wellness#tool-cognitive-debt',
    tags: ['phone distraction', 'context switching', 'screen time']
  },
  {
    slug: 'tool-screen-time',
    name: 'Screen Time Life Calculator',
    description: 'Calculates the cumulative lifetime years spent looking at screens based on daily usage.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-screen-time',
    tags: ['screen time', 'lifetime calculator', 'habits']
  },
  {
    slug: 'tool-intention',
    name: 'One Goal Focus Saver',
    description: 'Single-task commitment anchor that locks your display to one primary objective.',
    category: 'Brain / Cognition',
    hub: 'wellness',
    url: '/hubs/wellness#tool-intention',
    tags: ['one goal', 'focus', 'deep work', 'intention']
  },
  {
    slug: 'tool-detox',
    name: 'Screen Detox Planner',
    description: 'Structured protocol for tapering device usage and reclaiming evening hours.',
    category: 'Wellness / Biofeedback',
    hub: 'wellness',
    url: '/hubs/wellness#tool-detox',
    tags: ['digital detox', 'screen tapering', 'sleep hygiene']
  },

  // --- Startup Hub (13 Tools) ---
  {
    slug: 'tool-freemium',
    name: 'Freemium Compute Death Simulator',
    description: 'Simulates cloud server and API inference cost escalation under freemium tier growth.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-freemium',
    tags: ['freemium', 'api cost', 'cloud compute', 'startup unit economics']
  },
  {
    slug: 'tool-equity',
    name: 'Co-Founder Equity Engine',
    description: 'Calculates dynamic equity splits based on risk, idea validation, IP, and capital contributions.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-equity',
    tags: ['co-founder equity', 'cap table', 'vesting', 'equity split']
  },
  {
    slug: 'tool-wcds',
    name: 'Working Capital Death Spiral Engine',
    description: 'Models accounts receivable delays vs accounts payable to spot solvency cliffs.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-wcds',
    tags: ['working capital', 'cash flow', 'insolvency', 'finance']
  },
  {
    slug: 'tool-daoc',
    name: 'Founder Opportunity Cost (DAOC)',
    description: 'Quantifies lost corporate salary and market compounding against venture equity value.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-daoc',
    tags: ['opportunity cost', 'founder salary', 'equity valuation']
  },
  {
    slug: 'tool-zombie',
    name: 'Zombie Startup Warning System',
    description: 'Audits gross margin, growth rate, and burn efficiency to detect stagnant operational traps.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-zombie',
    tags: ['zombie startup', 'venture metrics', 'growth rate', 'burn multiple']
  },
  {
    slug: 'tool-runway',
    name: 'Dynamic Runway Calculator',
    description: 'Simulates net burn, variable revenue growth curves, and cash-out zero dates.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-runway',
    tags: ['cash runway', 'net burn', 'runway calculator', 'startup runway']
  },
  {
    slug: 'tool-saas-metrics',
    name: 'SaaS Metrics Engine',
    description: 'Calculates ARR, MRR, Quick Ratio, Magic Number, and Net Revenue Retention.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-saas-metrics',
    tags: ['saas metrics', 'arr', 'mrr', 'quick ratio', 'nrr']
  },
  {
    slug: 'tool-cap-table',
    name: 'Cap Table Simulator',
    description: 'Models pre-seed through Series B dilution, employee stock option pools (ESOP), and SAFE notes.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-cap-table',
    tags: ['cap table', 'dilution', 'safe notes', 'esop']
  },
  {
    slug: 'tool-exit-waterfall',
    name: 'Exit Waterfall Simulator',
    description: 'Calculates liquidation preferences, participating preferred shares, and common distributions.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-exit-waterfall',
    tags: ['exit waterfall', 'liquidation preference', 'm&a distribution']
  },
  {
    slug: 'tool-unit-economics',
    name: 'Unit Economics Engine',
    description: 'Calculates Contribution Margin 1/2/3, Customer Acquisition Cost, and Payback Period.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-unit-economics',
    tags: ['unit economics', 'cac payback', 'contribution margin', 'ltv']
  },
  {
    slug: 'tool-validator',
    name: 'Idea Validator Matrix',
    description: 'Scoring engine evaluating market urgency, regulatory friction, and distribution leverage.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-validator',
    tags: ['idea validator', 'market size', 'startup validation']
  },
  {
    slug: 'tool-registries',
    name: 'Global Incorporation & IP Registries',
    description: 'Direct directory of official company and patent registrars across Delaware, UK, EU, and Asia.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-registries',
    tags: ['incorporation', 'delaware c-corp', 'company house', 'patents']
  },
  {
    slug: 'tool-contract',
    name: 'Legal Agreement Engine',
    description: 'Generates standardized NDA, advisory agreement, and mutual IP assignment templates locally.',
    category: 'Productivity / Utility',
    hub: 'startup',
    url: '/hubs/startup#tool-contract',
    tags: ['nda generator', 'legal agreement', 'advisory shares']
  },

  // --- Freelancer Hub (11 Tools) ---
  {
    slug: 'tool-ppp',
    name: 'Global PPP Pricing Engine',
    description: 'Normalizes international client project quotes based on World Bank Purchasing Power Parity.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-ppp',
    tags: ['purchasing power parity', 'ppp pricing', 'international rates']
  },
  {
    slug: 'tool-ltv-cac',
    name: 'Freelance LTV & CAC Engine',
    description: 'Computes lifetime retainer value and client acquisition costs for independent consultants.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-ltv-cac',
    tags: ['freelance ltv', 'retainer value', 'client cac']
  },
  {
    slug: 'tool-risk-analyzer',
    name: 'Client Concentration Risk Analyzer',
    description: 'Calculates portfolio Herfindahl index to identify high-risk single-client revenue dependency.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-risk-analyzer',
    tags: ['client concentration', 'revenue risk', 'herfindahl index']
  },
  {
    slug: 'tool-scope-creep',
    name: 'Scope Creep Margin Quantifier',
    description: 'Quantifies billable margin loss resulting from uncontracted revisions and out-of-scope requests.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-scope-creep',
    tags: ['scope creep', 'billable hours', 'project margin']
  },
  {
    slug: 'tool-ai-roi',
    name: 'AI Delegation ROI Engine',
    description: 'Calculates the real hourly cost benefit of automating repetitive administrative workflows.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-ai-roi',
    tags: ['ai roi', 'workflow automation', 'hourly savings']
  },
  {
    slug: 'tool-zoom-tax',
    name: 'Zoom Tax Meeting Cost Calculator',
    description: 'Calculates the true billable cost of multi-stakeholder video conference calls.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-zoom-tax',
    tags: ['zoom tax', 'meeting cost', 'billable rate']
  },
  {
    slug: 'tool-creator-revenue',
    name: 'Creator Revenue Predictor',
    description: 'Models sponsorship rates, newsletter subscriptions, and course sales across follower tiers.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-creator-revenue',
    tags: ['creator revenue', 'sponsorship calculator', 'newsletter economics']
  },
  {
    slug: 'tool-hourly-rate',
    name: 'Hourly Rate Engineer',
    description: 'Back-calculates target billing rates based on taxes, non-billable hours, and retirement goals.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-hourly-rate',
    tags: ['hourly rate', 'freelance billing', 'target income']
  },
  {
    slug: 'tool-global-tax',
    name: 'Global Tax Estimator',
    description: 'Estimates self-employment tax obligations and business deductions across jurisdictions.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-global-tax',
    tags: ['freelance tax', 'self employment tax', 'deductions']
  },
  {
    slug: 'tool-red-flag',
    name: 'Client Red Flag Scanner',
    description: 'Analyzes project brief wording and scope clauses to identify problematic payment risks.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-red-flag',
    tags: ['red flag scanner', 'client screening', 'contract risk']
  },
  {
    slug: 'tool-freelance-contract',
    name: 'Dynamic Contract PDF Generator',
    description: 'Compiles custom statement of work (SOW) terms and payment milestones into a downloadable document.',
    category: 'Productivity / Utility',
    hub: 'freelancer',
    url: '/hubs/freelancer#tool-contract',
    tags: ['freelance contract', 'sow generator', 'client agreement']
  }
];
