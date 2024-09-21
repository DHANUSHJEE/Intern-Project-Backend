import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import connectDB from "./DataBase/database.js";
import router from "./Routers/userRoutes.js";
import morgan from "morgan";
import cookieParser from "cookie-parser";





dotenv.config();
const app = express();
const PORT = process.env.PORT;


app.use(express.json());
app.use(cors());
app.use(cookieParser());
app.use(morgan("dev"));





connectDB();

app.use("/api/user", router);

// Home Route
app.get("/", (req, res) => {
    res.send("Welcome to the homepage!");
});

// Handle undefined routes
app.use((req, res) => {
    res.status(404).send("Page not found");
});





app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});

