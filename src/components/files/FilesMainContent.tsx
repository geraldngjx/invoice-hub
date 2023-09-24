import React, { useState, useEffect } from "react";
import ExcelJS from "exceljs";
import axios from "axios";

interface DataItem {
  item_description: string;
  item_quantity: string;
  item_price: string;
  item_total: string;
  tax_amount: string;
}

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
  const [isLoading, setIsLoading] = useState(true); // Track loading state

  useEffect(() => {
    // When the files are fetched, set isLoading to false
    if (props.files) {
      setIsLoading(false);
    }
  }, [props.files]);

  const filteredFiles = Array.isArray(props.files)
    ? props.files.filter((file) =>
      file.fileName?.toLowerCase().includes(searchTerm.toLowerCase())
    )
    : [];

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchTerm(e.target.value);
  };

  useEffect(() => {
    // Loop over each file to check if invoices are done processing
    props.files.forEach(file => {
      if (file.invoices.length > 0) {
        window.location.reload();
        // Perform any additional logic you need here
      }
    });
  }, [props.files]);

  const createWorkbookFromFiles = (files : any) => {
    console.log(files);
    const workbook = new ExcelJS.Workbook();

    // Create INVOICES sheet
    const invoicesSheet = workbook.addWorksheet("INVOICES");

    // Define columns with a specific width
    invoicesSheet.columns = [
      { header: "Invoice Number", key: "invoice_number", width: 15 },
      { header: "Date", key: "invoice_date", width: 10 },
      { header: "Buyer", key: "bill_from", width: 15 },
      { header: "Seller", key: "bill_to", width: 15 },
      { header: "Amount", key: "amount_due", width: 10 },
      { header: "Tax Amount", key: "tax_amount", width: 10 },
      { header: "Total Spent", key: "grand_total", width: 12 },
      {
        header: "Transaction description",
        key: "transaction_description",
        width: 25,
      },
    ];

    // Loop through each InvoiceCollection document
    files.invoices.forEach((invoice : any) => {
      const invoiceData = invoice.data;
      // Loop through each invoice in the invoices array of the InvoiceCollection document
      // file.invoices.forEach((invoice) => {
      // Add each invoice as a row to the worksheet
      invoicesSheet.addRow({
        invoice_number: invoiceData.invoice_number,
        invoice_date: invoiceData.invoice_date,
        bill_from: invoiceData.bill_from,
        bill_to: invoiceData.bill_to,
        amount_due: invoiceData.amount_due,
        tax_amount: invoiceData.tax_amount,
        grand_total: invoiceData.grand_total,
        transaction_description: invoiceData.transaction_description,
        // });
      });
    });

    // After creating and populating the workbook
    workbook.xlsx.writeBuffer().then((buffer) => {
      const blob = new Blob([buffer], {
        type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
      });
      const link = document.createElement("a");
      link.href = window.URL.createObjectURL(blob);
      link.download = "invoices.xlsx"; // You can modify the name of the downloaded file here
      document.body.appendChild(link); // Required for Firefox
      link.click();
      document.body.removeChild(link);
    });
  };

  const handleDeleteClick = async (fileName: string) => {
    try {
      await axios.delete(
        `http://localhost:3000/api/invoiceCollections?fileName=${fileName.fileName}`
      );
      window.location.reload();
    } catch (error) {
      console.error("Error deleting the file:", error);
    }
  };

  const handleDownloadClick = (file: File) => {
    createWorkbookFromFiles(file);
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
        {isLoading ? ( // Display loading spinner when isLoading is true
          <div className="flex h-40 items-center justify-center text-white">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <ul className="mt-2">
            {filteredFiles.map((file) => (
              <li
                key={file._id}
                className="mb-2 flex items-center justify-between rounded-md bg-gray-700 p-4"
              >
              <div>
                <p className="text-lg font-semibold text-white">{file.fileName}</p>
                <p className="text-sm text-gray-400">Created On: {file.createdOn}</p>
              </div>
              <div>
                {
                  (file.invoices.length > 0) ? (
                    <button onClick={() => handleDownloadClick(file)} className="mr-4 text-lg text-blue-500 hover:text-blue-700">
                      Download
                    </button>
                  ) : (
                    <span className="mr-4 text-lg text-gray-400">Processing Invoices</span>
                  )
                }
                <button
                  onClick={() => handleDeleteClick(file)}
                  className="mr-2 text-lg text-red-500 hover:text-red-700"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
        )}
      </div>
    </div>
  );
}
