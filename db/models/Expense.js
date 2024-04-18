const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ExpenseSchema = new Schema({
  _id: { type: String, required: true },
  client_id: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  schedule_id: { type: Schema.Types.ObjectId, ref: "Schedule"},
  invoice_id: { type: Schema.Types.ObjectId, ref: "Invoice"},
  cost: { type: Number, required: true },
  status: {
    type: String,
    enum: ["shopping", "medical", "unknown"],
    default: "unknown",
  },
});

ExpenseSchema.virtual("url").get(function () {
  return `/expenses/${this._id}`;
});

// Export model
module.exports = mongoose.model("Expense", ExpenseSchema);
