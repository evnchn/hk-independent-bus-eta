import React, { MouseEventHandler } from "react";
import {
  Box,
  Card,
  CardContent,
  IconButton,
  SxProps,
  Theme,
} from "@mui/material";
import { Link } from "react-router-dom";
import RouteTerminus from "./RouteTerminus";
import RouteNoCompany from "./RouteNoCompany";
import { Close as CloseIcon } from "@mui/icons-material";
import { grey } from "@mui/material/colors";
import { RouteListEntry } from "hk-bus-eta";
import { useTranslation } from "react-i18next";
import useLanguage from "../../hooks/useTranslation";
import { toProperCase } from "../../utils";

interface RouteRowProps {
  route: [string, RouteListEntry];
  style: React.CSSProperties;
  onClick: MouseEventHandler<HTMLButtonElement>;
  onRemove?: MouseEventHandler<HTMLButtonElement>;
}

const RouteRow = ({ route, onClick, style, onRemove }: RouteRowProps) => {
  const language = useLanguage();
  const { t } = useTranslation();

  const [routeNo] = route[0].split("-");
  // e.g. "Route 1A to Central, from Star Ferry" — a coherent accessible
  // name, instead of the disjoint visual fragments a screen reader would
  // otherwise stitch together.
  const routeLabel = `${t("路線")} ${routeNo} ${t("往")} ${toProperCase(
    route[1].dest[language]
  )}, ${t("由")} ${toProperCase(route[1].orig[language])}`;

  return (
    <Link
      // for SEO, not for click — hidden from the a11y tree to avoid a
      // duplicate, unlabelled tab stop over the same row.
      to={`/${language}/route/${route[0].toLowerCase()}`}
      style={style}
      tabIndex={-1}
      aria-hidden="true"
    >
      <Card variant="outlined" key={route[0]} square sx={rootSx}>
        <Box
          component="button"
          type="button"
          onClick={onClick}
          aria-label={routeLabel}
          sx={actionSx}
        >
          <CardContent sx={cardContentSx}>
            <RouteNoCompany route={route} />
            <RouteTerminus terminus={route[1]} />
          </CardContent>
        </Box>
        {onRemove && (
          <IconButton onClick={onRemove} aria-label={`${t("移除")} ${routeNo}`}>
            <CloseIcon />
          </IconButton>
        )}
      </Card>
    </Link>
  );
};

export default RouteRow;

const rootSx: SxProps<Theme> = {
  border: "none",
  display: "flex",
  alignItems: "center",
  height: "100%",
  borderBottomWidth: "1px",
  borderBottomStyle: "solid",
  borderBlockColor: (t) => (t.palette.mode === "dark" ? grey[900] : grey[200]),
};

const cardContentSx: SxProps<Theme> = {
  display: "grid",
  gridTemplateColumns: "25% 65%",
  py: 0.5,
  px: 2,
  alignItems: "center",
};

// A lightweight native <button> replaces MUI CardActionArea (a ButtonBase) as
// the row's click target — the ButtonBase is ~a quarter of the per-row render
// cost, which shows up as jank when react-window mounts rows during a scroll.
// Keeps the accessible name + keyboard activation; a CSS press/focus state
// stands in for the ripple.
const actionSx: SxProps<Theme> = {
  appearance: "none",
  border: 0,
  m: 0,
  p: 0,
  width: "100%",
  background: "transparent",
  font: "inherit",
  color: "inherit",
  textAlign: "left",
  display: "block",
  cursor: "pointer",
  transition: "background-color 0.1s ease-out",
  "&:active": {
    backgroundColor: (theme) =>
      theme.palette.mode === "dark"
        ? "rgba(255, 255, 255, 0.08)"
        : "rgba(0, 0, 0, 0.06)",
  },
  "&:focus-visible": {
    outline: (theme) => `2px solid ${theme.palette.primary.main}`,
    outlineOffset: "-2px",
  },
  "@media (prefers-reduced-motion: reduce)": {
    transition: "none",
  },
};
