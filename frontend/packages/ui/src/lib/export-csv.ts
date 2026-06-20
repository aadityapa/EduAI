export interface CsvColumn<T> {
  header: string;
  accessor: (row: T) => string | number | boolean | null | undefined;
}

function escapeCell(value: string): string {
  if (/[",\n\r]/.test(value)) {
    return `"${value.replace(/"/g, '""')}"`;
  }
  return value;
}

export function exportToCsv<T>(
  rows: T[],
  columns: CsvColumn<T>[],
  filename: string,
): void {
  if (rows.length === 0 || columns.length === 0) return;

  const header = columns.map((c) => escapeCell(c.header)).join(',');
  const body = rows
    .map((row) =>
      columns
        .map((col) => {
          const raw = col.accessor(row);
          const value = raw == null ? '' : String(raw);
          return escapeCell(value);
        })
        .join(','),
    )
    .join('\n');

  const csv = `${header}\n${body}`;
  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename.endsWith('.csv') ? filename : `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}
