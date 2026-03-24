// ============================================================
// Tab switching
// ============================================================
document.querySelectorAll('.tab-btn').forEach(btn => {
  btn.addEventListener('click', () => {
    document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
    document.querySelectorAll('.panel').forEach(p => p.classList.remove('active'));
    btn.classList.add('active');
    document.getElementById('panel-' + btn.dataset.tab).classList.add('active');
  });
});

// ============================================================
// Initialize default dates
// ============================================================
(function init() {
  const now = new Date();
  const y = now.getFullYear(), m = now.getMonth() + 1, d = now.getDate();

  document.getElementById('ss-year').value = y;
  document.getElementById('ss-month').value = m;
  document.getElementById('ss-day').value = d;

  // Try to get actual timezone offset
  const tzOff = -now.getTimezoneOffset() / 60;
  document.getElementById('ss-tz').value = tzOff;

  document.getElementById('mp-year').value = y;
  document.getElementById('mp-month').value = '';

  document.getElementById('cal-month').value = m;
  document.getElementById('cal-year').value = y;

  document.getElementById('hol-year').value = y;
  document.getElementById('met-year').value = y;

  document.getElementById('jd-year').value = y;
  document.getElementById('jd-month').value = m;
  document.getElementById('jd-day').value = d;

  // Sidereal time: current JD
  fillCurrentJD();
})();
