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

      const zip = new AdmZip(data.buffer);
      const zipEntries = zip.getEntries();

      const BATCH_SIZE = 5; // You can adjust the batch size as per your requirement and observation

      async function processBatch(batch) {
        return await Promise.all(
          batch.map(async (entry) => {
            if (entry.isDirectory)
              return {
                success: false,
                error: "Directory found in zip, skipping.",
              };

            const fileBuffer = entry.getData();
            const image_base64 = fileBuffer.toString("base64");
            const payload = { image: image_base64 };

            try {
              const response = await axios.post(url, payload);
              return response.data;
            } catch (error) {
              return { success: false, error: error.message };
            }
          })
        );
      }

      async function processEntriesInBatches(zipEntries) {
        const results = [];

        for (let i = 0; i < zipEntries.length; i += BATCH_SIZE) {
          const batch = zipEntries.slice(i, i + BATCH_SIZE);
          const batchResults = await processBatch(batch);
          results.push(...batchResults);
        }

        return results;
      }

      const results = await processEntriesInBatches(zipEntries);

      //   const successfulResults = results.filter(
      //     (result) => result.success !== false
      //   );
      const successfulResults = results;

      return res.status(200).json(successfulResults);
    } catch (error) {
      console.error("Error:", error);
      return res.status(500).json({ error: "Internal Server Error" });
    }
  } else {
    res.status(405).end();
  }
}
