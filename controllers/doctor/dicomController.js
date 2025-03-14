// const path = require("path");
// const fs = require("fs");

// const uploadDicom = (req, res) => {
//   try {
//     if (!req.file) {
//       return res.status(400).json({ message: "No file uploaded" });
//     }

//     const { originalname } = req.file;
//     const extension = path.extname(originalname).toLowerCase();

//     if (extension !== ".dcm") {
//       return res.status(400).json({ message: "Invalid file type. Only .DCM files are allowed." });
//     }

//     res.status(200).json({ message: "DICOM file uploaded successfully", filename: req.file.filename });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };

// module.exports = { uploadDicom };



const path = require("path");
const fs = require("fs");

const uploadDicom = (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No file uploaded" });
    }

    const { originalname, filename } = req.file;
    const extension = path.extname(originalname).toLowerCase();

    if (extension !== ".dcm") {
      return res.status(400).json({ message: "Invalid file type. Only .DCM files are allowed." });
    }

    // Generate the file URL
    const fileUrl = `/uploads/dicom/${filename}`;

    res.status(200).json({
      message: "DICOM file uploaded successfully",
      filename: req.file.filename,
      fileUrl,
    });
  } catch (error) {
    console.error("Error in uploadDicom:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// const getDicomFiles = (req, res) => {
//   try {
//     const directoryPath = path.join(__dirname, "../../uploads/dicom");
//     fs.readdir(directoryPath, (err, files) => {
//       if (err) {
//         return res.status(500).json({ message: "Unable to scan directory", error: err.message });
//       }

//       // Sort files by name (ensure sequence based on timestamp)
//       const sortedFiles = files.sort((a, b) => {
//         const numA = parseInt(a.split('-')[0], 10);
//         const numB = parseInt(b.split('-')[0], 10);
//         return numA - numB;
//       });

//       const fileData = sortedFiles.map((file) => ({
//         name: file,
//         url: `/uploads/dicom/${file}`, // The full URL to access the file
//       }));

//       res.status(200).json({ files: fileData });
//     });
//   } catch (error) {
//     console.error("Error fetching files:", error);
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


const getDicomFiles = (req, res) => {
  try {
    const directoryPath = path.join(__dirname, "../../uploads/dicom");

    // Get pagination parameters from query (default to page 1 and limit 10)
    const { page = 1, limit = 10 } = req.query;
    const skip = (page - 1) * limit;
    const take = parseInt(limit);

    fs.readdir(directoryPath, (err, files) => {
      if (err) {
        return res.status(500).json({ message: "Unable to scan directory", error: err.message });
      }

      // Get file stats and sort by modification time (most recent first)
      const filesWithStats = files.map((file) => {
        const filePath = path.join(directoryPath, file);
        const stats = fs.statSync(filePath);
        return { name: file, createdAt: stats.mtime };
      });

      // Sort files by most recent first (descending order)
      const sortedFiles = filesWithStats.sort((a, b) => b.createdAt - a.createdAt);

      // Paginate the files
      const paginatedFiles = sortedFiles.slice(skip, skip + take);

      const fileData = paginatedFiles.map((file) => ({
        name: file.name,
        url: `/uploads/dicom/${file.name}`, // The full URL to access the file
      }));

      // Include pagination metadata in the response
      res.status(200).json({
        files: fileData,
        pagination: {
          currentPage: page,
          totalPages: Math.ceil(sortedFiles.length / limit),
          totalFiles: sortedFiles.length,
        },
      });
    });
  } catch (error) {
    console.error("Error fetching files:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

const deleteDicomFile = async (req, res) => {
  const { fileName } = req.params; // Ensure fileName is correctly received

  if (!fileName) {
    return res.status(400).send({ message: 'File name is required' });
  }

  const filePath = path.resolve('uploads', 'dicom', fileName); // Resolve path from the project root




  try {
    // Ensure the file exists
    if (fs.existsSync(filePath)) {
      fs.unlinkSync(filePath); // Delete the file
      return res.status(200).send({ message: 'File deleted successfully' });
    } else {
      return res.status(404).send({ message: 'File not found' });
    }
  } catch (error) {
    console.error('Error deleting file:', error);
    return res.status(500).send({ message: 'Failed to delete file' });
  }
};

module.exports = { uploadDicom, getDicomFiles,deleteDicomFile };




// const getDicomFiles = (req, res) => {
//   try {
//     const directoryPath = path.join(__dirname, "../../uploads/dicom");
//     fs.readdir(directoryPath, (err, files) => {
//       if (err) {
//         return res.status(500).json({ message: "Unable to scan directory", error: err.message });
//       }

//       // Sort files by filename (assuming the filenames are sequential)
//       const sortedFiles = files.sort((a, b) => {
//         // Assuming filenames are in the format: timestamp-filename.dcm
//         const aNumber = parseInt(a.split('-')[0], 10);
//         const bNumber = parseInt(b.split('-')[0], 10);
//         return aNumber - bNumber;
//       });

//       // Construct file URLs for each slice
//       const fileData = sortedFiles.map((file) => ({
//         name: file,
//         url: `/uploads/dicom/${file}`, // Construct URL for each file
//       }));

//       res.status(200).json({ files: fileData });
//     });
//   } catch (error) {
//     res.status(500).json({ message: "Server error", error: error.message });
//   }
// };


// ------------------------------check-----------

// const express = require('express');
// const multer = require('multer');
// const dicomParser = require('dicom-parser');
// const path = require('path');
// const app = express();
// const port = 5000;

// const upload = multer({ dest: 'uploads/' });

// app.use(express.static('public'));

// // Route for uploading DICOM files
// app.post('/upload', upload.single('dicom'), (req, res) => {
//   if (!req.file) {
//     return res.status(400).send('No file uploaded.');
//   }

//   const dicomData = dicomParser.parseDicom(req.file.buffer);

//   // You can extract useful information from the DICOM data here, e.g., Patient Name, Study ID, etc.
//   const patientName = dicomData.string('x00100010');  // Example tag
//   const studyDescription = dicomData.string('x00081030'); // Example tag

//   res.json({ message: 'File uploaded successfully', patientName, studyDescription });
// });

// // Serve the React app
// app.use(express.static(path.join(__dirname, 'client/build')));

// app.listen(port, () => {
//   console.log(`Server is running on http://localhost:${port}`);
// });








// import React, { useState } from 'react';
// import axios from 'axios';

// const FileUpload = () => {
//   const [selectedFile, setSelectedFile] = useState(null);
//   const [dicomInfo, setDicomInfo] = useState(null);

//   const onFileChange = (event) => {
//     setSelectedFile(event.target.files[0]);
//   };

//   const onUpload = async () => {
//     const formData = new FormData();
//     formData.append('dicom', selectedFile);

//     try {
//       const response = await axios.post('http://localhost:5000/upload', formData);
//       setDicomInfo(response.data);
//     } catch (error) {
//       console.error('Error uploading file:', error);
//     }
//   };

//   return (
//     <div>
//       <h2>Upload DICOM File</h2>
//       <input type="file" onChange={onFileChange} />
//       <button onClick={onUpload}>Upload</button>

//       {dicomInfo && (
//         <div>
//           <h3>Patient Info:</h3>
//           <p>Patient Name: {dicomInfo.patientName}</p>
//           <p>Study Description: {dicomInfo.studyDescription}</p>
//         </div>
//       )}
//     </div>
//   );
// };

// export default FileUpload;




// import React from 'react';
// import FileUpload from './FileUpload';
// import DicomViewer from './DicomViewer';

// const App = () => {
//   const [dicomData, setDicomData] = React.useState(null);

//   return (
//     <div className="App">
//       <h1>DICOM Viewer</h1>
//       <FileUpload setDicomData={setDicomData} />
//       {dicomData && <DicomViewer dicomImageData={dicomData} />}
//     </div>
//   );
// };

// export default App;
