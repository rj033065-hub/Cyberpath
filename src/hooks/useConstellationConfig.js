/**
 * useConstellationConfig
 *
 * Maps the current pathname to ConstellationBackground props.
 * Returns null for auth routes (login, signup, forgot-password, reset-password)
 * so the component is not rendered at all on those pages.
 */

/** @type {Record<string, { density: number, opacity: number, interactive: boolean } | null>} */
export const CONSTELLATION_ROUTE_CONFIG = {
  // Auth routes — do NOT render the background
  "/login": null,
  "/signup": null,
  "/forgot-password": null,
  "/reset-password": null,
  "/auth/callback": null,

  // Landing page — full density, interactive
  "/": { density: 70, opacity: 1, interactive: true },

  // Student dashboard — calm, not interactive (people read/work here)
  "/dashboard": { density: 25, opacity: 0.4, interactive: false },
};

/**
 * Default config for any route not listed above (future pages).
 * Calm, non-distracting.
 */
export const DEFAULT_CONSTELLATION_CONFIG = {
  density: 25,
  opacity: 0.35,
  interactive: false,
};

/**
 * Returns the ConstellationBackground props for the given pathname,
 * or null if the background should not be shown on this route.
 *
 * @param {string} pathname - e.g. window.location.pathname or from useLocation()
 * @returns {{ density: number, opacity: number, interactive: boolean } | null}
 */
export function getConstellationConfig(pathname) {
  if (Object.prototype.hasOwnProperty.call(CONSTELLATION_ROUTE_CONFIG, pathname)) {
    return CONSTELLATION_ROUTE_CONFIG[pathname];
  }
  return DEFAULT_CONSTELLATION_CONFIG;
}
