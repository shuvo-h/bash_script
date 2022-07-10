// external imports
import express from "express";
import { addNewUserController, doUserLogin, keepUserLogin, makeLogout } from "../controller/authController/authenticationController.mjs";
import { addUniqueID } from "../middleware/authenticate/addUniqueID.mjs";
import { addUserValidator, addUserValidatorHandler } from "../middleware/authenticate/authValidator.mjs";
import { checkLogin } from "../middleware/authenticate/keepLogin.mjs";

// internal imports
export const authRouter = express.Router();

// registration route path 
authRouter.post("/registration",addUserValidator,addUserValidatorHandler,addUniqueID,addNewUserController)

// login route path 
authRouter.post("/login",doUserLogin)

// keep user login router (onAuthStateChange)
authRouter.get("/onAuthStateChange",checkLogin,keepUserLogin)

// logout
authRouter.get("/logout",makeLogout)



