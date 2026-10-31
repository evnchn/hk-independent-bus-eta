export const SAVED_ROUTE_LIMIT = 40;

// Unique saved entries whose route still exists, beyond the newest SAVED_ROUTE_LIMIT.
export const hiddenSavedRouteCount = (
  savedEtas: string[],
  routeList: Record<string, unknown>
): number => {
  const valid = new Set(savedEtas.filter((r) => r.split("/")[0] in routeList));
  return Math.max(0, valid.size - SAVED_ROUTE_LIMIT);
};
