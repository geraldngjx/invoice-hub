import { SidePanel } from "./SidePanel";
import { UploadMainContent } from "./UploadMainContent";

interface ContentProps {
  title: string;
}

export function UploadContent(props: ContentProps) {

  const handleFileUpload = (file: File) => {
    // Handle the uploaded file here, e.g., send it to an external API
    console.log("Uploaded file:", file.name);
  };

  return (
    <div className="flex flex-wrap">
      <UploadMainContent title={props.title} onFileUpload={handleFileUpload}/>
      <SidePanel />
    </div>
  );
}
