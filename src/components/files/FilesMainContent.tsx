import React, { useState } from "react";
import { saveAs } from "file-saver";

interface Data {
  bill_to: string;
  items: DataItem[];
  amount_due: string;
  tax_amount: string;
  bill_from: string;
  invoice_number: string;
  invoice_date: string;
  grand_total: string;
  transaction_description: string;
}


interface File {
  _id: string;
  fileName: string;
  createdOn: string;
  fileType: string;
  data: Data;
}

interface FilesMainContentProps {
  title: string;
  files: File[]; // Array of File objects
}



export function FilesMainContent(props: FilesMainContentProps) {
  const [searchTerm, setSearchTerm] = useState<string>("");

  console.log(props.files);

  const filteredFiles = Array.isArray(props.files)
    ? props.files.filter((file) => file.fileName?.toLowerCase().includes(searchTerm.toLowerCase()))
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  const convertDataToCSV = (fileData: Data) => {
    const headers = [
      "invoice_number",
      "invoice_date",
      "bill_from",
      "bill_to",
      "amount_due",
      "tax_amount",
      "grand_total",
      "transaction_description",
    ];

    const values = headers.map(header => fileData[header as keyof Data] || "");
    return `${headers.join(",")}\n${values.join(",")}`;
  };


  const handleDownloadClick = (file: File) => {
    const csvData = convertDataToCSV(file.data);
    const blob = new Blob([csvData], { type: "text/csv;charset=utf-8" });
    saveAs(blob, `${file.fileName}.csv`);
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
        <ul className="mt-2">
          {filteredFiles.map((file) => (
            <li
              key={file._id}
              className="mb-2 flex items-center justify-between rounded-md bg-gray-700 p-4"
            >
              <div>
                <p className="text-lg font-semibold text-white">{file.fileName}</p>
                <p className="text-sm text-gray-400">Type: {file.fileType}</p>
                <p className="text-sm text-gray-400">Created On: {file.createdOn}</p>
              </div>
              <div>
                <button
                  onClick={() => handleDownloadClick(file)}
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
