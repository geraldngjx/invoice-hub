import axios from "axios";
import multer from "multer";
import AdmZip from "adm-zip";
require("dotenv").config();

const url = process.env.PARSE_INVOICE_URL;

export const config = {
  api: {
    bodyParser: false,
  },
};

const storage = multer.memoryStorage();
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

      let results = [];

      async function processSingleFile(buffer, filetype) {
        const image_base64 = buffer.toString("base64");
        const payload = { image: image_base64, filetype }; // include filetype in the payload
        try {
          const response = await axios.post(url, payload);
          return { ...response.data, filetype }; // include filetype in the response
        } catch (error) {
          return { success: false, error: error.message, filetype }; // include filetype in the error response
        }
      }

      if (data.mimetype === "application/zip") {
        const zip = new AdmZip(data.buffer);
        const zipEntries = zip.getEntries();

        for (const entry of zipEntries) {
          if (!entry.isDirectory) {
            const fileBuffer = entry.getData();
            // Extract file type from entry name
            const filetype =
              entry.entryName.split(".").pop()?.toUpperCase() || "UNKNOWN";
            results.push(await processSingleFile(fileBuffer, filetype));
          } else {
            results.push({
              success: false,
              error: "Directory found in zip, skipping.",
            });
          }
        }
      } else {
        // For non-zip files, directly process the file
        const filetype =
          data.originalname.split(".").pop()?.toUpperCase() || "UNKNOWN";
        results.push(await processSingleFile(data.buffer, filetype));
      }

      return res.status(200).json(results);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
