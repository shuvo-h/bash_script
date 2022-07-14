import express from "express";
import { addNewSiteCtl, getUsersSites, getWordsInfoCtl } from "../controller/sitesController/sitesController.mjs";
import { checkLogin } from "../middleware/authenticate/keepLogin.mjs";
import { addUniqueSiteID } from "../middleware/siteAdd/addUniqueSiteID.mjs";
import { getSiteAccess } from "../middleware/siteAdd/getSiteAccess.mjs";
import { addSiteValidatonHandler, siteAddValidator } from "../middleware/siteAdd/siteAdd.mjs";

export const sitesRouter = express.Router()

// add a new site information
sitesRouter.post("/site/add",siteAddValidator,addSiteValidatonHandler,checkLogin,addUniqueSiteID,addNewSiteCtl)

// get user specific list of all sites 
sitesRouter.get("/",checkLogin,getUsersSites)

// get words count information of a single website
sitesRouter.post("/site",checkLogin,getSiteAccess,getWordsInfoCtl)



