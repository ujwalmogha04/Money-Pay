const express = require("express");
const userModel = require("./db");
const bcrypt = require("bcryptjs");
const app = express();

app.use(express.json());

app.post("/signup", async (req, res) => {
    const { username, password, name } = req.body;
    try {
       const existingUser = await userModel.findOne({username});

       if(existingUser){
        return res.status(400).json({
            message : "user Already Exists"
        })
       }
    
       const hashedPassword = await bcrypt.hash(password , 10);

       const user = await userModel.create({
           username ,
           password : hashedPassword,
           name
       })

       return res.status(201).json({
        message: "User created successfully",
        user
    });
}
    catch (error){
       return res.status(500).json({
        message : "Internal server error",
        error : error.message
       })
    }
})

app.post("/signin", async (req, res) => {
    const { username, password, name } = req.body;
    try {
        const existingUser = await userModel.findOne({username});

        if(!existingUser){
            return res.status(400).json({
                 message : "user does not exists...you need to signup first"
            })
        }

        const matchPassword = await bcrypt.compare(password , existingUser.Password);
        
        if(!matchPassword){
            return res.status(400).json({
                message : "incorrect credentials"
            })
        }

        const token = jwt.sign({existingUser} , JWT_SECRET)

        return res.status().json({
            message : "you have signed up sucessfully",
            token
        })

    }
    catch (error) {
        return res.status(500).json({
            message : "Internal server error",
            error : error.message
           })
    }
})

app.put("/updateinfo", (req, res) => {
    const { username, password, name } = req.body;
    try {

    }
    catch {

    }
})

app.listen(3000, (req, res) => {
    console.log("server is running on port 3000")
})