/**
 * DuckDB-WASM Parquet & CSV Analytics Logic
 * In-memory client-side tabular query parser and data frame processor.
 */

export interface QueryResult {
  columns: string[];
  rows: Array<Record<string, unknown>>;
  rowCount: number;
  executionTimeMs: number;
}

export function parseCsvToRows(csvText: string): { columns: string[]; rows: Array<Record<string, unknown>> } {
  const lines = csvText.trim().split(/\r?\n/).filter((l) => l.trim().length > 0);
  if (lines.length === 0) {
    return { columns: [], rows: [] };
  }

  const parseLine = (line: string): string[] => {
    const values: string[] = [];
    let current = '';
    let inQuotes = false;
    for (let i = 0; i < line.length; i++) {
      const c = line[i];
      if (c === '"') {
        inQuotes = !inQuotes;
      } else if (c === ',' && !inQuotes) {
        values.push(current.trim());
        current = '';
      } else {
        current += c;
      }
    }
    values.push(current.trim());
    return values;
  };

  const columns = parseLine(lines[0]);
  const rows: Array<Record<string, unknown>> = [];

  for (let i = 1; i < lines.length; i++) {
    const vals = parseLine(lines[i]);
    const row: Record<string, unknown> = {};
    columns.forEach((col, idx) => {
      const rawVal = vals[idx] !== undefined ? vals[idx] : '';
      const num = Number(rawVal);
      row[col] = !isNaN(num) && rawVal !== '' ? num : rawVal;
    });
    rows.push(row);
  }

  return { columns, rows };
}

export function executeSimpleSql(
  data: Array<Record<string, unknown>>,
  query: string
): QueryResult {
  const start = performance.now();
  let workingRows = [...data];
  const clean = query.trim().replace(/;$/, '');

  // Extract LIMIT
  let limit: number | null = null;
  const limitMatch = clean.match(/LIMIT\s+(\d+)/i);
  if (limitMatch) {
    limit = parseInt(limitMatch[1], 10);
  }

  // Extract ORDER BY
  const orderMatch = clean.match(/ORDER\s+BY\s+([a-zA-Z0-9_]+)(?:\s+(ASC|DESC))?/i);
  if (orderMatch) {
    const col = orderMatch[1];
    const isDesc = orderMatch[2]?.toUpperCase() === 'DESC';
    workingRows.sort((a, b) => {
      const valA = a[col];
      const valB = b[col];
      if (typeof valA === 'number' && typeof valB === 'number') {
        return isDesc ? valB - valA : valA - valB;
      }
      return isDesc ? String(valB).localeCompare(String(valA)) : String(valA).localeCompare(String(valB));
    });
  }

  // Extract WHERE (simple equality or inequality)
  const whereMatch = clean.match(/WHERE\s+([a-zA-Z0-9_]+)\s*(=|>|<|>=|<=|!=)\s*(['"]?)([^'"\s]+)\3/i);
  if (whereMatch) {
    const col = whereMatch[1];
    const op = whereMatch[2];
    const rawVal = whereMatch[4];
    const targetVal = !isNaN(Number(rawVal)) ? Number(rawVal) : rawVal;

    workingRows = workingRows.filter((r) => {
      const cell = r[col];
      if (op === '=') return cell === targetVal || String(cell).toLowerCase() === String(targetVal).toLowerCase();
      if (op === '!=') return cell !== targetVal;
      if (typeof cell === 'number' && typeof targetVal === 'number') {
        if (op === '>') return cell > targetVal;
        if (op === '<') return cell < targetVal;
        if (op === '>=') return cell >= targetVal;
        if (op === '<=') return cell <= targetVal;
      }
      return true;
    });
  }

  // Aggregation: COUNT, SUM, AVG
  const countMatch = clean.match(/SELECT\s+COUNT\(\*\)(?:\s+AS\s+([a-zA-Z0-9_]+))?/i);
  const sumMatch = clean.match(/SELECT\s+SUM\(([a-zA-Z0-9_]+)\)(?:\s+AS\s+([a-zA-Z0-9_]+))?/i);

  if (countMatch) {
    const alias = countMatch[1] || 'count';
    const executionTimeMs = parseFloat((performance.now() - start).toFixed(2));
    return {
      columns: [alias],
      rows: [{ [alias]: workingRows.length }],
      rowCount: 1,
      executionTimeMs,
    };
  }

  if (sumMatch) {
    const col = sumMatch[1];
    const alias = sumMatch[2] || `sum_${col}`;
    const sum = workingRows.reduce((acc, r) => acc + (typeof r[col] === 'number' ? (r[col] as number) : 0), 0);
    const executionTimeMs = parseFloat((performance.now() - start).toFixed(2));
    return {
      columns: [alias],
      rows: [{ [alias]: sum }],
      rowCount: 1,
      executionTimeMs,
    };
  }

  // Column projection
  const selectMatch = clean.match(/SELECT\s+([\s\S]+?)\s+FROM/i);
  let selectedColumns: string[] = [];
  if (selectMatch && selectMatch[1].trim() !== '*') {
    selectedColumns = selectMatch[1].split(',').map((c) => c.trim());
    workingRows = workingRows.map((r) => {
      const projected: Record<string, unknown> = {};
      selectedColumns.forEach((c) => {
        if (r[c] !== undefined) projected[c] = r[c];
      });
      return projected;
    });
  } else if (workingRows.length > 0) {
    selectedColumns = Object.keys(workingRows[0]);
  }

  if (limit !== null) {
    workingRows = workingRows.slice(0, limit);
  }

  const executionTimeMs = parseFloat((performance.now() - start).toFixed(2));
  return {
    columns: selectedColumns,
    rows: workingRows,
    rowCount: workingRows.length,
    executionTimeMs,
  };
}

export function rowsToCsv(columns: string[], rows: Array<Record<string, unknown>>): string {
  const header = columns.join(',');
  const lines = rows.map((r) => columns.map((col) => JSON.stringify(r[col] !== undefined ? r[col] : '')).join(','));
  return [header, ...lines].join('\n');
}
