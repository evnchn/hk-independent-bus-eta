import { StopListEntry } from "hk-bus-eta";
import { useContext, useEffect, useState } from "react";
import DbContext from "../context/DbContext";

interface GeoJsonType extends GeoJSON.GeoJsonObject {
  features?: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: Array<[number, number]>;
    };
  }>;
}

import { getDistance } from "../utils";

type Pt = [number, number];
const dist = (a: Pt, b: Pt) =>
  getDistance({ lat: a[1], lng: a[0] }, { lat: b[1], lng: b[0] });
const pathLen = (c: Pt[]) =>
  c.reduce((s, p, i) => (i ? s + dist(c[i - 1], p) : 0), 0);
const excursion = (c: Pt[]) =>
  c.reduce((m, p) => Math.max(m, dist(p, c[0])), 0);

// Remove out-and-back retraces: when a point returns within eps of an earlier
// kept vertex, excise the spur back to it.
const deloop = (pts: Pt[], eps: number): Pt[] => {
  const out: Pt[] = [pts[0]];
  for (let k = 1; k < pts.length; k++) {
    const p = pts[k];
    let hit = -1;
    for (let j = out.length - 4; j >= 0; j--)
      if (dist(p, out[j]) < eps) {
        hit = j;
        break;
      }
    if (hit >= 0) {
      out.length = hit + 1;
      if (dist(p, out[out.length - 1]) >= eps) out.push(p);
    } else out.push(p);
  }
  return out;
};

// Heal spurious mid-route "doubling-back" loops in the CSDI waypoints (the router
// skipped a hard turn, so it backtracked or detoured). Per part: flag by excursion,
// confirm spurious by self-overlap, then de-loop; chord any residual. Golden
// (non-flagged) parts are untouched.
const healSpuriousLoops = (json: GeoJsonType): GeoJsonType => {
  const geometry = json?.features?.[0]?.geometry;
  if (geometry?.type !== "MultiLineString") return json;
  const parts = geometry.coordinates as unknown as Pt[][];
  for (let i = 0; i < parts.length; i++) {
    const part = parts[i];
    if (part.length < 2) continue;
    const len = pathLen(part);
    const exc = excursion(part);
    const span = dist(part[0], part[part.length - 1]);
    if (!(len > 500 && exc > 800 && exc > 2 * Math.max(span, 30))) continue;
    const healed = deloop(part, 30);
    if (1 - pathLen(healed) / len < 0.2) continue; // low self-overlap = real road
    const h = deloop(healed, 80);
    const he = excursion(h);
    const hs = dist(h[0], h[h.length - 1]);
    parts[i] =
      pathLen(h) > 500 && he > 800 && he > 2 * Math.max(hs, 30)
        ? [h[0], h[h.length - 1]]
        : h;
  }
  return json;
};

export const useRoutePath = (routeId: string, stops: StopListEntry[]) => {
  const [geoJson, setGeoJson] = useState<GeoJsonType | null>(null);
  const {
    db: { routeList },
  } = useContext(DbContext);
  const { gtfsId, bound, co, route, dest } = routeList[routeId];

  useEffect(() => {
    let waypointsFile = "";
    if (gtfsId) {
      waypointsFile = `${gtfsId}-${
        bound[co[0]] === "I" ? "I" : "O" // handling for pseudo circular route
      }.json`;
    } else if (co.includes("mtr")) {
      waypointsFile = `${routeId.split("-")[0].toLowerCase()}.json`;
    } else if (route && co.includes("lightRail")) {
      // For light rail map
      waypointsFile = `${route}${dest.en.includes("Circular") ? "" : bound[co[0]] === "I" ? "_I" : "_O"}.json`;
    }
    const setFallbackGeoJson = () => {
      setGeoJson({
        features: [
          {
            type: "Feature",
            geometry: {
              type: "LineString",
              coordinates: stops.reduce(
                (acc, { location: { lat, lng } }) => {
                  acc.push([lng, lat]);
                  return acc;
                },
                [] as [number, number][]
              ),
            },
          },
        ],
        type: "FeatureCollection",
      });
    };
    if (waypointsFile === "") {
      setFallbackGeoJson();
    } else {
      fetch(`https://hkbus.github.io/route-waypoints/${waypointsFile}`)
        .then((r) => r.json())
        .then((json) => {
          setGeoJson(healSpuriousLoops(json));
        })
        .catch(() => {
          setFallbackGeoJson();
        });
    }
    return () => {
      setGeoJson(null);
    };
  }, [routeId, gtfsId, bound, co, stops, dest, route]);

  return geoJson;
};
