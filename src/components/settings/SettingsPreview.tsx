import { useContext, useMemo } from "react";
import { Box, Typography, SxProps, Theme } from "@mui/material";
import { Eta } from "hk-bus-eta";
import { useTranslation } from "react-i18next";
import AppContext from "../../context/AppContext";
import DbContext from "../../context/DbContext";
import SuccinctTimeReport from "../home/SuccinctTimeReport";
import RouteInputPad from "../route-board/RouteInputPad";
import { getPlatformSymbol } from "../../utils";

// Look-only preview built from the real route row + keypad, driven by real DB
// routes with fabricated arrival times, so the options reflect live as they change.

interface PreviewProps {
  category: "function" | "appearance";
}

// an ISO arrival string m minutes out, carrying HK's +08:00 offset like the real
// ETA API — so SuccinctEtas' clock read (slice 11..16) shows local time, not UTC
const min = (m: number): string => {
  const d = new Date(Date.now() + m * 60000);
  const p = (n: number) => String(n).padStart(2, "0");
  return `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(d.getDate())}T${p(
    d.getHours()
  )}:${p(d.getMinutes())}:${p(d.getSeconds())}+08:00`;
};

const SettingsPreview = ({ category }: PreviewProps) => {
  const { t } = useTranslation();
  const { isRouteFilter, busSortOrder, platformMode } = useContext(AppContext);
  const {
    db: { routeList },
  } = useContext(DbContext);

  // real routes from the DB — a KMB bus, a CTB bus, and a railway (MTR, else
  // Light Rail) whose stops actually have platforms; memoised so we don't rescan
  const [kmb, ctb, rail] = useMemo(() => {
    const find = (co: string) =>
      Object.keys(routeList).find((k) =>
        routeList[k]?.co?.some((c) => c === co)
      );
    return [find("kmb"), find("ctb"), find("mtr") ?? find("lightRail")];
  }, [routeList]);

  if (!kmb) return null;

  const kmbCo = routeList[kmb].co[0];
  const blank = { zh: "", en: "" };
  const dest = (k: string) => routeList[k]?.dest ?? blank;

  // bus row: plain, plain, then a scheduled bus — demos ETA format + annotate
  const busEtas: Eta[] = [
    { eta: min(3), remark: blank, dest: dest(kmb), co: kmbCo },
    { eta: min(12), remark: blank, dest: dest(kmb), co: kmbCo },
    {
      eta: min(24),
      remark: { zh: "預定班次", en: "Scheduled Bus" },
      dest: dest(kmb),
      co: kmbCo,
    },
  ];
  // railway row forced to a "coming soon" state with NO arrival time — exactly
  // what shows when live ETA data is unavailable. An unparseable eta makes the
  // real SuccinctEtas fall back to rendering the remark verbatim, so it reads the
  // same in every ETA format; the platform symbol still reacts to platformMode.
  const railCo = rail ? routeList[rail].co[0] : kmbCo;
  const comingSoon = `${getPlatformSymbol(1, platformMode)} ${t("即將抵達")}`;
  const railEtas: Eta[] = [
    {
      eta: "N/A",
      remark: { zh: comingSoon, en: comingSoon },
      dest: dest(rail ?? kmb),
      co: railCo,
    },
  ];
  const plainEtas = (k: string, a: number, b: number): Eta[] => [
    { eta: min(a), remark: blank, dest: dest(k), co: routeList[k].co[0] },
    { eta: min(b), remark: blank, dest: dest(k), co: routeList[k].co[0] },
  ];

  // Functionality: two real rows, reordered by busSortOrder and thinned by the
  // route filter (the CTB row stands in for a "not currently running" route)
  const rows: { id: string; co: string; etas: Eta[] }[] = [];
  if (kmb)
    rows.push({ id: `${kmb}/0`, co: "kmb", etas: plainEtas(kmb, 3, 16) });
  if (ctb)
    rows.push({ id: `${ctb}/0`, co: "ctb", etas: plainEtas(ctb, 6, 20) });
  const ordered = rows
    .slice()
    .sort((x, y) =>
      busSortOrder === "CTB first"
        ? Number(y.co === "ctb") - Number(x.co === "ctb")
        : Number(y.co === "kmb") - Number(x.co === "kmb")
    )
    .filter((r) => !isRouteFilter || r.co === "kmb");

  return (
    <Box sx={rootSx}>
      <Typography sx={labelSx}>{t("預覽")}</Typography>
      <Box sx={cardSx}>
        {category === "appearance" ? (
          <>
            <Box sx={noTapSx}>
              <SuccinctTimeReport routeId={`${kmb}/0`} etas={busEtas} />
              {rail && (
                <SuccinctTimeReport routeId={`${rail}/0`} etas={railEtas} />
              )}
            </Box>
            <Box sx={keypadSx}>
              <RouteInputPad boardTab="all" />
            </Box>
          </>
        ) : (
          <Box sx={noTapSx}>
            {ordered.map((r) => (
              <SuccinctTimeReport key={r.id} routeId={r.id} etas={r.etas} />
            ))}
          </Box>
        )}
      </Box>
    </Box>
  );
};

export default SettingsPreview;

const rootSx: SxProps<Theme> = {
  mx: 2,
  mb: 2,
  mt: 1,
  // cap at half the dialog so a large font size can't blow the preview out;
  // it scrolls independently of the settings list above
  maxHeight: "50%",
  overflowY: "auto",
  flexShrink: 0,
};

const labelSx: SxProps<Theme> = {
  fontSize: "0.7rem",
  fontWeight: 700,
  letterSpacing: "0.08em",
  textTransform: "uppercase",
  color: "primary.main",
  mb: 0.5,
};

const cardSx: SxProps<Theme> = {
  border: (theme) => `1px solid ${theme.palette.divider}`,
  borderRadius: 2,
  overflow: "hidden",
};

// the preview is look-only; swallow taps so a row never navigates away
const noTapSx: SxProps<Theme> = {
  pointerEvents: "none",
};

// the full real search keypad (numbers + letters), reflecting numPadOrder;
// pointer-events-none so it's look-only. The preview scrolls, so it fits at
// natural size.
const keypadSx: SxProps<Theme> = {
  pointerEvents: "none",
  borderTop: (theme) => `1px solid ${theme.palette.divider}`,
  "& > div": { background: "transparent" },
};
