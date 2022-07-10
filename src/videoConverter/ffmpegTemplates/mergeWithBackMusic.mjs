import fs from 'fs';
import { createFFmpeg,fetchFile } from '@ffmpeg/ffmpeg';
import { getAllFilesInDir } from "../utilitiesConverter/commonUtils.mjs";

process.on("message", async (message) => {
    console.log(message,"merge child message");
    // const {audioDuration,audioCounter,imgKeyAnimText,fileNameExt} = message; // send the full object to make video
    
    const videoPartFolder = `./src/videoConverter/allFiles/tempVideos/`; 
    const sortedFileNames = await getAllFilesInDir(videoPartFolder);
    console.log(sortedFileNames,"fileNames pam pam pam");
    const mergeResponse = await margeVideParts(sortedFileNames,message);
    
    // check here the converted file size, if file has no size, then try to convert again by calling:   await ffmpegNoAnimationOnlyText(message); 

    // send the response to exit with child process
    process.send(mergeResponse);

    // always exist the child process must
    process.exit();
});


async function margeVideParts(videoNameList,videoSaveInfo) {
    const {videoName, videoType, backgroundMusic,backgroundMusicType,backgroundVolume} = videoSaveInfo;
    console.log(videoSaveInfo," ed");
    
    try {
            // create and load ffmpeg 
        const ffmpeg = createFFmpeg({log: true,});
        await ffmpeg.load();

            // write video files path 
        const videopaths = [];
        for (let i = 0; i < videoNameList.length; i++) {
            const fileName = videoNameList[i];
            ffmpeg.FS('writeFile', fileName, await fetchFile(`./src/videoConverter/allFiles/tempVideos/${fileName}`));
            videopaths.push(`file ${fileName}\n`);
        }
    
        // concat video in text file in ffmpeg 
        const concatVideoPathStr = videopaths.join("")
        ffmpeg.FS('writeFile', 'concat_videoList.txt', concatVideoPathStr);

            // create the vide mixing audio and images 
        const videoOutputFileNameNoBack = `noBackground_${videoName}.${videoType}`;
        const videoOutputFileNameWithBack = `${videoName}.${videoType}`;
        await ffmpeg.run("-f", "concat", "-safe", "0", "-i", 'concat_videoList.txt',  "-vcodec", "copy", "-acodec", "copy", "-shortest",videoOutputFileNameNoBack);


            // write final video and background music 
        // const back_musicPath = `./src/videoConverter/allFiles/demoBackgroundMusic/${backgroundMusic}.${backgroundMusicType}`;
        const back_musicPath = `./src/videoConverter/allFiles/demoBackgroundMusic/${backgroundMusic}`;
        ffmpeg.FS('writeFile', "backgroundMusic.mp3", await fetchFile(back_musicPath));

            // background music adding command ffmpeg 
        await ffmpeg.run("-i", videoOutputFileNameNoBack, "-stream_loop", "-1", "-i", "backgroundMusic.mp3", "-filter_complex", `[1:a]volume=${backgroundVolume},apad[A];[0:a][A]amerge[out]`,
        "-c:v", "copy", "-map", "0:v", "-map", "[out]", "-y", videoOutputFileNameWithBack);

            // write the video file to harddrive 
        const videoFileNameWithPath = `./src/videoConverter/allFiles/finalVideos/${videoOutputFileNameWithBack}`;
        await fs.promises.writeFile(videoFileNameWithPath, ffmpeg.FS('readFile', videoOutputFileNameWithBack));

        
            // unlink txt file
        await ffmpeg.FS('unlink','concat_videoList.txt');
        // unlink videos
        for (let i = 0; i < videoNameList.length; i++) {
            const fileName = videoNameList[i];
            await ffmpeg.FS('unlink', fileName);
        }

            // unlink video and background music file
        await ffmpeg.FS('unlink','backgroundMusic.mp3');

        
            // get the size of the final marged file
        const videoFile = fs.statSync(videoFileNameWithPath);
        return {encodeStatus: true, fileName: videoOutputFileNameWithBack, fileExtension:videoType,fileSize: videoFile.size, message:"Video encoded successfull."}

    } catch (error) {
        // store the error.message to personal DB collection so that developer can later understood the main probjem. or can write in a logger file
        return {encodeStatus: false,  message:  "Video Merged failed!" }
    }
}


