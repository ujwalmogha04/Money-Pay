const { Router } = require("express");
const userRouter = Router();
const { userSigninSchema, userSignupSchema } = require("../schema");
const userMiddleware = require("../middleware");
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const {userModel} = require("../db");

userRouter.post("/signup", async (req, res) => {
    const { username, password, name } = req.body;

    const validateSchema = userSignupSchema.safeParse({ username, password, name });

    if (!validateSchema.success) {
        return res.status(400).json({
            message: "Invalid format",
            errors: validateSchema.error.errors,
        })
    }
    try {
        const existingUser = await userModel.findOne({ username });

        if (existingUser) {
            return res.status(400).json({
                message: "user Already Exists"
            })
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const User = await userModel.create({
            username,
            password: hashedPassword,
            name
        })

        const token = jwt.sign({ id: User._id, username: User.username }, process.env.JWT_SECRET, { expiresIn: "1h" })

        res.setHeader("Authorization", `Bearer ${token}`);

        return res.status(201).json({
            message: "User created successfully",
            token
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
})

userRouter.post("/signin", async (req, res) => {
    const { username, password } = req.body;

    const validateSchema = userSigninSchema.safeParse({ username, password });

    if (!validateSchema.success) {
        return res.status(400).json({
            message: "Invalid format",
            errors: validateSchema.error.errors,
        })
    } try {
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

        res.setHeader("Authorization", `Bearer ${token}`);

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

userRouter.put("/updateinfo", userMiddleware, async (req, res) => {
    const { password, name } = req.body;
    const userId = req.userId;
   
    try {
        const existingUser = await userModel.findOne({ _id: userId });
       
        if (!existingUser) {
            return res.status(404).json({
                message: "user does not exists...signup first"
            })
        };

        if (name) existingUser.name = name;
        if (password) {
            existingUser.password = await bcrypt.hash(password, 10);
        }

        await existingUser.save();

        return res.status(200).json({ message: "User updated successfully" });
    }
    catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        })
    }
});

userRouter.post("/bulk", async (req, res) => {
    const filter = req.query.filter || "";
    try {
        const users = await userModel.find({
            $or: [
                { firstname: { $regex: filter, $options: "i" } },
                { lastname: { $regex: filter, $options: "i" } }
            ]

        })

        res.json({
            users: users.map(user => ({
                username: user.username,
                name: user.name,
                _id: user._id
            }))
        })
    } catch (error) {
        return res.status(500).json({
            message: "Internal server error",
            error: error.message
        });
    }

})

module.exports = userRouter;