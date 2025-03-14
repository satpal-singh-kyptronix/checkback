const { Router } = require("express");
const {
  addPatient,
  deletePatient,
  updatePatient,
  getAllPatient,
  getSinglePatient,
  getAllDoctorsByPatient,
} = require("../../controllers/admin/patientController");
const loginVerify = require("../../middleware/loginVerify");

const patientRoute = Router();

patientRoute.post("/add-patient", loginVerify, addPatient);

patientRoute.delete("/delete-patient/:id", loginVerify, deletePatient);

patientRoute.put("/update-patient/:id", loginVerify, updatePatient);

patientRoute.get("/get-patient", loginVerify, getAllPatient);

patientRoute.get("/get-single-patient/:id", loginVerify, getSinglePatient);

patientRoute.get("/get-doctor-by-patient", getAllDoctorsByPatient);


module.exports = { patientRoute };
