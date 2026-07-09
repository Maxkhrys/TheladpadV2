// Photos intentionally left out — real barber photography is coming later.
// Cards show an initials badge in the meantime (see initialsOf in lib/format.js).
export const BARBER_PROFILES = {
  'Aaron Byrne': {
    bio: 'Founder and master barber. Two decades in the chair, still obsessed with a clean line.',
  },
  'Cian Doyle': {
    bio: 'Fade specialist. If it needs to be sharp and tight to the skin, Cian is your man.',
  },
  'Sean Whelan': {
    bio: 'Beard sculpting and hot towel shaves done the old-world way — no shortcuts.',
  },
  'Jamie Kavanagh': {
    bio: 'Classic cuts and patient hands. The lads bring their kids to him for a reason.',
  },
};

export function getBarberProfile(name) {
  return BARBER_PROFILES[name] || { bio: '' };
}
