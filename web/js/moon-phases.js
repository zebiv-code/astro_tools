// ============================================================
// Tab 2: Moon Phases (Meeus algorithm)
// ============================================================
function calcMoonPhase(k) {
  const T = k / 1236.85;
  const T2 = T * T;
  const T3 = T2 * T;
  const T4 = T3 * T;

  let jde = 2451550.09766 + 29.530588861 * k
    + 0.00015437 * T2
    - 0.000000150 * T3
    + 0.00000000073 * T4;

  const E = 1 - 0.002516 * T - 0.0000074 * T2;

  // Sun's mean anomaly
  const M = (2.5534 + 29.10535670 * k - 0.0000014 * T2 - 0.00000011 * T3) * RAD;
  // Moon's mean anomaly
  const Mp = (201.5643 + 385.81693528 * k + 0.0107582 * T2 + 0.00001238 * T3 - 0.000000058 * T4) * RAD;
  // Moon's argument of latitude
  const F = (160.7108 + 390.67050284 * k - 0.0016118 * T2 - 0.00000227 * T3 + 0.000000011 * T4) * RAD;
  // Longitude of ascending node
  const omega = (124.7746 - 1.56375588 * k + 0.0020672 * T2 + 0.00000215 * T3) * RAD;

  const phase = mod(k, 1);
  let correction;

  if (Math.abs(phase) < 0.01 || Math.abs(phase - 1) < 0.01) {
    // New Moon
    correction =
      -0.40720 * Math.sin(Mp)
      + 0.17241 * E * Math.sin(M)
      + 0.01608 * Math.sin(2 * Mp)
      + 0.01039 * Math.sin(2 * F)
      + 0.00739 * E * Math.sin(Mp - M)
      - 0.00514 * E * Math.sin(Mp + M)
      + 0.00208 * E * E * Math.sin(2 * M)
      - 0.00111 * Math.sin(Mp - 2 * F)
      - 0.00057 * Math.sin(Mp + 2 * F)
      + 0.00056 * E * Math.sin(2 * Mp + M)
      - 0.00042 * Math.sin(3 * Mp)
      + 0.00042 * E * Math.sin(M + 2 * F)
      + 0.00038 * E * Math.sin(M - 2 * F)
      - 0.00024 * E * Math.sin(2 * Mp - M)
      - 0.00017 * Math.sin(omega)
      - 0.00007 * Math.sin(Mp + 2 * M)
      + 0.00004 * Math.sin(2 * Mp - 2 * F)
      + 0.00004 * Math.sin(3 * M)
      + 0.00003 * Math.sin(Mp + M - 2 * F)
      + 0.00003 * Math.sin(2 * Mp + 2 * F)
      - 0.00003 * Math.sin(Mp + M + 2 * F)
      + 0.00003 * Math.sin(Mp - M + 2 * F)
      - 0.00002 * Math.sin(Mp - M - 2 * F)
      - 0.00002 * Math.sin(3 * Mp + M)
      + 0.00002 * Math.sin(4 * Mp);
  } else if (Math.abs(phase - 0.5) < 0.01) {
    // Full Moon
    correction =
      -0.40614 * Math.sin(Mp)
      + 0.17302 * E * Math.sin(M)
      + 0.01614 * Math.sin(2 * Mp)
      + 0.01043 * Math.sin(2 * F)
      + 0.00734 * E * Math.sin(Mp - M)
      - 0.00515 * E * Math.sin(Mp + M)
      + 0.00209 * E * E * Math.sin(2 * M)
      - 0.00111 * Math.sin(Mp - 2 * F)
      - 0.00057 * Math.sin(Mp + 2 * F)
      + 0.00056 * E * Math.sin(2 * Mp + M)
      - 0.00042 * Math.sin(3 * Mp)
      + 0.00042 * E * Math.sin(M + 2 * F)
      + 0.00038 * E * Math.sin(M - 2 * F)
      - 0.00024 * E * Math.sin(2 * Mp - M)
      - 0.00017 * Math.sin(omega)
      - 0.00007 * Math.sin(Mp + 2 * M)
      + 0.00004 * Math.sin(2 * Mp - 2 * F)
      + 0.00004 * Math.sin(3 * M)
      + 0.00003 * Math.sin(Mp + M - 2 * F)
      + 0.00003 * Math.sin(2 * Mp + 2 * F)
      - 0.00003 * Math.sin(Mp + M + 2 * F)
      + 0.00003 * Math.sin(Mp - M + 2 * F)
      - 0.00002 * Math.sin(Mp - M - 2 * F)
      - 0.00002 * Math.sin(3 * Mp + M)
      + 0.00002 * Math.sin(4 * Mp);
  } else {
    // Quarter phases
    correction =
      -0.62801 * Math.sin(Mp)
      + 0.17172 * E * Math.sin(M)
      - 0.01183 * E * Math.sin(Mp + M)
      + 0.00862 * Math.sin(2 * Mp)
      + 0.00804 * Math.sin(2 * F)
      + 0.00454 * E * Math.sin(Mp - M)
      + 0.00204 * E * E * Math.sin(2 * M)
      - 0.00180 * Math.sin(Mp - 2 * F)
      - 0.00070 * Math.sin(Mp + 2 * F)
      - 0.00040 * Math.sin(3 * Mp)
      - 0.00034 * E * Math.sin(2 * Mp - M)
      + 0.00032 * E * Math.sin(M + 2 * F)
      + 0.00032 * E * Math.sin(M - 2 * F)
      - 0.00028 * E * E * Math.sin(Mp + 2 * M)
      + 0.00027 * E * Math.sin(2 * Mp + M)
      - 0.00017 * Math.sin(omega)
      - 0.00005 * Math.sin(Mp - M - 2 * F)
      + 0.00004 * Math.sin(2 * Mp + 2 * F)
      - 0.00004 * Math.sin(Mp + M + 2 * F)
      + 0.00004 * Math.sin(Mp - 2 * M)
      + 0.00003 * Math.sin(Mp + M - 2 * F)
      + 0.00003 * Math.sin(3 * M)
      + 0.00002 * Math.sin(2 * Mp - 2 * F)
      + 0.00002 * Math.sin(Mp - M + 2 * F)
      - 0.00002 * Math.sin(3 * Mp + M);

    const W = 0.00306 - 0.00038 * E * Math.cos(M) + 0.00026 * Math.cos(Mp)
      - 0.00002 * Math.cos(Mp - M) + 0.00002 * Math.cos(Mp + M) + 0.00002 * Math.cos(2 * F);

    if (Math.abs(phase - 0.25) < 0.01) {
      correction += W;
    } else {
      correction -= W;
    }
  }

  jde += correction;

  // Additional corrections (planetary)
  const A1 = (299.77 + 132.8475848 * k - 0.009173 * T2) * RAD;
  const A2 = (251.88 + 0.01321 * k) * RAD;
  const A3 = (251.83 + 26.651886 * k) * RAD;
  const A4 = (349.42 + 36.412478 * k) * RAD;
  const A5 = (84.66 + 18.206239 * k) * RAD;
  const A6 = (141.74 + 53.303771 * k) * RAD;
  const A7 = (207.14 + 2.453732 * k) * RAD;
  const A8 = (154.84 + 7.306860 * k) * RAD;
  const A9 = (34.52 + 27.261239 * k) * RAD;
  const A10 = (207.19 + 0.121824 * k) * RAD;
  const A11 = (291.34 + 1.844379 * k) * RAD;
  const A12 = (161.72 + 24.198154 * k) * RAD;
  const A13 = (239.56 + 25.513099 * k) * RAD;
  const A14 = (331.55 + 3.592518 * k) * RAD;

  jde += 0.000325 * Math.sin(A1)
    + 0.000165 * Math.sin(A2)
    + 0.000164 * Math.sin(A3)
    + 0.000126 * Math.sin(A4)
    + 0.000110 * Math.sin(A5)
    + 0.000062 * Math.sin(A6)
    + 0.000060 * Math.sin(A7)
    + 0.000056 * Math.sin(A8)
    + 0.000047 * Math.sin(A9)
    + 0.000042 * Math.sin(A10)
    + 0.000040 * Math.sin(A11)
    + 0.000037 * Math.sin(A12)
    + 0.000035 * Math.sin(A13)
    + 0.000023 * Math.sin(A14);

  return jde;
}

function jdToUTCString(jd) {
  const cal = jdToCal(jd);
  const dayInt = Math.floor(cal.day);
  const frac = cal.day - dayInt;
  const hours = frac * 24;
  return `${cal.year}-${pad2(cal.month)}-${pad2(dayInt)} ${formatTime(hours)} UTC`;
}

function calcMoonPhases() {
  const year = parseInt(document.getElementById('mp-year').value);
  const monthFilter = parseInt(document.getElementById('mp-month').value) || 0;

  const phaseNames = ['New Moon', 'First Quarter', 'Full Moon', 'Last Quarter'];
  const phaseSymbols = ['\u{1F311}', '\u{1F313}', '\u{1F315}', '\u{1F317}'];

  // Calculate k for start of year (or month)
  let startK, endK;
  if (monthFilter > 0) {
    startK = Math.floor((year + (monthFilter - 1) / 12 - 2000) * 12.3685);
    endK = Math.ceil((year + monthFilter / 12 - 2000) * 12.3685);
  } else {
    startK = Math.floor((year - 2000) * 12.3685) - 1;
    endK = Math.ceil((year + 1 - 2000) * 12.3685) + 1;
  }

  const results = [];
  for (let ki = startK; ki <= endK; ki++) {
    for (let q = 0; q < 4; q++) {
      const k = ki + q * 0.25;
      const jde = calcMoonPhase(k);
      const cal = jdToCal(jde);
      const dayInt = Math.floor(cal.day);

      if (cal.year !== year) continue;
      if (monthFilter > 0 && cal.month !== monthFilter) continue;

      const frac_day = cal.day - dayInt;
      const hours = frac_day * 24;

      results.push({
        jde,
        phase: phaseNames[q],
        symbol: phaseSymbols[q],
        date: `${cal.year}-${pad2(cal.month)}-${pad2(dayInt)}`,
        time: formatTime(hours) + ' UTC',
        month: cal.month,
        day: dayInt
      });
    }
  }

  results.sort((a, b) => a.jde - b.jde);

  const out = document.getElementById('out-moon');
  if (results.length === 0) {
    out.innerHTML = '<span class="warn">No phases found for the given period.</span>';
    return;
  }

  let html = '<table class="result-table"><tr><th>Date</th><th>Time</th><th>Phase</th></tr>';
  for (const r of results) {
    html += `<tr><td>${r.date}</td><td>${r.time}</td><td>${r.phase}</td></tr>`;
  }
  html += '</table>';
  out.innerHTML = html;
}
