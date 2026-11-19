const fs = require('fs');

const toolsToDelete = [
  'cidr_subnet_calculator', 'curl_to_fetch_axios', 'advanced_search_operator_builder',
  'json_to_typescript_pro', 'sql_formatter_pro', 'csv_to_json_pro', 'uuid_v4_bulk_gen',
  'tax_bracket_estimator', 'unit_converter_physics', 'bibtex_citation_gen',
  'pallete_generator_pro', 'contact_vcard_qr'
];

const toolsJsonPath = 'public/tools.json';
let toolsData = JSON.parse(fs.readFileSync(toolsJsonPath, 'utf8'));

const initialLength = toolsData.length;
toolsData = toolsData.filter(tool => !toolsToDelete.includes(tool.id));
console.log(`Removed ${initialLength - toolsData.length} items from tools.json`);

fs.writeFileSync(toolsJsonPath, JSON.stringify(toolsData, null, 4));
