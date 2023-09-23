import Data from "../../components/models/ExtractedData";

export default async function handler(req, res) {
  if (req.method === "POST") {
    try {
      const data = new Data(req.body);
      await data.save();

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
