import React, { useState } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faUpload } from "@fortawesome/free-solid-svg-icons";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

interface UploadMainContentProps {
  title: string;
  // eslint-disable-next-line unused-imports/no-unused-vars
  onFileUpload: (file: File, fileName: string) => void; // Update the function signature
}

export function UploadMainContent(props: UploadMainContentProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [fileName, setFileName] = useState<string>(""); // State for file name input

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null); // Ensure it's not undefined
  };

  const handleUploadClick = () => {
    if (selectedFile) {
      console.log(selectedFile);
      if (fileName.trim() === "") {
        toast.error("Please enter a file name."); // Validate file name
      } else {
        props.onFileUpload(selectedFile, fileName); // Pass file name to the function
        setSelectedFile(null); // Clear the selected file after upload
        setFileName(""); // Clear the file name input
      }
    } else {
      toast.error("Please select a file to upload.");
    }
  };

  return (
    <div className="w-full rounded-3xl bg-gray-800 p-6 lg:w-8/12">
      <div className="mb-8 flex items-center justify-between text-white">
        <p className="mb-10 text-2xl font-bold">{props.title}</p>
      </div>
      <div className="text-white">
        <div className="flex flex-col justify-center text-center text-white">
          <label className="mb-2 flex justify-center text-lg">
            <div
              className="w-28 cursor-pointer rounded-full border-2 border-blue-500 p-5 hover:bg-blue-900"
            >
              <FontAwesomeIcon icon={faUpload} size="3x" className="text-blue-500" />
            </div>
            <input
              id="fileInput"
              type="file"
              name="sampleFile" // <-- Add this line
              accept=".zip,.pdf,image/*"
              onChange={handleFileChange}
              className="mb-10 hidden"
            />
          </label>
          <p className="my-4">Click the icon to upload a Zip File</p>
          <div className="mb-6">
            {selectedFile ? (
              <p className="text-gray-400">Selected File: {selectedFile.name}</p>
            ) : (
              <p className="text-gray-400">No File Selected</p>
            )}
          </div>
        </div>
        <div className="mb-4">
          {/* Input for file name */}
          <input
            type="text"
            placeholder="Enter File Name"
            value={fileName}
            onChange={(e) => setFileName(e.target.value)}
            className="mt-6 w-full rounded-lg border border-gray-300 px-4 py-2 text-black placeholder:text-gray-500 focus:border-transparent focus:outline-none focus:ring-2 focus:ring-blue-600"
          />
        </div>
        <button
          onClick={handleUploadClick}
          className="mt-3 w-full rounded-full bg-blue-500 px-4 py-2 font-bold text-white hover:bg-blue-700"
        >
          Upload
        </button>
      </div>
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}