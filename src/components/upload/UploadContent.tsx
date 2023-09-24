import { SidePanel } from "../SidePanel";
import { UploadMainContent } from "./UploadMainContent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface ContentProps {
  title: string;
}

export function UploadContent(props: ContentProps) {

  const handleFileUpload = async (file: File, fileName: string) => {
    try {
      // Create a FormData object to send the file

      const formData = new FormData();
      formData.append("sampleFile", file, fileName); // use fileName here if needed


      //pre-create InvoiceCollection Object
      const initialResponse = await axios.post("/api/invoiceCollections", { fileName, invoices: [] });
      if (!initialResponse.data.success) throw new Error("Initial save failed");


      // Send a POST request to the server
      const response = await fetch("/api/parseInvoice", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle the error if the request is not successful
        throw new Error(`Upload failed with status ${response.status}`);
      }

      // Parse the JSON response
      const result = await response.json();


      if (result) {
        console.log("This is result: ", result);
        // Extract fileType from fileName
        const fileType = result.fileType || fileName.split(".").pop()?.toUpperCase() || "UNKNOWN";

        // Format data to be saved to MongoDB
        const dataToSave = result.map((doc: any) => ({
          data: doc,
          fileName,
          createdOn: new Date(),
          fileType,
        }));

        // Save the formatted data to MongoDB
        saveToMongoDB(dataToSave, fileName);
        // Indicate successful upload
        console.log("Upload successful");
        toast.success("Upload Successful");
      } else {
        // Handle the case where the response indicates failure
        console.error("Upload failed:", result.message);
        throw new Error(result.message);
      }
    } catch {
      toast.error("Upload failed");
    }
  };

  /**
 * Save an object to MongoDB
 * @param {Object} obj - The object to be saved
 */
  async function saveToMongoDB(obj: any, fileName: string) {
    try {
      // 1. Save each individual invoice
      const individualSavePromises = obj.map((invoice: any) =>
        axios.post("/api/save", invoice)
      );

      await Promise.all(individualSavePromises);
      console.log("All individual invoices have been saved successfully.");

      // 2. Save the collection of invoices in one Document
      const collectionSaveResponse = await axios.put("/api/invoiceCollections", { invoices: obj, fileName });
      console.log("Invoice collection has been saved successfully:", collectionSaveResponse.data);
    } catch (error) {
      console.error("Error saving data:", error);
    }
  }

  return (
    <div className="flex flex-wrap">
      <UploadMainContent title={props.title} onFileUpload={handleFileUpload} />
      <SidePanel />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
