const { doctorModel } = require("../../models/doctor");
const { patientModel } = require("../../models/patient");
const bcrypt = require("bcrypt");

// const addPatient = async (req, res) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       gender,
//       age,
//       blood_group,
//       treatment,
//       mobile,
//       email,
//       address,
//       password,
//     } = req.body;

//     // Validate required fields
//     if (
//       !first_name ||
//       !last_name ||
//       !gender ||
//       !age ||
//       !blood_group ||
//       !treatment ||
//       !mobile ||
//       !email ||
//       !address ||
//       !password
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);
//     // Create a new patient
//     const patient = new patientModel({
//       first_name,
//       last_name,
//       gender,
//       age,
//       blood_group,
//       treatment,
//       mobile,
//       email,
//       address,
//       password: hashPassword,
//     });

//     await patient.save();
//     res.status(201).json({
//       status: true,
//       message: "Patient created successfully",
//       desc: "Patient Created Successfully",
//       tittle: "Success",
//       data: patient,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         status: false,
//         message: "Email or mobile number already exists",
//         desc: error.message,
//       });
//     }
//     res.status(500).json({
//       status: false,
//       message: error.message,
//       desc: "Internal Server Error",
//     });
//   }
// };

// echo


// const addPatient = async (req, res) => {
//   try {
//     const {
//       first_name,
//       last_name,
//       gender,
//       age,
//       blood_group,
//       treatment,
//       mobile,
//       email,
//       address,
//       state,
//       postal_code,
//       password,
//     } = req.body;

//     // Validate required fields
//     if (
//       !first_name ||
//       !last_name ||
//       !gender ||
//       !age ||
//       !blood_group ||
//       !treatment ||
//       !mobile ||
//       !email ||
//       !address ||
//       !state ||
//       !postal_code ||
//       !password
//     ) {
//       return res.status(400).json({ message: "All fields are required" });
//     }

//     const hashPassword = await bcrypt.hash(password, 10);
//     // Create a new patient
//     const patient = new patientModel({
//       first_name,
//       last_name,
//       gender,
//       age,
//       blood_group,
//       treatment,
//       mobile,
//       email,
//       address,
//       state,
//       postal_code,
//       password: hashPassword,
//     });

//     await patient.save();
//     res.status(201).json({
//       status: true,
//       message: "Patient created successfully",
//       desc: "Patient Created Successfully",
//       tittle: "Success",
//       data: patient,
//     });
//   } catch (error) {
//     if (error.code === 11000) {
//       return res.status(400).json({
//         status: false,
//         message: "Email or mobile number already exists",
//         desc: error.message,
//       });
//     }
//     res.status(500).json({
//       status: false,
//       message: error.message,
//       desc: "Internal Server Error",
//     });
//   }
// };


const addPatient = async (req, res) => {
  try {
    const {
      first_name, last_name, gender, age, blood_group, treatment, mobile, email, 
      address, state, postal_code, password, doctor
    } = req.body;

    if (!first_name || !last_name || !gender || !age || !blood_group || !treatment || 
        !mobile || !email || !address || !state || !postal_code || !password || !doctor) {
      return res.status(400).json({ message: "All fields are required, including doctor" });
    }

    // Verify doctor exists
    const existingDoctor = await doctorModel.findById(doctor);
    if (!existingDoctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    const hashPassword = await bcrypt.hash(password, 10);

    const patient = new patientModel({
      first_name, last_name, gender, age, blood_group, treatment, mobile, email,
      address, state, postal_code, password: hashPassword, doctor,
    });

    await patient.save();
    res.status(201).json({ status: true, message: "Patient added successfully", data: patient });
  } catch (error) {
    res.status(500).json({ status: false, message: error.message });
  }
};


const deletePatient = async (req, res) => {
  try {
    const { id } = req.params;

    // Find and delete the patient
    const deletedPatient = await patientModel.findByIdAndDelete(id);

    if (!deletedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient deleted successfully",
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const updatePatient = async (req, res) => {
  try {
    const { id } = req.params;
    let updates = { ...req.body };

    // If password is being updated, hash it
    if (updates.password) {
      const saltRounds = 10;
      updates.password = await bcrypt.hash(updates.password, saltRounds);
    }

    // Find and update the patient
    const updatedPatient = await patientModel.findByIdAndUpdate(id, updates, {
      new: true,
    });

    if (!updatedPatient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient updated successfully",
      data: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


// const getAllPatient = async (req, res) => {
//   try {
//     const patients = await patientModel.find();
//     res.status(200).json({
//       message: "Patients retrieved successfully",
//       data: patients,
//     });
//   } catch (error) {
//     res.status(500).json({ message: error.message });
//   }
// };



const getAllPatient = async (req, res) => {
  try {
    const patients = await patientModel.find().populate("doctor", "firstName lastName email specialization");
    res.status(200).json({ message: "Patients retrieved successfully", data: patients });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getSinglePatient = async (req, res) => {
  try {
    const { id } = req.params;

    const patient = await patientModel.findById(id);

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({
      message: "Patient retrieved successfully",
      data: patient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllPatientFilterByDoctor = async (req, res) => {
  try {
    const { doctorId, page = 1, limit = 10 } = req.query; // Get query parameters with defaults

    let filter = {};
    if (doctorId) {
      filter.doctor = doctorId; // Filter patients by doctor ID if provided
    }

    const patients = await patientModel
      .find(filter)
      .populate("doctor", "firstName lastName email specialization")
      .skip((page - 1) * limit) // Skip patients for pagination
      .limit(Number(limit)); // Limit results per page

    const totalPatients = await patientModel.countDocuments(filter); // Get total count

    res.status(200).json({
      message: "Patients retrieved successfully",
       patients,
      pagination: {
        currentPage: Number(page),
        totalPages: Math.ceil(totalPatients / limit),
        totalPatients,
      },
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deletePatientByDoctor = async (req, res) => {
  try {
    const { doctorId, patientId } = req.query; // Get doctor and patient IDs from query params

    if (!doctorId || !patientId) {
      return res.status(400).json({ message: "Doctor ID and Patient ID are required" });
    }

    // Find the patient and ensure they belong to the requesting doctor
    const patient = await patientModel.findOne({ _id: patientId, doctor: doctorId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found or does not belong to this doctor" });
    }

    // Delete the patient
    await patientModel.deleteOne({ _id: patientId });

    res.status(200).json({ message: "Patient deleted successfully" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


const editPatientByDoctor = async (req, res) => {
  try {
    const { doctorId, patientId } = req.params; // Get doctor & patient ID from params
    const updatedData = req.body; // Get updated patient details

    if (!doctorId || !patientId) {
      return res.status(400).json({ message: "Doctor ID and Patient ID are required" });
    }

    // Check if the patient exists and belongs to the doctor
    const patient = await patientModel.findOne({ _id: patientId, doctor: doctorId });

    if (!patient) {
      return res.status(404).json({ message: "Patient not found or does not belong to this doctor" });
    }

    // Update patient details
    const updatedPatient = await patientModel.findByIdAndUpdate(patientId, updatedData, { new: true });

    res.status(200).json({
      message: "Patient updated successfully",
      patient: updatedPatient,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};



const getSinglePatientByDoctor = async (req, res) => {
  try {
    const { patientId } = req.params; // Extract patient ID from request parameters

    if (!patientId) {
      return res.status(400).json({ message: "Patient ID is required" });
    }

    const patient = await patientModel.findById(patientId).populate("doctor", "first_name last_name email");

    if (!patient) {
      return res.status(404).json({ message: "Patient not found" });
    }

    res.status(200).json({ patient });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const getAllDoctorsByPatient = async (req, res) => {
  try {
    // Optional: Pagination query parameters (page, limit)
    const { page = 1, limit = 10 } = req.query;

    // Calculate the skip and limit for pagination
    const skip = (page - 1) * limit;

    // Find doctors and populate the specialization field
    const doctors = await doctorModel
      .find()
      .populate("specialization", "department desc")
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




module.exports = {
  addPatient,
  deletePatient,
  updatePatient,
  getAllPatient,
  getSinglePatient,
  getAllPatientFilterByDoctor,deletePatientByDoctor,editPatientByDoctor,
  getSinglePatientByDoctor, getAllDoctorsByPatient
};
