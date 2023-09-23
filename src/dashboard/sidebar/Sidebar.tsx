import css from "../style.module.css";
import { SidebarItems } from "./SidebarItems";
import { useDashboardContext } from "../Provider";

interface SidebarProps {
  mobileOrientation: "start" | "end";
}

export function Sidebar({ mobileOrientation }: SidebarProps) {
  const { sidebarOpen } = useDashboardContext();

  const getMobileOrientationStyle = () => {
    if (mobileOrientation === "start") {
      return "left-0";
    } else if (mobileOrientation === "end") {
      return "right-0 lg:left-0";
    }
    return "";
  };

  const sidebarStyle = {
    container: "pb-32 lg:pb-12",
    close: "duration-700 ease-out hidden transition-all lg:w-24",
    open: "absolute duration-500 ease-in transition-all w-8/12 z-40 sm:w-5/12 md:w-64",
    default: "h-screen overflow-y-auto text-white top-0 lg:absolute bg-gray-900 lg:block lg:z-40",
  };

  const mobileOrientationStyle = getMobileOrientationStyle();
  const sidebarOpenStyle = sidebarOpen ? sidebarStyle.open : sidebarStyle.close;

  return (
    <aside
      className={`${sidebarStyle.default} ${mobileOrientationStyle} ${sidebarOpenStyle} ${css.scrollbar}`}
    >
      <div className={sidebarStyle.container}>
        <div className="sticky top-0 z-10 mb-6 flex items-center justify-center bg-gray-900 pb-6 pt-3">
          <img src="/images/2.png" width={80} height={90} alt="Enoch Ndika" />
        </div>
        <SidebarItems />
      </div>
    </aside>
  );
};

export default Sidebar;
