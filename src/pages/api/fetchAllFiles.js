import Data from "../../components/models/ExtractedData";
import dbConnect from "../../components/utils/mongoDB"; // Replace with your actual connection utility

export default async function fetchAllFiles(req, res) {
  await dbConnect(); // Ensure the database is connected

  switch (req.method) {
    case "POST":
      try {
        const data = new Data(req.body);
        await data.save();
        return res
          .status(200)
          .json({ success: true, data: "Data saved successfully" });
      } catch (error) {
        console.error("API POST Error", error.stack); // Log the stack trace
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }

    case "GET":
      try {
        const data = await Data.find({});
        return res.status(200).json({ success: true, data });
      } catch (error) {
        console.error("API GET Error", error.stack); // Log the stack trace
        return res
          .status(500)
          .json({ success: false, message: "Internal Server Error" });
      }

    default:
      res.setHeader("Allow", ["POST", "GET"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
  }
}
