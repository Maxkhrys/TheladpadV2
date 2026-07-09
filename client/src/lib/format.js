const DAYS = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
const DAY_ABBR = {
  monday: 'Mon',
  tuesday: 'Tue',
  wednesday: 'Wed',
  thursday: 'Thu',
  friday: 'Fri',
  saturday: 'Sat',
  sunday: 'Sun',
};

export function formatTime12h(time) {
  if (!time) return '';
  const [h, m] = time.split(':').map(Number);
  const period = h >= 12 ? 'pm' : 'am';
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return m === 0 ? `${hour12}${period}` : `${hour12}:${String(m).padStart(2, '0')}${period}`;
}

/** Groups consecutive days that share the same hours, e.g. Mon–Sat 9am–5pm / Sun Closed */
export function summarizeHours(hours) {
  if (!hours) return [];
  const lines = [];
  let i = 0;
  while (i < DAYS.length) {
    const entry = hours[DAYS[i]];
    const key = entry ? `${entry.open}-${entry.close}` : 'closed';
    let j = i;
    while (j + 1 < DAYS.length) {
      const nextEntry = hours[DAYS[j + 1]];
      const nextKey = nextEntry ? `${nextEntry.open}-${nextEntry.close}` : 'closed';
      if (nextKey === key) j++;
      else break;
    }
    const label = i === j ? DAY_ABBR[DAYS[i]] : `${DAY_ABBR[DAYS[i]]}–${DAY_ABBR[DAYS[j]]}`;
    const value = entry ? `${formatTime12h(entry.open)} – ${formatTime12h(entry.close)}` : 'Closed';
    lines.push({ label, value });
    i = j + 1;
  }
  return lines;
}

export function formatPrice(n) {
  return `€${Number(n).toFixed(0)}`;
}
