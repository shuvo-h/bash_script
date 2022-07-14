// external imports 
import { check, validationResult } from "express-validator";
import createError from "http-errors";

// internal imports 
import {People} from "../../models/AuthModel/People.mjs"

export const addUserValidator = [
    check("name")
        .isLength({min: 3})
        .withMessage("Name is required atleast 3 characters!")
        .isAlpha("en-US", {ignore: " -"})
        .withMessage("Name must not contain anything other than alphabet!")
        .trim(),
    check("email")
        .isEmail()
        .withMessage("Invalid email address!")
        .trim()
        .custom(async(value) =>{
            // check if the email is already registred
            try {
                const query = { email: value.toLowerCase() };
                const projectionProperty = { _id: 1 };
                const existUser = await People.findOne(query,projectionProperty);
                
                if (existUser) {
                    throw createError("Email already exist");
                }
            } catch (err) {
                throw createError(err.message)
            }
        }),
    check("password")
        .isStrongPassword({
            minLength: 8,
            minLowercase: 1,
            minUppercase: 1,
            minNumbers: 1
        })
        .withMessage("Password must be at least 8 characters long and should contain 1 lowercase, 1 uppercase, 1 number & 1 symbol"),
];

export function addUserValidatorHandler(req,res,next) {
    // catch the errors from addUserValidator and make array of them
    const validatorsErrors = validationResult(req);
    const mappedError = validatorsErrors.mapped();
    
    if (Object.keys(mappedError).length === 0) {
        next();
    }else{
        // remove/delete if any file is uploaded
        // send error response
        // res.status(406).json({error:mappedError})  // res.ststus() is not working on axios request
        res.json({error:mappedError})
    }

}