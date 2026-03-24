// ============================================================
// Tab 3: Calendar
// ============================================================
function calcCalendar() {
  const month = parseInt(document.getElementById('cal-month').value);
  const year = parseInt(document.getElementById('cal-year').value);

  const jd1 = calToJD(year, month, 1);
  const dow = dayOfWeek(jd1);
  const dim = daysInMonth(year, month);

  const now = new Date();
  const todayY = now.getFullYear(), todayM = now.getMonth() + 1, todayD = now.getDate();

  let html = `<div style="text-align:center;margin-bottom:0.8rem;font-size:0.95rem;color:var(--accent)">${MONTH_NAMES[month]} ${year}</div>`;
  html += '<div class="calendar-grid">';

  const days = ['SU', 'MO', 'TU', 'WE', 'TH', 'FR', 'SA'];
  for (const d of days) {
    html += `<div class="day-header">${d}</div>`;
  }

  for (let i = 0; i < dow; i++) {
    html += '<div class="day-cell empty"></div>';
  }

  for (let d = 1; d <= dim; d++) {
    const isToday = (year === todayY && month === todayM && d === todayD);
    const isSun = ((dow + d - 1) % 7 === 0);
    let cls = 'day-cell';
    if (isToday) cls += ' today';
    else if (isSun) cls += ' sunday';
    html += `<div class="${cls}">${d}</div>`;
  }

  const remaining = (7 - ((dow + dim) % 7)) % 7;
  for (let i = 0; i < remaining; i++) {
    html += '<div class="day-cell empty"></div>';
  }

  html += '</div>';
  document.getElementById('out-calendar').innerHTML = html;
}
