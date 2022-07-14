import jwt from "jsonwebtoken";
import { SitesModel } from "../../models/SitesModel/SitesModel.mjs";

export async function getSiteAccess(req,res,next) {
    if (req.decodedUser.user_id && req.body.site_id) {
        try {
            // get the site access from DB
            const accessDBToken = await SitesModel.findOne({site_id:req.body.site_id, user_id:req.decodedUser.user_id},{_id:0,token:1})
            if (accessDBToken.token) {
                // decript the jwt token to get username and password
                const decodedSiteAccess = jwt.verify(accessDBToken.token,process.env.JWT_SITE_TOKEN_SECRET_NEVER_CHANGE);
                req.decodedSiteAccess = decodedSiteAccess;
                next();
            }else{
                res.json({error:{common:{msg: "Site access does not exist!"}}})
            }
        } catch (err) {
            console.log(err);
            res.status(500).json({error:{common:{msg: err.message}}})
        }
    }else{
        res.json({error:{common:{msg: "Unauthorized user!"}}})
    }
}

