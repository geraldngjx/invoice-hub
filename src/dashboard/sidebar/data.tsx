// import { DocIcon } from "./icons/DocIcon";
import { HomeIcon } from "./icons/HomeIcon";
import { StatusIcon } from "./icons/StatusIcon";
// import { CreditIcon } from "./icons/CreditIcon";
import { ArchiveIcon } from "./icons/ArchiveIcon";
// import { SettingsIcon } from "./icons/SettingsIcon";

export const data = [
  {
    title: "Home",
    icon: <HomeIcon />,
    link: "/",
  },
  {
    title: "Upload",
    icon: <StatusIcon />,
    link: "/admin/upload",
  },
  {
    title: "Files",
    icon: <ArchiveIcon />,
    link: "/admin/files",
  },
  // {
  //   title: "Credits",
  //   icon: <CreditIcon />,
  //   link: "/admin/credits",
  // },
  // {
  //   title: "Settings",
  //   icon: <SettingsIcon />,
  //   link: "/admin/settings",
  // },
  // {
  //   title: "Documentation",
  //   icon: <DocIcon />,
  //   link: "/admin/documentation",
  // },
];
