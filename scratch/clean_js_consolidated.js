const fs = require('fs');

const consolidatedTools = [
  'compound_interest_sim', 'emergency_fund_calc', 'cagr_inflation_adjusted',
  'dcf_valuation_model', 'net_worth_tracker_local', 'emi_true_cost_analyzer',
  'sleep_debt_calculator', 'blood_pressure_tracker', 'breathing_coherence_trainer',
  'body_fat_navy_method', 'circadian_rhythm_optimizer'
];

let jsContent = fs.readFileSync('scripts/generate-guides.js', 'utf8');

consolidatedTools.forEach(toolId => {
  const regex = new RegExp(`\\s*'${toolId}'\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`, 'g');
  jsContent = jsContent.replace(regex, '');
});

fs.writeFileSync('scripts/generate-guides.js', jsContent);
console.log('Cleaned up generate-guides.js for consolidated tools');
