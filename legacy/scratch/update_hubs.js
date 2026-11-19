const fs = require('fs');

const consolidatedTools = [
  'compound_interest_sim', 'emergency_fund_calc', 'cagr_inflation_adjusted',
  'dcf_valuation_model', 'net_worth_tracker_local', 'emi_true_cost_analyzer',
  'sleep_debt_calculator', 'blood_pressure_tracker', 'breathing_coherence_trainer',
  'body_fat_navy_method', 'circadian_rhythm_optimizer'
];

const newHubs = [
  {
    "id": "finance_suite_local",
    "name": "Personal Finance & Business Suite",
    "category": "Personal Finance & F.I.R.E.",
    "description": "A comprehensive personal finance and business suite covering compound interest, emergency funds, net worth tracking, and more."
  },
  {
    "id": "health_metrics_dashboard",
    "name": "Wellness & Bio-Tracking Dashboard",
    "category": "Clinical Health & Diagnostics",
    "description": "A unified dashboard for your health and bio-tracking tools including sleep debt, blood pressure, and breathing coherence."
  }
];

const toolsJsonPath = 'public/tools.json';
let toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

const initialLength = toolsData.length;
// Remove consolidated tools
toolsData = toolsData.filter(tool => !consolidatedTools.includes(tool.id));
console.log(`Removed ${initialLength - toolsData.length} consolidated items from tools.json`);

// Add new hubs
toolsData.unshift(...newHubs);
console.log(`Added 2 hub pages to tools.json`);

fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 4));
