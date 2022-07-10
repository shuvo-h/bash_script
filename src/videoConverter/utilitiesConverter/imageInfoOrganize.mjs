import { getImgListPerKey } from "./common3rdParyUtils.mjs";
import { uniqueRandNumArr } from "./commonUtils.mjs";



export async function getUnsplashImgLinks(keyArray,duration,userSecPerImg) {
    const {imgRequire,finalSecPerImg} = makeTimePerImg(duration,userSecPerImg);
    // const linksPerKey = Math.ceil(imgRequire / keyArray.length); 
    const linksPerKey = Math.ceil(imgRequire / keyArray.length) + 2; // increasing additional 2 links for testing to match with duration, can delete in later if not useful
    console.log( {imgRequire,finalSecPerImg});
    const imgLinks = await makeImgList(keyArray,linksPerKey);
    if (imgLinks.length) {
        return {encodeStatus: true, imgLinks,finalSecPerImg};
    }else{
        return imgLinks;
    }
    console.log(imgLinks,"final img links");
}



const makeTimePerImg = (totalTime,approximateTimePerImg=7) =>{
    // const imgRequire = Math.floor(totalTime / approximateTimePerImg);
    const imgRequire = totalTime > approximateTimePerImg ? Math.floor(totalTime / approximateTimePerImg) : 1;
    
    const finalSecPerImg = (totalTime > imgRequire && imgRequire > 1) ? (totalTime / imgRequire) : totalTime;
    console.log(finalSecPerImg,"finalSecPerImg", totalTime,"totalTime",imgRequire,"imgRequire");
    return {imgRequire,finalSecPerImg}
}



async function makeImgList(keyArray,linksPerKey) {
    const imgLinks = [];
    for(let key of keyArray){
        try {
            const imgList = await getImgListPerKey(key);
            const imgSelectedIdx = uniqueRandNumArr(imgList.length-1,linksPerKey);
            imgSelectedIdx.forEach(indexNum =>{
                const link = imgList[indexNum].links.download;
                imgLinks.push(link);
            })
            
        } catch (error) {
            return {encodeStatus: false,message:"Image links couldn't find!"};
        }
        
    }

    return imgLinks;
}


