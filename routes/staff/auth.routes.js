const express = require("express");
const staffRouter = express.Router();
const staffController = require("../../controllers/staff/login.controller");    

staffRouter.post("/login",staffController.login );

module.exports = { staffRouter };