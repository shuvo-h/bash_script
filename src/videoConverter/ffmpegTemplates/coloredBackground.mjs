import fs from 'fs';
import { createFFmpeg,fetchFile } from '@ffmpeg/ffmpeg';
import http from "https";
import { getRndInteger, makeCenteredNewLine } from '../utilitiesConverter/commonUtils.mjs';
import { colorList } from '../utilitiesConverter/ffmpegInfoUtils.mjs';

process.on("message", async (message) => {
    const {audioDuration,audioCounter,imgKeyAnimText,fileNameExt} = message; // send the full object to make video
    console.log(audioDuration,audioCounter,imgKeyAnimText,fileNameExt,"got color background child process");
    // process.exit();
    
    // console.log(message,"in clild");
    const convertedResult = await ffmpegColoredBackground(message);      // const processMsgObj = {videoFileName:"",audioFileName:"",imgLinks:[]}
    console.log(convertedResult,"convertedResult transition with effect");
    
    // check here the converted file size, if file has no size, then try to convert again by calling:   await ffmpegNoAnimationOnlyText(message); 

    // send the response to exit with child process
    process.send(convertedResult);

    // always exist the child process must
    process.exit();
});

async function ffmpegColoredBackground(videoMakeInfo) {
    const {audioDuration,audioCounter,imgKeyAnimText,fileNameExt} = videoMakeInfo;
    const {name,audioType,videoType,language,options} = fileNameExt; 
    const {frameOption, textOption} = options; 
    const {animationText,imgLinks,userSecPerImg,finalSecPerImg} = imgKeyAnimText;
    const filteredNimationText = animationText.replace(/['":]+/g, '')  // remove the single and double quotation to escape from conflict with ffmpeg commands
    const newLineTitle = await makeCenteredNewLine(filteredNimationText,textOption.fontsize,2300) // screen width = 2200px - 2300px
    console.log(newLineTitle," -> -> -> ani miya");
    // transitionDuration
    try {
            // step 1: create and load ffmpeg 
        const ffmpeg = createFFmpeg({log: true,});
        await ffmpeg.load();
        
            // step 2: write audio file
        const FSMMEaudioFileName = `${name}_${audioCounter}.${audioType}`; 
        const audioLocalPath = `./src/videoConverter/allFiles/tempAudios/${FSMMEaudioFileName}`;
        ffmpeg.FS("writeFile", FSMMEaudioFileName, await fetchFile(audioLocalPath));
        
            // step 3: write the font 
        const fontFamily = "FSMMEfont.ttf";
        ffmpeg.FS('writeFile', `${fontFamily}`, await fetchFile(textOption.fontLink));

        // calculate the alpha for fade-in fade out, in future change this for further transition
        const fadeStartTime = 0;
        const fadeInDuration = frameOption.transitionDuration;
        const fadeOutDuration = frameOption.transitionDuration;
        const timeTextToDisplay = audioDuration - (fadeStartTime + fadeInDuration + fadeOutDuration);

        const alphaCmd = `alpha='if(lt(t,${fadeStartTime}),0,if(lt(t,${fadeStartTime+fadeInDuration}),(t-${fadeStartTime})/${fadeInDuration},if(lt(t,${fadeStartTime+fadeInDuration+timeTextToDisplay}),1,if(lt(t,${fadeStartTime+fadeInDuration+timeTextToDisplay+fadeOutDuration}),(${fadeOutDuration}-(t-${fadeStartTime+fadeInDuration+timeTextToDisplay}))/${fadeOutDuration},0))))'`

        // get random color each time
        const randIdx = getRndInteger(0,colorList.length);
        const selectedColor = colorList[randIdx] ? colorList[randIdx] : "black";
            // step 4: convert the video
        // await ffmpeg.run("-f","lavfi", "-i", `color=size=${frameOption.videoWidth}x${frameOption.videoHeight}:rate=25:color=${selectedColor}`, "-i", FSMMEaudioFileName, "-vf", `drawtext=fontfile=${fontFamily}:fontsize=30:fontcolor=white:${alphaCmd}:x=(w-text_w)/2:y=(h-text_h)/2:text='${newLineTitle}`, "-c:a", "copy", "-shortest", `${name}_${audioCounter}.${videoType}`)
        
        await ffmpeg.run("-f","lavfi", "-i", `color=size=${frameOption.videoWidth}x${frameOption.videoHeight}:rate=25:color=${selectedColor}`, "-i", FSMMEaudioFileName, "-vf", `drawtext=fontfile=${fontFamily}:text=${newLineTitle}:fontcolor=${textOption.fontcolor}:${alphaCmd}:fontsize=${textOption.fontsize}:box=${textOption.box}:boxborderw=${textOption.boxborderw}:boxcolor=${textOption.boxcolor}@${textOption.boxcolor_alpha}:borderw=${textOption.borderw}:bordercolor=${textOption.bordercolor}@${textOption.bordercolor_alpha}:fix_bounds=${textOption.fix_bounds}:shadowcolor=${textOption.shadowcolor}@${textOption.shadowcolor_alpha}:shadowx=${textOption.shadowx}:shadowy=${textOption.shadowy}:${textOption.textPosition}`, "-c:a", "copy", "-shortest", `${name}_${audioCounter}.${videoType}`)
       

            // step 5:unlink audio and font file
        await ffmpeg.FS('unlink', FSMMEaudioFileName);
        await ffmpeg.FS('unlink', fontFamily);

         
        // process.exit()
        // step 10: save the video to local drive 
        await fs.promises.writeFile(`./src/videoConverter/allFiles/tempVideos/${name}_${audioCounter}.${videoType}`, ffmpeg.FS('readFile',  `${name}_${audioCounter}.${videoType}`));
        
        return { encodeStatus: true, message: 'Video part encoded successful' } 
    } catch (error) {
        console.log(error, "color background.mjs");
        // store the error.message to personal DB collection so that developer can later understood the main probjem. or can write in a logger file
        return { encodeStatus: false, message:  "Video encoded failed!" } 
    }

}


