import React, { useState, useEffect } from "react";
import axios from "axios";

import { FilesContent } from "../../components/files/FilesContent";

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

export default function FilesPage() {
  const [files, setFiles] = useState<File[]>([]);
  const [error, setError] = useState<Error | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/fetchZipFiles"); // Use a relative URL here
        if (response.status !== 200) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        console.log(response.data.data);
        setFiles(response.data.data);
      } catch (error: any) {
        if (error instanceof Error) {
          console.error("There has been a problem with your fetch operation:", error.message);
          setError(error);
        } else {
          console.error("An unknown error occurred");
        }
      }
    };
    fetchData();
  }, []);

  return <FilesContent title="Files" files={files} />;
}