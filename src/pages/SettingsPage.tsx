import { useContext, useEffect, useState, useMemo, useCallback } from "react";
import AppContext from "../context/AppContext";
import {
  Avatar,
  Box,
  Checkbox,
  List,
  ListItem,
  ListItemButton,
  ListItemAvatar,
  ListItemText,
  ListSubheader,
  Slider,
  Paper,
  Snackbar,
  Typography,
  SxProps,
  Theme,
} from "@mui/material";
import {
  GetApp as GetAppIcon,
  Build as BuildIcon,
  LocationOn as LocationOnIcon,
  LocationOff as LocationOffIcon,
  MonetizationOn as MonetizationOnIcon,
  DataUsage as DataUsageIcon,
  GitHub as GitHubIcon,
  Share as ShareIcon,
  Telegram as TelegramIcon,
  Fingerprint as FingerprintIcon,
  Gavel as GavelIcon,
  SsidChart as SsidChartIcon,
  BarChart as BarChartIcon,
  Info as InfoIcon,
  SendToMobile as SendToMobileIcon,
  HelpOutline as HelpIcon,
  QuestionAnswerOutlined as FaqIcon,
  Sync as SyncIcon,
  SyncDisabled as SyncDisabledIcon,
  SecurityUpdate as SecurityUpdateIcon,
  Watch as WatchIcon,
  Map as MapIcon,
  NavigateNext as NavigateNextIcon,
  OpenInNew as OpenInNewIcon,
  Bookmarks as BookmarksIcon,
  Delete as DeleteIcon,
  History as HistoryIcon,
  HourglassTop as HourglassTopIcon,
  Tune as TuneIcon,
} from "@mui/icons-material";
import { visuallyHidden } from "@mui/utils";
import { useTranslation } from "react-i18next";
import {
  vibrate,
  setSeoHeader,
  triggerShare,
  checkAppInstalled,
  iOSRNWebView,
} from "../utils";
import InstallDialog from "../components/settings/InstallDialog";
import Donations from "../Donations";
import PersonalizeDialog from "../components/settings/PersonalizeDialog";
import { useNavigate } from "react-router-dom";
import ReactNativeContext from "../context/ReactNativeContext";
import useLanguage from "../hooks/useTranslation";
import DbContext from "../context/DbContext";

const Settings = () => {
  const {
    AppTitle,
    db: { schemaVersion, versionMd5, updateTime },
    renewDb,
    autoRenew,
    toggleAutoDbRenew,
  } = useContext(DbContext);
  const {
    geoPermission,
    updateGeoPermission,
    vibrateDuration,
    toggleAnalytics,
    analytics,
    openUrl,
    energyMode,
    toggleEnergyMode,
    resetUsageRecord,
    isRecentSearchShown,
    toggleIsRecentSearchShown,
    refreshInterval,
    updateRefreshInterval,
  } = useContext(AppContext);
  const { os } = useContext(ReactNativeContext);
  const [updating, setUpdating] = useState(false);
  const [showGeoPermissionDenied, setShowGeoPermissionDenied] = useState(false);
  const [isCopied, setIsCopied] = useState(false);
  const [isOpenInstallDialog, setIsOpenInstallDialog] = useState(false);
  const [personalizeTab, setPersonalizeTab] = useState<
    "function" | "appearance" | "manage" | null
  >(null);

  const { t } = useTranslation();
  const language = useLanguage();
  const donationId = useMemo(
    () => Math.floor(Math.random() * Donations.length),
    []
  );
  const isApple =
    os === "ios" || /iPad|iPhone|iPod|Mac/.test(navigator.userAgent);

  const showInstall = !checkAppInstalled() && !iOSRNWebView();
  const notHarmony =
    // @ts-expect-error harmonyBridger exists in Harmony OS only
    typeof harmonyBridger === "undefined";
  const watchButton = (
    <ListItemButton
      onClick={() => {
        vibrate(vibrateDuration);
        openUrl(
          isApple ? `https://watch.hkbus.app/` : `https://wear.hkbus.app/`
        );
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <WatchIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={t("智能手錶應用程式")}
        secondary={t("支援 WearOS 及 WatchOS 平台")}
      />
      <OpenInNewIcon fontSize="small" sx={hintSx} />
    </ListItemButton>
  );
  const installButton = (
    <ListItemButton
      onClick={() => {
        vibrate(vibrateDuration);
        setTimeout(() => setIsOpenInstallDialog(true), 0);
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <GetAppIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={t("安裝")}
        secondary={t("安裝巴士預報 App 到裝置")}
      />
    </ListItemButton>
  );
  const shareButton = (
    <ListItemButton
      onClick={() => {
        vibrate(vibrateDuration);
        triggerShare(
          `https://${window.location.hostname}`,
          t("巴士到站預報 App")
        ).then(() => {
          if (navigator.clipboard) setIsCopied(true);
        });
      }}
    >
      <ListItemAvatar>
        <Avatar>
          <ShareIcon />
        </Avatar>
      </ListItemAvatar>
      <ListItemText
        primary={t("複製應用程式鏈結")}
        secondary={t("經不同媒介分享給親友")}
      />
    </ListItemButton>
  );

  const geoOpening =
    geoPermission === "opening" || geoPermission === "force-opening";

  // energy score /6: geo -2 · map -1 · auto-refresh -1 · polling <20s -1
  const powerScore =
    6 -
    (geoPermission === "granted" ? 2 : 0) -
    (!energyMode ? 1 : 0) -
    (autoRenew ? 1 : 0) -
    (refreshInterval < 20000 ? 1 : 0);
  // privacy score /4: analytics -2 (sends data out) · search history -1 (local)
  const privacyScore = 4 - (analytics ? 2 : 0) - (isRecentSearchShown ? 1 : 0);
  // grade colours worst->best; each clears WCAG-AA (>=3:1) on its own bg
  const ENERGY_COLORS = [
    { light: "#616161", dark: "#9E9E9E" },
    { light: "#D32F2F", dark: "#EF5350" },
    { light: "#E65100", dark: "#FB8C00" },
    { light: "#B26A00", dark: "#FDD835" },
    { light: "#558B2F", dark: "#9CCC65" },
    { light: "#2E7D32", dark: "#66BB6A" },
  ];
  const PRIVACY_COLORS = [
    { light: "#D32F2F", dark: "#EF5350" },
    { light: "#E65100", dark: "#FB8C00" },
    { light: "#558B2F", dark: "#9CCC65" },
    { light: "#2E7D32", dark: "#66BB6A" },
  ];

  const navigate = useNavigate();

  useEffect(() => {
    setSeoHeader({
      title: t("設定") + " - " + t(AppTitle),
      description: t("setting-page-description"),
      lang: language,
    });
    setUpdating(false);
  }, [updateTime, language, t, AppTitle]);

  const updateApp = useCallback(() => {
    if ("serviceWorker" in navigator) {
      navigator.serviceWorker
        .register("/sw.js", { scope: "/" })
        .then((registration) => {
          // registration worked
          registration.update();
          window.location.reload();
        })
        .catch(() => {
          // registration failed
          console.error(`Not registrated`);
        });
    }
  }, []);

  return (
    <Paper sx={rootSx} square elevation={0}>
      <Typography component="h1" style={visuallyHidden}>{`${t("設定")} - ${t(
        AppTitle
      )}`}</Typography>
      <List sx={{ py: 0 }}>
        <ListSubheader sx={subheaderSx} disableSticky>
          {t("應用程式")}
        </ListSubheader>
        {showInstall ? installButton : notHarmony && watchButton}
        {shareButton}
        {showInstall && notHarmony && watchButton}
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            setPersonalizeTab("function");
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <TuneIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("自定義")} secondary={t("功能與外貌")} />
          <NavigateNextIcon sx={hintSx} />
        </ListItemButton>

        <ListSubheader sx={subheaderSx} disableSticky>
          {t("版本資料")}
          <Box component="span" sx={sectionHintSx}>
            {t("點擊以即時更新")}
          </Box>
        </ListSubheader>
        <ListItemButton onClick={updateApp}>
          <ListItemAvatar>
            <Avatar>
              <InfoIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={`${t("版本")}: ${
              import.meta.env.VITE_VERSION || "unknown"
            }${
              import.meta.env.VITE_COMMIT_HASH
                ? ` - ${import.meta.env.VITE_COMMIT_HASH}`
                : ""
            }`}
            secondary={import.meta.env.VITE_COMMIT_MESSAGE || ""}
          />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            setUpdating(true);
            renewDb();
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <BuildIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={
              `${t("更新路線資料庫")}: ` +
              `${schemaVersion} - ${versionMd5.slice(0, 6)}`
            }
            secondary={
              t("更新時間") +
              ": " +
              new Date(updateTime)
                .toLocaleString(undefined, { hour12: false })
                .replace(/,\s*/, " ")
            }
          />
        </ListItemButton>

        <ListSubheader sx={subheaderSx} disableSticky>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {t("能源效益")}
            <Meter score={powerScore} max={6} colors={ENERGY_COLORS} />
          </Box>
        </ListSubheader>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            toggleAutoDbRenew();
          }}
        >
          <ListItemAvatar>
            <Avatar>{autoRenew ? <SyncIcon /> : <SyncDisabledIcon />}</Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("自動更新路線資料")}
            secondary={t(autoRenew ? "開啟" : "關閉")}
          />
          <Checkbox
            edge="end"
            checked={autoRenew}
            inputProps={{ tabIndex: -1, "aria-hidden": true, readOnly: true }}
            sx={switchSx}
          />
        </ListItemButton>
        <Box sx={pairTightSx}>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              toggleEnergyMode();
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <MapIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("顯示地圖")}
              secondary={t(!energyMode ? "開啟" : "關閉")}
            />
            <Checkbox
              edge="end"
              checked={!energyMode}
              inputProps={{ tabIndex: -1, "aria-hidden": true, readOnly: true }}
              sx={switchSx}
            />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              if (geoPermission === "granted") {
                updateGeoPermission("closed");
              } else if (
                geoPermission === "force-opening" ||
                geoPermission === "opening"
              ) {
                updateGeoPermission("closed");
              } else {
                updateGeoPermission("force-opening", () => {
                  setShowGeoPermissionDenied(true);
                });
              }
            }}
          >
            <ListItemAvatar>
              <Avatar>
                {geoPermission === "granted" ? (
                  <LocationOnIcon />
                ) : (
                  <LocationOffIcon />
                )}
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("定位功能")}
              secondary={t(
                geoPermission === "granted"
                  ? "開啟"
                  : geoOpening
                    ? "開啟中..."
                    : "關閉"
              )}
            />
            <Checkbox
              edge="end"
              checked={geoPermission === "granted"}
              inputProps={{ tabIndex: -1, "aria-hidden": true, readOnly: true }}
              sx={switchSx}
            />
          </ListItemButton>
        </Box>
        <ListItem>
          <ListItemAvatar>
            <Avatar>
              <HourglassTopIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("更新頻率")}
            secondary={
              <Slider
                step={1}
                min={5}
                max={60}
                value={refreshInterval / 1000}
                valueLabelDisplay="auto"
                size="small"
                valueLabelFormat={(v: number) => `${v}s`}
                onChange={(_, v: number | number[]) =>
                  updateRefreshInterval((v as number) * 1000)
                }
              />
            }
          />
        </ListItem>
        <ListSubheader sx={subheaderSx} disableSticky>
          {t("資料管理")}
        </ListSubheader>
        <Box sx={pairTightSx}>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              navigate(`/${language}/export`);
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <SendToMobileIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("資料匯出")} />
            <NavigateNextIcon sx={hintSx} />
          </ListItemButton>
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              navigate(`/${language}/import`);
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <SecurityUpdateIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText primary={t("資料匯入")} />
            <NavigateNextIcon sx={hintSx} />
          </ListItemButton>
        </Box>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            setPersonalizeTab("manage");
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <BookmarksIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("管理收藏")} />
          <NavigateNextIcon sx={hintSx} />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            if (window.confirm(t("確定清空？"))) {
              resetUsageRecord();
            }
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <DeleteIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("一鍵清空用戶資料")}
            secondary={t("包括設定和收藏")}
          />
        </ListItemButton>

        <ListSubheader sx={subheaderSx} disableSticky>
          {t("社群")}
        </ListSubheader>
        {!iOSRNWebView() ? (
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              openUrl("https://t.me/hkbusapp");
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <TelegramIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("Telegram 交流區")}
              secondary={t("歡迎意見及技術交流")}
            />
            <OpenInNewIcon fontSize="small" sx={hintSx} />
          </ListItemButton>
        ) : (
          <ListItemButton
            onClick={() => {
              vibrate(vibrateDuration);
              navigate(`/${language}/support`);
            }}
          >
            <ListItemAvatar>
              <Avatar>
                <HelpIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={t("協助")}
              secondary={t("歡迎意見及技術交流")}
            />
            <NavigateNextIcon sx={hintSx} />
          </ListItemButton>
        )}
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(
              "https://datastudio.google.com/embed/reporting/de590428-525e-4865-9d37-a955204b807a/page/psfZC"
            );
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <SsidChartIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("統計數據彙整")}
            secondary={t("整理從 Google 收集的數據")}
          />
          <OpenInNewIcon fontSize="small" sx={hintSx} />
        </ListItemButton>
        {
          // @ts-expect-error harmonyBridger exists in Harmony OS only
          !iOSRNWebView() && typeof harmonyBridger === "undefined" && (
            <ListItemButton
              onClick={() => {
                vibrate(vibrateDuration);
                openUrl(Donations[donationId].url[language]);
              }}
            >
              <ListItemAvatar>
                <Avatar>
                  <MonetizationOnIcon />
                </Avatar>
              </ListItemAvatar>
              <ListItemText
                primary={t("捐款支持")}
                secondary={Donations[donationId].description[language]}
              />
              <OpenInNewIcon fontSize="small" sx={hintSx} />
            </ListItemButton>
          )
        }

        <ListSubheader sx={subheaderSx} disableSticky>
          <Box
            sx={{
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
            }}
          >
            {t("私隱")}
            <Meter score={privacyScore} max={4} colors={PRIVACY_COLORS} />
          </Box>
        </ListSubheader>
        {!iOSRNWebView() && (
          <ListItemButton onClick={toggleAnalytics}>
            <ListItemAvatar>
              <Avatar>
                <BarChartIcon />
              </Avatar>
            </ListItemAvatar>
            <ListItemText
              primary={"Google Analytics"}
              secondary={t(analytics ? "開啟" : "關閉")}
            />
            <Checkbox
              edge="end"
              checked={analytics}
              inputProps={{ tabIndex: -1, "aria-hidden": true, readOnly: true }}
              sx={switchSx}
            />
          </ListItemButton>
        )}
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            toggleIsRecentSearchShown();
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <HistoryIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("搜尋記錄")}
            secondary={t(isRecentSearchShown ? "開啟" : "關閉")}
          />
          <Checkbox
            edge="end"
            checked={isRecentSearchShown}
            inputProps={{ tabIndex: -1, "aria-hidden": true, readOnly: true }}
            sx={switchSx}
          />
        </ListItemButton>
        <ListItemButton
          component={"a"}
          href={`/${language}/privacy`}
          onClick={() => {
            vibrate(vibrateDuration);
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <FingerprintIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("隱私權聲明")} />
          <NavigateNextIcon sx={hintSx} />
        </ListItemButton>

        <ListSubheader sx={subheaderSx} disableSticky>
          {t("關於")}
        </ListSubheader>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(
              import.meta.env.VITE_REPO_URL ||
                `https://github.com/hkbus/hk-independent-bus-eta`
            );
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <GitHubIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("Source code")}
            secondary={"GPL-3.0 License"}
          />
          <OpenInNewIcon fontSize="small" sx={hintSx} />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl("/faq");
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <FaqIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("FAQ")}
            secondary={"Eng Version is currently not available"}
          />
          <OpenInNewIcon fontSize="small" sx={hintSx} />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(`https://instagram.com/chan_gua`);
          }}
        >
          <ListItemAvatar>
            <Avatar sx={iconSx} src="/img/logo128.png" alt="App Logo"></Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("圖標來源")}
            secondary={t("陳瓜 Chan Gua")}
          />
          <OpenInNewIcon fontSize="small" sx={hintSx} />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl(`https://github.com/anscg/hk-pmtiles-generation`);
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <MapIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("地圖資源")}
            secondary={"HK pmtiles Generation by @anscg"}
          />
          <OpenInNewIcon fontSize="small" sx={hintSx} />
        </ListItemButton>
        <ListItemButton
          component={"a"}
          href={`/${language}/terms`}
          onClick={() => {
            vibrate(vibrateDuration);
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <GavelIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText primary={t("條款")} />
          <NavigateNextIcon sx={hintSx} />
        </ListItemButton>
        <ListItemButton
          onClick={() => {
            vibrate(vibrateDuration);
            openUrl("https://data.gov.hk");
          }}
        >
          <ListItemAvatar>
            <Avatar>
              <DataUsageIcon />
            </Avatar>
          </ListItemAvatar>
          <ListItemText
            primary={t("交通資料來源")}
            secondary={t("開放數據平台")}
          />
          <OpenInNewIcon fontSize="small" sx={hintSx} />
        </ListItemButton>
      </List>
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={updating}
        message={t("資料更新中") + "..."}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={showGeoPermissionDenied}
        autoHideDuration={1500}
        onClose={() => {
          setShowGeoPermissionDenied(false);
        }}
        message={t("無法獲得地理位置定位功能權限")}
      />
      <Snackbar
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        open={isCopied}
        autoHideDuration={1500}
        onClose={() => {
          setIsCopied(false);
        }}
        message={t("鏈結已複製到剪貼簿")}
      />
      <InstallDialog
        open={isOpenInstallDialog}
        handleClose={() => setIsOpenInstallDialog(false)}
      />
      <PersonalizeDialog
        open={personalizeTab !== null}
        initialTab={personalizeTab ?? "function"}
        onClose={() => setPersonalizeTab(null)}
      />
    </Paper>
  );
};

export default Settings;

// N-cell score bar; score = lit-cell count, theme-adaptive fills clear WCAG-AA
const Meter = ({
  score,
  max,
  colors,
}: {
  score: number;
  max: number;
  colors: { light: string; dark: string }[];
}) => {
  const c = colors[Math.max(0, Math.min(colors.length - 1, score - 1))];
  return (
    <Box aria-hidden sx={{ display: "flex", gap: "3px", alignItems: "center" }}>
      {Array.from({ length: max }, (_, i) => (
        <Box
          key={i}
          sx={{
            width: 6,
            height: 14,
            borderRadius: "2px",
            bgcolor: (theme) =>
              i < score
                ? theme.palette.mode === "dark"
                  ? c.dark
                  : c.light
                : theme.palette.action.disabledBackground,
          }}
        />
      ))}
    </Box>
  );
};

const rootSx: SxProps<Theme> = {
  background: (theme) =>
    theme.palette.mode === "dark" ? theme.palette.background.default : "white",
  height: "calc(100vh - 120px)",
  overflowY: "scroll",
  "& .MuiAvatar-colorDefault": {
    color: (theme) =>
      theme.palette.mode === "dark"
        ? theme.palette.background.default
        : "white",
  },
};

const subheaderSx: SxProps<Theme> = {
  bgcolor: "transparent",
  lineHeight: "36px",
  fontWeight: 700,
  fontSize: "0.75rem",
  letterSpacing: "0.06em",
  textTransform: "uppercase",
  color: "primary.main",
};

const hintSx: SxProps<Theme> = {
  color: "text.disabled",
  ml: 1,
};

// a normal-case hint appended to a section header, same size as the title
const sectionHintSx: SxProps<Theme> = {
  ml: 1,
  fontSize: "0.75rem",
  fontWeight: 400,
  color: "text.secondary",
  textTransform: "none",
  letterSpacing: "normal",
};

// pair short label-only rows side-by-side; wraps back to 1 column on the narrowest
// screens (iPhone SE). used only where mis-click risk is low and labels are short:
// map|location and export|import
const pairTightSx: SxProps<Theme> = {
  display: "flex",
  flexWrap: "wrap",
  "& > *": { flex: "1 1 150px", minWidth: 0 },
  "& .MuiListItemText-secondary": {
    whiteSpace: "nowrap",
    overflow: "hidden",
    textOverflow: "ellipsis",
  },
};

// visual-only indicator; the row's onClick performs the toggle
const switchSx: SxProps<Theme> = {
  pointerEvents: "none",
};

const iconSx: SxProps<Theme> = {
  filter: (theme) =>
    theme.palette.mode === "dark" ? "grayscale(100%) brightness(0.5)" : "none",
};
