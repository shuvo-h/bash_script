import {fork} from 'child_process';

export async function callToStartChildAutomation(childCronMessageObj) {
    try {
        // start a new promise to wait untill finish the task
        const childIntervalStarter = await new Promise((resolve,reject)=>{
            // fork the file to start setInterval to continuously convert video
            // const childprocess_Interval = fork("./intervalProcessStarter.mjs");
            const childprocess_Interval = fork("./src/videoConverter/processInitializer/intervalProcessStarter.mjs");
    
            setTimeout(()=>{
                const childCronMessageObj = {} // just an empty object since there is no need to send anything in the process
                childprocess_Interval.send(childCronMessageObj);
                childprocess_Interval.on('message', async(message)=>{
                    //don't resolve this function since this forked process will be kept running
                    // resolve(message)
                });
                
    
            },4000) // first time wait 4 seconds to load the forked files 
    
        })
        
    } catch (error) {
        console.log(error);
    }
}



