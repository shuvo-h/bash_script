import fs from "fs"
import { videoConvertResultModel } from "../../models/videoConvertResult/videoConvertResult.mjs";
import { convertStatusTypes, VideoTextInfo } from "../../models/videoModel/VideoInfo.mjs";


export async function addNewVideoOrder(req,res,next) {
    const userID =  req.decodedUser.user_id;
    const videoID = req.body.video_id;
    const textInfo = req.body.textInfo;
    const template = req.body.template;
    console.log( req.body);
    console.log( textInfo);
    // process.exit()
    console.log(userID,videoID,req.body.isVerifyUser);
    if (userID && videoID && req.body.isVerifyUser && textInfo.mainTitle?.trim()?.length && textInfo.all_para?.length) {
        console.log("enter -> mongoos");
        const newTextdoc = {
            user_id: userID,
            video_id: videoID,
            textInfo,
            template,
            convert_status: convertStatusTypes.pending
        }
        const newVideoTextInfo = new VideoTextInfo(newTextdoc)
        console.log(req.body,"  => che text array");
        try {
            const resAddVideo = await newVideoTextInfo.save();
            res.json(resAddVideo)
        } catch (error) {
            res.json({error: true, message: error.message})
        }
    }else{
        res.json({error: true, message:"Something went wrong! Please try again later."})
    }
    
    
}



export async function getAllVideoStatus(req,res,next) {
    console.log(req.decodedUser,"gotta");
    const user_id = req.decodedUser?.user_id;
    if (user_id) {
        try {
            // list of all ordered video
            const orderedList = await VideoTextInfo.find({user_id},{_id:0,"textInfo.mainTitle":1, video_id:1,convert_status:1,status_messages:1})
            // list of converted video
            const convertedList = await videoConvertResultModel.find({user_id: user_id},{_id:0,encode_id:1 ,video_title:1,video_size:1,video_id:1,encode_status:1,encode_message:1});
            // separate the waiting video list: totalOrder - convertedVideo
            let queeList = [];
            orderedList.forEach(video =>{
                const isExist = convertedList.find(el => el.video_id === video.video_id)
                if (!isExist?.video_id) {
                    const reStructProperty = {
                        video_title: video.textInfo?.mainTitle,
                        video_id: video.video_id,
                        encode_status: video.convert_status,
                        encode_message: video.status_messages
                    }                    
                    queeList.push(reStructProperty);
                }
            })
            const videoStatus = [convertedList,queeList].flat()

            res.json(videoStatus)
        } catch (error) {
            console.log(error.message);
            res.status(500).json({error: true, message:"Something went wrong!" })
        }
    }else{
        res.status(401).json({error:"true", message:"Unauthorized user!"})
    }
}

// download one video, request API endpoint  eg, /video/download?encode_id=453078_4
export async function downloadOneVideo(req,res,next) {
    const encode_id = req.query.encode_id;
    try {
        const userID_DB = await videoConvertResultModel.findOne({encode_id},{_id:0,user_id:1,video_title:1});
        const requesterID = req.decodedUser.user_id
        // if requester user_id and the DB user_id for this video_id matchMedia, then allow to download the video 
        if (requesterID === userID_DB.user_id) {
            // send the download response
            // get the file information
            const videoFileNameWithPath = `./src/videoConverter/allFiles/finalVideos/${encode_id + ".mp4"}`;
            const videoFile = fs.statSync(videoFileNameWithPath);
            console.log("ok down ", videoFile);
            res.writeHead(200,{
                "Content-Type":"video/mp4",
                "Content-Length": `${videoFile.size}`,
                'Content-Disposition': `attachment; filename='${userID_DB.video_title}'`,
            })

            const fileReadStream = fs.createReadStream(videoFileNameWithPath);
            fileReadStream.pipe(res);

        } else{
            res.json({error: true, message:"Unauthorized user!"})  // create and throw new error
        }
        
    } catch (error) {
        console.log(error);
        res.json({error: true, message: error.message})  // create and  throw new error
    }
}

