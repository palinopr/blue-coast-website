// Única fuente de verdad para contacto y contenido. Lee PUBLIC_* del entorno.
const env = import.meta.env;

export const site = {
  name: 'Blue Coast Developers',
  tagline: 'Gestión integral de combustible diésel',
  domain: 'www.bluecoastpr.com',
  email: 'info@bluecoastpr.com',
  phone: env.PUBLIC_PHONE || '+19399699999',
  phoneAlt: env.PUBLIC_PHONE_ALT || '+17873470799',
  whatsapp: env.PUBLIC_WHATSAPP || '19399699999',
  ga4: env.PUBLIC_GA4_ID || '',
  pixel: env.PUBLIC_META_PIXEL_ID || '',
} as const;

export const phoneDisplay = (p: string) => {
  const d = p.replace(/[^0-9]/g, '').slice(-10);
  return `(${d.slice(0, 3)}) ${d.slice(3, 6)}-${d.slice(6)}`;
};

// Mensajes prellenados de WhatsApp por contexto. Cada enlace wa.me lleva el
// mensaje de su sección para que el lead llegue ya cualificado.
export const waMsg = {
  general: 'Hola, quiero solicitar una evaluación de combustible para mis tanques.',
  muestra: 'Hola, quiero mi muestra GRATIS de diésel para mi tanque.',
  gracias: 'Hola, acabo de enviar mi solicitud de muestra gratis en la página.',
  inspeccion: 'Hola, quiero una inspección del diésel de mi tanque.',
  emergencia: 'Hola, tengo una emergencia con el generador. Necesito servicio.',
  cobertura: (muni?: string) =>
    muni
      ? `Hola, estoy en ${muni} y necesito servicio de diésel para mi generador.`
      : 'Hola, necesito servicio de diésel para mi generador. Mi municipio es: ',
  servicio: (srv: string) => `Hola, me interesa el servicio de ${srv}.`,
  plan: (plan: string) => `Hola, me interesa el ${plan} de mantenimiento.`,
} as const;

export const waLink = (msg: string = waMsg.general) =>
  `https://wa.me/${site.whatsapp}?text=${encodeURIComponent(msg)}`;

export const nav = [
  { href: '/', label: 'Inicio' },
  { href: '/servicios', label: 'Servicios' },
  { href: '/industrias', label: 'Industrias' },
  { href: '/trabajos', label: 'Trabajos' },
  { href: '/contacto', label: 'Contacto' },
];

// ---------- servicios ----------
export interface Servicio {
  code: string;
  title: string;
  body: string;
  incluye: string[];
  dato: string; // línea de dato en mono al pie de cada entrada
}

export const servicios: Servicio[] = [
  {
    code: 'SRV·A',
    title: 'Limpieza de tanques diésel',
    body: 'Removemos lodo, sedimento y agua acumulada del interior del tanque hasta devolverlo a condición de operar.',
    incluye: ['Remoción de lodo, sedimento y agua', 'Limpieza interior del tanque', 'Disposición adecuada de residuos'],
    dato: 'CAPACIDAD ATENDIDA · HASTA 93,000 GAL',
  },
  {
    code: 'SRV·B',
    title: 'Pulido de combustible',
    body: 'Filtración y recirculación multietapa que separan agua, sedimento y microbios hasta restaurar la calidad del diésel almacenado.',
    incluye: ['Filtración multietapa', 'Separación de agua', 'Recirculación hasta restaurar la calidad', 'Análisis de muestra'],
    dato: 'RESULTADO · DIÉSEL COLOR ÁMBAR LIMPIO',
  },
  {
    code: 'SRV·C',
    title: 'Mantenimiento preventivo',
    body: 'Inspecciones y tratamientos programados durante el año que evitan fallas y extienden la vida del sistema de respaldo.',
    incluye: ['Inspecciones programadas', 'Muestreo de combustible', 'Tratamiento del diésel', 'Reportes de condición'],
    dato: 'REFERENCIA · NFPA 110 PARA GENERADORES DE EMERGENCIA',
  },
  {
    code: 'SRV·D',
    title: 'Sistemas de combustible para generadores',
    body: 'Diagnóstico y soporte técnico del sistema de combustible de respaldo, del tanque al motor.',
    incluye: ['Diagnóstico del sistema de combustible', 'Soporte técnico de punta a punta'],
    dato: 'COBERTURA · 78 MUNICIPIOS · 24/7',
  },
];

// ---------- procedimiento ----------
export const pasos = [
  {
    n: '1',
    title: 'Inspección y muestreo',
    body: 'Tomamos muestra y evaluamos el estado real del combustible y del tanque antes de recomendar nada.',
    dato: 'MUESTRA TOMADA A VARIOS NIVELES DEL TANQUE',
  },
  {
    n: '2',
    title: 'Limpieza del tanque',
    body: 'Extraemos el lodo y los residuos del fondo, la capa que tapa los filtros durante un apagón.',
    dato: 'RESIDUOS DISPUESTOS SEGÚN REGLAMENTO',
  },
  {
    n: '3',
    title: 'Pulido del combustible',
    body: 'Recirculamos el diésel por filtración multietapa hasta que vuelve a su color ámbar limpio.',
    dato: 'FILTRACIÓN MULTIETAPA + SEPARACIÓN DE AGUA',
  },
  {
    n: '4',
    title: 'Reporte y certificación',
    body: 'Entregamos un reporte de condición con la evidencia del trabajo, listo para auditoría.',
    dato: 'DOCUMENTACIÓN LISTA PARA AUDITORÍA',
  },
];

// ---------- industrias ----------
export const sectores = [
  { name: 'Hospitales', why: 'Vidas dependen del respaldo. Cumplimiento de normas como NFPA 110.' },
  { name: 'Hoteles', why: 'Operación 24/7 y experiencia del huésped, sin interrupciones.' },
  { name: 'Data centers', why: 'El uptime lo es todo; cada segundo de caída cuesta.' },
  { name: 'Condominios', why: 'Ascensores, agua y seguridad para los residentes.' },
  { name: 'Supermercados', why: 'Cadena de frío e inventario perecedero en riesgo.' },
  { name: 'Industria', why: 'Líneas de producción que no pueden parar.' },
];

// ---------- registro de obras ----------
// Datos tomados del material del cliente (capacidades según sus propias
// publicaciones de obra). Municipio solo cuando consta en el material.
export interface Obra {
  cliente: string;
  municipio: string;
  tanque: string;
  alcance: string;
  foto?: string; // nombre de archivo en src/assets/img/field/
}

export const obras: Obra[] = [
  { cliente: 'Hospital de Damas', municipio: 'Ponce', tanque: '93,000 gal', alcance: 'Pulido a gran escala', foto: 'hospital-damas-ponce.jpg' },
  { cliente: 'Hospital Auxilio Mutuo', municipio: 'San Juan', tanque: '20,000 gal', alcance: 'Limpieza y mantenimiento', foto: 'hospital-auxilio-mutuo.jpg' },
  { cliente: 'Boston Scientific', municipio: 'Puerto Rico', tanque: '20,000 gal', alcance: 'Limpieza y pulido', foto: 'boston-scientific.jpg' },
  { cliente: 'Hospital Menonita', municipio: 'Cayey', tanque: '30,000 gal', alcance: 'Servicio de tanque', foto: 'hospital-menonita-cayey.jpg' },
  { cliente: 'Hospital Menonita', municipio: 'Guayama', tanque: '12,000 gal', alcance: 'Servicio de tanque', foto: 'hospital-menonita-guayama.jpg' },
  { cliente: 'Torre del Cardenal', municipio: 'Puerto Rico', tanque: '6,000 gal', alcance: 'Limpieza de tanque residencial', foto: 'torre-del-cardenal.jpg' },
  { cliente: 'Paulson AGI Tower', municipio: 'Puerto Rico', tanque: '20,000 gal', alcance: 'Mantenimiento de sistema', foto: 'paulson-agi-tower.jpg' },
];

// Cifras publicadas por Blue Coast en su material vigente.
export const cifras = [
  { big: '+15', label: 'años de experiencia en Puerto Rico' },
  { big: '500+', label: 'tanques intervenidos' },
  { big: '93K', label: 'galones, el proyecto mayor (Ponce)' },
  { big: '78', label: 'municipios en cobertura' },
];
