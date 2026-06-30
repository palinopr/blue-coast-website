// Floating contact buttons (lead generation) — injected on every page
if (!document.querySelector('.float-cta')) {
  const waMsg = encodeURIComponent('Hola, quiero solicitar una evaluación de combustible para mis tanques.');
  const fc = document.createElement('div');
  fc.className = 'float-cta';
  fc.innerHTML =
    '<a class="fc-wa" href="https://wa.me/19399699999?text=' + waMsg + '" target="_blank" rel="noopener" aria-label="Escríbenos por WhatsApp">' +
    '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M.057 24l1.687-6.163a11.867 11.867 0 01-1.587-5.945C.16 5.335 5.495 0 12.05 0a11.82 11.82 0 018.413 3.488 11.82 11.82 0 013.48 8.414c-.003 6.557-5.338 11.892-11.893 11.892a11.9 11.9 0 01-5.688-1.448L.057 24zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884a9.82 9.82 0 001.523 5.26l-.999 3.648 3.465-.81zM17.45 14.3c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/></svg></a>' +
    '<a class="fc-call" href="tel:+19399699999" aria-label="Llamar ahora">' +
    '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M22 16.92v3a2 2 0 01-2.18 2 19.8 19.8 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.8 19.8 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"/></svg></a>';
  document.body.appendChild(fc);
}

// Mobile nav toggle
const navToggle = document.getElementById('navToggle');
const navLinks = document.getElementById('navLinks');

if (navToggle && navLinks) {
  navToggle.addEventListener('click', () => {
    const open = navLinks.classList.toggle('is-open');
    navToggle.setAttribute('aria-expanded', String(open));
  });
  navLinks.querySelectorAll('a').forEach((link) => {
    link.addEventListener('click', () => {
      navLinks.classList.remove('is-open');
      navToggle.setAttribute('aria-expanded', 'false');
    });
  });
}

// Reveal on scroll
const revealEls = document.querySelectorAll('.reveal');
if ('IntersectionObserver' in window && revealEls.length) {
  const io = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          io.unobserve(entry.target);
        }
      });
    },
    { threshold: 0.12, rootMargin: '0px 0px -40px 0px' }
  );
  revealEls.forEach((el) => io.observe(el));
} else {
  revealEls.forEach((el) => el.classList.add('is-visible'));
}

// Before/after drag slider
const baSlider = document.getElementById('baSlider');
if (baSlider) {
  let dragging = false;
  const setX = (clientX) => {
    const rect = baSlider.getBoundingClientRect();
    let pct = ((clientX - rect.left) / rect.width) * 100;
    pct = Math.max(0, Math.min(100, pct));
    baSlider.style.setProperty('--x', pct + '%');
  };
  baSlider.addEventListener('pointerdown', (e) => {
    dragging = true;
    if (baSlider.setPointerCapture) baSlider.setPointerCapture(e.pointerId);
    setX(e.clientX);
  });
  baSlider.addEventListener('pointermove', (e) => {
    if (dragging) setX(e.clientX);
  });
  baSlider.addEventListener('pointerup', () => { dragging = false; });
  baSlider.addEventListener('pointercancel', () => { dragging = false; });
}

// Coverage map (Puerto Rico)
const mapEl = document.getElementById('map');
if (mapEl && window.L) {
  const LOCATIONS = [
    { name: 'Hospital Auxilio Mutuo', town: 'Río Piedras', lat: 18.401, lng: -66.061, cap: '20,000 gal', featured: true },
    { name: 'Hospital de Damas', town: 'Ponce', lat: 18.013, lng: -66.614, cap: '93,000 gal', featured: true },
    { name: 'Boston Scientific', town: 'Dorado', lat: 18.458, lng: -66.267, cap: '20,000 gal', featured: true },
    { name: 'Condominio Torre del Cardenal', town: 'San Juan', lat: 18.43, lng: -66.07, cap: '6,000 gal', featured: true },
    { name: 'Hospital Menonita', town: 'Cayey', lat: 18.111, lng: -66.166, cap: '30,000 gal' },
    { name: 'Hospital Menonita', town: 'Guayama', lat: 17.984, lng: -66.113, cap: '12,000 gal' },
    { name: 'St. Jude Medical', town: 'Caguas', lat: 18.234, lng: -66.039 },
    { name: 'Hospital Menonita', town: 'Aibonito', lat: 18.140, lng: -66.266 },
    { name: 'San Pablo', town: 'Fajardo', lat: 18.326, lng: -65.652 },
    { name: 'Honeywell', town: 'Aguadilla', lat: 18.428, lng: -67.154 },
    { name: 'Eaton', town: 'Coamo', lat: 18.080, lng: -66.358 },
    { name: 'Hospital Metro', town: 'San Germán', lat: 18.081, lng: -67.041 },
    { name: 'Bayamón Shopping', town: 'Bayamón', lat: 18.398, lng: -66.157 },
    { name: "Doctor's Center", town: 'Carolina', lat: 18.38, lng: -65.96 },
  ];

  const map = L.map(mapEl, {
    scrollWheelZoom: false,
    zoomControl: true,
    attributionControl: true,
  }).setView([18.22, -66.45], 9);

  L.tileLayer('https://{s}.basemaps.cartocdn.com/dark_all/{z}/{x}/{y}{r}.png', {
    attribution: '&copy; OpenStreetMap &copy; CARTO',
    subdomains: 'abcd',
    maxZoom: 18,
  }).addTo(map);

  LOCATIONS.forEach((loc) => {
    L.circleMarker([loc.lat, loc.lng], {
      radius: loc.featured ? 9 : 6,
      color: '#0a1622',
      weight: 2,
      fillColor: '#c9a14a',
      fillOpacity: 1,
    })
      .addTo(map)
      .bindTooltip(
        `<b>${loc.name}</b><br>${loc.town}${loc.cap ? ' &middot; ' + loc.cap : ''}`,
        { className: 'bc-tip', direction: 'top', offset: [0, -6] }
      );
  });
}
