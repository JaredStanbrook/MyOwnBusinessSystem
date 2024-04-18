const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const ScheduleSchema = new Schema({
  _id: { type: String, required: true },
  client_id: { type: Schema.Types.ObjectId, ref: "Client", required: true },
  start: { type: Date, required: true },
  end: { type: Date, required: true },
});

ScheduleSchema.virtual("url").get(function () {
  return `/schedules/${this._id}`;
});

// Export model
module.exports = mongoose.model("Schedule", ScheduleSchema);
