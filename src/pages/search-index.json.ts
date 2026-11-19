import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

interface HubToolDef {
  slug: string;
  title: string;
  description: string;
  category: string;
  hub: string;
  tags: string[];
  aliases: string[];
  url: string;
}

// Statically curated metadata for embedded Hub tools
const HUB_TOOLS_CATALOG: HubToolDef[] = [
  // Startup Hub Tools
  {
    slug: 'tool-runway',
    title: 'Dynamic Runway Calculator',
    description: 'Calculate cash runway based on monthly burn and revenue growth.',
    category: 'Startup & VC',
    hub: 'startup',
    tags: ['runway', 'burn rate', 'finance', 'startup'],
    aliases: ['burn calculator', 'cash runway', 'startup burn'],
    url: '/hubs/startup#tool-runway',
  },
  {
    slug: 'tool-freemium',
    title: 'Freemium / AI Server Death Simulator',
    description: 'Simulate API cost spikes and server expenses against user conversion.',
    category: 'Startup & VC',
    hub: 'startup',
    tags: ['freemium', 'api cost', 'ai server', 'burn'],
    aliases: ['ai server cost', 'freemium unit economics', 'token burn'],
    url: '/hubs/startup#tool-freemium',
  },
  {
    slug: 'tool-equity',
    title: 'Co-Founder Equity Engine',
    description: 'Equitably calculate founder equity split based on contributions and risk.',
    category: 'Startup & VC',
    hub: 'startup',
    tags: ['equity', 'cofounder', 'cap table', 'vesting'],
    aliases: ['equity calculator', 'founder split', 'co-founder equity'],
    url: '/hubs/startup#tool-equity',
  },
  {
    slug: 'tool-wcds',
    title: 'Working Capital Death Spiral Engine',
    description: 'Forecast working capital stress points in scaling operations.',
    category: 'Startup & VC',
    hub: 'startup',
    tags: ['working capital', 'cash flow', 'insolvency', 'finance'],
    aliases: ['death spiral', 'working capital simulator', 'cash gap'],
    url: '/hubs/startup#tool-wcds',
  },
  {
    slug: 'tool-cap-table',
    title: 'Cap Table Simulator',
    description: 'Simulate dilution across SAFE, seed, and Series A fundraising rounds.',
    category: 'Startup & VC',
    hub: 'startup',
    tags: ['cap table', 'dilution', 'seed', 'series a'],
    aliases: ['dilution calculator', 'cap table model', 'safe note'],
    url: '/hubs/startup#tool-cap-table',
  },
  {
    slug: 'tool-exit-waterfall',
    title: 'Exit Waterfall Simulator',
    description: 'Calculate investor and founder payouts under liquidation preferences.',
    category: 'Startup & VC',
    hub: 'startup',
    tags: ['exit', 'waterfall', 'liquidation preference', 'payout'],
    aliases: ['exit payouts', 'waterfall model', 'liquidation priority'],
    url: '/hubs/startup#tool-exit-waterfall',
  },
  // Freelancer OS Tools
  {
    slug: 'tool-contract',
    title: 'Standard Freelancer Contract Builder',
    description: 'Generate standardized client service contracts with intellectual property terms.',
    category: 'Freelance & Creator',
    hub: 'freelancer',
    tags: ['contract', 'legal', 'freelance', 'terms'],
    aliases: ['contract generator', 'service agreement', 'client contract'],
    url: '/hubs/freelancer#tool-contract',
  },
  {
    slug: 'tool-ppp',
    title: 'Purchasing Power Parity (PPP) Engine',
    description: 'Normalize project rates and pricing across global currencies and cost of living.',
    category: 'Freelance & Creator',
    hub: 'freelancer',
    tags: ['ppp', 'pricing', 'rates', 'currency'],
    aliases: ['ppp calculator', 'global rate adjuster', 'purchasing power'],
    url: '/hubs/freelancer#tool-ppp',
  },
  {
    slug: 'tool-ltv-cac',
    title: 'LTV to CAC Ratio Model',
    description: 'Quantify lifetime value against customer acquisition costs for independent businesses.',
    category: 'Freelance & Creator',
    hub: 'freelancer',
    tags: ['ltv', 'cac', 'unit economics', 'marketing'],
    aliases: ['ltv cac ratio', 'customer lifetime value', 'acquisition cost'],
    url: '/hubs/freelancer#tool-ltv-cac',
  },
  {
    slug: 'tool-risk-analyzer',
    title: 'Client Risk Concentration Analyzer',
    description: 'Identify revenue concentration risks across your client accounts.',
    category: 'Freelance & Creator',
    hub: 'freelancer',
    tags: ['risk', 'concentration', 'client revenue', 'diversification'],
    aliases: ['client risk', 'revenue concentration', 'dependency index'],
    url: '/hubs/freelancer#tool-risk-analyzer',
  },
  {
    slug: 'tool-scope-creep',
    title: 'Scope Creep Margin Quantifier',
    description: 'Measure the financial impact of unbilled revisions and out-of-scope requests.',
    category: 'Freelance & Creator',
    hub: 'freelancer',
    tags: ['scope creep', 'billable hours', 'margin', 'consulting'],
    aliases: ['scope creep calculator', 'unbilled hours', 'margin leak'],
    url: '/hubs/freelancer#tool-scope-creep',
  },
  {
    slug: 'tool-zoom-tax',
    title: 'The Zoom Meeting Tax Calculator',
    description: 'Quantify the true cost of recurring video meetings on focus and revenue.',
    category: 'Freelance & Creator',
    hub: 'freelancer',
    tags: ['meetings', 'zoom tax', 'focus', 'time cost'],
    aliases: ['meeting cost calculator', 'zoom fatigue', 'hourly loss'],
    url: '/hubs/freelancer#tool-zoom-tax',
  },
  // Wellness Sanctuary Tools
  {
    slug: 'tool-tech-neck',
    title: 'Tech Neck Posture Alarm',
    description: 'Webcam-based posture tracker that notifies you when your neck angles forward.',
    category: 'Health & Vision',
    hub: 'wellness',
    tags: ['posture', 'tech neck', 'ergonomics', 'spine'],
    aliases: ['posture check', 'neck alarm', 'ergonomic monitor'],
    url: '/hubs/wellness#tool-tech-neck',
  },
  {
    slug: 'tool-blink-monitor',
    title: 'Eye Strain & Blink Counter',
    description: 'Monitor your blink frequency during screen work to mitigate dry eye syndrome.',
    category: 'Health & Vision',
    hub: 'wellness',
    tags: ['blink', 'eye strain', 'vision', 'dry eyes'],
    aliases: ['blink counter', 'eye strain monitor', '20-20-20'],
    url: '/hubs/wellness#tool-blink-monitor',
  },
  {
    slug: 'tool-proximity',
    title: 'Screen Distance Checker',
    description: 'Measure distance between eyes and display to maintain comfortable focal length.',
    category: 'Health & Vision',
    hub: 'wellness',
    tags: ['proximity', 'screen distance', 'focal length', 'eyes'],
    aliases: ['screen distance', 'monitor distance checker', 'eye distance'],
    url: '/hubs/wellness#tool-proximity',
  },
  {
    slug: 'tool-nsdr',
    title: 'Non-Sleep Deep Rest (NSDR) Protocol',
    description: 'Structured audio-guided somatic relaxation protocol for cognitive reset.',
    category: 'Health & Vision',
    hub: 'wellness',
    tags: ['nsdr', 'deep rest', 'meditation', 'focus reset'],
    aliases: ['nsdr protocol', 'yoga nidra', 'cognitive reset'],
    url: '/hubs/wellness#tool-nsdr',
  },
  {
    slug: 'tool-cognitive-debt',
    title: 'Brain Fog & Mental RAM Calculator',
    description: 'Estimate cognitive fatigue and context-switching load throughout your day.',
    category: 'Health & Vision',
    hub: 'wellness',
    tags: ['cognitive debt', 'brain fog', 'mental fatigue', 'productivity'],
    aliases: ['brain fog calculator', 'mental ram', 'cognitive load'],
    url: '/hubs/wellness#tool-cognitive-debt',
  },
  {
    slug: 'tool-screen-time',
    title: 'Phone Distraction & Screen Time Audit',
    description: 'Quantify daily hours lost to non-essential smartphone screen time.',
    category: 'Health & Vision',
    hub: 'wellness',
    tags: ['screen time', 'focus', 'digital wellness', 'habits'],
    aliases: ['phone addiction audit', 'screen time calculator', 'digital detox'],
    url: '/hubs/wellness#tool-screen-time',
  },
];

export const GET: APIRoute = async () => {
  const tools = await getCollection('tools');

  const items = tools.map((tool) => {
    const data = tool.data;
    const title = data.title || data.name || data.id;
    const tags = data.tags || [];
    const category = data.category || 'General';

    const aliases = new Set<string>();
    aliases.add(data.id.replace(/_/g, ' '));
    aliases.add(category.toLowerCase());
    for (const tag of tags) {
      aliases.add(tag.toLowerCase());
    }

    if (/calc/i.test(title)) aliases.add('calculator');
    if (/test|check/i.test(title)) {
      aliases.add('tester');
      aliases.add('diagnostic');
    }
    if (/convert/i.test(title)) aliases.add('converter');
    if (/format/i.test(title)) aliases.add('formatter');
    if (/generat/i.test(title)) aliases.add('generator');
    if (/monitor/i.test(title)) aliases.add('analyzer');

    return {
      slug: data.id,
      title,
      description: data.description || '',
      category,
      hub: (data as any).hub || null,
      tags,
      aliases: Array.from(aliases),
      url: `/tool/${data.id}`,
    };
  });

  const allSearchItems = [...items, ...HUB_TOOLS_CATALOG];

  return new Response(JSON.stringify(allSearchItems), {
    headers: {
      'Content-Type': 'application/json; charset=utf-8',
      'Cache-Control': 'public, max-age=3600',
    },
  });
};
