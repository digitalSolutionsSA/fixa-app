import { Geolocation } from '@capacitor/geolocation';
import { supabase } from './supabase';

export interface DeviceLocation {
  latitude: number;
  longitude: number;
  area: string; // human-readable suburb/city, reverse-geocoded
}

export class LocationError extends Error {}

// Reverse-geocode via OpenStreetMap Nominatim — no API key required.
async function reverseGeocode(latitude: number, longitude: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=14&addressdetails=1`,
      { headers: { Accept: 'application/json' } },
    );
    if (!res.ok) throw new Error('reverse geocode failed');
    const data = await res.json();
    const a = data?.address || {};
    const parts = [a.suburb || a.neighbourhood || a.town || a.village || a.city_district, a.city || a.town || a.county]
      .filter(Boolean);
    return parts.length ? parts.join(', ') : (data?.display_name || `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`);
  } catch {
    return `${latitude.toFixed(4)}, ${longitude.toFixed(4)}`;
  }
}

// Requests permission (native prompt on iOS/Android, browser prompt on web) and
// returns the device's current GPS position plus a human-readable area name.
export async function getCurrentDeviceLocation(): Promise<DeviceLocation> {
  const perm = await Geolocation.requestPermissions();
  if (perm.location === 'denied') {
    throw new LocationError('Location permission denied. Enable it in your device settings.');
  }

  const position = await Geolocation.getCurrentPosition({
    enableHighAccuracy: true,
    timeout: 15000,
  });

  const { latitude, longitude } = position.coords;
  const area = await reverseGeocode(latitude, longitude);

  return { latitude, longitude, area };
}

// Saves a fresh GPS fix to the current user's profile row.
export async function saveDeviceLocation(userId: string, loc: DeviceLocation) {
  const { error } = await supabase
    .from('profiles')
    .update({
      area: loc.area,
      latitude: loc.latitude,
      longitude: loc.longitude,
      location_updated_at: new Date().toISOString(),
    })
    .eq('id', userId);

  if (error) throw error;
}

const EARTH_RADIUS_KM = 6371;

function toRad(deg: number) {
  return (deg * Math.PI) / 180;
}

// Great-circle distance between two coordinates, in kilometers.
export function distanceKm(a: { latitude: number; longitude: number }, b: { latitude: number; longitude: number }): number {
  const dLat = toRad(b.latitude - a.latitude);
  const dLon = toRad(b.longitude - a.longitude);
  const lat1 = toRad(a.latitude);
  const lat2 = toRad(b.latitude);

  const h = Math.sin(dLat / 2) ** 2 + Math.cos(lat1) * Math.cos(lat2) * Math.sin(dLon / 2) ** 2;
  return EARTH_RADIUS_KM * 2 * Math.asin(Math.sqrt(h));
}

export function formatDistanceKm(km: number): string {
  if (km < 1) return `${Math.round(km * 1000)} m`;
  return `${km.toFixed(1)} km`;
}
