const mongoose = require("mongoose");
const { Schema, model } = mongoose;

const ClientSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  address: { type: String, maxLength: 400 },
  email: { type: String, maxLength: 300 },
  ndis_number: { type: String, maxLength: 100 },
  abn: { type: String, maxLength: 100 },
  phone_number: { type: String, maxLength: 100 },
});

// Virtual for client's URL
ClientSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/client/${this._id}`;
});

// Export model
module.exports = mongoose.model("Client", ClientSchema);
