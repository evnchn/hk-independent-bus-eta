import { Box, List, SxProps, Theme, Typography } from "@mui/material";
import { useTranslation } from "react-i18next";
import SuccinctTimeReport from "../SuccinctTimeReport";
import { EtaDb, Location, RouteList, StopList } from "hk-bus-eta";
import { formatHandling, sortRoutesByEta } from "../../../utils";
import { useContext, useMemo } from "react";
import AppContext from "../../../context/AppContext";
import { RouteCollection } from "../../../@types/types";
import DbContext from "../../../context/DbContext";
import { useRoutesEtas } from "../../../hooks/useRoutesEtas";

interface CollectionRouteListProps {
  collection: RouteCollection;
  isFocus: boolean;
}

const CollectionRouteList = ({
  collection,
  isFocus,
}: CollectionRouteListProps) => {
  const { t } = useTranslation();
  const { geolocation, isRouteFilter, sortSavedRoutesByEta } =
    useContext(AppContext);
  const {
    db: { routeList, stopList, serviceDayMap },
    isTodayHoliday,
  } = useContext(DbContext);

  const routes = useMemo(
    () =>
      getRoutes({
        savedEtas: collection.list,
        geolocation: geolocation.current,
        stopList,
        routeList,
        isRouteFilter,
        isTodayHoliday,
        serviceDayMap,
      }),
    [
      collection,
      geolocation,
      stopList,
      routeList,
      isRouteFilter,
      isTodayHoliday,
      serviceDayMap,
    ]
  );
  const activeRoutes = useMemo(() => routes.filter(Boolean), [routes]);
  const routeEtas = useRoutesEtas(
    activeRoutes,
    !sortSavedRoutesByEta || !isFocus
  );
  const displayRoutes = useMemo(
    () =>
      sortSavedRoutesByEta
        ? sortRoutesByEta(activeRoutes, routeEtas)
        : activeRoutes,
    [sortSavedRoutesByEta, activeRoutes, routeEtas]
  );

  const noRoutes = useMemo(() => displayRoutes.length === 0, [displayRoutes]);

  if (!isFocus) {
    return <></>;
  }

  if (noRoutes) {
    return (
      <Box sx={rootSx}>
        <Typography sx={{ marginTop: 5 }} fontWeight={700}>
          <b>{t("收藏中未有路線")}</b>
        </Typography>
      </Box>
    );
  }

  return (
    <List disablePadding sx={{ minHeight: "100dvh" }}>
      {displayRoutes.map((selectedRoute) => (
        <SuccinctTimeReport
          key={`route-shortcut-${selectedRoute}`}
          routeId={selectedRoute}
        />
      ))}
    </List>
  );
};

export default CollectionRouteList;

const getRoutes = ({
  savedEtas,
  geolocation,
  stopList,
  routeList,
  isRouteFilter,
  isTodayHoliday,
  serviceDayMap,
}: {
  savedEtas: string[];
  geolocation: Location;
  stopList: StopList;
  routeList: RouteList;
  isRouteFilter: boolean;
  isTodayHoliday: boolean;
  serviceDayMap: EtaDb["serviceDayMap"];
}): string[] =>
  formatHandling(
    savedEtas,
    isTodayHoliday,
    isRouteFilter,
    routeList,
    stopList,
    serviceDayMap,
    geolocation
  ).split("|");

const rootSx: SxProps<Theme> = {
  display: "flex",
  flexDirection: "column",
  gap: 2,
  flex: 1,
  minHeight: "100dvh",
};
