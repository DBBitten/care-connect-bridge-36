export function exportToCsv(filename: string, headers: string[], rows: (string | number | undefined)[][]) {
  const BOM = "\uFEFF";
  const headerLine = headers.join(";");
  const dataLines = rows.map(row =>
    row.map(cell => {
      if (cell === undefined || cell === null) return "";
      const str = String(cell);
      if (str.includes(";") || str.includes('"') || str.includes("\n")) {
        return `"${str.replace(/"/g, '""')}"`;
      }
      return str;
    }).join(";")
  );
  const csv = BOM + [headerLine, ...dataLines].join("\n");
  const blob = new Blob([csv], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}
