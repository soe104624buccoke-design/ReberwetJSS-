/**
 * Direct file downloader utility for Report Cards, Broadsheets, and Assessments.
 * Exports formatted documents directly as standalone offline HTML files,
 * prints via browser engine to PDF, or downloads structured CSV data directly to user storage.
 */

export interface ReportCardExportOptions {
  learnerName: string;
  admNo: string;
  grade: string;
  term: string;
  year?: string;
  documentHtml?: string;
}

/**
 * Downloads a complete, beautifully styled self-contained offline report card (.html)
 * straight into the user's Downloads/Files folder on Android or PC, which opens in any
 * browser or viewer without requiring internet, and allows immediate native printing to PDF.
 */
export function downloadReportCardToFile(
  elementId: string,
  filename: string,
  options: {
    title: string;
    learnerName?: string;
    admNo?: string;
    grade?: string;
  }
) {
  const sourceEl = document.getElementById(elementId);
  if (!sourceEl) {
    // Fallback: trigger print
    window.print();
    return;
  }

  // Clone node to avoid altering DOM
  const clone = sourceEl.cloneNode(true) as HTMLElement;

  // Remove any print:hidden or interactive file inputs
  const hiddenElements = clone.querySelectorAll('.print\\:hidden, input[type="file"], button');
  hiddenElements.forEach((el) => el.remove());

  // Package full standalone HTML with embedded styling so it renders identically when downloaded
  const fullHtmlContent = `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${options.title} - ${options.learnerName || 'Learner'}</title>
  <style>
    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
    body {
      font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
      background-color: #f8fafc;
      color: #0f172a;
      padding: 24px;
      display: flex;
      justify-content: center;
      -webkit-font-smoothing: antialiased;
    }
    .container {
      width: 100%;
      max-width: 900px;
      background: #ffffff;
      border: 1px solid #cbd5e1;
      border-radius: 16px;
      padding: 32px;
      box-shadow: 0 4px 6px -1px rgb(0 0 0 / 0.1);
    }
    table { width: 100%; border-collapse: collapse; margin-top: 12px; margin-bottom: 12px; }
    th, td { border: 1px solid #94a3b8; padding: 8px 10px; font-size: 12px; }
    th { background-color: #f1f5f9; font-weight: 800; text-align: left; }
    .text-center { text-align: center; }
    .text-right { text-align: right; }
    .font-mono { font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace; }
    .font-bold { font-weight: 700; }
    .font-black { font-weight: 900; }
    .stamp-box {
      width: 220px;
      height: 110px;
      border: 2px dashed #94a3b8;
      border-radius: 12px;
      display: flex;
      align-items: center;
      justify-content: center;
      margin: 8px auto;
      text-align: center;
      font-size: 11px;
      color: #64748b;
      font-weight: 700;
      text-transform: uppercase;
    }
    .red-notice {
      color: #dc2626;
      font-size: 11px;
      font-weight: 800;
      text-transform: uppercase;
      text-align: center;
      margin-top: 6px;
    }
    .btn-bar {
      margin-bottom: 16px;
      text-align: right;
    }
    .btn-print {
      background-color: #6b1426;
      color: white;
      border: none;
      padding: 10px 18px;
      border-radius: 8px;
      font-weight: 700;
      font-size: 13px;
      cursor: pointer;
    }
    @media print {
      body { background: white; padding: 0; }
      .container { border: none; box-shadow: none; padding: 0; max-width: 100%; }
      .btn-bar { display: none; }
      @page { margin: 12mm; }
    }
  </style>
</head>
<body>
  <div class="container">
    <div class="btn-bar">
      <button class="btn-print" onclick="window.print()">Print / Save as PDF</button>
    </div>
    ${clone.innerHTML}
  </div>
</body>
</html>`;

  const blob = new Blob([fullHtmlContent], { type: 'text/html;charset=utf-8' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.html`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

/**
 * Downloads a structured assessment summary (.csv) directly into the user's files.
 */
export function downloadCsvToFile(content: string, filename: string) {
  const blob = new Blob(['\uFEFF' + content], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `${filename}.csv`;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}
