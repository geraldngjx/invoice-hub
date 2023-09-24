const mongoose = require("mongoose");
const { Schema } = mongoose;

const DataSchema = new Schema({
  data: Schema.Types.Mixed, // This allows us to store any JSON object
  fileName: String,
  createdOn: Date,
  fileType: {
    type: String,
  },
});

const ExtractedData =
  (mongoose.models ? mongoose.models.ExtractedData : null) ||
  mongoose.model("ExtractedData", DataSchema);

module.exports = ExtractedData;
