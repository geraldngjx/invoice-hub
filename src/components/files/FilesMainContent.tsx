import React, { useState } from "react";

interface File {
  name: string;
  createdOn: string;
  type: string;
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

  return (
    <div className="w-full rounded-3xl bg-gray-800 p-6 lg:w-8/12">
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
              className="mb-2 flex items-center justify-between rounded-md bg-gray-700 p-2"
            >
              <div>
                <p className="font-semibold text-white">{file.name}</p>
                <p className="text-sm text-gray-400">Type: {file.type}</p>
                <p className="text-sm text-gray-400">Created On: {file.createdOn}</p>
              </div>
              <div>
                <button className="mr-2 text-blue-500 hover:text-blue-700">
                  Download
                </button>
                <button className="text-red-500 hover:text-red-700">Delete</button>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}