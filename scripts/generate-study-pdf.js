const fs = require('fs');
const path = require('path');
const { chromium } = require('playwright');

const projectRoot = path.resolve(__dirname, '..');
const markdownPath = path.join(projectRoot, 'Playwright_JS_Interview_QA.md');
const outputPath = path.join(projectRoot, 'Playwright_JS_Interview_QA.pdf');

function escapeHtml(value) {
  return value
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;');
}

function applyInlineFormatting(text) {
  return text
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/`(.+?)`/g, '<code>$1</code>');
}

function markdownToHtml(markdown) {
  const lines = markdown.split(/\r?\n/);
  const html = [];
  let inList = false;

  const closeList = () => {
    if (inList) {
      html.push('</ul>');
      inList = false;
    }
  };

  for (const rawLine of lines) {
    const line = rawLine.trimEnd();
    const trimmed = line.trim();

    if (!trimmed) {
      closeList();
      continue;
    }

    if (/^---+$/.test(trimmed)) {
      closeList();
      html.push('<hr />');
      continue;
    }

    const headingMatch = trimmed.match(/^(#{1,6})\s+(.*)$/);
    if (headingMatch) {
      closeList();
      const level = headingMatch[1].length;
      const content = applyInlineFormatting(escapeHtml(headingMatch[2]));
      html.push(`<h${level}>${content}</h${level}>`);
      continue;
    }

    const orderedMatch = trimmed.match(/^\d+\.\s+(.*)$/);
    if (orderedMatch) {
      closeList();
      html.push(`<p>${applyInlineFormatting(escapeHtml(trimmed))}</p>`);
      continue;
    }

    const unorderedMatch = trimmed.match(/^[-*]\s+(.*)$/);
    if (unorderedMatch) {
      if (!inList) {
        html.push('<ul>');
        inList = true;
      }
      html.push(`<li>${applyInlineFormatting(escapeHtml(unorderedMatch[1]))}</li>`);
      continue;
    }

    closeList();
    html.push(`<p>${applyInlineFormatting(escapeHtml(trimmed))}</p>`);
  }

  closeList();

  return html.join('\n');
}

function buildHtmlDocument(bodyContent) {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Playwright JS Interview Q&A</title>
  <style>
    body {
      font-family: Arial, Helvetica, sans-serif;
      color: #1f2937;
      line-height: 1.55;
      margin: 0;
      padding: 24px 28px;
      font-size: 12px;
      background: #ffffff;
    }
    h1, h2, h3 {
      color: #111827;
      margin-top: 20px;
      margin-bottom: 8px;
    }
    h1 {
      font-size: 24px;
      border-bottom: 2px solid #2563eb;
      padding-bottom: 8px;
    }
    h2 {
      font-size: 18px;
      color: #1d4ed8;
      page-break-after: avoid;
    }
    h3 {
      font-size: 14px;
      page-break-after: avoid;
    }
    p {
      margin: 6px 0 10px;
      text-align: justify;
    }
    ul {
      margin: 6px 0 12px 20px;
      padding: 0;
    }
    li {
      margin: 4px 0;
    }
    strong {
      color: #111827;
    }
    code {
      font-family: Consolas, 'Courier New', monospace;
      background: #f3f4f6;
      padding: 1px 4px;
      border-radius: 4px;
      font-size: 11px;
    }
    hr {
      border: none;
      border-top: 1px solid #d1d5db;
      margin: 18px 0;
    }
    @page {
      size: A4;
      margin: 14mm 12mm;
    }
  </style>
</head>
<body>
${bodyContent}
</body>
</html>`;
}

(async () => {
  if (!fs.existsSync(markdownPath)) {
    throw new Error(`Markdown file not found: ${markdownPath}`);
  }

  const markdown = fs.readFileSync(markdownPath, 'utf8');
  const bodyContent = markdownToHtml(markdown);
  const html = buildHtmlDocument(bodyContent);

  const browser = await chromium.launch();
  const page = await browser.newPage();
  await page.setContent(html, { waitUntil: 'load' });
  await page.pdf({
    path: outputPath,
    format: 'A4',
    printBackground: true,
    margin: {
      top: '12mm',
      bottom: '12mm',
      left: '10mm',
      right: '10mm'
    }
  });
  await browser.close();

  console.log(`PDF created at: ${outputPath}`);
})();
