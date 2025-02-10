require("dotenv").config();
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const userRouter = require("./routes/userRoute");
const app = express();

app.use(express.json());
app.use(cors());

app.use("/api/v1/user/" , userRouter);

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

//userMiddleware
//token in headers in signin route
//express routing
//verification email feature
