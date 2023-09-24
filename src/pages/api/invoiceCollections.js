import InvoiceCollection from "../../components/models/InvoiceCollection";

export default async function saveInvoiceCollection(req, res) {
  if (req.method === "POST") {
    try {
      console.log(req.body);
      const dataArray = Array.isArray(req.body.invoices)
        ? req.body.invoices
        : [req.body.invoices]; // Ensure it is an array
      const fileName = req.body.fileName;

      // Filter out objects where success is false and map to Data model
      //   const validDataArray = dataArray
      //     .filter((item) => item.invoices !== false)
      //     .map((item) => new Data(item));

      const newInvoiceCollection = new InvoiceCollection({
        invoices: dataArray,
        fileName: fileName,
      });

      await newInvoiceCollection.save();

      return res.status(200).json({
        success: true,
        message: "Invoice collection saved successfully",
      });
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
