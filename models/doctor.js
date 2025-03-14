const { Schema, model } = require("mongoose");

const DoctorSchema = new Schema({
  firstName: { type: String },
  lastName: { type: String },
  age: { type: Number },
  gender: { type: String, enum: ["Male", "Female", "Other"] },
  email: { type: String },
  username: { type: String, unique: true },
  password: { type: String },
  mobile: { type: String },
  profilePhoto: { type: String }, // URL or file path for the profile photo
  specialization: { type: Schema.Types.ObjectId, ref: "Departments" },
  experience: { type: Number }, // In years
  qualifications: { type: String },
  license: { type: String },
  schedule: {
    sun: { start: { type: String }, end: { type: String } },
    mon: { start: { type: String }, end: { type: String } },
    tue: { start: { type: String }, end: { type: String } },
    wed: { start: { type: String }, end: { type: String } },
    thu: { start: { type: String }, end: { type: String } },
    fri: { start: { type: String }, end: { type: String } },
    sat: { start: { type: String }, end: { type: String } },
  },
  about: { type: String },
  status: {
    type: String,
    enum: ["active", "inactive"],
    default: "inactive",
    required: true,
  },
});

const doctorModel = model("doctor", DoctorSchema);

module.exports = { doctorModel };
