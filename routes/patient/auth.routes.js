const express = require("express");
const loginVerify = require("../../middleware/loginVerify");
const patientController = require("../../controllers/patient/auth.controller");
const patientRouter = express.Router();
patientRouter.post("/login", patientController.loginPatient);
module.exports = { patientRouter };
