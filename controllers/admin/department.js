const { DepartmentModel } = require("../../models/department");

const addDepartment = async (req, res) => {
  const { name, desc } = req.body;
  if (!name) {
    return res.status(400).json({
      status: false,
      message: "Department Name is required",
      desc: " Please enter department name",
    });
  }
  try {
    const check = await DepartmentModel.findOne({ department: name });
    if (check) {
      return res.status(400).json({
        status: false,
        message: "Department Already exist!",
        desc: "Plese add unique department..",
      });
    }
    const department = new DepartmentModel({
      department: name,
      desc: desc,
    });
    await department.save();
    return res.status(201).json({
      status: true,
      message: "Added Successfully",
      desc: " Department Added Successfully",
    });
  } catch (error) {
    return res.status(500).json({
      status: true,
      message: "Internal Error",
      desc: error.message,
    });
  }
};

// const allDepartments = async (req, res) => {
//   try {
//     const data = await DepartmentModel.find({}).sort("department");
//     return res.status(200).send(data);
//   } catch (error) {
//     return res.status(500).json({
//       status: false,
//       message: "Technical Issue!",
//       desc: "Sorry, Please check your internal system",
//     });
//   }
// };

const allDepartments = async (req, res) => {
  try {
    const data = await DepartmentModel.find({}).sort("department");
    
    return res.status(200).json({
      status: true,
      message: "Departments fetched successfully",
      departments: data, // Change key name to match frontend
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Technical Issue!",
      desc: "Sorry, Please check your internal system",
    });
  }
};


const deleteDepartment = async (req, res) => {
  const { departmentId } = req.params;
  try {
    await DepartmentModel.findByIdAndDelete(departmentId);
    return res.status(200).json({
      status: true,
      message: "Deleted Department",
      desc: "Department deleted successfully..",
    });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Technical Issue!",
      desc: "please try again later !",
    });
  }
};

const getDepartmentById = async (req, res) => {
  const { departmentId } = req.params;
  try {
    const department = await DepartmentModel.findById(departmentId);
    if (!department) {
      return res.status(404).json({
        status: false,
        message: "Department Not Found",
        desc: "No department found with the given ID",
      });
    }
    return res.status(200).json({ department });
  } catch (error) {
    return res.status(500).json({
      status: false,
      message: "Technical Issue!",
      desc: "Sorry, Please check your internal system",
    });
  }
};
module.exports = {
  addDepartment,
  allDepartments,
  deleteDepartment,
  getDepartmentById,
};
