// external imports
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
// internal imports
import {People} from "../../models/AuthModel/People.mjs";

export async function addNewUserController(req,res,next) {
    // make hash the password
    const saltRound = 10;
    const hashedPassword = await bcrypt.hash(req.body.password,saltRound);
    // make new user model
    const newPeopel = new People({...req.body, password:hashedPassword});
    newPeopel.email = newPeopel.email.toLowerCase()
    // add unique user ID

    console.log(newPeopel);
    // insert the new user to DB
    try {
        const result = await newPeopel.save();
        res.status(200).json({message:"User was added successfully!",id:result._id})
    } catch (err) {
        // delete uploaded file

        // send error response
        res.status(500).json({
            errors:{
                common: {message: "Unknown error occured!"}
            }
        })
        
    }
}

export async function doUserLogin(req,res,next) {
    try {
        // find user from DB
        const user = await People.findOne({email:req.body?.email},{_id:0, email:1, user_id:1,password:1,name:1});
        if (user && user.user_id) {
            // match the password
            const isValidPassword = await bcrypt.compare(req.body.password,user.password);
            if (isValidPassword) {
                // prepare the user object to generate access token 
                const userObject = {
                    name : user.name,
                    user_id: user.user_id,
                    email: user.email,
                    // img: user.avatar,
                    // role: user.role || "user" 
                }
                
                // generate token 
                const token = jwt.sign(userObject,process.env.JWT_SECRET,{expiresIn:process.env.JWT_EXPIRY})

                // set cookie
                const cookieOptions = {
                    maxAge: process.env.JWT_EXPIRY,
                    expires: new Date(Date.now() + process.env.JWT_EXPIRY),
                    httpOnly: true,
                    signed: true,
                    sameSite:"none",
                    secure: true  // allow this only in production
                }
                console.log(token);
                res.status(200).cookie(process.env.COOKIE_NAME,token,cookieOptions).json(userObject)
                
            }else{
                throw createError("Login failed. please try again!")
            }
        }else{
            res.json({email: req.body.email,message: "Login failed. please try again!"})
        }
    } catch (error) {
        res.status(500).json({
            email: req.body.email,
            message: "Login failed!"
        })
        
    }
}

// keep user loggedin
export function keepUserLogin(req,res,next) {
    if (req.decodedUser) {
        res.status(200).json(req.decodedUser);
    }else{
        res.status(401).json({message:"Unauthorized user!"})
    }
}

// do logout 
export function makeLogout(req,res) {
    res.clearCookie(process.env.COOKIE_NAME)
    .json({user:null,message:"logout successful!"});
}

