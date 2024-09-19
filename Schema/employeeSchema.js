import mongoose from "mongoose";

const employeeSchema = new mongoose.Schema({
    no: {
        type: 'number',
        require: 'true',
        unique:'true'
    },
    name:{
        type: 'string',
        required: true,

    },
    email: {
        type: 'string',
        required: true,
        unique: true,

    },
    mobile: {
        type: 'number',
        required: true,
        unique: true
    },
    designation: {
        type: String,
        enum: ['HR', 'Manager', 'Sales'], // Only these values are allowed
        required: true
        
    },
    gender: {
        type: 'string',
        enum: ["Male", "Female"],
        required: true
    },
    course: {
        type: 'string',
        enum: ['MCA', 'BCA', 'BSC'],
        required: true
    }

})


export default mongoose.model("Employee", employeeSchema)