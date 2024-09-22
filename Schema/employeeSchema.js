import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    course: { type: [String], required: true }, // Array of courses
    date: { type: Date },
    image: { type: String }, // Path to image
    userid: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true } // Reference to User
});

export default mongoose.model("Employee", employeeSchema);
