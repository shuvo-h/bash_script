import {fork} from 'child_process';

export async function margeVideos(videoSaveInfo) {
    console.log(videoSaveInfo," ext fn");
    
    // start the child process to merge video parts
    const mergeChildResult = await new Promise((resolve,reject)=>{
        const childProcess_paraBasedVideo = fork(`./src/videoConverter/ffmpegTemplates/${"mergeWithBackMusic"}.mjs`); // call the dynamic child process based on user order
        
        // process.exit()

        setTimeout(()=>{
            console.log(videoSaveInfo," videoSaveInfo in setTimeout");
            // const childProcessMessageObj = {audioDuration,audioCounter,imgKeyAnimText,fileNameExt}
            childProcess_paraBasedVideo.send(videoSaveInfo);
            childProcess_paraBasedVideo.on('message', async(message) =>{
                resolve(message);
                console.log(message,"output of videoSaveInfo child process");
        });
        },2000)
        
    })
    console.log(mergeChildResult,"mergeChildResult merge");
    // return   {encodeStatus: false,message:"Video Merged failed"};
    return mergeChildResult
}