import { useCallback, useContext, useEffect, useRef, useState } from "react";
import { Eta, fetchEtas } from "hk-bus-eta";
import AppContext from "../context/AppContext";
import useLanguage from "./useTranslation";
import DbContext from "../context/DbContext";

// fetch etas for a list of routeIds (format "<routeId>/<seq>") in parallel
export const useRoutesEtas = (
  routeIds: string[],
  disabled: boolean = false
) => {
  const { isVisible, refreshInterval } = useContext(AppContext);
  const {
    db: { routeList, stopList, holidays, serviceDayMap },
  } = useContext(DbContext);
  const language = useLanguage();
  const [etas, setEtas] = useState<Record<string, Eta[]>>({});
  const isMounted = useRef<boolean>(false);

  const fetchData = useCallback(() => {
    if (disabled || !isVisible || navigator.userAgent === "prerendering") {
      return;
    }
    Promise.all(
      routeIds.map((routeId) => {
        const [routeKey, seq] = routeId.split("/");
        return fetchEtas({
          ...(routeList[routeKey] ?? DefaultRoute),
          seq: parseInt(seq, 10),
          stopList,
          language,
          holidays,
          serviceDayMap,
        }).then((e): [string, Eta[]] => [routeId, e]);
      })
    ).then((result) => {
      if (isMounted.current) setEtas(Object.fromEntries(result));
    });
  }, [
    disabled,
    isVisible,
    language,
    routeIds,
    routeList,
    stopList,
    holidays,
    serviceDayMap,
  ]);

  useEffect(() => {
    if (disabled) return;
    isMounted.current = true;
    fetchData();
    const interval = setInterval(fetchData, refreshInterval);
    return () => {
      isMounted.current = false;
      clearInterval(interval);
    };
  }, [disabled, fetchData, refreshInterval]);

  return etas;
};

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

export default useRoutesEtas;
