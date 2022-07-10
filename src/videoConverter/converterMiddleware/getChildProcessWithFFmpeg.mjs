import {fork} from 'child_process';

export async function getChildProcessWithFFmpeg(childProcessMessageObj) {
    // start to work for child process from here
    
    let encodeStatus = false;
    
    const childResult = await new Promise((resolve,reject)=>{
        console.log("pre child",childProcessMessageObj.fileNameExt.childTemplate);
        const childProcess_paraBasedVideo = fork(`./src/videoConverter/ffmpegTemplates/${childProcessMessageObj.fileNameExt.childTemplate}.mjs`); // call the dynamic child process based on user order
        
        // process.exit()

        setTimeout(()=>{
            console.log(childProcessMessageObj,"sending req in setTimeout");
            // const childProcessMessageObj = {audioDuration,audioCounter,imgKeyAnimText,fileNameExt}
            childProcess_paraBasedVideo.send(childProcessMessageObj);
            childProcess_paraBasedVideo.on('message', async(message) =>{
                if (message.encodeStatus) {
                    encodeStatus = true;
                    resolve(message); // the resolved value will be returned
                }else{
                    // update DB that video encode failed and exit the process
                    resolve(message)
                }
            console.log(message,"output of child process");
        });
        },2000)
        
    })

    // return {encodeStatus, message: "videoConvert.message"}
    return childResult;
}