import { describe, it, expect } from 'vitest';
import {
  parseCsvToRows,
  executeSimpleSql,
  rowsToCsv,
} from './logic';

describe('DuckDB-WASM Analytics Logic', () => {
  const SAMPLE_CSV = `id,product,category,price,units
1,Mechanical Keyboard,Gaming,120,5
2,Ultra High Speed HDMI Cable,Accessories,25,40
3,OLED Monitor 4K,Display,899,2
4,Optical Gaming Mouse,Gaming,79,15
5,Hall Effect Stick Module,Gaming,35,30`;

  it('parses CSV into structured columns and typed rows', () => {
    const { columns, rows } = parseCsvToRows(SAMPLE_CSV);
    expect(columns).toEqual(['id', 'product', 'category', 'price', 'units']);
    expect(rows.length).toBe(5);
    expect(rows[0].price).toBe(120);
    expect(typeof rows[0].price).toBe('number');
  });

  it('executes SELECT with WHERE filtering', () => {
    const { rows } = parseCsvToRows(SAMPLE_CSV);
    const result = executeSimpleSql(rows, 'SELECT * FROM data WHERE category = "Gaming"');

    expect(result.rowCount).toBe(3);
    expect(result.rows.every((r) => r.category === 'Gaming')).toBe(true);
  });

  it('executes ORDER BY and LIMIT', () => {
    const { rows } = parseCsvToRows(SAMPLE_CSV);
    const result = executeSimpleSql(rows, 'SELECT product, price FROM data ORDER BY price DESC LIMIT 2');

    expect(result.rowCount).toBe(2);
    expect(result.rows[0].price).toBe(899);
    expect(result.rows[0].product).toBe('OLED Monitor 4K');
    expect(result.columns).toEqual(['product', 'price']);
  });

  it('computes aggregation functions: COUNT and SUM', () => {
    const { rows } = parseCsvToRows(SAMPLE_CSV);
    const countRes = executeSimpleSql(rows, 'SELECT COUNT(*) AS total_items FROM data');
    expect(countRes.rows[0].total_items).toBe(5);

    const sumRes = executeSimpleSql(rows, 'SELECT SUM(units) AS total_units FROM data');
    expect(sumRes.rows[0].total_units).toBe(5 + 40 + 2 + 15 + 30); // 92
  });

  it('formats query results back to CSV string', () => {
    const { columns, rows } = parseCsvToRows(SAMPLE_CSV);
    const csvOut = rowsToCsv(columns, rows);
    expect(csvOut).toContain('OLED Monitor 4K');
    expect(csvOut.split('\n').length).toBe(6);
  });
});
