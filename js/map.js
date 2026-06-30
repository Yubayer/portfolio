/* ============================================================
   Contact page — interactive dark map (Leaflet + CartoDB tiles)
   Only runs if #contactMap exists on the page.
   ============================================================ */

document.addEventListener('DOMContentLoaded', () => {
  const mapEl = document.getElementById('contactMap');
  if (!mapEl || typeof L === 'undefined') return;

  const loadingEl = document.getElementById('mapLoading');

  // Dhaka, Bangladesh
  const home = [23.8103, 90.4125];

  const map = L.map('contactMap', {
    center: home,
    zoom: 2,
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  });

  // Allow scroll-zoom only once the user has interacted with the map,
  // so page-scrolling isn't hijacked by accident.
  map.on('focus', () => map.scrollWheelZoom.enable());
  map.on('blur', () => map.scrollWheelZoom.disable());
  mapEl.addEventListener('click', () => map.scrollWheelZoom.enable());

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors &copy; <a href="https://carto.com/attributions">CARTO</a>',
    subdomains: 'abcd',
    maxZoom: 19,
  }).addTo(map);

  const pulseIcon = L.divIcon({
    className: '',
    html: '<div class="map-marker-pulse"></div>',
    iconSize: [18, 18],
    iconAnchor: [9, 9],
  });

  L.marker(home, { icon: pulseIcon })
    .addTo(map)
    .bindPopup('<strong>Dhaka, Bangladesh</strong><br>Home base — remote-first, GMT+6');

  // Small markers for client regions
  const clientRegions = [
    { coords: [39.5, -98.35], label: 'United States', sub: 'Clients' },
    { coords: [54.0, -2.0], label: 'United Kingdom', sub: 'Clients' },
    { coords: [-25.0, 133.0], label: 'Australia', sub: 'Clients' },
  ];

  const smallIcon = L.divIcon({
    className: '',
    html: '<div style="width:10px;height:10px;border-radius:50%;background:#d4af37;opacity:0.85;border:1.5px solid #0a0a0a;"></div>',
    iconSize: [10, 10],
    iconAnchor: [5, 5],
  });

  clientRegions.forEach((r) => {
    L.marker(r.coords, { icon: smallIcon })
      .addTo(map)
      .bindPopup(`<strong>${r.label}</strong><br>${r.sub}`);
  });

  map.whenReady(() => {
    if (loadingEl) loadingEl.classList.add('hidden');
  });
});
