// ============================================================
// Tab 5: Meteor Showers (solar longitude iteration)
// ============================================================
function solarLongitude(jd) {
  // Approximate solar longitude (Meeus, simplified)
  const T = (jd - 2451545.0) / 36525.0;
  // Geometric mean longitude
  let L0 = 280.46646 + 36000.76983 * T + 0.0003032 * T * T;
  L0 = mod(L0, 360);
  // Mean anomaly
  let M = 357.52911 + 35999.05029 * T - 0.0001537 * T * T;
  M = mod(M, 360) * RAD;
  // Equation of center
  const C = (1.914602 - 0.004817 * T - 0.000014 * T * T) * Math.sin(M)
    + (0.019993 - 0.000101 * T) * Math.sin(2 * M)
    + 0.000289 * Math.sin(3 * M);
  // Sun's true longitude
  let lon = L0 + C;
  // Apparent longitude (nutation + aberration)
  const omega = (125.04 - 1934.136 * T) * RAD;
  lon = lon - 0.00569 - 0.00478 * Math.sin(omega);
  return mod(lon, 360);
}

function findSolarLongitudeDate(targetLon, year) {
  // Start from approximate date and iterate
  // targetLon in degrees
  // Rough estimate: solar longitude ~ 0 at March equinox (~ March 20)
  const daysFromEquinox = targetLon / 360 * 365.25;
  const equinoxJD = calToJD(year, 3, 20.5);
  let jd = equinoxJD + daysFromEquinox;

  // Newton-Raphson iteration
  for (let i = 0; i < 20; i++) {
    const lon = solarLongitude(jd);
    let diff = targetLon - lon;
    // Handle wrap-around
    if (diff > 180) diff -= 360;
    if (diff < -180) diff += 360;
    if (Math.abs(diff) < 0.0001) break;
    jd += diff / 360 * 365.25;
  }

  return jd;
}

function calcMeteors() {
  const year = parseInt(document.getElementById('met-year').value);

  const showers = [
    { name: 'Quadrantids', lon: 283.16, rate: '120' },
    { name: 'Lyrids', lon: 32.32, rate: '18' },
    { name: 'Eta Aquariids', lon: 45.5, rate: '50' },
    { name: 'Delta Aquariids', lon: 125.0, rate: '20' },
    { name: 'Perseids', lon: 140.0, rate: '100' },
    { name: 'Orionids', lon: 208.0, rate: '20' },
    { name: 'Taurids', lon: 220.0, rate: '5' },
    { name: 'Leonids', lon: 235.27, rate: '15' },
    { name: 'Geminids', lon: 262.2, rate: '150' },
  ];

  let html = '<table class="result-table"><tr><th>Shower</th><th>Maximum</th><th>ZHR</th></tr>';

  for (const s of showers) {
    const jd = findSolarLongitudeDate(s.lon, year);
    const cal = jdToCal(jd);
    const dayInt = Math.floor(cal.day);
    html += `<tr><td>${s.name}</td><td>${MONTH_ABBR[Math.floor(cal.month)]} ${dayInt}, ${Math.floor(cal.year)}</td><td>${s.rate}</td></tr>`;
  }

  html += '</table>';
  document.getElementById('out-meteors').innerHTML = html;
}
