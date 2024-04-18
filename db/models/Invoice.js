const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const InvoiceSchema = new Schema({
  invoice_id: { type: String, required: true },
  invoice_type: {
    type: String,
    required: true,
    enum: ["ndis", "abn"],
    default: "ndis",
  },
  date: { type: Date, required: true },
  client_id: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  client_fullname: { type: String, required: true },
  client_address: { type: String, required: true },
  client_number: { type: String, required: true },
  user_fullname: { type: String, required: true },
  user_bsb: { type: String, required: true },
  user_account: { type: String, required: true },
  user_bank: { type: String, required: true },
  user_abn: { type: String, required: true },
  user_phone: { type: String, required: true },
  user_email: { type: String, required: true },
  user_address: { type: String, required: true },
  service: [{
    service_date: { type: Date, required: true },
    line_number: { type: String },
    description: { type: String },
    km: { type: Number },
    km_rate: { type: Number },
    hour: { type: Number, required: true },
    hour_rate: { type: Number, required: true },
  },{ _id: true }],
  status: {
    type: String,
    required: true,
    enum: ["completed", "incomplete"],
    default: "incomplete",
  },
},{ _id: true });

InvoiceSchema.virtual("url").get(function () {
  return `/invoices/${this._id}`;
});

// Export model
module.exports = mongoose.model("Invoice", InvoiceSchema);
