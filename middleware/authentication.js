const jwt=require("jsonwebtoken");


verifyToken=(req,res,next)=>{
    let token=req.params.token;

    if(!token){
      //  return res.status(403).send({
        //    message:"Unauthorized Access"
        //});
        //res.send("error")
        return res.redirect("/login")
    }
  
    jwt.verify(token, process.env.ACCESSTOKEN, (err, decoded)=>{
        if(err){
            return res.status(401).send({
                message: "Unauthorized!"
              });
        }
        req.userid=decoded.id;
        next();
    });
};

const authentication={
    verifyToken:verifyToken
}

module.exports=authentication;