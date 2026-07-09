// Static mirror of the seeded shop data (server/data/seed.js), used only when
// the API is unreachable — e.g. a frontend-only deployment with no backend
// hosted yet. Keeps the site looking complete instead of empty. Once a real
// API is live this fallback is never used (ShopContext only reaches for it
// on a failed fetch).

export const FALLBACK_LOCATIONS = [
  {
    id: 'carlow',
    name: 'The Lad Pad Barbershop — Carlow',
    address: '5 Castle Hill, Centre, Carlow, R93 XD72',
    hours: {
      monday: { open: '09:00', close: '17:00' },
      tuesday: { open: '09:00', close: '17:00' },
      wednesday: { open: '09:00', close: '17:00' },
      thursday: { open: '09:00', close: '17:00' },
      friday: { open: '09:00', close: '17:00' },
      saturday: { open: '09:00', close: '17:00' },
      sunday: null,
    },
    phone: '+353 59 000 0000',
    instagram: 'https://instagram.com/theladpadbarbershop',
  },
];

export const FALLBACK_SERVICES = [
  { id: 'skin-fade', name: 'Skin Fade', price: 25, duration: 30, description: 'A precision fade blended tight to the skin and finished razor sharp.' },
  { id: 'beard-sculpt', name: 'Beard Sculpt', price: 15, duration: 20, description: 'Shape, line and trim — beard sculpted to suit your face, every time.' },
  { id: 'full-service', name: 'Full Service Cut & Beard', price: 35, duration: 45, description: 'The full works. Cut, beard sculpt and hot towel finish in one sitting.' },
  { id: 'kids-cut', name: 'Kids Cut', price: 18, duration: 25, description: 'Sharp cuts for the next generation of lads. Patient hands, quick work.' },
  { id: 'hot-towel-shave', name: 'Hot Towel Shave', price: 20, duration: 30, description: 'Old-world straight razor shave with hot towels and a proper finish.' },
  { id: 'line-up', name: 'Hair Design / Line Up', price: 10, duration: 15, description: 'Crisp line-up and hair design to keep things sharp between cuts.' },
];

export const FALLBACK_BARBERS = [
  { id: 'aaron-byrne', name: 'Aaron Byrne', specialty: 'Owner & Master Barber', location: 'carlow' },
  { id: 'cian-doyle', name: 'Cian Doyle', specialty: 'Skin Fades & Sharp Lines', location: 'carlow' },
  { id: 'sean-whelan', name: 'Sean Whelan', specialty: 'Beard Sculpting & Hot Towel Shaves', location: 'carlow' },
  { id: 'jamie-kavanagh', name: 'Jamie Kavanagh', specialty: 'Classic Cuts & Kids Specialist', location: 'carlow' },
];
