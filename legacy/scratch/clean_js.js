const fs = require('fs');

const toolsToDelete = [
  'cidr_subnet_calculator', 'curl_to_fetch_axios', 'advanced_search_operator_builder',
  'json_to_typescript_pro', 'sql_formatter_pro', 'csv_to_json_pro', 'uuid_v4_bulk_gen',
  'tax_bracket_estimator', 'unit_converter_physics', 'bibtex_citation_gen',
  'pallete_generator_pro', 'contact_vcard_qr'
];

let jsContent = fs.readFileSync('scripts/generate-guides.js', 'utf8');

toolsToDelete.forEach(toolId => {
  // We need to match the tool key and its whole object value.
  // The object ends when there's a matching closing brace.
  // E.g. 'tool_name': { ... },
  const regex = new RegExp(`\\s*'${toolId}'\\s*:\\s*\\{[\\s\\S]*?\\n\\s*\\},?`, 'g');
  jsContent = jsContent.replace(regex, '');
});

fs.writeFileSync('scripts/generate-guides.js', jsContent);
console.log('Cleaned up generate-guides.js');
