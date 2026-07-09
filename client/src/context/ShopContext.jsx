import { createContext, useContext, useEffect, useState } from 'react';
import { api } from '../lib/api';
import { FALLBACK_LOCATIONS, FALLBACK_SERVICES, FALLBACK_BARBERS } from '../data/fallbackShop';

const ShopContext = createContext(null);

export function ShopProvider({ children }) {
  const [locations, setLocations] = useState([]);
  const [services, setServices] = useState([]);
  const [barbers, setBarbers] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let cancelled = false;
    async function load() {
      try {
        const [locRes, svcRes, barRes] = await Promise.all([
          api.get('/locations'),
          api.get('/services'),
          api.get('/barbers'),
        ]);
        if (cancelled) return;
        setLocations(locRes.locations);
        setServices(svcRes.services);
        setBarbers(barRes.barbers);
      } catch (err) {
        // No API reachable (e.g. a frontend-only deployment) — fall back to
        // the seeded shop data so the site still reads as complete.
        console.error('Failed to load shop data, using static fallback', err);
        if (cancelled) return;
        setLocations(FALLBACK_LOCATIONS);
        setServices(FALLBACK_SERVICES);
        setBarbers(FALLBACK_BARBERS);
      } finally {
        if (!cancelled) setLoading(false);
      }
    }
    load();
    return () => {
      cancelled = true;
    };
  }, []);

  const primaryLocation = locations[0] || null;

  return (
    <ShopContext.Provider value={{ locations, services, barbers, primaryLocation, loading }}>
      {children}
    </ShopContext.Provider>
  );
}

export function useShop() {
  const ctx = useContext(ShopContext);
  if (!ctx) throw new Error('useShop must be used within a ShopProvider');
  return ctx;
}
