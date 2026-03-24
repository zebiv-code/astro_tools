// ============================================================
// Utility functions
// ============================================================
const PI = Math.PI;
const RAD = PI / 180;
const DEG = 180 / PI;
const TWO_PI = 2 * PI;

function frac(x) { return x - Math.floor(x); }
function mod(a, b) { return ((a % b) + b) % b; }

function calToJD(year, month, day) {
  // Meeus algorithm
  let y = year, m = month;
  if (m <= 2) { y--; m += 12; }
  const A = Math.floor(y / 100);
  const B = 2 - A + Math.floor(A / 4);
  return Math.floor(365.25 * (y + 4716)) + Math.floor(30.6001 * (m + 1)) + day + B - 1524.5;
}

function jdToCal(jd) {
  const z = Math.floor(jd + 0.5);
  const f = jd + 0.5 - z;
  let a;
  if (z < 2299161) { a = z; }
  else {
    const alpha = Math.floor((z - 1867216.25) / 36524.25);
    a = z + 1 + alpha - Math.floor(alpha / 4);
  }
  const b = a + 1524;
  const c = Math.floor((b - 122.1) / 365.25);
  const d = Math.floor(365.25 * c);
  const e = Math.floor((b - d) / 30.6001);
  const day = b - d - Math.floor(30.6001 * e) + f;
  const month = e < 14 ? e - 1 : e - 13;
  const year = month > 2 ? c - 4716 : c - 4715;
  return { year, month, day };
}

function dayOfWeek(jd) {
  return Math.floor(jd + 1.5) % 7; // 0=Sunday
}

function isLeapYear(y) {
  return (y % 4 === 0 && y % 100 !== 0) || (y % 400 === 0);
}

function daysInMonth(y, m) {
  return [31, isLeapYear(y) ? 29 : 28, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31][m - 1];
}

const MONTH_NAMES = ['', 'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'];

const MONTH_ABBR = ['', 'Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
  'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

function pad2(n) { return String(Math.floor(n)).padStart(2, '0'); }

function formatTime(hours) {
  const h = Math.floor(hours);
  const m = Math.floor((hours - h) * 60);
  const s = Math.floor(((hours - h) * 60 - m) * 60);
  return `${pad2(h)}:${pad2(m)}:${pad2(s)}`;
}

function formatAngle(deg) {
  return deg.toFixed(1) + '\u00b0';
}
