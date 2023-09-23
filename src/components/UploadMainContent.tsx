import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";

interface UploadMainContentProps {
  title: string;
  onFileUpload: (file: File) => void;
}

export function UploadMainContent(props: UploadMainContentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null); // Ensure it's not undefined
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      props.onFileUpload(selectedFile);
      setSelectedFile(null); // Clear the selected file after upload
    } else {
      alert("Please select a file to upload.");
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gray-800 p-6 lg:w-8/12">
      <div className="mb-8 flex items-center justify-between text-white">
        <p className="text-2xl font-bold">{props.title}</p>
      </div>
      <div className="text-white">
        <div className="text-white text-center">
            <label className="text-lg mb-2">
                <FontAwesomeIcon icon={faUpload} size="3x" />
                <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="hidden"
                />
            </label>
            <p>Click the icon to upload a Zip File</p>
            </div>
            <button
            onClick={handleUploadClick}
            className="mt-4 bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded-full w-full"
            >
            Upload
            </button>
        </div>
    </div>
  );
}