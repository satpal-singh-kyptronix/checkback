const mongoose = require("mongoose");

const DepartmentSchema = new mongoose.Schema(
  {
    department: {
      type: String,
      required: true,
      unique: true,
    },
    desc: {
      type: String,
    },
  },
  { timestamps: true }
);

const DepartmentModel = mongoose.model("Departments", DepartmentSchema);
module.exports = { DepartmentModel };
