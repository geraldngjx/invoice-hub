import React from "react";
import { useFetchAllFileContents } from "../../components/utils/fetchAllFileContents";

import { FilesContent } from "../../components/files/FilesContent";

export default function FilesPage() {

  const { files, error } = useFetchAllFileContents();

  return <FilesContent title="Files" files={files} />;
}