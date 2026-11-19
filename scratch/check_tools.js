const fs = require('fs');
const path = require('path');

const toolsToDelete = [
  'cidr_subnet_calculator', 'curl_to_fetch_axios', 'advanced_search_operator_builder',
  'json_to_typescript_pro', 'sql_formatter_pro', 'csv_to_json_pro', 'uuid_v4_bulk_gen',
  'tax_bracket_estimator', 'unit_converter_physics', 'bibtex_citation_gen',
  'pallete_generator_pro', 'contact_vcard_qr'
];

const hubsToConsolidate = [
  'compound_interest_sim', 'emergency_fund_calc', 'cagr_inflation_adjusted',
  'dcf_valuation_model', 'net_worth_tracker_local', 'emi_true_cost_analyzer',
  'sleep_debt_calculator', 'blood_pressure_tracker', 'breathing_coherence_trainer',
  'body_fat_navy_method', 'circadian_rhythm_optimizer'
];

const toolsToHold = [
  'voltage_divider_tool', 'led_resistor_calculator', 'context_manager_llm',
  'contrast_sensitivity_function'
];

const allTools = [...toolsToDelete, ...hubsToConsolidate, ...toolsToHold];

console.log("Checking tools...");
for (const tool of allTools) {
  const toolPath = path.join('public', 'tool', tool + '.html');
  const blogPath = path.join('blog', tool + '_blog.html');
  
  if (fs.existsSync(toolPath)) console.log(`[FOUND HTML] ${tool}`);
  if (fs.existsSync(blogPath)) console.log(`[FOUND BLOG] ${tool}`);
}

const toolsJson = JSON.parse(fs.readFileSync('public/tools.json', 'utf8'));
const inJson = toolsJson.map(t => t.id);
for (const tool of allTools) {
  if (inJson.includes(tool)) console.log(`[FOUND JSON] ${tool}`);
}
