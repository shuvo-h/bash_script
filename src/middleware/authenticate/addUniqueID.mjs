import { People } from "../../models/AuthModel/People.mjs";
import { randomInteger } from "../../utilities/uniqueIDgenerator.mjs"

export async function addUniqueID(req,res,next) {
    console.log("hit adding unique ID");
    const existIDs = await (await People.find({}, {_id:0, user_id:1})).map(el => parseInt(el.user_id))

    const userID = await getValidID(existIDs);
    if (userID.idError) {
        // send an email to the Admin, no available unique ID
        // res.json(userID)
        res.json({error:{common:{msg: userID.message}}})
    }else{
        req.body.user_id = userID.newID;
        console.log(userID);
        next() 
    }
    // res.json(userID)
}


const getValidID = async (allExistIDs) =>{
    const minID = 100000;  // change the max and min user id from here
    const maxID = 1000000;
    const newID = randomInteger(minID,maxID);
    const isExist = allExistIDs.includes(newID);
    console.log(allExistIDs, isExist);
    console.log(maxID, "===", allExistIDs.length,"length");
    if (maxID === allExistIDs.length - 1) {
        return {idError: true, message:"No user ID available at this moment!"}
    }else if(isExist){
        return getValidID(allExistIDs);
    }else{
        return {idError: false, newID};
    }
}

