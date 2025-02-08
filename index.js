require("dotenv").config();
const express = require("express");
const jwt = require("jsonwebtoken");
const userModel = require("./db");
const mongoose = require("mongoose");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

app.post("/api/v1/signup", async (req, res) => {
    const { username, password, name } = req.body;
    try {
        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "user Already Exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = await userModel.create({
            username,
            password: hashedPassword,
            name
        })

        return res.status(201).json({
            message: "User created successfully",
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
})

app.post("/api/v1/signin", async (req, res) => {
    const { username, password } = req.body;
    try {
        const existingUser = await userModel.findOne({ username });

        if (!existingUser) {
            return res.status(400).json({
                message: "user does not exists...you need to signup first"
            })
        }

        const matchPassword = await bcrypt.compare(password, existingUser.password);

        if (!matchPassword) {
            return res.status(400).json({
                message: "incorrect credentials"
            })
        }

        const token = jwt.sign({ id: existingUser._id, username: existingUser.username }, process.env.JWT_SECRET, { expiresIn: "1h" })

        return res.status(200).json({
            message: "you have signed up sucessfully",
            token
        })

    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
})

app.put("/api/v1/updateinfo", (req, res) => {
    const { username, password, name } = req.body;
    try {

    }
    catch {

    }
})

async function main() {
    try {
        await mongoose.connect(process.env.MONGO_URL);

        app.listen(3000, () => {
            console.log("server is running on port 3000")
        })
    }
    catch (error) {
        console.error("Something went wrong! , Cannot connect to Database try after sometime", error.message);
        process.exit(1);
    }
}

main();

