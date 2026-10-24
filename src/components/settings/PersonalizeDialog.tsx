import { useEffect, useState } from "react";
import {
  Box,
  Dialog,
  DialogTitle,
  Divider,
  IconButton,
  Tab,
  Tabs,
  SxProps,
  Theme,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { useTranslation } from "react-i18next";
import OptionsList from "./OptionsList";
import UserContentManagement from "./UserContentManagement";

type TabType = "function" | "appearance" | "manage";

interface PersonalizeModalProps {
  open: boolean;
  initialTab?: TabType;
  onClose: () => void;
}

const PersonalizeDialog = ({
  open,
  initialTab = "function",
  onClose,
}: PersonalizeModalProps) => {
  const [tab, setTab] = useState<TabType>(initialTab);
  const { t } = useTranslation();

  useEffect(() => {
    if (open) setTab(initialTab);
  }, [open, initialTab]);

  const isManage = tab === "manage";

  return (
    <Dialog
      PaperProps={{ sx: DialogSx }}
      open={open}
      onClose={onClose}
      maxWidth="xs"
      fullWidth
    >
      <DialogTitle sx={DialogTitleSx}>
        <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
          {t(isManage ? "管理收藏" : "自定義")}
        </Box>
        <IconButton aria-label={t("關閉視窗")} onClick={onClose}>
          <CloseIcon />
        </IconButton>
      </DialogTitle>
      {!isManage && (
        <Tabs value={tab} onChange={(_, v) => setTab(v)} variant="fullWidth">
          <Tab value="function" label={t("功能設定")} />
          <Tab value="appearance" label={t("外貌設定")} />
        </Tabs>
      )}
      <Divider />
      {isManage ? <UserContentManagement /> : <OptionsList category={tab} />}
    </Dialog>
  );
};

export default PersonalizeDialog;

const DialogSx: SxProps<Theme> = {
  height: "100%",
};

const DialogTitleSx: SxProps<Theme> = {
  display: "flex",
  justifyContent: "space-between",
};
