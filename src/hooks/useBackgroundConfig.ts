import { lazy } from 'react';

// Lazy load background components to keep initial bundle small
const PacketNetworkBackground = lazy(() => import('./PacketNetworkBackground'));
const HexGridBackground = lazy(() => import('./HexGridBackground'));

export type BackgroundIntensity = 'hero' | 'calm' | 'still';

export interface BackgroundConfig {
  component: React.LazyExoticComponent<React.ComponentType<any>> | null;
  intensity: BackgroundIntensity;
  opacity: number;
}

// Route prefixes mapped to background settings. Order matters – first match wins.
const BACKGROUND_ROUTE_CONFIG: { prefix: string; config: BackgroundConfig }[] = [
  // Landing page – heroic packet network animation
  {
    prefix: '/',
    config: { component: PacketNetworkBackground, intensity: 'hero', opacity: 0.8 },
  },
  // Dashboard and core app pages – calm hex grid
  {
    prefix: '/dashboard',
    config: { component: HexGridBackground, intensity: 'calm', opacity: 0.5 },
  },
  {
    prefix: '/learn',
    config: { component: HexGridBackground, intensity: 'calm', opacity: 0.5 },
  },
  {
    prefix: '/explore',
    config: { component: HexGridBackground, intensity: 'calm', opacity: 0.5 },
  },
  {
    prefix: '/profile',
    config: { component: HexGridBackground, intensity: 'calm', opacity: 0.5 },
  },
  {
    prefix: '/resources',
    config: { component: HexGridBackground, intensity: 'calm', opacity: 0.5 },
  },
  // Lab/CTF routes – no background (focus mode)
  { prefix: '/lab', config: { component: null, intensity: 'still', opacity: 0 } },
  { prefix: '/ctf', config: { component: null, intensity: 'still', opacity: 0 } },
  // Auth routes – explicitly no background
  { prefix: '/login', config: { component: null, intensity: 'still', opacity: 0 } },
  { prefix: '/signup', config: { component: null, intensity: 'still', opacity: 0 } },
  { prefix: '/forgot-password', config: { component: null, intensity: 'still', opacity: 0 } },
  { prefix: '/reset-password', config: { component: null, intensity: 'still', opacity: 0 } },
  { prefix: '/auth', config: { component: null, intensity: 'still', opacity: 0 } },
];

/**
 * Returns the appropriate background configuration for a given pathname.
 * If no explicit match is found, falls back to a calm hex grid.
 */
export function getBackgroundConfig(pathname: string): BackgroundConfig {
  const p = pathname.toLowerCase();
  for (const entry of BACKGROUND_ROUTE_CONFIG) {
    if (p === entry.prefix || p.startsWith(entry.prefix + '/')) {
      return entry.config;
    }
  }
  // Default fallback – calm hex grid with low opacity
  return { component: HexGridBackground, intensity: 'calm', opacity: 0.4 };
}
