import { UNSPLASH } from './media';

export const BARBER_PROFILES = {
  'Aaron Byrne': {
    photo: UNSPLASH.portrait1,
    bio: 'Founder and master barber. Two decades in the chair, still obsessed with a clean line.',
  },
  'Cian Doyle': {
    photo: UNSPLASH.portrait2,
    bio: 'Fade specialist. If it needs to be sharp and tight to the skin, Cian is your man.',
  },
  'Sean Whelan': {
    photo: UNSPLASH.portrait3,
    bio: 'Beard sculpting and hot towel shaves done the old-world way — no shortcuts.',
  },
  'Jamie Kavanagh': {
    photo: UNSPLASH.barberClose,
    bio: 'Classic cuts and patient hands. The lads bring their kids to him for a reason.',
  },
};

export function getBarberProfile(name) {
  return BARBER_PROFILES[name] || { photo: null, bio: '' };
}
