// Arma y descarga el PDF de una cotización (contracts/pdf-cotizacion.md de la spec 001; presentación en
// contracts/pdf-visual.md de la spec 002). Usa jsPDF (global `jspdf`). Los colores salen de los tokens de styles.css.
import { formatMoney, formatQuantity } from './calc.js';
import { formatDateLong, REGIMES, CLIENT_TYPES } from './ui.js';

const MARGIN = 40;
const PAGE_W = 612;
const PAGE_H = 792;
const RIGHT = PAGE_W - MARGIN;
const COL = { desc: MARGIN, qty: 385, price: 470, amount: RIGHT };
const STRIPE_H = 10;
const PARTS_X = 320;
const TOTALS_X = 312;

function loadImage(src) {
  return new Promise((resolve, reject) => {
    const img = new Image();
    img.onload = () => resolve(img);
    img.onerror = reject;
    img.src = src;
  });
}

function pct(bp) {
  return `${(bp / 100).toString()} %`;
}

// Convierte '#rrggbb' o '#rgb' en [r, g, b].
function hexToRgb(hex) {
  let h = hex.trim().replace('#', '');
  if (h.length === 3) h = [...h].map((c) => c + c).join('');
  return [0, 2, 4].map((i) => parseInt(h.slice(i, i + 2), 16));
}

// Lee los tokens de color del tema (única fuente de la paleta) y los entrega como RGB para jsPDF.
export function readTheme() {
  const style = getComputedStyle(document.documentElement);
  const color = (name) => hexToRgb(style.getPropertyValue(name));
  return {
    primary: color('--color-primary'),
    onPrimary: color('--color-primary-contrast'),
    text: color('--color-text'),
    muted: color('--color-text-muted'),
    border: color('--color-border'),
    ground: color('--color-ground'),
  };
}

export async function downloadQuotePdf(quote) {
  const { jsPDF } = window.jspdf;
  const theme = readTheme();
  const doc = new jsPDF({ unit: 'pt', format: 'letter' });
  const ink = (rgb) => doc.setTextColor(...rgb);
  let y;

  function stripe() {
    doc.setFillColor(...theme.primary);
    doc.rect(0, 0, PAGE_W, STRIPE_H, 'F');
  }
  function startPage() {
    stripe();
    y = MARGIN + STRIPE_H;
  }
  startPage();

  // 1. Encabezado: logo a la izquierda (si existe); título y folio. Sin logo, el título va a la izquierda.
  let logoDrawn = false;
  let logoH = 0;
  if (quote.freelancer.logo) {
    try {
      const img = await loadImage(quote.freelancer.logo);
      logoH = Math.min(60, (img.height / img.width) * 120);
      const w = (img.width / img.height) * logoH;
      const fmt = quote.freelancer.logo.startsWith('data:image/png') ? 'PNG' : 'JPEG';
      doc.addImage(quote.freelancer.logo, fmt, MARGIN, y, w, logoH);
      logoDrawn = true;
    } catch { /* sin logo si no se puede leer */ }
  }
  const titleX = logoDrawn ? RIGHT : MARGIN;
  const titleOpts = logoDrawn ? { align: 'right' } : undefined;
  doc.setFont('helvetica', 'bold').setFontSize(26);
  ink(theme.primary);
  doc.text('Cotización', titleX, y + 24, titleOpts);
  doc.setFont('helvetica', 'normal').setFontSize(12);
  ink(theme.muted);
  doc.text(`Folio ${quote.folio}`, titleX, y + 44, titleOpts);
  y += Math.max(logoH, 56) + 24;

  // 2. Fechas: pares etiqueta-valor
  doc.setFontSize(10);
  const dateRow = (label, value) => {
    doc.setFont('helvetica', 'normal');
    ink(theme.muted);
    doc.text(`${label}:`, MARGIN, y);
    doc.setFont('helvetica', 'bold');
    ink(theme.text);
    doc.text(value, MARGIN + 110, y);
    y += 15;
  };
  dateRow('Fecha de emisión', formatDateLong(quote.issueDate));
  dateRow('Vigencia hasta', formatDateLong(quote.validUntil));
  y += 14;

  // 3 y 4. Partes: "De" (emisor) y "Para" (cliente) en dos columnas; nombre en negrita
  const f = quote.freelancer;
  const c = quote.client;
  doc.setFont('helvetica', 'normal').setFontSize(10);
  const fLines = [f.name, `RFC: ${f.rfc}`, `Régimen fiscal: ${REGIMES[f.regime] ?? f.regime}`, f.contact]
    .filter(Boolean)
    .map((t) => doc.splitTextToSize(t, 260));
  const cLines = [c.name, ...(c.rfc ? [`RFC: ${c.rfc}`] : []), CLIENT_TYPES[c.type] ?? c.type]
    .map((t) => doc.splitTextToSize(t, 250));
  doc.setFont('helvetica', 'bold').setFontSize(9);
  ink(theme.muted);
  doc.text('De', MARGIN, y);
  doc.text('Para', PARTS_X, y);
  const drawParty = (blocks, x) => {
    let yy = y + 15;
    blocks.forEach((lines, i) => {
      doc.setFont('helvetica', i === 0 ? 'bold' : 'normal').setFontSize(10);
      ink(i === 0 ? theme.text : theme.muted);
      doc.text(lines, x, yy);
      yy += lines.length * 13;
    });
    return yy;
  };
  y = Math.max(drawParty(fLines, MARGIN), drawParty(cLines, PARTS_X)) + 18;

  // 5. Tabla de conceptos
  function tableHeader() {
    doc.setFillColor(...theme.ground);
    doc.rect(MARGIN, y - 13, RIGHT - MARGIN, 22, 'F');
    doc.setFont('helvetica', 'bold').setFontSize(10);
    ink(theme.text);
    doc.text('Descripción', COL.desc + 4, y + 1);
    doc.text('Cantidad', COL.qty, y + 1, { align: 'right' });
    doc.text('Precio unitario', COL.price, y + 1, { align: 'right' });
    doc.text('Importe', COL.amount - 4, y + 1, { align: 'right' });
    doc.setDrawColor(...theme.border).setLineWidth(0.7).line(MARGIN, y + 9, RIGHT, y + 9);
    y += 28;
    doc.setFont('helvetica', 'normal');
  }
  tableHeader();
  for (const l of quote.lines) {
    const descLines = doc.splitTextToSize(l.description, COL.qty - 70 - COL.desc);
    const ruleY = (descLines.length - 1) * 13 + 7;
    const rowH = ruleY + 14;
    if (y + rowH > PAGE_H - MARGIN) {
      doc.addPage();
      startPage();
      tableHeader();
    }
    doc.setFont('helvetica', 'normal').setFontSize(10);
    ink(theme.text);
    doc.text(descLines, COL.desc + 4, y);
    doc.text(formatQuantity(l.quantityHundredths), COL.qty, y, { align: 'right' });
    doc.text(formatMoney(l.unitPriceCents), COL.price, y, { align: 'right' });
    doc.text(formatMoney(l.amount), COL.amount - 4, y, { align: 'right' });
    doc.setDrawColor(...theme.border).setLineWidth(0.5).line(MARGIN, y + ruleY, RIGHT, y + ruleY);
    y += rowH;
  }
  y += 6;

  // 6 y 7. Desglose y total (el total va en una caja de acento que no se parte entre páginas)
  const t = quote.totals;
  const rows = [
    ['Subtotal', formatMoney(t.subtotal)],
    ['IVA (16 %)', formatMoney(t.iva)],
  ];
  if (c.type === 'MORAL') {
    rows.push([`Retención de ISR (${pct(quote.isrRateBp)})`, `-${formatMoney(t.retIsr)}`]);
    rows.push(['Retención de IVA (2/3)', `-${formatMoney(t.retIva)}`]);
  }
  const boxH = 36;
  const needed = rows.length * 16 + 8 + boxH;
  if (y + needed > PAGE_H - MARGIN) {
    doc.addPage();
    startPage();
  }
  doc.setFontSize(10).setFont('helvetica', 'normal');
  for (const [label, value] of rows) {
    ink(theme.muted);
    doc.text(label, TOTALS_X, y);
    ink(theme.text);
    doc.text(value, RIGHT, y, { align: 'right' });
    y += 16;
  }
  y += 2;
  doc.setFillColor(...theme.primary);
  doc.rect(TOTALS_X - 12, y, RIGHT - TOTALS_X + 12, boxH, 'F');
  ink(theme.onPrimary);
  doc.setFont('helvetica', 'bold').setFontSize(14);
  doc.text('Total', TOTALS_X, y + 23);
  doc.text(formatMoney(t.total), RIGHT - 10, y + 23, { align: 'right' });

  doc.save(`Cotizacion-${quote.folio}.pdf`);
}
