const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AppointmentSchema = new Schema({
  title: { type: String, required: true },
  client: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  start_date: { type: Date, required: true },
  end_date: { type: Date, required: true },
  status: {
    type: String,
    required: true,
    enum: ["Compeleted", "Incomplete"],
    default: "Incomplete",
  },
});

// Virtual for book's URL
AppointmentSchema.virtual("url").get(function () {
  // We don't use an arrow function as we'll need the this object
  return `/catalog/appointment/${this._id}`;
});

// Export model
module.exports = mongoose.model("Appointment", AppointmentSchema);
