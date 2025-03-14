const bcrypt = require("bcrypt");

const { adminModel } = require("../../models/admin");
const { doctorModel } = require("../../models/doctor");
const mongoose = require('mongoose');

const addDoctor = async (req, res) => {
  console.log(req.body);

  try {
    const {
      firstName,
      lastName,
      age,
      gender,
      email,
      mobile,
      specialization,
      experience,
      qualifications,
      license,
      schedule,
      username,
      password,
      about,
      status,
    } = req.body;

    if (
      !firstName ||
      !lastName ||
      // !age ||
      !gender ||
      !email ||
      !mobile ||
      !username

      // !specialization ||
      // !experience ||
      // !qualifications ||
      // !license ||
      // !schedule ||
      // !password ||
      // !about
    ) {
      return res.status(400).json({
        status: false,
        message: "All fields are required",
        desc: "Please fill the all required fields",
      });
    }

    // Check for duplicate email or username
    const existingUser = await doctorModel.findOne({
      $or: [{ email: email }, { username: username }],
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email or username already exists.",
        desc: " Please use a different email or username.",
      });
    }

    // Hash the password
    const hashedPassword = await bcrypt.hash(password, 10);
    const parsedSchedule = schedule || {
      sun: { start: "", end: "" },
      mon: { start: "", end: "" },
      tue: { start: "", end: "" },
      wed: { start: "", end: "" },
      thu: { start: "", end: "" },
      fri: { start: "", end: "" },
      sat: { start: "", end: "" },
    };
    // Create the doctor
    const user = new doctorModel({
      firstName,
      lastName,
      age,
      gender,
      email,
      mobile,
      specialization,
      experience,
      qualifications,
      license,
      schedule: parsedSchedule,
      about,
      username,
      status,
      password: hashedPassword,
    });
    await user.save();
    return res.status(201).json({
      status: true,
      message: "Doctor created successfully",
      doctorId: user._id,
      status: true, // Make sure this is true for success
      desc: "Doctor profile has been created successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to create doctor",
      error: error.message,
      status: false,
      desc: "Oops! Something went wrong. Please try again later.",
    });
  }
};

const addAdmin = async (req, res) => {
  const { firstname, lastname, email, username, password } = req.body;
  try {
    const emailUsernameExist = await adminModel.findOne({
      $or: [{ email: email }, { username: username }],
    });
    if (emailUsernameExist) {
      return res.status(500).json({
        status: false,
        message: "Email or username already exist",
        desc: "Please try a different email or username",
      });
    }
    const hashedPassword = await bcrypt.hash(password, 10);
    const newAdmin = await adminModel.create({
      first_name: firstname,
      last_name: lastname,
      email,
      username,
      password: hashedPassword,
    });
    return res.status(500).json({
      status: false,
      message: "Admin created",
      desc: "new admin created successfull",
    });
  } catch (error) {
    return res
      .status(500)
      .json({ status: false, message: error.message, desc: "Internal Error" });
  }
};


const getSingleDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params; // Get the doctor ID from request params

    // Find the doctor by ID and populate the specialization field with department details
    const doctor = await doctorModel.findById(doctorId).populate("specialization", "department");

    // Check if the doctor exists
    if (!doctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
        desc: "The doctor with the provided ID does not exist.",
      });
    }

    // Return the doctor details
    return res.status(200).json({
      status: true,
      message: "Doctor found successfully",
      doctor,
      desc: "Doctor details fetched successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to retrieve doctor details",
      error: error.message,
      desc: "Oops! Something went wrong. Please try again later.",
    });
  }
};




const getAllDoctors = async (req, res) => {
  try {
    // Optional: Pagination query parameters (page, limit)
    const { page = 1, limit = 10 } = req.query;

    // Calculate the skip and limit for pagination
    const skip = (page - 1) * limit;
    const doctors = await doctorModel
      .find()
      .skip(skip)
      .limit(parseInt(limit))
      .exec();

    // Count the total number of doctors for pagination info
    const totalDoctors = await doctorModel.countDocuments();

    // Return the doctors and pagination info
    return res.status(200).json({
      message: "Doctors retrieved successfully",
      doctors,
      pagination: {
        totalDoctors,
        currentPage: page,
        totalPages: Math.ceil(totalDoctors / limit),
      },
      status: true,
      desc: "List of doctors fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching doctors:", error.message);
    return res.status(500).json({
      message: "Failed to fetch doctors",
      error: error.message,
      status: false,
      desc: "Oops! Something went wrong. Please try again later.",
    });
  }
};

const deleteDoctor = async (req, res) => {
  try {
    const doctorId = req.params.id;

    // Find the doctor by ID and remove it
    const doctor = await doctorModel.findByIdAndDelete(doctorId);

    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found",staus:"false", desc: "No doctor found with the provided ID" });
    }

    // Return success response
    res.status(200).json({ status: true,message: "Doctor deleted successfully", desc: "Doctor has been deleted successfully." });
  } catch (error) {
    console.error(error);
    res.status(500).json({ staus: false,message: "Failed to delete doctor", desc: "Error deleting doctor" });
  }
};

const getDoctorById = async (req, res) => {
  try {
    const doctorId = req.params.doctorId;
    // Find the doctor by ID
    const doctor = await doctorModel.findById(doctorId);
    doctor.password = "**********";

    if (!doctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
        desc: "No doctor found with the provided ID",
      });
    }

    // Return the doctor details
    return res.status(200).json({
      status: true,
      message: "Doctor retrieved successfully",
      doctor,
      desc: "Doctor details fetched successfully.",
    });
  } catch (error) {
    console.error("Error fetching doctor:", error.message);
    return res.status(500).json({
      status: false,
      message: "Failed to fetch doctor",
      error: error.message,
      desc: "Oops! Something went wrong. Please try again later.",
    });
  }
};






const editDoctor = async (req, res) => {
  const { doctorId } = req.params; // Assume the doctor ID is passed in the URL
  const {
    firstName,
    lastName,
    age,
    gender,
    email,
    mobile,
    specialization,
    experience,
    qualifications,
    license,
    schedule,
    username,
    password,
    about,
    status,
  } = req.body;

  console.log("req.body",req.body);

  try {
    // Check if the doctor exists
    const existingDoctor = await doctorModel.findById(doctorId);
    if (!existingDoctor) {
      return res.status(404).json({
        status: false,
        message: "Doctor not found",
        desc: "The doctor with the given ID does not exist.",
      });
    }

    // Check for duplicate email or username
    const existingUser = await doctorModel.findOne({
      $or: [{ email: email }, { username: username }],
      _id: { $ne: doctorId }, // Ensure the current doctor is excluded
    });

    if (existingUser) {
      return res.status(400).json({
        status: false,
        message: "Email or username already exists.",
        desc: "Please use a different email or username.",
      });
    }

    // Hash the new password if provided
    let hashedPassword;
    if (password) {
      hashedPassword = await bcrypt.hash(password, 10);
    }
// Validate specialization ID (Handle multiple IDs)
let specializationIds = [];

if (Array.isArray(specialization)) {
  for (const id of specialization) {
    const trimmedId = id.trim(); // Trim any extra spaces
    if (mongoose.Types.ObjectId.isValid(trimmedId)) {
      specializationIds.push(new mongoose.Types.ObjectId(trimmedId));
    } else {
      return res.status(400).json({
        status: false,
        message: "Invalid specialization ID",
        desc: `The specialization ID '${id}' is invalid.`,
      });
    }
  }
} else {
  return res.status(400).json({
    status: false,
    message: "Specialization should be an array",
    desc: "Expected specialization to be an array of valid ObjectIds.",
  });
}



    // Update the doctor with the new details
    const updatedDoctor = await doctorModel.findByIdAndUpdate(
      doctorId,
      {
        firstName,
        lastName,
        age,
        gender,
        email,
        mobile,
        specialization: specializationIds, // Updated array of ObjectIds
        experience,
        qualifications,
        license,
        schedule,
        about,
        username,
        status,
        password: hashedPassword || existingDoctor.password, 
      },
      { new: true } // Return updated doctor object
    );
    

    return res.status(200).json({
      status: true,
      message: "Doctor updated successfully",
      doctorId: updatedDoctor._id,
      desc: "Doctor profile has been updated successfully.",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Failed to update doctor",
      error: error.message,
      desc: "Oops! Something went wrong. Please try again later.",
    });
  }
};




module.exports = {
  addDoctor,
  addAdmin,
  getAllDoctors,
  deleteDoctor,
  getDoctorById,
  editDoctor, getSingleDoctor
};
