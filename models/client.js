const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ClientSchema = new Schema({
  first_name: { type: String, required: true, maxLength: 100 },
  family_name: { type: String, required: true, maxLength: 100 },
  address: { type: String, maxLength: 400 },
  email: { type: String, maxLength: 300 },
  ndis_number: { type: Number },
  phone_number: { type: String, maxLength: 100 },
});

// Virtual for client's full name
ClientSchema.virtual("name").get(function () {
  // To avoid errors in cases where an client does not have either a family name or first name
  // We want to make sure we handle the exception by returning an empty string for that case
  let fullname = "";
  if (this.first_name && this.family_name) {
    fullname = `${this.family_name}, ${this.first_name}`;
  }

  return fullname;
});

// Virtual for client's URL
ClientSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/client/${this._id}`;
});

// Export model
module.exports = mongoose.model("Client", ClientSchema);
