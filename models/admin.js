const { Schema, model } = require("mongoose");

const AdminSchema = new Schema(
  {
    first_name: { type: String, required: true },
    last_name: { type: String },
    email: { type: String, required: true },
    username: { type: String, required: true },
    password: { type: String, required: true },
  },
  { timestamps: true }
);

const adminModel = model("admin", AdminSchema);
module.exports = { adminModel };
