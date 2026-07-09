import bcrypt from 'bcryptjs';
import { nanoid } from 'nanoid';
import { db, initDB } from '../db.js';

const LOCATION_ID = 'carlow';

async function seed() {
  await initDB();

  db.data.locations = [
    {
      id: LOCATION_ID,
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

  const ownerPassword = await bcrypt.hash('ChangeMe123!', 10);
  const staffPassword = await bcrypt.hash('ChangeMe123!', 10);

  db.data.users = [
    {
      id: nanoid(),
      name: 'Aaron Byrne',
      email: 'owner@theladpad.ie',
      passwordHash: ownerPassword,
      role: 'owner',
      specialty: 'Owner & Master Barber',
      active: true,
      location: LOCATION_ID,
      createdAt: new Date().toISOString(),
    },
    {
      id: nanoid(),
      name: 'Cian Doyle',
      email: 'cian@theladpad.ie',
      passwordHash: staffPassword,
      role: 'staff',
      specialty: 'Skin Fades & Sharp Lines',
      active: true,
      location: LOCATION_ID,
      createdAt: new Date().toISOString(),
    },
    {
      id: nanoid(),
      name: 'Sean Whelan',
      email: 'sean@theladpad.ie',
      passwordHash: staffPassword,
      role: 'staff',
      specialty: 'Beard Sculpting & Hot Towel Shaves',
      active: true,
      location: LOCATION_ID,
      createdAt: new Date().toISOString(),
    },
    {
      id: nanoid(),
      name: 'Jamie Kavanagh',
      email: 'jamie@theladpad.ie',
      passwordHash: staffPassword,
      role: 'staff',
      specialty: 'Classic Cuts & Kids Specialist',
      active: true,
      location: LOCATION_ID,
      createdAt: new Date().toISOString(),
    },
  ];

  db.data.services = [
    {
      id: nanoid(),
      name: 'Skin Fade',
      price: 25,
      duration: 30,
      description: 'A precision fade blended tight to the skin and finished razor sharp.',
    },
    {
      id: nanoid(),
      name: 'Beard Sculpt',
      price: 15,
      duration: 20,
      description: 'Shape, line and trim — beard sculpted to suit your face, every time.',
    },
    {
      id: nanoid(),
      name: 'Full Service Cut & Beard',
      price: 35,
      duration: 45,
      description: 'The full works. Cut, beard sculpt and hot towel finish in one sitting.',
    },
    {
      id: nanoid(),
      name: 'Kids Cut',
      price: 18,
      duration: 25,
      description: 'Sharp cuts for the next generation of lads. Patient hands, quick work.',
    },
    {
      id: nanoid(),
      name: 'Hot Towel Shave',
      price: 20,
      duration: 30,
      description: 'Old-world straight razor shave with hot towels and a proper finish.',
    },
    {
      id: nanoid(),
      name: 'Hair Design / Line Up',
      price: 10,
      duration: 15,
      description: 'Crisp line-up and hair design to keep things sharp between cuts.',
    },
  ];

  db.data.bookings = [];

  await db.write();

  console.log('Seed complete.');
  console.log('Owner login: owner@theladpad.ie / ChangeMe123!  (change this immediately — see README)');
  console.log('Staff login example: cian@theladpad.ie / ChangeMe123!');
}

seed().then(() => process.exit(0)).catch((err) => {
  console.error(err);
  process.exit(1);
});
