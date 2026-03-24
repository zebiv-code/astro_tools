// ============================================================
// Tab 6: Julian Date
// ============================================================
function setJDMode(mode, btn) {
  document.getElementById('jd-toJD').style.display = mode === 'toJD' ? 'block' : 'none';
  document.getElementById('jd-fromJD').style.display = mode === 'fromJD' ? 'block' : 'none';
  document.querySelectorAll('.mode-toggle button').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('out-julian').innerHTML = '';
}

function calcJDFromCal() {
  const year = parseInt(document.getElementById('jd-year').value);
  const month = parseInt(document.getElementById('jd-month').value);
  const day = parseFloat(document.getElementById('jd-day').value);

  const jd = calToJD(year, month, day);

  const out = document.getElementById('out-julian');
  out.innerHTML = `<span class="label">Date:</span> <span class="value">${year}-${pad2(month)}-${day}</span>\n<span class="label">Julian Day:</span> <span class="value">${jd.toFixed(5)}</span>`;
}

function calcCalFromJD() {
  const jd = parseFloat(document.getElementById('jd-input').value);
  const cal = jdToCal(jd);

  const dayInt = Math.floor(cal.day);
  const frac_day = cal.day - dayInt;
  const hours = frac_day * 24;

  const out = document.getElementById('out-julian');
  out.innerHTML = `<span class="label">Julian Day:</span> <span class="value">${jd.toFixed(5)}</span>\n<span class="label">Date:</span> <span class="value">${cal.year}-${pad2(cal.month)}-${pad2(dayInt)}</span>  <span class="label">Time:</span> <span class="value">${formatTime(hours)} UT</span>`;
}
