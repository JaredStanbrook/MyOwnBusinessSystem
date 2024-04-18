const { ObjectId } = require("mongodb");
const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const UserSchema = new Schema({
  _id: { type: String, required: true },
  date: { type: Date, required: true },
  user_firstname: { type: String, required: true },
  user_familyname: { type: String, required: true },
  user_bsb: { type: String, required: true },
  user_account: { type: String, required: true },
  user_bank: { type: String, required: true },
  user_abn: { type: String, required: true },
  user_phone: { type: String, required: true },
  user_email: { type: String, required: true },
  user_address: { type: String, required: true },
  auth: {
    type: String,
    required: true,
    enum: ["admin", "user", "guest"], //admin= rwx, user= rw-, guest= r--
    default: "user",
  },
});

UserSchema.virtual("url").get(function () {
  return `/users/${this._id}`;
});

// Export model
module.exports = mongoose.model("User", UserSchema);
