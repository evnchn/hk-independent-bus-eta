import { useContext } from "react";
import {
  Avatar,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  SxProps,
  Theme,
} from "@mui/material";
import {
  Timer as TimerIcon,
  DarkMode as DarkModeIcon,
  SettingsBrightness as SettingsBrightnessIcon,
  WbSunny as WbSunnyIcon,
  AllInclusive as AllInclusiveIcon,
  FilterAlt as FilterAltIcon,
  Filter1 as Filter1Icon,
  Filter7 as Filter7Icon,
  Sort as SortIcon,
  PushPin as PinIcon,
  FormatSize as FormatSizeIcon,
  LooksOneRounded as LooksOneRoundedIcon,
} from "@mui/icons-material";
import { ETA_FORMAT_STR } from "../../constants";
import AppContext from "../../context/AppContext";
import { vibrate } from "../../utils";
import { useTranslation } from "react-i18next";
import FontSizeSlider from "./FontSizeSlider";

interface OptionsListProps {
  category: "function" | "appearance";
}

const OptionsList = ({ category }: OptionsListProps) => {
  const {
    isRouteFilter,
    toggleRouteFilter,
    busSortOrder,
    toggleBusSortOrder,
    numPadOrder,
    toggleNumPadOrder,
    etaFormat,
    toggleEtaFormat,
    _colorMode: colorMode,
    toggleColorMode,
    platformMode,
    togglePlatformMode,
    vibrateDuration,
    annotateScheduled,
    toggleAnnotateScheduled,
  } = useContext(AppContext);
  const { t } = useTranslation();

  return (
    <List sx={ListSx}>
      {category === "function" && (
        <>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              toggleRouteFilter();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                {isRouteFilter ? <FilterAltIcon /> : <AllInclusiveIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("路線篩選")}
              secondary={t(isRouteFilter ? "只顯示現時路線" : "顯示所有路線")}
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              toggleBusSortOrder();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <SortIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("巴士排序")} secondary={t(busSortOrder)} />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              toggleColorMode();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                {colorMode === "system" && <SettingsBrightnessIcon />}
                {colorMode === "light" && <WbSunnyIcon />}
                {colorMode === "dark" && <DarkModeIcon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("主題")}
              secondary={t(`color-${colorMode}`)}
            />
          </ListItemButton>
          <ListItem>
            <ListItemAvatar>
              <Avatar>
                <FormatSizeIcon />
              </Avatar>
            </ListItemAvatar>
            <FontSizeSlider />
          </ListItem>
        </>
      )}
      {category === "appearance" && (
        <>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              toggleEtaFormat();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <TimerIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("報時格式")}
              secondary={t(ETA_FORMAT_STR[etaFormat])}
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              toggleAnnotateScheduled();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <PinIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("注釋預定班次")}
              secondary={t(annotateScheduled ? "開啟" : "關閉")}
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              toggleNumPadOrder();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                {numPadOrder[0] === "1" ? <Filter1Icon /> : <Filter7Icon />}
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("鍵盤格式")} secondary={numPadOrder} />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              togglePlatformMode();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <LooksOneRoundedIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("月台顯示格式")}
              secondary={t(platformMode ? "➊" : "①")}
            />
          </ListItemButton>
        </>
      )}
    </List>
  );
};

export default OptionsList;

const ListSx: SxProps<Theme> = {
  "& .MuiAvatar-colorDefault": {
    color: (theme) =>
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : "white",
  },
  overflow: "scroll",
};
