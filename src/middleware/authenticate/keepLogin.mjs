import jwt from "jsonwebtoken";
import { People } from "../../models/AuthModel/People.mjs";


export function checkLogin(req,res,next) {
    console.log("trying to re-access with token");
    let cookies = Object.keys(req.signedCookies).length > 0 ? req.signedCookies : null;
   if (cookies) {
     try {
        const token = cookies[process.env.COOKIE_NAME];
        const decodedUserInfo = jwt.verify(token,process.env.JWT_SECRET);
        req.decodedUser = decodedUserInfo;
        next();
     } catch (error) {
        res.status(401).json({message: "Authentication failed!"})
     }
   }else{
        res.status(401).json({message: "Authentication failed!"})
   }
}

export async function verifyLogin(req,res,next) {
   const decodedUserID =  req.decodedUser.user_id;
   const existUser = await People.findOne({user_id: decodedUserID},{_id:0, email:1})
   if (existUser.email) {
      console.log("ex =>  ",existUser,"existUser");
      req.body.isVerifyUser = true;
      next();
   }else{
      req.body.isVerifyUser = false;
      res.json({error: true, message: "Unauthorized user!"})
   }
}