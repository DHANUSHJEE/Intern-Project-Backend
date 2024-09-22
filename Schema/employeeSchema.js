import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    name: { type: String, required: true },
    email: { type: String, required: true },
    mobile: { type: String, required: true },
    designation: { type: String, required: true },
    gender: { type: String, required: true },
    courses: { type: [String], required: true },
    image: { type: String, required: false }
});



export default mongoose.model("Employee", employeeSchema)