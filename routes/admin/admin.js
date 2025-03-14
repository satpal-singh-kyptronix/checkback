const express = require("express");
const router = express.Router();
const { addAdmin } = require("../../controllers/admin/doctor");
const loginVerify = require("../../middleware/loginVerify");
const doctorController = require("../../controllers/admin/doctor");

router.post("/signup", addAdmin);
router.get("/doctor/:doctorId", loginVerify, doctorController.getDoctorById);

module.exports = { router };
