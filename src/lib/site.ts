// Single source of truth for contact + content. Reads PUBLIC_* env when present.
const env = import.meta.env;

export const site = {
  name: 'Blue Coast Developers',
  tagline: 'Gestion integral de combustible diesel',
  domain: 'www.bluecoastpr.com',
  email: 'info@bluecoastpr.com',
  phone: env.PUBLIC_PHONE || '+19399699999',
  phoneAlt: env.PUBLIC_PHONE_ALT || '+17873470799',
  whatsapp: env.PUBLIC_WHATSAPP || '19399699999',
  whatsappMsg:
    'Hola, quiero solicitar una evaluacion de combustible para mis tanques.',
  ga4: env.PUBLIC_GA4_ID || '',
  pixel: env.PUBLIC_META_PIXEL_ID || '',
} as const;

export const phoneDisplay = (p: string) => {
  const d = p.replace(/[^0-9]/g, '').slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

export const waLink = () =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(site.whatsappMsg)}`;

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/industrias', label: 'Industrias' },
  { href: '/trabajos', label: 'Trabajos' },
  { href: '/contacto', label: 'Contacto' },
];

export const services = [
  {
    n: '01',
    title: 'Limpieza de tanques diesel',
    body: 'Removemos sedimentos, lodo y agua acumulada para devolverle al tanque combustible limpio y seguro.',
  },
  {
    n: '02',
    title: 'Pulido de combustible',
    body: 'Filtracion y recirculacion multietapa que restauran la calidad del diesel almacenado.',
  },
  {
    n: '03',
    title: 'Mantenimiento preventivo',
    body: 'Programas e inspecciones periodicas que evitan fallas y extienden la vida del generador.',
  },
  {
    n: '04',
    title: 'Sistemas de generadores',
    body: 'Diagnostico y soporte tecnico del sistema de combustible de respaldo, de punta a punta.',
  },
];

export const steps = [
  { n: '01', title: 'Inspeccion y muestreo', body: 'Tomamos muestra y evaluamos el estado real del combustible y del tanque.' },
  { n: '02', title: 'Pulido y filtracion', body: 'Recirculamos el diesel para remover agua, sedimentos y bacterias.' },
  { n: '03', title: 'Limpieza del tanque', body: 'Extraemos lodo y residuos del interior hasta dejarlo limpio.' },
  { n: '04', title: 'Reporte y certificacion', body: 'Entregamos un reporte de condicion con la evidencia del trabajo.' },
];

export const industries = [
  'Hospitales', 'Hoteles', 'Data Centers', 'Condominios', 'Supermercados', 'Industria',
];

export const projects = [
  { client: 'Hospital Auxilio Mutuo', loc: 'Rio Piedras, PR', cap: '20,000 gal', img: '/assets/img/hospital-auxilio-mutuo.jpg', desc: 'Limpieza y mantenimiento de tanque diesel.' },
  { client: 'Boston Scientific', loc: 'Puerto Rico', cap: '20,000 gal', img: '/assets/img/boston-scientific.jpg', desc: 'Limpieza y pulido de combustible.' },
  { client: 'Hospital de Damas', loc: 'Ponce, PR', cap: '93,000 gal', img: '/assets/img/hospital-damas-ponce.jpg', desc: 'Pulido de combustible a gran escala.' },
  { client: 'Torre del Cardenal', loc: 'Puerto Rico', cap: '6,000 gal', img: '/assets/img/torre-del-cardenal.jpg', desc: 'Limpieza de tanque diesel de condominio.' },
];

export const stats = [
  { big: '+15', label: 'anos de experiencia en Puerto Rico' },
  { big: '500+', label: 'tanques intervenidos' },
  { big: '93K', label: 'galones, nuestro proyecto mayor (Ponce)' },
  { big: '78', label: 'municipios en cobertura' },
];
