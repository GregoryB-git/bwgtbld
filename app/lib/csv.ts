// lib/csv.ts
import { readFile, writeFile } from 'fs/promises';

export async function readCsv(path: string): Promise<Record<string, string>[]> {
  const raw = await readFile(path, 'utf-8');
  const lines = raw.trim().split('\n').filter(Boolean);
  const headers = lines[0].split(',');
  return lines.slice(1).map((line) => {
    const values = line.split(',');
    return Object.fromEntries(headers.map((h, i) => [h.trim(), (values[i] ?? '').trim()]));
  });
}

export async function writeCsv(path: string, headers: string[], rows: Record<string, string>[]) {
  const lines = [headers.join(',')];
  for (const row of rows) lines.push(headers.map((h) => row[h] ?? '').join(','));
  await writeFile(path, lines.join('\n') + '\n', 'utf-8');
}