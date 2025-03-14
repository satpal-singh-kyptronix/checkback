const mongoose = require("mongoose");
const AppoinmentManagerSchema = new mongoose.Schema({
  
    doctorId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "doctor",
        required: true
    },
    firstName: {
        type: String,
        required: true
    },
    lastName: {
        type: String,
        required: true
    },
    email : {
        type: String,
        required: true
    },
    gender: {
        type: String,
        required: true
    },
    mobile: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
}, {
    timestamps: true
    
});

const AppoinmentManagerModel = mongoose.model("AppoinmentManager", AppoinmentManagerSchema);
module.exports = {AppoinmentManagerModel};