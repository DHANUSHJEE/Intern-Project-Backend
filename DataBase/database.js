import mongoose from "mongoose";
import dotenv from "dotenv";

dotenv.config();


const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.CONNECTIONSTRING, {
            useNewUrlParser: true,
            useUnifiedTopology: true,
            serverSelectionTimeoutMS: 30000,
        });
        console.log(`MongoDB Connected`);
    } catch (error) {   
        console.log(error,"Error in DB connection");
       
    }
}

export default connectDB;