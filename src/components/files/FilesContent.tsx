import { SidePanel } from "../SidePanel";
import { FilesMainContent } from "./FilesMainContent";

interface ContentProps {
  title: string;
}

export function FilesContent(props: ContentProps) {

  // Mock data for testing
  const mockFiles = [
    {
      name: "Document 1",
      createdOn: "2023-09-25",
      type: "PDF",
    },
    {
      name: "Presentation",
      createdOn: "2023-09-24",
      type: "PPT",
    },
    {
      name: "Spreadsheet",
      createdOn: "2023-09-23",
      type: "XLS",
    },
    {
      name: "Image 1",
      createdOn: "2023-09-22",
      type: "JPG",
    },
    {
      name: "Document 2",
      createdOn: "2023-09-21",
      type: "PDF",
    },
  ];

  return (
    <div className="flex flex-wrap">
      <FilesMainContent title={props.title} files={mockFiles}/>
      <SidePanel />
    </div>
  );
}