import { videoConvertResultModel } from "../../models/videoConvertResult/videoConvertResult.mjs";
import { convertStatusTypes, VideoTextInfo } from "../../models/videoModel/VideoInfo.mjs"
import { checkLongSentence, deleteAllFiles, finalizeTextImageKeys, getAllFilesInDir, getRndInteger } from "../utilitiesConverter/commonUtils.mjs";
import { templateList } from "../utilitiesConverter/ffmpegInfoUtils.mjs";
import { finalizeOptions } from "../utilitiesConverter/optionCombiner.mjs";
import { margeVideos } from "./margeVideos.mjs";
import { prepareForSeparatedVideo } from "./prepareForSeparateConvert.mjs";

export async function getUserTxtOptions() {
    // get the video order with status pending
    // instead of using finOne, use findOneAndUpdate to status "pending"-> "started"
    const orderedVideoInfo = await VideoTextInfo.findOne({convert_status: convertStatusTypes.pending},{_id:0,textInfo:1,video_id:1,user_id:1,template:1}) || {}; 
    console.log(orderedVideoInfo,"orderedVideoInfo");
    // process.exit()
    if (orderedVideoInfo.video_id && orderedVideoInfo.user_id && orderedVideoInfo.template) {
        // find the template file name
        const tempalteClild = templateList.find(template => template.tpl_code == orderedVideoInfo.template)?.tpl_child_name;
        console.log(tempalteClild);

     
        // make the video customize options here, but (in future), this options will be taken from user through DB 
        const videoOptions = {  // (in future), it will come from DB as -->  orderedVideoInfo.videoOptions
            textOption:{
                text: "www.article2VideoSample.uk.org.com \n        ok",  // change this text at the time of sending to convert child process
                // font: {family: "Sacramento", variant: "regular"},
                font: {family: "Poppins", variant: "regular"},
                positionCtg: "center",    // "center", "top_center"
                paddingX: 30,
                paddingY: 25,
                fontcolor: "white",
                fontcolor_alpha: 1,  // 0 to 1
                fontsize: 50,
                box: 1,  // 0 or 1
                boxborderw: 10,   // 0 to up
                boxcolor: "black",
                boxcolor_alpha: 0.3,  // 0 to 1
                borderw: 2, // 0 to up
                bordercolor: "blue",
                bordercolor_alpha: 1,  // 0 to 1
                fix_bounds: true,    // true or false
                shadowcolor: "black",
                shadowcolor_alpha: 1,  // 0 to 1
                shadowx: 5,   // 0 to up
                shadowy: 5,      // 0 to up
            },
            frameOption: {
                transitionName: "random",
                transitionDuration: 1,
                secPerImg: 5,
                videoFramePadColor: "black",
                videoWidth: 1280,
                videoHeight: 720
            },
        }
        
        // pass the DB options to match with Default options
        const options = await finalizeOptions(orderedVideoInfo.template,videoOptions);  // templateCode and videoOptions
        console.log(options,"options");
        // process.exit()
        // pass image keywords with default options
        const textWithImgKeys = await finalizeTextImageKeys(orderedVideoInfo.textInfo)
        
        
        // check if any long sencence is existed more than (200 characters) to download audio for free
        const longSentences = await checkLongSentence(textWithImgKeys);
        console.log(longSentences,"longSentences");
        if (longSentences.isLongSentence) {
            // update the DB status pending to run error, so that nex time it can be skiped
            const orderedVideoStatus = await VideoTextInfo.findOneAndUpdate({video_id: orderedVideoInfo.video_id},{convert_status: convertStatusTypes.convert_Error,status_messages:"can't convert long sentence more than 200 characters"},{upsert: true})
            // return from here so that no need to go further and save the error to database so that user can see the error reason 
            return {videoLoopEnded: true, isMoreOrder: true }
        }
        
        // prepare video options
        const fileName = `${orderedVideoInfo.user_id}_${orderedVideoInfo.video_id}`;
        const fileNameExt = {name: fileName, audioType:"mp3",videoType:"mp4",language: "en", childTemplate: tempalteClild, options};
        console.log(fileNameExt.options.textOption,"tx chek");
        // process.exit()
    
        // clear the audio and video parts every time before start the process 
        // Delete all Video files from temporary folder to get a clean folder before start encoding
        // Delete all Video files from a folder
        const partedVideoFolder = `./src/videoConverter/allFiles/tempVideos/`;
        const deletePartedVideos = await deleteAllFiles(partedVideoFolder);
        // Delete all Audio files from a folder
        const partedAudioFolder = `./src/videoConverter/allFiles/tempAudios/`;
        const deletePartedAudios = await deleteAllFiles(partedAudioFolder);
      

        // uncomment this part during production, just commenting for not to re-encode in development mode
    
        // start making preparation loop for video
        const separatedVideosResult = await prepareForSeparatedVideo(textWithImgKeys,fileNameExt);
        console.log(separatedVideosResult, "separatedVideosResult");
        
        if (!separatedVideosResult.encodeStatus) {
            // update the DB status pending to run error, so that nex time it can be skiped
            const orderedVideoStatus = await VideoTextInfo.findOneAndUpdate({video_id: orderedVideoInfo.video_id},{convert_status: convertStatusTypes.convert_Error,status_messages: separatedVideosResult.message},{upsert: true})
            return {videoLoopEnded: true, isMoreOrder: true }
        }
        
        
        // go to next middleware

        // get the backgroundMusic title, (in future, background music url and ffmpeg fetch can be used)
        const all_backMusic = await getAllFilesInDir("./src/videoConverter/allFiles/demoBackgroundMusic/");
        const randomBackIdx = getRndInteger(0,all_backMusic.length-1)
        console.log(all_backMusic," -> ",randomBackIdx," alll abck");

        // merge the videos into final one file
        const videoSaveInfo = {videoName: fileName, videoType:"mp4", backgroundMusic: all_backMusic[randomBackIdx],backgroundMusicType:"mp3",backgroundVolume: 0.2} //backgroundVolume = 0 to 1
        console.log(videoSaveInfo,"videoSaveInfo");
        const videoResult = await margeVideos(videoSaveInfo)
        if (!videoResult.encodeStatus) {
            // videoConvertResultModel: update to DB status that video merged failed
            const convertResultDB = await videoConvertResultModel.findOneAndUpdate(
                {encode_id: fileName},
                {
                    user_id: orderedVideoInfo.user_id,
                    video_id: orderedVideoInfo.video_id,
                    encode_id : fileName,
                    video_title: orderedVideoInfo.textInfo.mainTitle,
                    video_size: 0,
                    encode_date: new Date().toISOString(),
                    encode_status: convertStatusTypes.convert_Error,
                    encode_message: videoResult.message,
                },
                {new: true, upsert: true}
            )
            // VideoTextInfo model: update to DB status that video merged failed
            const orderedVideoStatus = await VideoTextInfo.findOneAndUpdate({video_id: orderedVideoInfo.video_id},{convert_status: convertStatusTypes.convert_Error,status_messages: videoResult.message},{upsert: true})
            return videoResult;
        }
        console.log(videoResult,"videoResult after merged");
        // process.exit()

        // after successfully encoded video, update the status to DB from "started" -> "completed"
        const convertResultDB = await videoConvertResultModel.findOneAndUpdate(
            {encode_id: fileName},
            {
                user_id: orderedVideoInfo.user_id,
                video_id: orderedVideoInfo.video_id,
                encode_id : fileName,
                video_title: orderedVideoInfo.textInfo.mainTitle,
                video_size: videoResult.fileSize,
                encode_date: new Date().toISOString(),
                encode_status: convertStatusTypes.completed,
                encode_message: videoResult.message,
            },
            {new: true, upsert: true}
        )
        // VideoTextInfo model: update to DB status that video merged failed
        const orderedVideoStatus = await VideoTextInfo.findOneAndUpdate({video_id: orderedVideoInfo.video_id},{convert_status: convertStatusTypes.completed,status_messages: videoResult.message},{upsert: true})
    
        // process.exit()
    /*
        // delete the unnecessary files and move the final file to separate folter to keep store
        if (videoResult.encodeStatus) {
            // Delete all Video files from a folder
            const partedVideoFolder = `./src/videoConverter/allFiles/tempVideos/`;
            const deletePartedVideos = await deleteAllFiles(partedVideoFolder);
            // Delete all Audio files from a folder
            const partedAudioFolder = `./src/videoConverter/allFiles/tempAudios/`;
            const deletePartedAudios = await deleteAllFiles(partedAudioFolder);
        }
    */


        // finally return isMoreOrder: true, sothat to start loop again
        return {videoLoopEnded: true, isMoreOrder: true}  // make it isMoreOrder:true in production
    }else{
        // there is no video pending
        return {videoLoopEnded: true, isMoreOrder: false}
    }

}