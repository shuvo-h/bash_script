// external imports 
import { check, validationResult } from "express-validator";
import createError from "http-errors";

export const siteAddValidator = [
    check("title")
        .isLength({min:1})
        .withMessage("Title is required atleast 1 character!")
        .isAlpha("en-US", {ignore: " -"})
        .withMessage("Name must not contain anything other than alphabet!")
        .trim(),
    check("username")
        .isLength({min:1})
        .withMessage("Title is required atleast 1 character!")
        .isAlpha("en-US", {ignore: " -"})
        .withMessage("Name must not contain anything other than alphabet!")
        .trim(),
    check("password")
        .isLength({min:4})
        .withMessage("Password need atleast 4 characters!")
]

export function addSiteValidatonHandler(req,res,next) {
    // catch the errors from siteAddValidator and make array of them
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
