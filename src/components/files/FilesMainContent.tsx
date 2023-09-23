import React, { useState } from "react";
import { saveAs } from "file-saver";

interface File {
  name: string;
  createdOn: string;
  type: string;
  data: JSON[];
}

interface FilesMainContentProps {
  title: string;
  files: File[]; // Array of File objects
}

export function FilesMainContent(props: FilesMainContentProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  const filteredFiles = props.files.filter((file) =>
    file.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const convertDataToCSV = (jsonData: JSON[]) => {
    const csvRows = [];

    // Extract headers from the first object
    const headers = Object.keys(jsonData[0]);
    csvRows.push(headers.join(","));

    // Loop through each JSON object and convert it to a CSV row
    for (const row of jsonData) {
      const values = headers.map((header: string) => row[header as keyof typeof row]);
      csvRows.push(values.join(","));
    }

    return csvRows.join("\n");
  };

  // Function to handle the download button click
  const handleDownloadClick = (file: File) => {
    const csvData = convertDataToCSV(file.data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${file.name}.csv`);
  };

  return (
    <div className="h-full w-full overflow-y-auto rounded-3xl bg-gray-800 p-6 lg:w-8/12">
      <div className="mb-8 flex items-center justify-between text-white">
        <p className="text-2xl font-bold">{props.title}</p>
      </div>
      <div className="mt-8">
        <input
          type="text"
          placeholder="Search files by name"
          className="mb-5 w-full rounded-md bg-gray-700 p-2 text-white"
          value={searchTerm}
          onChange={handleSearchChange}
        />
        {/* Display Filtered File List */}
        <ul className="mt-2">
          {filteredFiles.map((file, index) => (
            <li
              key={index}
              className="mb-2 flex items-center justify-between rounded-md bg-gray-700 p-4"
            >
              <div>
                <p className=" text-lg font-semibold text-white">{file.name}</p>
                <p className="text-sm text-gray-400">Type: {file.type}</p>
                <p className="text-sm text-gray-400">Created On: {file.createdOn}</p>
              </div>
              <div>
                <button
                  onClick={() => handleDownloadClick(file)} // Call the download function with the file data
                  className="mr-4 text-lg text-blue-500 hover:text-blue-700"
                >
                  Download
                </button>
                <button className="mr-2 text-lg text-red-500 hover:text-red-700">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}