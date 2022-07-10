
// list of function sequences link next() 
// (startConvertProcessing,getUserTxtOptions,)

import { getUserTxtOptions } from "../converterMiddleware/getUserTxtOptions.mjs";
import { waitDesiredMinutes } from "../utilitiesConverter/commonUtils.mjs";
import { delayMinuteIfNoCurrentOrder } from "../utilitiesConverter/ffmpegInfoUtils.mjs";

export async function startConvertProcessing() {
    console.log(" printing from resourcecontroller.mjs");

    const textOptionEncodeRes = await getUserTxtOptions()
    // console.log(textOptionEncodeRes);
    if ( textOptionEncodeRes.videoLoopEnded && !textOptionEncodeRes.isMoreOrder) {
        // just wait 10 minutes before re-query to DB
        // const waitTime = await waitDesiredMinutes(0.5)
        const waitTime = await waitDesiredMinutes(delayMinuteIfNoCurrentOrder)
        console.log(waitTime, "current Time = ", new Date().getMinutes());
    }

    // always return as end the  to restart the convert process
    return {processEnd: true}
    
    
}


