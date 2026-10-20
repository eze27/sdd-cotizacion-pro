const TZ = 'America/Mexico_City';

// Fecha AAAA-MM-DD en la Ciudad de México. `now` es inyectable para pruebas.
export function todayInMexico(now = new Date()) {
  return new Intl.DateTimeFormat('en-CA', {
    timeZone: TZ, year: 'numeric', month: '2-digit', day: '2-digit',
  }).format(now);
}

export function yearInMexico(now = new Date()) {
  return Number(todayInMexico(now).slice(0, 4));
}
