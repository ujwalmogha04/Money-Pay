const z = require("zod");

const userSignupSchema = z.object({
    username : z.string().email({ message: "Invalid email format" }),
    name : z.string().min(3 , { message: "Name must be at least 3 characters long" }),
    password : z.string().min(4)
});

const userSigninSchema = z.object({
    username : z.string().email(),
    password : z.string().min(4)
})

module.exports = {
    userSignupSchema,
    userSigninSchema
}

// const userUpdateSchema = z.object({
    
// })

