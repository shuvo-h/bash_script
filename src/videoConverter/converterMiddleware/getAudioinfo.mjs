import fs from 'fs';
import getMp3Duration from 'get-mp3-duration';
import { maxAnimatedDuration, maxgeneralDuration, templateList, tpl_ctgList } from '../utilitiesConverter/ffmpegInfoUtils.mjs';
import { getAudioBase64 } from '../utilitiesConverter/common3rdParyUtils.mjs';
import { getUnsplashImgLinks } from '../utilitiesConverter/imageInfoOrganize.mjs';
import { getChildProcessWithFFmpeg } from './getChildProcessWithFFmpeg.mjs';

export async function getAudioinfo(fullText,imgKeyAnimText,fileNameExt,fileCount) {
    const optimizedSentenceArrayForAudio = fullText.trim().replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|").split("|");

    // const optimizedTextForAudio = makeOptimizedPara(sentenceArray);
    console.log(optimizedSentenceArrayForAudio,"aw");

    const audioVidRes = await writeAudioAndStartVideo(optimizedSentenceArrayForAudio,imgKeyAnimText,fileNameExt,fileCount);
    console.log(audioVidRes);
    return audioVidRes;
    
}



async function writeAudioAndStartVideo(optimizedTextArr,imgKeyAnimText,fileNameExt,fileCount) {
    console.log(optimizedTextArr,fileNameExt);
    let encodeStatus = false;
    // make audio maximum   1000s
    // change the duration of audio based on the video type to get optimum time duration during converting
    const isAnimated = templateList.find(el => el.tpl_child_name === fileNameExt.childTemplate).tpl_ctg === tpl_ctgList.animation;
    const maxAudioDuration = isAnimated ? maxAnimatedDuration :  maxgeneralDuration;
    console.log(maxAudioDuration, "maxAudioDuration --------------------------------> check for none animated video");
    // check if the video need unsplash images or it will be only colored background
    const isNoImgOnVideo = templateList.find(el => el.tpl_child_name === fileNameExt.childTemplate).tpl_ctg === tpl_ctgList.no_img;
    const noNeedImgRes = {
        encodeStatus: true,
        imgLinks: ["no img need"],
        finalSecPerImg: 5
    }
    console.log(isNoImgOnVideo,"isImgNeed");
    // process.exit()

    let audioBase64sFixDuration = [];
    let audioCounter = fileCount;  // i=0; i++; use fileCount to make count all the files for whol article 
    for(let text of optimizedTextArr){
        const audio64s = await getAudioBase64(text,fileNameExt.language);
        audioBase64sFixDuration.push(audio64s);
        const joinedBase64 = audioBase64sFixDuration.join("");
        const audioDuration = await getMp3Duration(Buffer.from(joinedBase64,"base64")) / 1000;          // divided by 1000 to get in seconds
        console.log(fileNameExt,"fileNameExt");

        if (audioDuration > maxAudioDuration) {  // audioDuration > 120

            // download audio and empty the 64s array
            try {
                fs.writeFileSync(`./src/videoConverter/allFiles/tempAudios/${fileNameExt.name}_${audioCounter}.${fileNameExt.audioType}`,new Buffer(joinedBase64,"base64"));
            } catch (error) {
                // write in the loger  file
                return {encodeStatus: false,audioCounter,message:"Audio file write failed!"};
            }
            audioBase64sFixDuration.length = 0;
            console.log("downloading above 60s");
            console.log(imgKeyAnimText);
            
            // get image links in an array
            const  imgLinksInfo = isNoImgOnVideo? noNeedImgRes : await getUnsplashImgLinks(imgKeyAnimText.imgKeys,audioDuration, imgKeyAnimText.userSecPerImg);
            if (!imgLinksInfo.encodeStatus) {
                console.log(imgLinksInfo,"imgLinksInfo 5");
                return {encodeStatus: false, message: imgLinksInfo.message}
            }
            imgKeyAnimText.imgLinks = imgLinksInfo.imgLinks;
            imgKeyAnimText.finalSecPerImg = imgLinksInfo.finalSecPerImg;
            console.log(imgLinksInfo, " -<>- getAudioInfo.mjs file");

            // have more code, tomorrow, start from here 
            
            // call child process to make video for this part of audio
            // call child process start
            const processMsgObj = {audioDuration,audioCounter,imgKeyAnimText,fileNameExt}
            const videoConvert = await getChildProcessWithFFmpeg(processMsgObj);
            if (!videoConvert.encodeStatus) {
                console.log(videoConvert,"getAudioinfo.mjs");
                encodeStatus = false;
                return {encodeStatus: false, message: videoConvert.message}
            }else{
                encodeStatus = true;
                console.log("done done done done ",audioCounter)
            }
            // child process end
            //increase the audio counter to make a sequence
            audioCounter++;
            console.log(audioCounter);
            
            
        }
    }

     // the last base64 which duration couldn't over 60s
     if (audioBase64sFixDuration.length) {
        // download the last audio
        const joinedBase64 = audioBase64sFixDuration.join("");
        const audioDuration = await getMp3Duration(Buffer.from(joinedBase64,"base64")) / 1000;          // divided by 1000 to get in seconds
        console.log(audioDuration,"last audioDuration");
        // download audio and empty the 64s array
        try {
            fs.writeFileSync(`./src/videoConverter/allFiles/tempAudios/${fileNameExt.name}_${audioCounter}.${fileNameExt.audioType}`,new Buffer(joinedBase64,"base64"));
        } catch (error) {
            // write in the loger  file
            return {encodeStatus: false,audioCounter,message:"Audio file write failed!"};
        }

        // get image links in an array
        let imgLinksInfo;
        // check here if this video really need images or is it only colored background
        imgLinksInfo = isNoImgOnVideo? noNeedImgRes : await getUnsplashImgLinks(imgKeyAnimText.imgKeys,audioDuration, imgKeyAnimText.userSecPerImg);
        console.log(imgLinksInfo,"imgLinksInfo");
        // process.exit()
        if (!imgLinksInfo.encodeStatus) {
            console.log(imgLinksInfo,"imgLinksInfo 1st time failed");
            // just double check if 1st time failed to get image links
            imgLinksInfo = isNoImgOnVideo? noNeedImgRes : await getUnsplashImgLinks(imgKeyAnimText.imgKeys,audioDuration, imgKeyAnimText.userSecPerImg);
            if (!imgLinksInfo.encodeStatus) {
                console.log(imgLinksInfo,"imgLinksInfo 2nd time failed");
                return {encodeStatus: false, message: imgLinksInfo.message}
            }   
        }
        imgKeyAnimText.imgLinks = imgLinksInfo.imgLinks;
        imgKeyAnimText.finalSecPerImg = imgLinksInfo.finalSecPerImg;

        // console.log(imgLinks, finalSecPerImg);
        // process.exit()

        // call child process start
        const processMsgObj = {audioDuration,audioCounter,imgKeyAnimText,fileNameExt}
        const videoConvert = await getChildProcessWithFFmpeg(processMsgObj);
        if (!videoConvert.encodeStatus) {
            console.log(videoConvert,"getAudioinfo.mjs");
            encodeStatus = false;
            return {encodeStatus: false, message: videoConvert.message}
        }else{
            encodeStatus = true;
            console.log("done done done done ",audioCounter)
        }
        
        // child process end
        //increase the audio counter to make a sequence
        audioCounter++;
    }

    console.log({encodeStatus,audioCounter},"conv status");
    // process.exit() 
    return {encodeStatus,audioCounter};
}


