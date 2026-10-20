// Cálculos de dinero, folios, vigencia y validaciones.
// Módulo sin dependencias del navegador: lo usan las pantallas y el servidor.
// Importes en centavos enteros; cantidades en centésimas.

// Redondeo a entero con "0.005 sube" para valores no negativos: num / den.
function roundDiv(num, den) {
  return (2n * num + den) / (2n * den);
}

// Importe exacto de un concepto en "centésimas de centavo" (cantidad en centésimas × precio en centavos).
function exactLine(quantityHundredths, unitPriceCents) {
  return BigInt(quantityHundredths) * BigInt(unitPriceCents);
}

export function lineAmount(quantityHundredths, unitPriceCents) {
  return Number(roundDiv(exactLine(quantityHundredths, unitPriceCents), 100n));
}

export function calcQuote(lines, clientType, isrRateBp) {
  let exact = 0n;
  for (const l of lines) exact += exactLine(l.quantityHundredths, l.unitPriceCents);

  const subtotal = roundDiv(exact, 100n);
  const iva = roundDiv(exact * 16n, 10000n);
  let retIsr = 0n;
  let retIva = 0n;
  if (clientType === 'MORAL') {
    retIsr = roundDiv(exact * BigInt(isrRateBp), 1000000n);
    retIva = roundDiv(exact * 32n, 30000n); // S × 16/100 × 2/3
  }
  const total = subtotal + iva - retIsr - retIva;
  return {
    subtotal: Number(subtotal),
    iva: Number(iva),
    retIsr: Number(retIsr),
    retIva: Number(retIva),
    total: Number(total),
  };
}

export function formatMoney(cents) {
  const negative = cents < 0;
  const abs = Math.abs(cents);
  const pesos = Math.floor(abs / 100);
  const cs = String(abs % 100).padStart(2, '0');
  const withCommas = String(pesos).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  return `${negative ? '-' : ''}$${withCommas}.${cs}`;
}

// Convierte texto ("2.5", "0.25") a centésimas. Devuelve null si no es un número con máximo 2 decimales.
export function parseQuantity(text) {
  const m = /^\s*(\d+)(?:[.,](\d{1,2}))?\s*$/.exec(String(text));
  if (!m) return null;
  return Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0') || 0);
}

// Convierte texto en pesos ("333.33") a centavos. Devuelve null si no es válido.
export function parsePrice(text) {
  const m = /^\s*\$?\s*(\d+)(?:\.(\d{1,2}))?\s*$/.exec(String(text).replace(/,/g, ''));
  if (!m) return null;
  return Number(m[1]) * 100 + Number((m[2] ?? '').padEnd(2, '0') || 0);
}

export function validateQuantity(hundredths) {
  if (!Number.isInteger(hundredths)) {
    return { ok: false, error: 'La cantidad debe tener máximo 2 decimales.' };
  }
  if (hundredths <= 0) return { ok: false, error: 'La cantidad debe ser mayor que 0.' };
  return { ok: true };
}

export function validatePrice(cents) {
  if (!Number.isInteger(cents)) return { ok: false, error: 'El precio debe tener máximo 2 decimales.' };
  if (cents <= 0) return { ok: false, error: 'El precio debe ser mayor que 0.' };
  return { ok: true };
}

const RFC_RE = /^[A-ZÑ&]{3,4}\d{6}[A-Z0-9]{3}$/;

export function normalizeRfc(rfc) {
  return String(rfc ?? '').trim().toUpperCase();
}

export function isValidRfc(rfc, { allowEmpty = false } = {}) {
  const v = normalizeRfc(rfc);
  if (v === '') return allowEmpty;
  return RFC_RE.test(v);
}

export function formatFolio(year, n) {
  return `${year}-${String(n).padStart(3, '0')}`;
}

export function nextFolioNumber(lastNumber) {
  return lastNumber + 1;
}

// Suma días naturales a una fecha AAAA-MM-DD.
export function addDays(isoDate, days) {
  const [y, m, d] = isoDate.split('-').map(Number);
  const dt = new Date(Date.UTC(y, m - 1, d + days));
  return dt.toISOString().slice(0, 10);
}

export const VIGENCIA_DIAS = 30;

// Vencida cuando hoy es posterior a emisión + 30 días naturales.
export function isExpired(issueDate, today) {
  return today > addDays(issueDate, VIGENCIA_DIAS);
}

// Cantidad en centésimas → texto sin ceros sobrantes (250 → "2.5", 100 → "1", 25 → "0.25").
export function formatQuantity(hundredths) {
  const whole = Math.floor(hundredths / 100);
  const frac = String(hundredths % 100).padStart(2, '0').replace(/0+$/, '');
  return frac ? `${whole}.${frac}` : String(whole);
}
