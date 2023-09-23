import axios from "axios";
import multer from "multer";
require("dotenv").config();

const url = process.env.PARSE_INVOICE_URL;

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage(); // Store the file in memory
const upload = multer({ storage: storage });

export default async function parseInvoice(req, res) {
  if (req.method === "POST") {
    try {
      const data = await new Promise((resolve, reject) => {
        upload.single("sampleFile")(req, res, (err) => {
          if (err) return reject(err);
          resolve(req.file);
        });
      });

      const image_base64 = data.buffer.toString("base64");
      const payload = { image: image_base64 };

      const response = await axios.post(url, payload);

      if (response.status === 200) {
        console.log(data);
        return res.status(200).json(response.data);
      } else {
        return res.status(response.status).json(response.data);
      }
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    // Handle any other HTTP method
    res.status(405).end();
  }
}
