const express = require("express");
const multer = require("multer");
const { uploadDicom, getDicomFiles, deleteDicomFile } = require("../../controllers/doctor/dicomController");
const fs = require('fs');
const path = require('path');

const dicomRouter = express.Router();

// Ensure the "uploads/dicom" folder exists, or create it
const dir = './uploads/dicom';
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

// Multer configuration for file uploads
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, dir); // Store in "uploads/dicom"
  },
  filename: (req, file, cb) => {
    cb(null, `${Date.now()}-${file.originalname}`);
  },
});

const upload = multer({ storage });

dicomRouter.post("/upload-dicom", upload.single("dicomFile"), uploadDicom);
dicomRouter.get("/list-dicom", getDicomFiles);

dicomRouter.delete("/delete-dicom/:fileName", deleteDicomFile);

module.exports = dicomRouter;
