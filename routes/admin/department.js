const { Router } = require("express");
const {
  addDepartment,
  allDepartments,
  deleteDepartment,
  getDepartmentById,
} = require("../../controllers/admin/department");
const departmentRoute = Router();

departmentRoute.post("/add", addDepartment);
departmentRoute.get("/all-department", allDepartments);
departmentRoute.delete("/delete-department/:departmentId", deleteDepartment);
departmentRoute.get("/:departmentId", getDepartmentById);

module.exports = { departmentRoute };
