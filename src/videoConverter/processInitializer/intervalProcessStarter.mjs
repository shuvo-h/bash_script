import mongoose from 'mongoose';
import { startConvertProcessing } from "../resourceCollector/resourceCollector.mjs";


// connect the mongoose DB again since it is a child process apart from main thread 
// database connection 
mongoose.connect(process.env.MONGO_CONNECTION_URI,{
    useNewUrlParser: true,
    useUnifiedTopology: true,
    dbName: 'Article2Video'
}).then(()=>console.log("DB connection for video encoding successfull."))
.catch(err => console.log(err))




// blocking the main thread, so create a child process, and use this setInterval in that child process
// continuously start the ffmpeg convert process
let isFfmpegRunning = {status: false};


const timeWriter = setInterval(async()=>{
    // return the execution if ffmpeg is already running
    if (isFfmpegRunning.status) {
        // console.log("FFmpeg is already running...... ",isFfmpegRunning.status);
        return;   // no need in async function, but kept here to be more ensure
    }

    try {
        // set the ffmpeg running status to => true
        isFfmpegRunning.status = true;
        // call the ffmpeg function and change the runnning status after completing the video convert
        const convertResult = await startConvertProcessing();   // return an object with process end  {processEnd: true}
        console.log(convertResult);
        
        // change the ffmpeg status after finishing the process, also change the convert result status to reuse it
        if (convertResult.processEnd) {
            console.log("changing ffmpeg status");
            isFfmpegRunning.status = false;
            convertResult.processEnd = false;
            return;
        }
        
    } catch (error) {
        // log the error in the log file, and set the ffmpeg false to start again the process
        console.log(error);
        isFfmpegRunning.status = false;
    }
    
},5000)   // check in every 5 seconds   // in production, make it optimum time. because it will continuously make a query in database if any new order is placed. so reduce the number of query 



