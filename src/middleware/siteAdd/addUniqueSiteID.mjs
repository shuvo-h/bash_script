import { SitesModel } from "../../models/SitesModel/SitesModel.mjs";
import { randomInteger } from "../../utilities/uniqueIDgenerator.mjs";

export async function addUniqueSiteID(req,res,next) {
    // find the existing site ID
    console.log("hit adding unique ID");
    const existIDs = await (await SitesModel.find({}, {_id:0, site_id:1})).map(el => parseInt(el.site_id))
    console.log(existIDs,"existIDs");
    const siteID = await getValidSiteID(existIDs);
    if (siteID.idError) {
        // send an email to the Admin, no available unique ID
        // res.json(userID)
        res.json({error:{common:{msg: siteID.message}}})
    }else{
        req.body.site_id = siteID.newID;
        console.log(siteID);
        next() 
    }
    // res.json(userID)
}




const getValidSiteID = async (allExistIDs) =>{
    const minID = 10000;  // change the max and min user id from here
    const maxID = 999999999;
    const newID = randomInteger(minID,maxID);
    console.log(minID," = min vs max = ", maxID, "generatedID =", newID);
    const isExist = allExistIDs.includes(newID);
    console.log(allExistIDs, isExist);
    console.log(maxID, "===", allExistIDs.length,"length");
    if ( maxID - 3 < allExistIDs.length) {
        return {idError: true, message:"No user ID available at this moment!"}
    }else if(isExist){
        return getValidSiteID(allExistIDs,minID,maxID);
    }else{
        return {idError: false, newID};
    }
}

