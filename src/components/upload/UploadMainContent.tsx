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
  const [uploading, setUploading] = useState<boolean>(false); // New state for upload progress
  const [showPopup, setShowPopup] = useState<boolean>(false); // New state for displaying the popup

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    setSelectedFile(file || null); // Ensure it's not undefined
  };

  const handleUploadClick = async () => {
    if (selectedFile) {
      if (fileName.trim() === "") {
        toast.error("Please enter a file name.");
      } else {
        setShowPopup(true); // Display the popup when uploading starts
        setUploading(true); // Set uploading to true
        try {
          // Simulate the upload process (replace this with your actual upload logic)
          await props.onFileUpload(selectedFile, fileName);
          // Upload completed successfully
          setSelectedFile(null);
          setFileName("");
          setShowPopup(false); // Hide the popup when uploading is done
        } catch (error) {
          // Handle any errors during the upload process
          console.error("Error uploading file:", error);
          toast.error("Upload failed.");
          setShowPopup(false); // Hide the popup on error
        } finally {
          setUploading(false); // Set uploading to false
        }
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
      {/* Display the popup while uploading */}
      {showPopup && (
        <div className="fixed left-0 top-0 z-50 flex h-screen w-screen items-center justify-center bg-black bg-opacity-70">
          <div className="rounded bg-white p-10 text-center shadow-lg">
            <p className="text-lg font-semibold">Uploading in Progress</p>
            <p className="text-sm text-gray-600">
              Please do not leave this page.
            </p>
          </div>
        </div>
      )}
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}