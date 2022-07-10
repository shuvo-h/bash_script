import fs from 'fs';
import { createFFmpeg,fetchFile } from '@ffmpeg/ffmpeg';
import http from "https";
import { getRndInteger, makeCenteredNewLine } from '../utilitiesConverter/commonUtils.mjs';
import { transitionList } from '../utilitiesConverter/ffmpegInfoUtils.mjs';

process.on("message", async (message) => {
    const {audioDuration,audioCounter,imgKeyAnimText,fileNameExt} = message; // send the full object to make video
    console.log(audioDuration,audioCounter,imgKeyAnimText,fileNameExt,"got child process");
    // process.exit();
    
    // console.log(message,"in clild");
    const convertedResult = await ffmpegOnlyAnimationOnlyText(message);      // const processMsgObj = {videoFileName:"",audioFileName:"",imgLinks:[]}
    console.log(convertedResult,"convertedResult transition with effect");
    
    // check here the converted file size, if file has no size, then try to convert again by calling:   await ffmpegNoAnimationOnlyText(message); 

    // send the response to exit with child process
    process.send(convertedResult);

    // always exist the child process must
    process.exit();
});

async function ffmpegOnlyAnimationOnlyText(videoMakeInfo) {
    const {audioDuration,audioCounter,imgKeyAnimText,fileNameExt} = videoMakeInfo;
    const {name,audioType,videoType,language,options} = fileNameExt; 
    const {frameOption, textOption} = options; 
    const {animationText,imgLinks,userSecPerImg,finalSecPerImg} = imgKeyAnimText;
    const filteredNimationText = animationText.replace(/['":]+/g, '')  // remove the single and double quotation to escape from conflict with ffmpeg commands
    const newLineTitle = await makeCenteredNewLine(filteredNimationText,textOption.fontsize,2300) // screen width = 2200px - 2300px
    console.log(newLineTitle," -> -> -> ani miya");

    try {
        // step 1: create and load ffmpeg 
        const ffmpeg = createFFmpeg({log: true,});
        await ffmpeg.load();
        
        // step 2: write audio file
        const FSMMEaudioFileName = `${name}_${audioCounter}.${audioType}`; 
        const audioLocalPath = `./src/videoConverter/allFiles/tempAudios/${FSMMEaudioFileName}`;
        ffmpeg.FS("writeFile", FSMMEaudioFileName, await fetchFile(audioLocalPath));
        
        // step 2.1: write the font 
        const fontFamily = "FSMMEfont.ttf";
        ffmpeg.FS('writeFile', `${fontFamily}`, await fetchFile(textOption.fontLink));

        
        // step 3: write image files
        for(let i = 0; i < imgLinks.length; i++){
            // write paragraph image 
            const numP = `000${i}`.slice(-4);
            const FSMMEimgFileNameP = `img.${numP}.jpg`;
            ffmpeg.FS('writeFile', FSMMEimgFileNameP, await fetchFile(`${imgLinks[i]}`));
        }

        
            // step 3.1: write extra demo image files
        const imgCMDlength = 11;
        for(let i = imgLinks.length; i < imgCMDlength; i++){   // imgCMDlength is the number of image is in ffmpeg.run() cmmand
            // write paragraph image 
            const numP = `000${i}`.slice(-4);
            const FSMMEimgFileNameP = `img.${numP}.jpg`;
            const demoLink = "./src/videoConverter/allFiles/demoImg/demo_img.png";
            ffmpeg.FS('writeFile', FSMMEimgFileNameP, await fetchFile(`${demoLink}`));
        }

        
        const mergedDefaultVideoOptObj = {
            transitionName: frameOption.transitionName? frameOption.transitionName :  "fade",
            transitionDuration: frameOption.transitionDuration? frameOption.transitionDuration : 1,
            videoWidth: frameOption.videoWidth? frameOption.videoWidth : 1280,
            videoHeight: frameOption.videoHeight? frameOption.videoHeight : 720,
            videoFramePadColor: frameOption.videoFramePadColor? frameOption.videoFramePadColor : "black"
        }  
        
        console.log(frameOption, textOption);

        

        const tranCMDoption = await makeTransitionOptionCMD(imgCMDlength,mergedDefaultVideoOptObj,finalSecPerImg,fontFamily,newLineTitle, textOption)
        console.log(tranCMDoption,  " => tranCMDoption"); 
        
        // process.exit()

        
            // step 4:create video with scale resolution 1280X720 , number of "-framerate" "-loop" command will be (imgCMDlength-1 = img.0010.jpg)
        /*
        await ffmpeg.run(
        
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0000.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0001.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0002.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0003.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0004.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0005.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0006.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0007.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0008.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0009.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0010.jpg",
            "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0011.jpg",
            
            "-i", FSMMEaudioFileName, '-c:a', 'copy',

            "-filter_complex",
                `${tranCMDoption}`, 
                "-map", `[${imgCMDlength - 1}x]`, "-c:v", "libx264", "-crf", "17",            // `[${imgLength-1}x]`
                "-map", `${imgCMDlength}:a`, "-shortest", "-t", `${audioDuration}`,     // `${imgLength}:a`
                `${name}_${audioCounter}.${videoType}`
        );
        */

        await ffmpeg.run(
       
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0000.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0001.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0002.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0003.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0004.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0005.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0006.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0007.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0008.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0009.jpg",
           "-framerate", "30", "-loop", "1", "-t", `${finalSecPerImg}`, "-i", "img.0010.jpg",
           
           "-i", FSMMEaudioFileName, '-c:a', 'copy',

           "-filter_complex",
               `${tranCMDoption}`, 
               "-map", `[${imgCMDlength - 1}x]`, "-c:v", "libx264", "-crf", "17",            // `[${imgLength-1}x]`
               "-map", `${imgCMDlength}:a`, "-shortest",     // `${imgLength}:a`
               `${name}_${audioCounter}.${videoType}`
       );

            // step 5:unlink audio and font file
        await ffmpeg.FS('unlink', FSMMEaudioFileName);
        await ffmpeg.FS('unlink', fontFamily);

            // step 6:unlink images
        // for (let i = 0; i < imgLinks.length; i++) {
        for (let i = 0; i < imgCMDlength; i++) {
            const num = `000${i}`.slice(-4);
            await ffmpeg.FS('unlink', `img.${num}.jpg`);
        }
        // process.exit()
        // step 10: save the video to local drive 
        await fs.promises.writeFile(`./src/videoConverter/allFiles/tempVideos/${name}_${audioCounter}.${videoType}`, ffmpeg.FS('readFile',  `${name}_${audioCounter}.${videoType}`));
        
        return { encodeStatus: true, message: 'Video part encoded successful' } 
    } catch (error) {
        // store the error.message to personal DB collection so that developer can later understood the main probjem. or can write in a logger file
        return { encodeStatus: false, message: "Video encoded failed!" } 
    }

}






const makeTransitionOptionCMD = (imgCMDLooplength,videoOptObj,imgPerSec, ffmpegFSfontFamilyName, lineTitle, textOption) =>{  // videoOptObj = {transitionName: "fade",transitionDuration: 1}   
    console.log(videoOptObj);
    
    const txtOptArr = [];
    const trnsitionOptArr = [];
    for(let i = 0; i<imgCMDLooplength; i++){
        
       txtOptArr.push(`[${i}]scale=${videoOptObj.videoWidth}:${videoOptObj.videoHeight}:force_original_aspect_ratio=decrease,pad=${videoOptObj.videoWidth}:${videoOptObj.videoHeight}:(ow-iw)/2:(oh-ih)/2:color=${videoOptObj.videoFramePadColor},setsar=1, drawtext=fontfile=${ffmpegFSfontFamilyName}:text=${lineTitle}:fontcolor=${textOption.fontcolor}@${textOption.fontcolor_alpha}:fontsize=${textOption.fontsize}:box=${textOption.box}:boxborderw=${textOption.boxborderw}:boxcolor=${textOption.boxcolor}@${textOption.boxcolor_alpha}:borderw=${textOption.borderw}:bordercolor=${textOption.bordercolor}@${textOption.bordercolor_alpha}:fix_bounds=${textOption.fix_bounds}:shadowcolor=${textOption.shadowcolor}@${textOption.shadowcolor_alpha}:shadowx=${textOption.shadowx}:shadowy=${textOption.shadowy}:${textOption.textPosition}[${i}p];`);
        
    }
    // const transitionList = ["fade",	"fadeblack","fadewhite","distance"];
    // const transitionList = ["fade", "wipeleft","wiperight","wipeup","wipedown","slideleft","slideright","slideup","slidedown","circlecrop","rectcrop","distance","fadeblack","fadewhite","radial","smoothleft","smoothright","smoothup","smoothdown","circleopen","circleclose","vertopen","vertclose","horzopen","horzclose","dissolve","pixelize","diagtl","diagtr","diagbl","diagbr","hlslice","hrslice","vuslice","vdslice","hblur","fadegrays","wipetl","wipetr","wipebl","wipebr","squeezev"];
    
    for(let i = 0; i<imgCMDLooplength - 1; i++){
        let selectedTransition = videoOptObj.transitionName;
        if (selectedTransition === "random") {
            let transIndex = getRndInteger(0,transitionList.length-1);
            selectedTransition = transitionList[transIndex];
        }
        let ofsetTime = (imgPerSec - videoOptObj.transitionDuration) * (i+1);  // 7 - 1 = 6 * (i+1)
        trnsitionOptArr.push(`[${i}${i === 0? "p":"x"}][${i+1}p]xfade=transition=${selectedTransition}:duration=${videoOptObj.transitionDuration}:offset=${ofsetTime}[${i+1}x]`);
    }
   console.log(trnsitionOptArr);
    // process.exit()
    return `${txtOptArr.join("")} ${trnsitionOptArr.join("; ")}`;
}



