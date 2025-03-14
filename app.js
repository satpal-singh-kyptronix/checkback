const express = require("express");
const app = express();
const dotenv = require("dotenv");
const cors = require("cors");
const bodyParser = require("body-parser");
const path = require("path");
const fs = require("fs");

const http = require("http");
const { Server } = require("socket.io");

dotenv.config();
const { connectDB } = require("./config/conn");
const port = process.env.PORT || 3000;
const loginRoute = require("./routes/admin/login");
const { departmentRoute } = require("./routes/admin/department");
const { patientRoute } = require("./routes/admin/patient");
const { doctorRouter } = require("./routes/admin/doctor");
const { router } = require("./routes/admin/admin");
const { mainDoctorRouter } = require("./routes/doctor/auth.routes");
const { staffRouter } = require("./routes/staff/auth.routes");
const { patientRouter } = require("./routes/patient/auth.routes");
const dicomRouter = require("./routes/doctor/dicomRoute");

const server = http.createServer(app);

// const io = new Server(server);


app.use(cors({
  origin: "https://coruscating-granita-9f71aa.netlify.app", // replace with your actual frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true,  // if you use cookies
}));

const io = new Server(server, {
  cors: {
    origin: "https://coruscating-granita-9f71aa.netlify.app",
    methods: ["GET", "POST"],
    credentials: true,
  },
  transports: ["websocket"], // Force WebSocket only
});




// app.use(cors());






let rooms = {}; // Store room information (you could save to a DB)

io.on("connection", (socket) => {
  // Listen for room creation (doctor creating meeting)
  socket.on("room:create", ({ room, email }) => {
    rooms[room] = { doctorSocketId: socket.id, email }; // Store room details
    console.log(`Room created: ${room}`);
  });

  // Patient accepts the meeting
  socket.on("patient:accept", ({ roomId, doctorSocketId }) => {
    // Notify the doctor that the patient has accepted the meeting
    io.to(doctorSocketId).emit("patient:accepted", { roomId });
    // Notify the patient that the meeting is starting
    socket.emit("meeting:start", { roomId });
  });

  // Handle joining room
  socket.on("join:room", ({ roomId }) => {
    const room = rooms[roomId];
    if (room) {
      socket.emit("room:joined", { room: roomId, doctorId: room.doctorSocketId });
    }
  });

  // Handle stream (assuming WebRTC)
  socket.on("stream:remote", (stream) => {
    io.emit("stream:remote", stream); // Broadcast the stream to the other user
  });
});


connectDB();
app.use(express.json());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
// app.use("/uploads", express.static("uploads")); // Serve uploaded files as static

app.use('/uploads', express.static(path.join(__dirname, 'uploads')));



app.get('/uploads/dicom/:filename', (req, res) => {
  const filePath = path.join(__dirname, 'uploads/dicom', req.params.filename);
  console.log(`Fetching file from: ${filePath}`);
  
  if (!fs.existsSync(filePath)) {
    console.error(`File not found: ${filePath}`);
    return res.status(404).send('File not found');
  }
  
  res.setHeader('Content-Type', 'application/dicom');
  res.sendFile(filePath, (err) => {
    if (err) {
      console.error(`Error sending file: ${err.message}`);
      res.status(500).send('Internal Server Error');
    }
  });
});



app.get("/", (req, res) => {
  res.write("Hello World!");
  res.end();
});


app.use("/", loginRoute);
app.use("/department", departmentRoute);
app.use("/patient", patientRoute);
app.use("/admin", router);
app.use("/admin", doctorRouter);
app.use("/doctor", mainDoctorRouter);
app.use("/staff", staffRouter);
app.use("/patient", patientRouter);

app.use("/uploads/dicom/file",dicomRouter)

server.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
