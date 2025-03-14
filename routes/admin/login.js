const { Router } = require("express");
const bcrypt = require("bcrypt");
const UserModel = require("../../models/admin");
const { login, checkTocken, logout } = require("../../controllers/auth/login");
const loginVerify = require("../../middleware/loginVerify");

const loginRoute = Router();

loginRoute.post("/login", login);

loginRoute.post("/add", async (req, res) => {
  const { first_name, last_name } = req.body.admin;
  const { role, email, username, password } = req.body;

  const user = new UserModel({
    admin: {
      first_name: first_name,
      last_name: last_name,
    },
    role: role,
    email_address: email,
    password: await bcrypt.hash(password, 10),
    username: username,
  });
  await user.save();
  res.status(201).json({ status: true, message: user });
});

loginRoute.post("/check-token", loginVerify, checkTocken);
loginRoute.post("/logout", loginVerify, logout);

module.exports = loginRoute;
