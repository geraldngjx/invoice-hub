import { SidePanel } from "../SidePanel";
import { FilesMainContent } from "./FilesMainContent";

interface ContentProps {
  title: string;
  files: File[];
}

export function FilesContent(props: ContentProps) {
  const mockJSONData = {
    header1: "value1",
    header2: "value2",
    header3: "value3",
    parse() {
      return Object.values(this);
    },
    stringify() {
      return Object.values(this).join(",");
    },
    [Symbol.toStringTag]: "Object",
  };
  const files = props;

  return (
    <div className="flex h-full flex-wrap">
      <FilesMainContent title={props.title} files={files.files} />
      <SidePanel />
    </div>
  );
}
