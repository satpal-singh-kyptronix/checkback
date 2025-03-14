const express = require("express");
const { addDoctor } = require("../../controllers/admin/doctor");
const { loginDoctor } = require("../../controllers/doctor/auth.controller");
const staffController = require("../../controllers/doctor/staff.controller");
const loginVerify  = require("../../middleware/loginVerify");
const mainDoctorRouter = express.Router();

mainDoctorRouter.post("/signup", addDoctor);
mainDoctorRouter.post("/login", loginDoctor);
mainDoctorRouter.post("/add-staff",loginVerify,staffController.addStaff );
mainDoctorRouter.get("/get-staff",loginVerify,staffController.getStaff );

module.exports = { mainDoctorRouter };
