import express from "express";
import { addNewVideoOrder, downloadOneVideo, getAllVideoStatus } from "../controller/videoController/videoController.mjs";
import { checkLogin, verifyLogin } from "../middleware/authenticate/keepLogin.mjs";
import { addUniqueVideoID } from "../middleware/videoMiddleWare/videoTextInfo.mjs";

// make the router 
export const videoRouter = express.Router();

// place a new video order
videoRouter.post("/order",checkLogin,verifyLogin,addUniqueVideoID,addNewVideoOrder)

// get user specific order list with status summary 
videoRouter.get("/all/status",checkLogin,verifyLogin,getAllVideoStatus)

// get user specific order list with status summary; request must come through eg, /download?encode_id=135_7534
videoRouter.get("/download",checkLogin,verifyLogin,downloadOneVideo)