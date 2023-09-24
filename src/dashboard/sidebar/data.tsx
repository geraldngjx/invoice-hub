import { HomeIcon } from "./icons/HomeIcon";
import { StatusIcon } from "./icons/StatusIcon";
import { ArchiveIcon } from "./icons/ArchiveIcon";

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
];
