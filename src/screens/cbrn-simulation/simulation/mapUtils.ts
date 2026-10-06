// Ported verbatim from pmbc_web's `mophongphattan.component.ts`.
const R_EARTH = 6371000.0;

// Converts local plume-plot coordinates (x = downwind meters, y = crosswind
// meters) into lat/lon, given the source point and the compass bearing the
// wind blows TOWARD (`windFromDeg` — naming kept from web, it's actually
// `windDirTo` at the call site).
export function localToLatLon(
  x: number,
  y: number,
  lat0: number,
  lon0: number,
  windFromDeg: number
): [number, number] {
  const bearingTo = (windFromDeg + 180) % 360;
  const bearingPerp = (bearingTo + 90) % 360;
  const toRad = (d: number) => (d * Math.PI) / 180;
  const dxEast = x * Math.sin(toRad(bearingTo)) + y * Math.sin(toRad(bearingPerp));
  const dyNorth = x * Math.cos(toRad(bearingTo)) + y * Math.cos(toRad(bearingPerp));
  const dLat = (dyNorth / R_EARTH) * (180 / Math.PI);
  const dLon = (dxEast / (R_EARTH * Math.cos(toRad(lat0)))) * (180 / Math.PI);
  return [lat0 + dLat, lon0 + dLon];
}
