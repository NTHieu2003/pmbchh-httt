import type { SimulationResult } from '../simulation';

// Leaflet + Esri/OSM tiles, matching pmbc_web's `renderMap()` — multi-level
// AEGL polygons, a base-map switcher, Catmull-Rom smoothed contours, a
// legend, a touch-driven domain-selection rectangle, and a response-plan
// overlay (isolation circle + evac lines + 4 field-response station
// markers). `localToLatLon`/`catmullRomSmooth`/`destinationPoint` are
// duplicated here in plain JS (not imported) because this string runs
// inside the WebView's own JS context, isolated from the React Native
// bundle.
//
// RN drives this page through `window.cbrnMap.*` (called via
// `injectJavaScript`) rather than in-page buttons — the toolbar/domain-info
// card live as native RN views above/over the WebView instead, for proper
// touch targets (see Map2DView.tsx/Map2DToolbar.tsx). The only thing this
// page pushes back to RN is `window.ReactNativeWebView.postMessage`:
// `{type:'domainUpdate', bounds: {...} | null}` whenever the domain
// rectangle changes, and `{type:'domainCenter', lat, lon}` when the
// native "Đặt nguồn tại tâm" button is pressed (that one needs RN state).
export function buildMapHtml(result: SimulationResult | null): string {
  const payload = result
    ? {
        sourceLat: result.sourceLat,
        sourceLon: result.sourceLon,
        windDirTo: result.windDirTo,
        xl: result.xl,
        levels: result.levels,
      }
    : null;

  return `<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no" />
  <link rel="stylesheet" href="https://unpkg.com/leaflet@1.9.4/dist/leaflet.css" />
  <style>
    html, body, #map { height: 100%; margin: 0; padding: 0; }
    .error-banner {
      position: absolute; top: 8px; left: 8px; right: 8px; z-index: 1000;
      background: #fef2f2; color: #b91c1c; font: 12px sans-serif;
      padding: 6px 10px; border-radius: 6px; border: 1px solid #fecaca;
      display: none;
    }
    .legend {
      position: absolute; right: 8px; bottom: 8px; z-index: 1000;
      background: rgba(255,255,255,0.92); border: 1px solid #cbd5e1; border-radius: 6px;
      padding: 6px 8px; font: 11px sans-serif; color: #1e293b;
      display: none;
    }
    .legend .row { display: flex; align-items: center; gap: 6px; margin-top: 2px; }
    .legend .swatch { width: 10px; height: 10px; border-radius: 2px; flex-shrink: 0; }
    .draw-rect {
      position: absolute; z-index: 999; border: 2px dashed #0284c7; background: rgba(56,189,248,0.2);
      pointer-events: none; display: none;
    }
    .response-pin-marker { overflow: visible !important; }
    .response-pin-marker .pin-inner {
      display: flex; align-items: center; justify-content: center; gap: 4px;
      width: 100%; height: 100%; box-sizing: border-box;
      font: 10px sans-serif; font-weight: 700; color: #fff; border-radius: 4px;
      padding: 3px 6px; white-space: nowrap; box-shadow: 0 1px 3px rgba(0,0,0,0.3);
    }
    .response-pin-marker .bg-blue { background: #1d4ed8; }
    .response-pin-marker .bg-orange { background: #c2410c; }
    .response-pin-marker .bg-green { background: #15803d; }
    .response-pin-marker .bg-red { background: #b91c1c; }
  </style>
</head>
<body>
  <div id="error-banner" class="error-banner">Không tải được ảnh bản đồ nền (kiểm tra kết nối mạng) — vùng đe dọa vẫn hiển thị bên dưới.</div>
  <div id="map"></div>
  <div id="legend" class="legend"></div>
  <div id="draw-rect" class="draw-rect"></div>
  <script src="https://unpkg.com/leaflet@1.9.4/dist/leaflet.js"></script>
  <script src="https://cdn.jsdelivr.net/npm/html2canvas@1.4.1/dist/html2canvas.min.js"></script>
  <script>
    var DATA = ${JSON.stringify(payload)};
    var R_EARTH = 6371000.0;

    function localToLatLon(x, y, lat0, lon0, windFromDeg) {
      var bearingTo = (windFromDeg + 180) % 360;
      var bearingPerp = (bearingTo + 90) % 360;
      var toRad = function (d) { return d * Math.PI / 180; };
      var dxEast = x * Math.sin(toRad(bearingTo)) + y * Math.sin(toRad(bearingPerp));
      var dyNorth = x * Math.cos(toRad(bearingTo)) + y * Math.cos(toRad(bearingPerp));
      var dLat = (dyNorth / R_EARTH) * (180 / Math.PI);
      var dLon = (dxEast / (R_EARTH * Math.cos(toRad(lat0)))) * (180 / Math.PI);
      return [lat0 + dLat, lon0 + dLon];
    }

    function destinationPoint(lat0, lon0, dMeters, bearingDeg) {
      var toRad = function (d) { return d * Math.PI / 180; };
      var toDeg = function (r) { return r * 180 / Math.PI; };
      var brng = toRad(bearingDeg);
      var phi1 = toRad(lat0), lambda1 = toRad(lon0);
      var delta = dMeters / R_EARTH;
      var phi2 = Math.asin(Math.sin(phi1) * Math.cos(delta) + Math.cos(phi1) * Math.sin(delta) * Math.cos(brng));
      var lambda2 = lambda1 + Math.atan2(Math.sin(brng) * Math.sin(delta) * Math.cos(phi1), Math.cos(delta) - Math.sin(phi1) * Math.sin(phi2));
      return [toDeg(phi2), toDeg(lambda2)];
    }

    function catmullRomSmooth(points, samplesPerSegment) {
      samplesPerSegment = samplesPerSegment || 8;
      if (points.length < 3) return points.slice();
      var result = [];
      for (var i = 0; i < points.length - 1; i++) {
        var p0 = points[i === 0 ? 0 : i - 1];
        var p1 = points[i];
        var p2 = points[i + 1];
        var p3 = points[i + 2 < points.length ? i + 2 : points.length - 1];
        for (var s = 0; s < samplesPerSegment; s++) {
          var t = s / samplesPerSegment, t2 = t * t, t3 = t2 * t;
          var x = 0.5 * ((2 * p1[0]) + (-p0[0] + p2[0]) * t + (2 * p0[0] - 5 * p1[0] + 4 * p2[0] - p3[0]) * t2 + (-p0[0] + 3 * p1[0] - 3 * p2[0] + p3[0]) * t3);
          var y = 0.5 * ((2 * p1[1]) + (-p0[1] + p2[1]) * t + (2 * p0[1] - 5 * p1[1] + 4 * p2[1] - p3[1]) * t2 + (-p0[1] + 3 * p1[1] - 3 * p2[1] + p3[1]) * t3);
          result.push([x, y]);
        }
      }
      result.push(points[points.length - 1]);
      return result;
    }

    function postToRN(msg) {
      if (window.ReactNativeWebView) window.ReactNativeWebView.postMessage(JSON.stringify(msg));
    }

    var lat0 = DATA ? DATA.sourceLat : 21.0285;
    var lon0 = DATA ? DATA.sourceLon : 105.8542;

    var map = L.map('map', { zoomControl: true, preferCanvas: true });

    // crossOrigin:true — tiles fetched with CORS mode so html2canvas
    // (window.cbrnMap.exportImage below) can actually read the canvas
    // pixels afterward; without it the canvas is "tainted" and
    // toDataURL() throws, silently producing a blank/background-only
    // exported image with the drawn polygons/markers missing.
    var esriStreet = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Street_Map/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri', maxZoom: 19, crossOrigin: true }
    );
    var osm = L.tileLayer(
      'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
      { attribution: '&copy; OpenStreetMap contributors', subdomains: 'abc', maxZoom: 19, crossOrigin: true }
    );
    var esriSat = L.tileLayer(
      'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
      { attribution: 'Tiles &copy; Esri', maxZoom: 19, crossOrigin: true }
    );
    esriStreet.addTo(map);
    L.control.layers(
      { 'Bản đồ Esri': esriStreet, 'OpenStreetMap': osm, 'Ảnh vệ tinh Esri': esriSat },
      undefined,
      { position: 'topright' }
    ).addTo(map);

    [esriStreet, osm, esriSat].forEach(function (layer) {
      layer.on('tileerror', function () {
        document.getElementById('error-banner').style.display = 'block';
      });
      layer.on('load', function () {
        document.getElementById('error-banner').style.display = 'none';
      });
    });

    // Hoàng Sa / Trường Sa (Việt Nam) island labels — ported verbatim from
    // web's addVietnamIslandLabels(), shown on every map load regardless
    // of simulation result, same as web.
    var VN_ISLAND_POINTS = [
      { name: 'Phú Lâm', lat: 16.8367, lon: 112.3333 },
      { name: 'Đảo Hoàng Sa', lat: 16.5333, lon: 111.6117 },
      { name: 'Hữu Nhật', lat: 16.505, lon: 111.588 },
      { name: 'Quang Hòa', lat: 16.4483, lon: 111.7117 },
      { name: 'Duy Mộng', lat: 16.46, lon: 111.74 },
      { name: 'Tri Tôn', lat: 15.7833, lon: 111.2 },
      { name: 'Linh Côn', lat: 16.6717, lon: 112.7267 },
      { name: 'Đá Bắc', lat: 17.1, lon: 111.5133 },
      { name: 'Trường Sa Lớn', lat: 8.6417, lon: 111.9319 },
      { name: 'Song Tử Tây', lat: 11.4333, lon: 114.3333 },
      { name: 'Sinh Tồn', lat: 9.8767, lon: 114.32 },
      { name: 'Sinh Tồn Đông', lat: 9.875, lon: 114.579 },
      { name: 'Nam Yết', lat: 10.1794, lon: 114.3667 },
      { name: 'Sơn Ca', lat: 10.375, lon: 114.48 },
      { name: 'An Bang', lat: 7.8694, lon: 112.9028 },
      { name: 'Trường Sa Đông', lat: 8.9311, lon: 112.3531 }
    ];

    function addVietnamIslandLabel(lat, lon, radiusMeters, labelText) {
      L.circle([lat, lon], {
        radius: radiusMeters, color: '#d97706', weight: 1.5, dashArray: '5 5',
        fillColor: '#f59e0b', fillOpacity: 0.08, interactive: false
      }).addTo(map);

      L.marker([lat, lon], {
        icon: L.divIcon({
          className: 'vn-island-badge',
          html: '<div style="background: rgba(217,119,6,0.9); color: white; font-size: 10px; font-weight: bold; padding: 2px 6px; border-radius: 4px; white-space: nowrap; transform: translate(-50%, -50%); border: 1px solid #92400e;">' + labelText + '</div>',
          iconSize: [0, 0]
        }),
        interactive: false
      }).addTo(map);
    }

    addVietnamIslandLabel(16.5, 112.0, 100000, 'Hoàng Sa (Việt Nam)');
    addVietnamIslandLabel(9.0, 114.0, 250000, 'Trường Sa (Việt Nam)');

    VN_ISLAND_POINTS.forEach(function (isl) {
      L.circleMarker([isl.lat, isl.lon], {
        radius: 3, color: '#d97706', weight: 1, fillColor: '#f59e0b', fillOpacity: 0.9, interactive: false
      }).addTo(map);
    });

    L.circleMarker([lat0, lon0], {
      radius: 7, color: '#1e293b', weight: 2, fillColor: '#f59e0b', fillOpacity: 1
    }).bindTooltip('Vị trí nguồn').addTo(map);

    var outermostPolygon = null;
    var legendEl = document.getElementById('legend');

    if (DATA && DATA.levels && DATA.levels.length && DATA.xl > 0) {
      var legendHtml = '';
      DATA.levels.forEach(function (lvl) {
        if (!lvl.contour.length || lvl.xl <= 0) return;
        var upperRaw = lvl.contour.map(function (p) { return localToLatLon(p.x, p.halfwidth, lat0, lon0, DATA.windDirTo); });
        var lowerRaw = lvl.contour.map(function (p) { return localToLatLon(p.x, -p.halfwidth, lat0, lon0, DATA.windDirTo); }).reverse();
        var upper = catmullRomSmooth(upperRaw, 8);
        var lower = catmullRomSmooth(lowerRaw, 8);
        var polygonPts = upper.concat(lower);

        var ppmText = lvl.loc_ppm != null ? ' (' + lvl.loc_ppm.toLocaleString('en-US', { maximumSignificantDigits: 4 }) + ' ppm)' : '';
        var polygon = L.polygon(polygonPts, {
          color: lvl.stroke, weight: 2, fillColor: lvl.fill, fillOpacity: lvl.fillOpacity
        }).bindTooltip(lvl.label + ppmText, { sticky: true }).addTo(map);

        if (!outermostPolygon) outermostPolygon = polygon;

        legendHtml += '<div class="row"><span class="swatch" style="background:' + lvl.stroke + '"></span>' + lvl.label + ppmText + '</div>';
      });

      if (legendHtml) {
        legendEl.innerHTML = '<b>Chú giải</b>' + legendHtml;
        legendEl.style.display = 'block';
      }

      var arrowLen = DATA.xl * 0.15;
      var arrowEnd = localToLatLon(arrowLen, 0, lat0, lon0, DATA.windDirTo);
      L.polyline([[lat0, lon0], arrowEnd], {
        color: '#0d9488', weight: 3, dashArray: '4 6'
      }).addTo(map).bindTooltip('Hướng gió thổi tới ' + Math.round(DATA.windDirTo) + '°');

      if (outermostPolygon) {
        map.fitBounds(outermostPolygon.getBounds(), { padding: [40, 40] });
      }
    } else {
      map.setView([lat0, lon0], 14);
    }

    // =====================================================================
    // Khoanh vùng miền mô phỏng (domain-selection rectangle) — matches
    // pmbc_web's toggleDomainSelection/onDrawStart/onDrawMove/onDrawEnd/
    // finishDrawingPx/autoBoundImpactZone/clearDomainSelection exactly,
    // just touch-event driven instead of mouse-event driven, and reporting
    // its state out to RN instead of rendering its own info card.
    var isSelectionMode = false;
    var drawStart = null;
    var domainRect = null;
    var mapContainer = map.getContainer();
    var drawRectEl = document.getElementById('draw-rect');

    // map.mouseEventToContainerPoint (Leaflet's own conversion, not a
    // manual getBoundingClientRect() subtraction) stays correct through
    // zoom/pan CSS transforms and matches exactly what
    // containerPointToLatLng below expects.
    function eventPoint(e) {
      var t = e.touches && e.touches.length ? e.touches[0] : (e.changedTouches && e.changedTouches.length ? e.changedTouches[0] : e);
      return map.mouseEventToContainerPoint(t);
    }

    function setSelectionMode(on) {
      isSelectionMode = on;
      drawStart = null;
      drawRectEl.style.display = 'none';
      if (on) {
        map.dragging.disable();
        map.doubleClickZoom.disable();
      } else {
        map.dragging.enable();
        map.doubleClickZoom.enable();
      }
    }

    function commitDomainRect(bounds) {
      if (domainRect) map.removeLayer(domainRect);
      domainRect = L.rectangle(bounds, {
        color: '#0284c7', weight: 2, dashArray: '6, 6', fillColor: '#38bdf8', fillOpacity: 0.2
      }).addTo(map);

      var sw = bounds.getSouthWest(), ne = bounds.getNorthEast(), center = bounds.getCenter();
      var widthKm = (center.distanceTo(L.latLng(center.lat, ne.lng)) * 2) / 1000;
      var heightKm = (center.distanceTo(L.latLng(ne.lat, center.lng)) * 2) / 1000;
      postToRN({
        type: 'domainUpdate',
        bounds: {
          southWest: { lat: sw.lat, lng: sw.lng }, northEast: { lat: ne.lat, lng: ne.lng },
          center: { lat: center.lat, lng: center.lng }, widthKm: widthKm, heightKm: heightKm, areaKm2: widthKm * heightKm
        }
      });
    }

    function finishDrawing(x2, y2) {
      if (!drawStart) return;
      // Captured before setSelectionMode(false) below, which nulls
      // drawStart as its own cleanup side-effect — reading drawStart.x/y
      // AFTER that call threw (drawStart was already null), silently
      // aborting before commitDomainRect ever ran.
      var x1 = drawStart.x, y1 = drawStart.y;
      var w = Math.abs(x2 - x1), h = Math.abs(y2 - y1);
      drawRectEl.style.display = 'none';
      setSelectionMode(false);
      if (w < 12 || h < 12) return;

      var p1 = map.containerPointToLatLng(L.point(x1, y1));
      var p2 = map.containerPointToLatLng(L.point(x2, y2));
      commitDomainRect(L.latLngBounds(p1, p2));
    }

    function onDrawStart(e) {
      if (!isSelectionMode) return;
      e.preventDefault();
      drawStart = eventPoint(e);
      drawRectEl.style.left = drawStart.x + 'px';
      drawRectEl.style.top = drawStart.y + 'px';
      drawRectEl.style.width = '0px';
      drawRectEl.style.height = '0px';
      drawRectEl.style.display = 'block';
    }
    function onDrawMove(e) {
      if (!isSelectionMode || !drawStart) return;
      e.preventDefault();
      var p = eventPoint(e);
      var minX = Math.min(drawStart.x, p.x), minY = Math.min(drawStart.y, p.y);
      drawRectEl.style.left = minX + 'px';
      drawRectEl.style.top = minY + 'px';
      drawRectEl.style.width = Math.abs(p.x - drawStart.x) + 'px';
      drawRectEl.style.height = Math.abs(p.y - drawStart.y) + 'px';
    }
    function onDrawEnd(e) {
      if (!isSelectionMode || !drawStart) return;
      e.preventDefault();
      var p = eventPoint(e);
      finishDrawing(p.x, p.y);
    }

    // L.DomEvent.on (not raw addEventListener) — Leaflet tracks its own
    // touch/click suppression state on the map container (used to stop a
    // drag-pan from also firing a synthetic click); binding through its own
    // utility avoids fighting that internal state machine, which is what
    // was silently swallowing the drag gesture here.
    L.DomEvent.on(mapContainer, 'mousedown', onDrawStart);
    L.DomEvent.on(mapContainer, 'mousemove', onDrawMove);
    L.DomEvent.on(mapContainer, 'mouseup', onDrawEnd);
    L.DomEvent.on(mapContainer, 'touchstart', onDrawStart, { passive: false });
    L.DomEvent.on(mapContainer, 'touchmove', onDrawMove, { passive: false });
    L.DomEvent.on(mapContainer, 'touchend', onDrawEnd, { passive: false });

    // =====================================================================
    // Lớp phủ thông tin ứng phó sự cố — matches pmbc_web's
    // renderResponseLayers/clearResponseLayers (isolation circle + 2 evac
    // bearing lines + 4 field-response station markers with popups).
    var responseLayers = [];
    function clearResponseLayers() {
      responseLayers.forEach(function (l) { map.removeLayer(l); });
      responseLayers = [];
    }
    function renderResponseLayers() {
      clearResponseLayers();
      if (!DATA) return;
      var isoRadius = Math.max(150, Math.round(DATA.xl * 0.15));
      var windDirTo = DATA.windDirTo;

      var isolationCircle = L.circle([lat0, lon0], {
        radius: isoRadius, color: '#ea580c', weight: 2.5, dashArray: '6, 6',
        fillColor: '#fb923c', fillOpacity: 0.16
      }).bindTooltip('<strong>VÀNH ĐAI CÁCH LY BAN ĐẦU</strong><br>Bán kính: <strong>' + isoRadius + ' m</strong>', { sticky: true });
      isolationCircle.addTo(map);
      responseLayers.push(isolationCircle);

      var evacDist = Math.max(isoRadius * 1.5, 320);
      var bearing1 = Math.round((windDirTo + 90) % 360);
      var bearing2 = Math.round((windDirTo + 270) % 360);
      var pt1 = destinationPoint(lat0, lon0, evacDist, bearing1);
      var pt2 = destinationPoint(lat0, lon0, evacDist, bearing2);

      [[pt1, bearing1, '1'], [pt2, bearing2, '2']].forEach(function (a) {
        var line = L.polyline([[lat0, lon0], a[0]], {
          color: '#16a34a', weight: 4, opacity: 0.9, dashArray: '8, 4'
        }).bindTooltip('<strong>HƯỚNG SƠ TÁN KHẨN CẤP ' + a[2] + '</strong><br>Hướng: <strong>' + a[1] + '°</strong>', { sticky: true });
        line.addTo(map);
        responseLayers.push(line);
      });

      function addStation(pt, bg, icon, label, popupHtml) {
        // Explicit non-zero iconSize (not [0,0]) — a zero-size divIcon
        // relies on overflow:visible cascading correctly through Leaflet's
        // marker wrapper, which some WebView engines don't honor, leaving
        // the colored pill background invisible and only the (white, so
        // unreadable against the map) text showing.
        var marker = L.marker(pt, {
          icon: L.divIcon({
            className: 'response-pin-marker',
            html: '<div class="pin-inner ' + bg + '">' + icon + ' ' + label + '</div>',
            iconSize: [120, 22],
            iconAnchor: [60, 11]
          })
        }).bindPopup(popupHtml);
        marker.addTo(map);
        responseLayers.push(marker);
      }

      var cpBearing = (windDirTo + 180) % 360;
      var cpPt = destinationPoint(lat0, lon0, Math.max(isoRadius * 1.3, 350), cpBearing);
      addStation(cpPt, 'bg-blue', '🏢', 'SỞ CHỈ HUY', '<b>Sở chỉ huy tác chiến dã chiến</b><br>Đầu hướng gió an toàn (' + Math.round(cpBearing) + '°)');

      var decontPt = destinationPoint(lat0, lon0, isoRadius * 1.1, bearing1);
      addStation(decontPt, 'bg-orange', '🚒', 'TRẠM TIÊU ĐỘC', '<b>Trạm tiêu độc khử trùng cơ động</b><br>Ranh giới cách ly, hướng sơ tán 1 (' + bearing1 + '°)');

      var medPt = destinationPoint(lat0, lon0, isoRadius * 1.1, bearing2);
      addStation(medPt, 'bg-green', '🚑', 'TRẠM Y TẾ', '<b>Trạm cấp cứu & phân loại y tế</b><br>Ranh giới cách ly, hướng sơ tán 2 (' + bearing2 + '°)');

      var checkPt = destinationPoint(lat0, lon0, isoRadius * 1.4, cpBearing);
      addStation(checkPt, 'bg-red', '⛔', 'CHỐT PHONG TỎA', '<b>Chốt phong tỏa & cô lập hiện trường</b>');
    }

    // =====================================================================
    // Bridge API — called by RN via injectJavaScript (see Map2DView.tsx).
    window.cbrnMap = {
      setDomainMode: function (on) { setSelectionMode(!!on); },
      autoFitDomain: function () {
        if (!DATA || !DATA.levels || !DATA.levels.length) return;
        var allCoords = [[lat0, lon0]];
        DATA.levels.forEach(function (lvl) {
          lvl.contour.forEach(function (p) {
            allCoords.push(localToLatLon(p.x, p.halfwidth, lat0, lon0, DATA.windDirTo));
            allCoords.push(localToLatLon(p.x, -p.halfwidth, lat0, lon0, DATA.windDirTo));
          });
        });
        if (allCoords.length < 2) return;
        var bounds = L.latLngBounds(allCoords).pad(0.12);
        commitDomainRect(bounds);
        map.fitBounds(bounds, { padding: [30, 30] });
      },
      zoomToDomain: function () {
        if (domainRect) map.fitBounds(domainRect.getBounds(), { padding: [30, 30] });
      },
      clearDomain: function () {
        if (domainRect) { map.removeLayer(domainRect); domainRect = null; }
      },
      setResponseVisible: function (on) {
        if (on) renderResponseLayers(); else clearResponseLayers();
      },
      // Captures the map's actual rendered pixels (tiles + drawn polygons/
      // markers/legend) from INSIDE the WebView via html2canvas — RN-side
      // view-shot captures can't see into a WebView's native surface, so
      // trying to screenshot this component from React Native only ever
      // produced a blank/background image with the drawn layers missing.
      exportImage: function () {
        if (typeof html2canvas !== 'function') {
          postToRN({ type: 'mapImageError', message: 'html2canvas not loaded' });
          return;
        }
        html2canvas(document.body, { useCORS: true, allowTaint: false, backgroundColor: '#ffffff' })
          .then(function (canvas) {
            postToRN({ type: 'mapImage', dataUrl: canvas.toDataURL('image/png') });
          })
          .catch(function (err) {
            postToRN({ type: 'mapImageError', message: String(err && err.message ? err.message : err) });
          });
      }
    };
  </script>
</body>
</html>`;
}
