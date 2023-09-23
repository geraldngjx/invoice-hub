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
        <p className="mb-10 text-2xl font-bold">{props.title}</p>
      </div>
      <div className="text-white">
        <div className="flex flex-col justify-center text-center text-white">
            <label className="mb-2 text-lg">
                <FontAwesomeIcon icon={faUpload} size="3x" />
                <input
                type="file"
                accept=".zip"
                onChange={handleFileChange}
                className="mb-10 hidden"
                />
            </label>
            <p className="my-10">Click the icon to upload a Zip File</p>
            </div>
            <button
            onClick={handleUploadClick}
            className="mt-10 w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
            >
            Upload
            </button>
        </div>
    </div>
  );
}