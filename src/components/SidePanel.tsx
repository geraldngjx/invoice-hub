import React from "react";
import { useState, useEffect } from "react";
import { useFetchAllFileContents } from "../components/utils/fetchAllFileContents";
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
  name: string;
  createdOn: string;
  type: string;
  data: Data; // Changed from JSON[] to Data
}

interface SidePanel {
  files: File[]; // Array of File objects, each containing JSON data
}

export function SidePanel() {
  const [isLoading, setIsLoading] = useState(true); // Track loading state
  const { files, error } = useFetchAllFileContents();

  useEffect(() => {
    // When the data is fetched, set isLoading to false
    if (files || error) {
      setIsLoading(false);
    }
  }, [files, error]);


  return (
    <div className="mt-8 w-full lg:mt-0 lg:w-4/12 lg:pl-4">
      <div className="rounded-3xl bg-gray-800 px-6 pt-6">
        <div className="flex pb-6 text-2xl font-bold text-white">
          <p>Latest Invoices</p>
        </div>
        {isLoading ? ( // Display loading indicator when isLoading is true
          <div className="flex h-40 items-center justify-center text-white">
            <div className="h-6 w-6 animate-spin rounded-full border-b-2 border-t-2 border-blue-500"></div>
          </div>
        ) : (
          <div>
            {/* display last 5 invoices */}
            {Array.isArray(files) && files.slice(-3).map((file) => (
              <div
                key={file.data.invoice_number}
                className="flex w-full border-t border-gray-700 p-2 hover:bg-gray-700 2xl:items-start"
              >
                <div className="w-full pl-4">
                  {/* can handle this part slightly better */}
                  <div
                    className={`mb-2 text-lg font-medium text-white ${
                      file.data.bill_to === "inflow" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {"Invoice #" + file.data.invoice_number}
                  </div>
                  <div
                    className={`mb-2 font-medium text-white ${
                      file.data.bill_to === "inflow" ? "text-green-500" : "text-red-500"
                    }`}
                  >
                    {file.data.transaction_description
                      ? file.data.transaction_description
                      : "No description"}
                  </div>
                  <div className="text-sm text-gray-400">
                    Amount:{" "}
                    <span className="text-white">{file.data.grand_total}</span>
                  </div>
                  <p className="mb-4 text-right text-sm text-gray-400">
                    {file.data.invoice_date}
                  </p>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}