const { Schema, model } = require("mongoose");

const PatientSchema = new Schema(
  {
    first_name: { type: String, trim: true },
    last_name: { type: String, trim: true },
    gender: {
      type: String,
      enum: ["Male", "Female", "Other"], // Restricts to predefined values
    },
    age: {
      type: Number,
      min: 0,
      max: 150, // Adds a realistic range for age
    },
    blood_group: {
      type: String,
      enum: ["A+", "A-", "B+", "B-", "AB+", "AB-", "O+", "O-"], // Common blood groups
    },
    treatment: { type: String, trim: true },
    mobile: {
      type: String,
    },
    email: {
      type: String,
    },
    address: { type: String, trim: true },
    username: { type: String },
    password: { type: String },
    state: {
      type: String,
      enum: [
        "Alabama", "Alaska", "Arizona", "Arkansas", "California", "Colorado", "Connecticut", "Delaware", "Florida", "Georgia", "Hawaii", "Idaho", "Illinois", "Indiana", "Iowa", "Kansas", "Kentucky", "Louisiana", "Maine", "Maryland", "Massachusetts", "Michigan", "Minnesota", "Mississippi", "Missouri", "Montana", "Nebraska", "Nevada", "New Hampshire", "New Jersey", "New Mexico", "New York", "North Carolina", "North Dakota", "Ohio", "Oklahoma", "Oregon", "Pennsylvania", "Rhode Island", "South Carolina", "South Dakota", "Tennessee", "Texas", "Utah", "Vermont", "Virginia", "Washington", "West Virginia", "Wisconsin", "Wyoming"
      ] // US states
    },
    postal_code: {
      type: String,
      // match: [/^\d{5}(-\d{4})?$/, "Please enter a valid US postal code"], // Validates US ZIP codes
    },

    doctor: { type: Schema.Types.ObjectId, ref: "doctor", required: true }, // Linking to a doctor
  },
  { timestamps: true }
);

const patientModel = model("patient", PatientSchema);

module.exports = { patientModel };
