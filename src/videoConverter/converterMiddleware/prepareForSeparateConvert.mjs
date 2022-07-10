import { getAudioinfo } from "./getAudioinfo.mjs";

export async function prepareForSeparatedVideo(textWithImgKeys,fileNameExt) {
    let encodeStatus = false;
    let fileCount = 0;
    // console.log(textWithImgKeys);
    console.log(fileNameExt.options.textOption," unde text"); 
    console.log(fileNameExt.options.textOption.text); 
    // process.exit()
    // make image display duration more than transition time
    const imgDIsplayDuration = (fileNameExt.options.frameOption.secPerImg - fileNameExt.options.frameOption.transitionDuration) > 0 ? fileNameExt.options.frameOption.secPerImg : (fileNameExt.options.frameOption.transitionDuration + 1);
    // go for the main title
    const imgKeyAnimText = {animationText: textWithImgKeys.mainTitle, imgKeys: textWithImgKeys.mainTitleImgKeys, userSecPerImg: imgDIsplayDuration} // initially 5 sec
    // console.log(imgKeyAnimText); 
    // add title text to user text option object to display on screen dynamically 
    if (fileNameExt.options?.textOption ) {
        fileNameExt.options.textOption.text = textWithImgKeys.mainTitle;
    }
    // go to download audio middleware
    const titleAudioInfo = await getAudioinfo(textWithImgKeys.mainTitle,imgKeyAnimText,fileNameExt,fileCount);
    console.log(titleAudioInfo,"titleAudioInfo");
    
    // update the file counter 
    if (titleAudioInfo.encodeStatus) {
        fileCount = titleAudioInfo.audioCounter;
        encodeStatus = true;
    }else{
        encodeStatus = false;
        // return with encode fail status and the message got from getAudioinfo middleware
        return {encodeStatus: false, message: titleAudioInfo.message}
    }
    console.log(textWithImgKeys.all_para," - main blog"); 
    
    // loop and create video for paragraphs 
    // loop and create video for paragraphs 
    for(let para of textWithImgKeys.all_para){
        console.log(para);
        // Go: title of a single para
        const paraTitle = para.subTitle;
        // add title text of this paragtaph to display on screen 
        if (fileNameExt.options?.textOption ) {
            fileNameExt.options.textOption.text = paraTitle;
        }
        const imgKeyAnimText = {animationText: paraTitle, imgKeys: para.subTitleImgKeys, userSecPerImg: imgDIsplayDuration} // initially 5 sec
        console.log( "fileCount ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",fileCount);
        // if paraTitle and the main title are not same, then go further, otherwise it will be repeated
        if (textWithImgKeys.mainTitle !== paraTitle) {
            const titleAudioInfoParaTitle = await getAudioinfo(paraTitle,imgKeyAnimText,fileNameExt,fileCount);
            if (titleAudioInfoParaTitle.encodeStatus) {
                fileCount = titleAudioInfoParaTitle.audioCounter;
                encodeStatus = true;
            }else{
                encodeStatus = false;
                // return with encode fail status and the message got from getAudioinfo middleware
                return {encodeStatus: false, message: titleAudioInfoParaTitle.message}
            }
        }
        // console.log(para);
        // process.exit()
        // Go: full text of a single para
        const imgKeyAnimTextPara = {animationText: paraTitle, imgKeys:  para.subParaImgKeys, userSecPerImg: imgDIsplayDuration} // initially 5 sec
        console.log( "fileCount ->>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>>",fileCount);
        const titleAudioInfoPara = await getAudioinfo(para.subText,imgKeyAnimTextPara,fileNameExt,fileCount);
        console.log("entering file counter **************** ", fileCount);
        if (titleAudioInfoPara.encodeStatus) {
            fileCount = titleAudioInfoPara.audioCounter;
            encodeStatus = true;
        }else{
            encodeStatus = false;
            // return with encode fail status and the message got from getAudioinfo middleware
            return {encodeStatus: false, message: titleAudioInfoPara.message}
        }
    }
    // console.log("ended loop");
    // process.exit()
    return {encodeStatus,message:"All video parts are converted successfully"};
}



