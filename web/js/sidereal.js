// ============================================================
// Tab 7: Sidereal Time (GMST)
// ============================================================
function calcSidereal() {
  const jd = parseFloat(document.getElementById('st-jd').value);

  // Separate JD into integer and fractional parts at UT midnight
  const jd0 = Math.floor(jd - 0.5) + 0.5; // JD at preceding UT midnight
  const ut = (jd - jd0) * 24.0; // UT hours

  const T = (jd0 - 2451545.0) / 36525.0;

  // GMST at 0h UT
  let gmst0 = 24110.54841 + 8640184.812866 * T + 0.093104 * T * T - 6.2e-6 * T * T * T;
  // Convert to hours
  gmst0 = gmst0 / 3600.0;
  // Add UT contribution (sidereal rate)
  let gmst = gmst0 + ut * 1.00273790935;
  gmst = mod(gmst, 24);

  const h = Math.floor(gmst);
  const m = Math.floor((gmst - h) * 60);
  const s = ((gmst - h) * 60 - m) * 60;

  const out = document.getElementById('out-sidereal');
  const cal = jdToCal(jd);
  const dayInt = Math.floor(cal.day);
  const frac_day = cal.day - dayInt;
  const utHours = frac_day * 24;

  out.innerHTML = `<span class="label">Julian Day:</span> <span class="value">${jd.toFixed(5)}</span>\n<span class="label">Date:</span> <span class="value">${cal.year}-${pad2(cal.month)}-${pad2(dayInt)} ${formatTime(utHours)} UT</span>\n\n<span class="label">GMST:</span> <span class="value">${pad2(h)}h ${pad2(m)}m ${s.toFixed(2)}s</span>\n<span class="label">GMST (decimal hours):</span> <span class="value2">${gmst.toFixed(6)}</span>`;
}

function fillCurrentJD() {
  const now = new Date();
  const y = now.getUTCFullYear();
  const m = now.getUTCMonth() + 1;
  const d = now.getUTCDate() + now.getUTCHours() / 24 + now.getUTCMinutes() / 1440 + now.getUTCSeconds() / 86400;
  const jd = calToJD(y, m, d);
  document.getElementById('st-jd').value = jd.toFixed(5);
}
