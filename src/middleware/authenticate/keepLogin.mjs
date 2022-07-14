import jwt from "jsonwebtoken";


export function checkLogin(req,res,next) {
    console.log("trying to re-access with token");
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
   if (cookies) {
     try {
        const token = cookies[process.env.COOKIE_NAME];
        const decodedUserInfo = jwt.verify(token,process.env.JWT_SECRET);
        console.log(decodedUserInfo,"decodedUserInfo");
        req.decodedUser = decodedUserInfo;
        next();
     } catch (error) {
        res.status(401).json({message: "Authentication failed!"})
     }
   }else{
        res.status(401).json({message: "Authentication failed!"})
   }
}