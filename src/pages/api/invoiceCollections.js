import InvoiceCollection from "../../components/models/InvoiceCollection";

export default async function handleInvoiceCollections(req, res) {
  try {
    if (req.method === "POST") {
      // Handle POST request
      const { invoices, fileName } = req.body;
      const dataArray = Array.isArray(invoices) ? invoices : [invoices];

      const newInvoiceCollection = new InvoiceCollection({
        invoices: dataArray,
        fileName,
      });
      await newInvoiceCollection.save();

      res
        .status(200)
        .json({
          success: true,
          message: "Invoice collection saved successfully",
        });
    } else if (req.method === "PUT") {
      // Handle PUT request
      const { fileName, invoices } = req.body;
      const invoiceCollection = await InvoiceCollection.findOne({
        fileName,
      }).sort({ createdOn: -1 });

      if (!invoiceCollection)
        return res
          .status(404)
          .json({ success: false, message: "Invoice Collection not found" });
      invoiceCollection.invoices = invoices;
      await invoiceCollection.save();

      res
        .status(200)
        .json({
          success: true,
          message: "Invoice collection updated successfully",
        });
    } else if (req.method === "DELETE") {
      // Handle DELETE request
      const { fileName } = req.query;
      await InvoiceCollection.findOneAndDelete({ fileName });

      res
        .status(200)
        .json({
          success: true,
          message: "Invoice collection deleted successfully",
        });
    } else {
      // Handle unexpected HTTP method
      res.setHeader("Allow", ["POST", "PUT", "DELETE"]);
      res.status(405).end(`Method ${req.method} Not Allowed`);
    }
  } catch (error) {
    console.error("API Error", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
}
