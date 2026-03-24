// ============================================================
// Tab 4: Holidays
// ============================================================
function easterWestern(year) {
  const a = year % 19;
  const b = Math.floor(year / 100);
  const c = year % 100;
  const d = Math.floor(b / 4);
  const e = b % 4;
  const f = Math.floor((b + 8) / 25);
  const g = Math.floor((b - f + 1) / 3);
  const h = (19 * a + b - d - g + 15) % 30;
  const i = Math.floor(c / 4);
  const k = c % 4;
  const l = (32 + 2 * e + 2 * i - h - k) % 7;
  const m = Math.floor((a + 11 * h + 22 * l) / 451);
  const month = Math.floor((h + l - 7 * m + 114) / 31);
  const day = ((h + l - 7 * m + 114) % 31) + 1;
  return { month, day };
}

function easterOrthodox(year) {
  const a = year % 4;
  const b = year % 7;
  const c = year % 19;
  const d = (19 * c + 15) % 30;
  const e = (2 * a + 4 * b - d + 34) % 7;
  const month = Math.floor((d + e + 114) / 31);
  const day = ((d + e + 114) % 31) + 1;
  // This gives Julian calendar date, convert to Gregorian
  const jd = calToJDJulian(year, month, day);
  return jdToCal(jd);
}

function calToJDJulian(year, month, day) {
  let y = year, m = month;
  if (m <= 2) { y--; m += 12; }
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day - 1524.5;
}

// Hebrew calendar computations using the actual molad-based algorithm
function hebrewNewYear(hebrewYear) {
  // Calculate the molad (mean conjunction) for Tishrei of the given Hebrew year
  // Reference: molad of year 1 (Tishrei) = Monday, 5h 204p (BaHaRaD)
  // Months since epoch: each Hebrew year has either 12 or 13 months
  // Mean synodic month = 29 days, 12 hours, 793 parts (1 hour = 1080 parts)

  const HOUR = 1080; // parts per hour
  const DAY = 24 * HOUR; // parts per day
  const MONTH = 29 * DAY + 12 * HOUR + 793; // mean synodic month in parts

  // Months from epoch to start of hebrewYear
  // In each 19-year cycle there are 235 months
  const cyclesElapsed = Math.floor((hebrewYear - 1) / 19);
  const yearInCycle = ((hebrewYear - 1) % 19);

  // Count months in completed years of this cycle
  const leapYears = [3, 6, 8, 11, 14, 17, 19]; // 1-indexed years in cycle that are leap
  let monthsInCycle = 0;
  for (let y = 0; y < yearInCycle; y++) {
    monthsInCycle += leapYears.includes(y + 1) ? 13 : 12;
  }

  const totalMonths = cyclesElapsed * 235 + monthsInCycle;

  // Molad in parts from BaHaRaD reference
  // BaHaRaD: day 2 (Monday), 5 hours, 204 parts
  const moladParts = 2 * DAY + 5 * HOUR + 204 + totalMonths * MONTH;

  const moladDay = Math.floor(moladParts / DAY); // day number (day 1 = Sunday)
  const moladRemainder = moladParts - moladDay * DAY;
  const moladHours = Math.floor(moladRemainder / HOUR);
  const moladHalakim = moladRemainder - moladHours * HOUR;

  let dow = moladDay % 7; // 0=Sat, 1=Sun, 2=Mon, ...
  let roshDay = moladDay;

  const isLeap = leapYears.includes(yearInCycle + 1);
  const prevYearInCycle = yearInCycle === 0 ? 18 : yearInCycle - 1;
  const prevIsLeap = leapYears.includes(prevYearInCycle + 1);

  // Postponement rule 1 (Lo ADU): Rosh Hashanah cannot fall on Sunday(1), Wednesday(4), or Friday(6)
  // dow: 0=Sat,1=Sun,2=Mon,3=Tue,4=Wed,5=Thu,6=Fri
  function postponeADU() {
    const d = roshDay % 7;
    if (d === 1 || d === 4 || d === 6) {
      roshDay++;
    }
  }

  // Postponement rule 2 (Molad Zaken): if molad is at or after 18 hours (noon), postpone
  if (moladHours >= 18) {
    roshDay++;
    // Check ADU again after postponement
    postponeADU();
  } else {
    postponeADU();
  }

  // Postponement rule 3 (GaTRaD): In a non-leap year, if molad falls on Tuesday
  // at or after 9h 204p, postpone to Thursday
  const d3 = roshDay % 7;
  // We need to check against the original molad day, not postponed
  const origDow = moladDay % 7;
  if (!isLeap && origDow === 3 && (moladHours > 9 || (moladHours === 9 && moladHalakim >= 204))) {
    if (d3 === 3) roshDay += 2; // Tue -> Thu
  }

  // Postponement rule 4 (BeTUTeKPaT): In the year after a leap year, if molad
  // falls on Monday at or after 15h 589p, postpone to Tuesday
  if (prevIsLeap && origDow === 2 && (moladHours > 15 || (moladHours === 15 && moladHalakim >= 589))) {
    const d4 = roshDay % 7;
    if (d4 === 2) roshDay += 1; // Mon -> Tue
  }

  // Convert Hebrew day number to Julian Day Number
  // BaHaRaD reference: moladDay=2 corresponds to Monday, Oct 7, 3761 BCE (Julian)
  // which is JD 347997.5 for day 2
  // Actually: day 1 in this system = JD 347996.5
  const jd = roshDay + 347995.5;

  return jd;
}

function passoverFromRosh(year) {
  // Passover (15 Nisan) in Gregorian year Y
  // falls in the Hebrew year that started the previous fall
  // Hebrew year H starts with Rosh Hashanah in the fall
  // Passover of Hebrew year H is in spring, which is Gregorian year H-3760 (approx)

  // For Gregorian year Y, Passover falls in Hebrew year Y+3760 (or Y+3761)
  // More precisely: Passover in spring of Gregorian year Y is in Hebrew year Y+3760
  const hebrewYear = year + 3760;

  // Rosh Hashanah of hebrewYear
  const roshJD = hebrewNewYear(hebrewYear);
  // Rosh Hashanah of hebrewYear+1
  const nextRoshJD = hebrewNewYear(hebrewYear + 1);
  const yearLength = nextRoshJD - roshJD;

  // Determine if leap year (13 months)
  const leapYears = [3, 6, 8, 11, 14, 17, 19];
  const yearInCycle = ((hebrewYear - 1) % 19);
  const isLeap = leapYears.includes(yearInCycle + 1);

  // Days from Rosh Hashanah (1 Tishrei) to 15 Nisan
  // Tishrei(30) + Cheshvan(29or30) + Kislev(29or30) + Tevet(29) + Shevat(30) + Adar(29or30) [+ Adar II(29)] + 14 days into Nisan
  // In a regular (355-day) year: 30+29+30+29+30+29 + 14 = 191
  // In a deficient (353-day) year: 30+29+29+29+30+29 + 14 = 190 (Kislev short)
  // In a complete (355-day) year: 30+30+30+29+30+29 + 14 = 192 (Cheshvan long)
  // Leap year adds 30 days (Adar I)

  let daysToNisan;
  if (isLeap) {
    // Leap: Tishrei(30)+Cheshvan+Kislev+Tevet(29)+Shevat(30)+AdarI(30)+AdarII(29)+14
    if (yearLength === 383) daysToNisan = 30 + 29 + 29 + 29 + 30 + 30 + 29 + 14; // 220
    else if (yearLength === 384) daysToNisan = 30 + 29 + 30 + 29 + 30 + 30 + 29 + 14; // 221
    else daysToNisan = 30 + 30 + 30 + 29 + 30 + 30 + 29 + 14; // 385: 222
  } else {
    if (yearLength === 353) daysToNisan = 30 + 29 + 29 + 29 + 30 + 29 + 14; // 190
    else if (yearLength === 354) daysToNisan = 30 + 29 + 30 + 29 + 30 + 29 + 14; // 191
    else daysToNisan = 30 + 30 + 30 + 29 + 30 + 29 + 14; // 355: 192
  }

  return roshJD + daysToNisan;
}

function calcHolidays() {
  const year = parseInt(document.getElementById('hol-year').value);
  const out = document.getElementById('out-holidays');

  const ew = easterWestern(year);
  const eo = easterOrthodox(year);

  // Passover (15 Nisan)
  const passoverJD = passoverFromRosh(year);
  const passoverCal = jdToCal(passoverJD);

  // First Seder is evening of 14 Nisan (evening before 15 Nisan)
  const seder1 = jdToCal(passoverJD - 1);
  // Second Seder is evening of 15 Nisan
  const seder2 = jdToCal(passoverJD);

  // Last day of Passover (22 Nisan = 15 Nisan + 7)
  const passoverEnd = jdToCal(passoverJD + 7);

  // Rosh Hashanah: 1 Tishrei of the Hebrew year that starts in the fall of this Gregorian year
  // That Hebrew year is year+3761
  const roshJD = hebrewNewYear(year + 3761);
  const roshCal = jdToCal(roshJD);
  const roshDay2 = jdToCal(roshJD + 1);

  // Yom Kippur: 10 Tishrei = Rosh Hashanah + 9
  const ykJD = roshJD + 9;
  const ykCal = jdToCal(ykJD);

  function fmt(cal) {
    return `${MONTH_ABBR[Math.floor(cal.month)]} ${Math.floor(cal.day)}`;
  }

  let html = '<table class="result-table"><tr><th>Holiday</th><th>Date</th></tr>';
  html += `<tr><td>Easter (Western)</td><td>${MONTH_ABBR[ew.month]} ${ew.day}, ${year}</td></tr>`;
  html += `<tr><td>Easter (Orthodox)</td><td>${MONTH_ABBR[Math.floor(eo.month)]} ${Math.floor(eo.day)}, ${year}</td></tr>`;
  html += `<tr><td colspan="2" style="padding-top:0.5rem;font-weight:bold">Passover ${year} (Hebrew ${year + 3760})</td></tr>`;
  html += `<tr><td>  First Seder (evening of 14 Nisan)</td><td>${fmt(seder1)}, ${year}</td></tr>`;
  html += `<tr><td>  Passover begins (15 Nisan)</td><td>${fmt(passoverCal)}, ${year}</td></tr>`;
  html += `<tr><td>  Second Seder (evening of 15 Nisan)</td><td>${fmt(seder2)}, ${year}</td></tr>`;
  html += `<tr><td>  Last day (22 Nisan)</td><td>${fmt(passoverEnd)}, ${year}</td></tr>`;
  html += `<tr><td colspan="2" style="padding-top:0.5rem;font-weight:bold">High Holy Days ${year} (Hebrew ${year + 3761})</td></tr>`;
  html += `<tr><td>  Rosh Hashanah (1 Tishrei)</td><td>${fmt(roshCal)}, ${roshCal.year}</td></tr>`;
  html += `<tr><td>  Rosh Hashanah Day 2</td><td>${fmt(roshDay2)}, ${roshDay2.year}</td></tr>`;
  html += `<tr><td>  Yom Kippur (10 Tishrei)</td><td>${fmt(ykCal)}, ${ykCal.year}</td></tr>`;
  html += '</table>';

  out.innerHTML = html;
}
