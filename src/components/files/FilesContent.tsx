import { SidePanel } from "../SidePanel";
import { FilesMainContent } from "./FilesMainContent";

interface ContentProps {
  title: string;
  files: File[]; // Array of File objects
}

export function FilesContent(props: ContentProps) {

  const mockJSONData = {
    "header1": "value1",
    "header2": "value2",
    "header3": "value3",
    parse() {
      return Object.values(this);
    },
    stringify() {
      return Object.values(this).join(",");
    },
    [Symbol.toStringTag]: "Object",
  };

  // Mock data for testing
  const mockFiles = [
    {
      name: "Document 1",
      createdOn: "2023-09-25",
      type: "PDF",
      data: [mockJSONData],
    },
    {
      name: "Presentation",
      createdOn: "2023-09-24",
      type: "PPT",
      data: [mockJSONData],
    },
    {
      name: "Spreadsheet",
      createdOn: "2023-09-23",
      type: "XLS",
      data: [mockJSONData],
    },
    {
      name: "Image 1",
      createdOn: "2023-09-22",
      type: "JPG",
      data: [mockJSONData],
    },
    {
      name: "Document 2",
      createdOn: "2023-09-21",
      type: "PDF",
      data: [mockJSONData],
    },
  ];

  return (
    <div className="flex flex-wrap">
      <FilesMainContent title={props.title} files={mockFiles}/>
      <SidePanel />
    </div>
  );
}