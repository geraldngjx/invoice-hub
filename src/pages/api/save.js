import Data from "../../components/models/ExtractedData";

export default async function save(req, res) {
  if (req.method === "POST") {
    try {
      const dataArray = Array.isArray(req.body) ? req.body : [req.body]; // Ensure it is an array

      // Filter out objects where success is false
      const validDataArray = dataArray.filter(
        (item) => item.data.success !== false
      );

      await Data.insertMany(validDataArray); // Use insertMany to save all valid documents in the dataArray

      return res
        .status(200)
        .json({ success: true, data: "Data saved successfully" });
    } catch (error) {
      console.error("API Error", error);
      return res
        .status(500)
        .json({ success: false, message: "Internal Server Error" });
    }
  } else {
    // Handle any other HTTP method
    res.setHeader("Allow", ["POST"]);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
