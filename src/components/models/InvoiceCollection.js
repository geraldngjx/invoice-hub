const mongoose = require("mongoose");
const { Schema } = mongoose;

const InvoiceCollectionSchema = new Schema({
  invoices: Schema.Types.Mixed, // Array of DataSchema to store multiple invoices in a single document
  fileName: String, // Field to store the fileName
  createdOn: {
    type: Date,
    default: Date.now,
  },
});

const InvoiceCollection =
  (mongoose.models ? mongoose.models.InvoiceCollection : null) ||
  mongoose.model("InvoiceCollection", InvoiceCollectionSchema);

module.exports = InvoiceCollection;
