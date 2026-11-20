import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Eta, fetchEtas } from "hk-bus-eta";
import AppContext from "../context/AppContext";
import useLanguage from "./useTranslation";
import DbContext from "../context/DbContext";

export const useEtas = (routeId: string, disable: boolean = false) => {
  const { isVisible, refreshInterval } = useContext(AppContext);
  const {
    db: { routeList, stopList, holidays, serviceDayMap },
  } = useContext(DbContext);
  const [routeKey, seq] = routeId.split("/");
  const routeObj = routeList[routeKey] || DefaultRoute;
  const [etas, setEtas] = useState<Eta[] | null>(null);
  const language = useLanguage();
  const isMounted = useRef<boolean>(false);
  const fetchedAt = useRef<number>(0);

  const fetchData = useCallback(() => {
    // hold the last-known ETAs over a brief hide or slow refresh, not for long
    if (Date.now() - fetchedAt.current > MAX_ETA_AGE) setEtas(null);
    if (!isVisible || navigator.userAgent === "prerendering") {
      // skip if prerendering
      return new Promise((resolve) => resolve([]));
    }
    return fetchEtas({
      ...routeObj,
      seq: parseInt(seq, 10),
      stopList,
      language,
      holidays,
      serviceDayMap,
    }).then((_etas) => {
      if (isMounted.current) {
        fetchedAt.current = Date.now();
        setEtas(_etas);
      }
    });
  }, [isVisible, language, routeObj, seq, stopList, holidays, serviceDayMap]);

  useEffect(() => {
    if (disable) return;
    isMounted.current = true;
    const fetchEtaInterval = setInterval(() => {
      fetchData();
    }, refreshInterval);

    fetchData();

    return () => {
      isMounted.current = false;
      clearInterval(fetchEtaInterval);
    };
  }, [routeId, fetchData, refreshInterval, disable]);

  return etas;
};

const MAX_ETA_AGE = 2 * 60 * 1000;

const DefaultRoute = {
  co: [""],
  stops: { "": [""] },
  dest: { zh: "", en: "" },
  bound: "",
  nlbId: 0,
  gtfsId: "",
  fares: [],
  faresHoliday: [],
};
