import React, { useEffect, useState } from "react";
import axios from "axios";
import { FilesContent } from "../../components/files/FilesContent";

export default function FilesPage() {
  const [files, setFiles] = useState([]);

  // Edit this function to query mongodb for files
  useEffect(() => {
    // Replace 'your-mongodb-api-url' with the actual MongoDB API URL
    axios.get("your-mongodb-api-url")
      .then((response: any) => {
        // Assuming the API response contains the files data as an array
        setFiles(response.data);
      })
      .catch((error: any) => {
        console.error("Error fetching data:", error);
      });
  }, []);

  return <FilesContent title="Files" files={files} />;
}