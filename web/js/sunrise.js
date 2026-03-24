// ============================================================
// Tab 1: Sunrise/Sunset - Sky & Telescope algorithm (Aug 1994)
// ============================================================
function sunPosition(t, tt) {
  let l = 0.779072 + 0.00273790931 * t;
  l = frac(l) * TWO_PI;
  let g = 0.993126 + 0.0027377785 * t;
  g = frac(g) * TWO_PI;

  const sinL = Math.sin(l), cosL = Math.cos(l);
  const sinG = Math.sin(g), cosG = Math.cos(g);
  const sin2L = Math.sin(2 * l), cos2L = Math.cos(2 * l);

  const v = 0.39785 * sinL - 0.01 * Math.sin(l - g) + 0.00333 * Math.sin(l + g) - 0.00021 * tt * sinL;
  const u = 1 - 0.03349 * cosG - 0.00014 * cos2L + 0.00008 * cosL;
  const w = -0.0001 - 0.04129 * sin2L + 0.03211 * sinG + 0.00104 * Math.sin(2 * l - g) - 0.00035 * Math.sin(2 * l + g) - 0.00008 * tt * sinG;

  const s = w / Math.sqrt(u - v * v);
  let ra = l + Math.atan2(s, Math.sqrt(1 - s * s));

  const s2 = v / Math.sqrt(u);
  const dec = Math.atan2(s2, Math.sqrt(1 - s2 * s2));

  return { ra, dec };
}

function calcSunrise() {
  const lat = parseFloat(document.getElementById('ss-lat').value);
  const lon = parseFloat(document.getElementById('ss-lon').value);
  const tz = parseFloat(document.getElementById('ss-tz').value);
  const year = parseInt(document.getElementById('ss-year').value);
  const month = parseInt(document.getElementById('ss-month').value);
  const day = parseInt(document.getElementById('ss-day').value);

  const jd0 = calToJD(year, month, day);
  const latRad = lat * RAD;
  const cosAlt = Math.cos(90.833 * RAD); // atmospheric refraction + solar radius

  // Compute sun positions for each hour 0..24
  const positions = [];
  for (let h = 0; h <= 24; h++) {
    const jd = jd0 + (h - tz) / 24.0;
    const t = jd - 2451545.0;
    const tt = t / 36525 + 1;
    const sp = sunPosition(t, tt);

    const gst = mod(6.697374558 + 0.06570982441908 * (jd0 - 2451545.0) + 1.00273790935 * ((h - tz) % 24) + 0.000026 * Math.pow((jd0 - 2451545.0) / 36525, 2), 24);
    const lst = mod(gst + lon / 15.0, 24);
    const ha = (lst - sp.ra / RAD / 15.0) * 15.0 * RAD;

    const alt = Math.sin(latRad) * Math.sin(sp.dec) + Math.cos(latRad) * Math.cos(sp.dec) * Math.cos(ha) - cosAlt;

    const azNum = Math.sin(sp.dec) - Math.sin(latRad) * (Math.sin(latRad) * Math.sin(sp.dec) + Math.cos(latRad) * Math.cos(sp.dec) * Math.cos(ha));
    const azDen = Math.cos(latRad) * Math.sqrt(Math.cos(sp.dec) * Math.cos(sp.dec) - Math.pow(azNum / Math.cos(latRad), 2) > 0 ? Math.cos(sp.dec) * Math.cos(sp.dec) - Math.pow(azNum / Math.cos(latRad), 2) : 0);

    positions.push({ h, alt, ha, dec: sp.dec, ra: sp.ra });
  }

  // Find zero crossings
  let sunrise = null, sunset = null;
  let sunriseAz = null, sunsetAz = null;
  let allAbove = true, allBelow = true;

  for (let i = 0; i < 24; i++) {
    if (positions[i].alt > 0) allBelow = false;
    if (positions[i].alt < 0) allAbove = false;
  }

  for (let i = 0; i < 24; i++) {
    const a1 = positions[i].alt;
    const a2 = positions[i + 1].alt;

    if (a1 < 0 && a2 >= 0) {
      // Sunrise - interpolate
      const fract = -a1 / (a2 - a1);
      sunrise = i + fract;
      // Compute azimuth at sunrise
      const jdR = jd0 + (sunrise - tz) / 24.0;
      const tR = jdR - 2451545.0;
      const ttR = tR / 36525 + 1;
      const spR = sunPosition(tR, ttR);
      sunriseAz = Math.acos((Math.sin(spR.dec) - Math.sin(latRad) * cosAlt) / (Math.cos(latRad) * Math.sin(90.833 * RAD))) * DEG;
      if (positions[i].ha > 0 || (positions[i].ha < -PI)) {
        // nothing
      }
      // Azimuth measured from north: sunrise is always < 180
      sunriseAz = 360 - sunriseAz; // measured from north through east
    }

    if (a1 >= 0 && a2 < 0) {
      // Sunset - interpolate
      const fract = a1 / (a1 - a2);
      sunset = i + fract;
      const jdS = jd0 + (sunset - tz) / 24.0;
      const tS = jdS - 2451545.0;
      const ttS = tS / 36525 + 1;
      const spS = sunPosition(tS, ttS);
      sunsetAz = Math.acos((Math.sin(spS.dec) - Math.sin(latRad) * cosAlt) / (Math.cos(latRad) * Math.sin(90.833 * RAD))) * DEG;
      // Sunset azimuth is > 180
    }
  }

  const out = document.getElementById('out-sunrise');
  let html = `<span class="label">Date:</span> <span class="value">${year}-${pad2(month)}-${pad2(day)}</span>\n`;
  html += `<span class="label">Location:</span> <span class="value">${lat.toFixed(4)}\u00b0, ${lon.toFixed(4)}\u00b0</span>  <span class="label">TZ:</span> <span class="value">UTC${tz >= 0 ? '+' : ''}${tz}</span>\n\n`;

  if (allAbove) {
    html += `<span class="warn">Sun is up all day (midnight sun)</span>`;
  } else if (allBelow) {
    html += `<span class="warn">Sun is down all day (polar night)</span>`;
  } else {
    if (sunrise !== null) {
      html += `<span class="label">Sunrise:</span>  <span class="value">${formatTime(sunrise)}</span>  <span class="label">Azimuth:</span> <span class="value2">${formatAngle(sunriseAz)}</span>\n`;
    } else {
      html += `<span class="label">Sunrise:</span>  <span class="warn">none</span>\n`;
    }
    if (sunset !== null) {
      html += `<span class="label">Sunset:</span>   <span class="value">${formatTime(sunset)}</span>  <span class="label">Azimuth:</span> <span class="value2">${formatAngle(sunsetAz)}</span>\n`;
    } else {
      html += `<span class="label">Sunset:</span>   <span class="warn">none</span>\n`;
    }
    if (sunrise !== null && sunset !== null) {
      const dayLen = sunset - sunrise;
      html += `\n<span class="label">Day length:</span> <span class="value">${formatTime(dayLen)}</span>`;
    }
  }

  out.innerHTML = html;
}

function useMyLocation() {
  if (!navigator.geolocation) {
    alert('Geolocation not supported');
    return;
  }
  navigator.geolocation.getCurrentPosition(pos => {
    document.getElementById('ss-lat').value = pos.coords.latitude.toFixed(4);
    document.getElementById('ss-lon').value = pos.coords.longitude.toFixed(4);
    // Estimate timezone from longitude
    const tzGuess = Math.round(pos.coords.longitude / 15);
    document.getElementById('ss-tz').value = tzGuess;
  }, err => {
    alert('Could not get location: ' + err.message);
  });
}
