// Resumen de actividad del inicio. Función pura: no depende del navegador (se prueba con node --test).
export function summarizeQuotes(list) {
  const vencidas = list.filter((q) => q.expired).length;
  return { vigentes: list.length - vencidas, vencidas, total: list.length };
}
