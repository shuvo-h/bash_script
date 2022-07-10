import { videoID_Limits } from "../../dataChanger/dataLimits.mjs";
import { VideoTextInfo } from "../../models/videoModel/VideoInfo.mjs";
import { getValidID } from "../../utilities/uniqueIDgenerator.mjs";

export async function addUniqueVideoID(req,res,next) {
    // get all the exist video ID
    const existVideoIDs = await (await VideoTextInfo.find({}, {_id:0, video_id:1})).map(el => parseInt(el.video_id));
    const newVideoID = await getValidID(existVideoIDs,videoID_Limits.minLimit,videoID_Limits.maxLimit);
    console.log(existVideoIDs,newVideoID);

    if (newVideoID.idError) {
        // send an email to the Admin, no available unique ID
        res.json({message: newVideoID.message})
    }else{
        req.body.video_id = newVideoID.newID;
        next() 
    }
}



