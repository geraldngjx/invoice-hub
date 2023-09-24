import { SidePanel } from "../SidePanel";
import { UploadMainContent } from "./UploadMainContent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

// import ExtractedData from "../models/ExtractedData";

interface ContentProps {
  title: string;
}

export function UploadContent(props: ContentProps) {

  const handleFileUpload = async (file: File, fileName: string) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("sampleFile", file, fileName); // use fileName here if needed

      // Send a POST request to the server
      const response = await fetch("http://localhost:3000/api/parseInvoice", {
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
        saveToMongoDB(dataToSave);
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
  async function saveToMongoDB(obj: any) {
    console.log(obj);
    console.log("testing");
    axios.post("http://localhost:3000/api/save", obj) // TODO: adjust the URL later
      .then(response => {
        console.log("Data saved successfully:", response.data);
      })
      .catch(error => {
        console.error("Error saving data:", error);
      });
  }

  // // testData
  // const testData = new ExtractedData({
  //   data: { key: "value" },
  //   fileName: "someFile.pdf",
  //   createdOn: new Date(),
  //   fileType: "PDF",
  // });

  // saveToMongoDB(testData);

  return (
    <div className="flex flex-wrap">
      <UploadMainContent title={props.title} onFileUpload={handleFileUpload} />
      <SidePanel />
      <ToastContainer position="bottom-right" autoClose={3000} />
    </div>
  );
}
