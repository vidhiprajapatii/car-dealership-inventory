const { connectDB } = require("./database/db");
const authRoutes = require("./routes/authRoutes");
const express = require("express");
const vehicleRoutes = require("./routes/vehicleRoutes");
const cors = require("cors");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api/auth", authRoutes);
app.use("/api/vehicles", vehicleRoutes);

app.get("/", (req, res) => {
    res.send("Car Dealership Inventory API Running");
});

app.use((req, res) => {
    res.status(404).json({
        message: "Route not found"
    });
});


const PORT = process.env.PORT || 8000;

connectDB().then(() => {
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
});