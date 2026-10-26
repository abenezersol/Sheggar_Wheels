export function exportToCSV(data: Record<string, unknown>[], filename: string): void {
  if (typeof window === 'undefined' || data.length === 0) return;
  const headers = Object.keys(data[0]);
  const escape = (value: unknown) => {
    const str = String(value ?? '');
    return /[",\r\n]/.test(str) ? `"${str.replace(/"/g, '""')}"` : str;
  };
  const csv = [headers.map(escape).join(','), ...data.map(row => headers.map(h => escape(row[h])).join(','))].join('\r\n');
  const blob = new Blob(['\uFEFF', csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  URL.revokeObjectURL(url);
}
