const { AppoinmentManagerModel } = require("../../models/appointment_manager");
const bcrypt = require("bcrypt"); 

module.exports.addStaff = async (req, res) => {

  const { firstName, lastName, mobile, gender, email, password } = req.body;
  if (!firstName || !lastName || !mobile || !gender || !email || !password) {
    return res.status(400).json({ message: "All fields are required" });
  }
  try {
    const check = await AppoinmentManagerModel.findOne({
      $or: [{ email: email }, { mobile: mobile }],
    });
    if (check) {
      return res
        .status(400)
        .json({ message: "Email or mobile already exists" });
    }
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const staff = new AppoinmentManagerModel({
      firstName,
      lastName,
      email,
      gender,
      password:hashedPassword,
      mobile,
      doctorId: req.user.user._id,
    });
    await staff.save();
    return res.status(200).json({ message: "Staff added successfully" });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
};

module.exports.getStaff = async (req, res) => {
  try {
    const staff = await AppoinmentManagerModel.find({
      doctorId: req.user.user._id,
    });
    return res.status(200).json({ staff });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Internal server error" });
  }
}
