const jwt = require("jsonwebtoken");


function userMiddleware (req , res, next){
     const authHeader = req.headers.authorization;

     if(!authHeader || !authHeader.startsWith("Bearer")){
        return res.status(401).json({
            message : "Token does not exists"
        })
     }
       
     const token = authHeader.split(" ")[1];

     try{
          const decoded = jwt.verify(token , process.env.JWT_SECRET);
          
          if(!decoded){
            return res.status(400).json({
                message : "Invalid token"
            })
          }
        
          req.userId = decoded.id;
          next();
    }
    catch(error){
         return res.status(500).json({
            message : "Internal server error",
            error : error.message
         })
    }
}

module.exports = userMiddleware;