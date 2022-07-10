import { UserID_Limits } from "../../dataChanger/dataLimits.mjs";
import { People } from "../../models/AuthModel/People.mjs";
import { getValidID, randomInteger } from "../../utilities/uniqueIDgenerator.mjs"

export async function addUniqueID(req,res,next) {
    
    const existIDs = await (await People.find({}, {_id:0, user_id:1})).map(el => parseInt(el.user_id))

    const userID = await getValidID(existIDs,UserID_Limits.minLimit,UserID_Limits.maxLimit);
    if (userID.idError) {
        // send an email to the Admin, no available unique ID
        // res.json(userID)
        res.json({error:{common:{msg: userID.message}}})
    }else{
        req.body.user_id = userID.newID;
        console.log(userID);
        next() 
    }
}

