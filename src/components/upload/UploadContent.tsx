import { SidePanel } from "../SidePanel";
import { UploadMainContent } from "./UploadMainContent";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import axios from "axios";

interface ContentProps {
  title: string;
}

export function UploadContent(props: ContentProps) {

  const handleFileUpload = async (file: File) => {
    try {
      // Create a FormData object to send the file
      const formData = new FormData();
      formData.append("file", file);

      // Send a POST request to the server
      const response = await fetch("https://mockurl.com/parse", {
        method: "POST",
        body: formData,
      });

      if (!response.ok) {
        // Handle the error if the request is not successful
        throw new Error(`Upload failed with status ${response.status}`);
      }

      // Parse the JSON response
      const result = await response.json();

      // Check if the response indicates success
      if (result.success) {

        // Save the CSV data to MongoDB 
        saveToMongoDB(result.data);

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
    axios.post("http://localhost:3000/api/save", obj) // TODO: adjust the URL later
      .then(response => {
        console.log("Data saved successfully:", response.data);
      })
      .catch(error => {
        console.error("Error saving data:", error);
      });
  }

  //testData
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
