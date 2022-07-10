import fs from 'fs';
import { textPosition } from "./ffmpegInfoUtils.mjs";

// wait for a specific period of time
export async function waitDesiredMinutes(minutes) {
    console.log("Waiting for ", minutes, " minutes delay");
   return new Promise((resolve,reject) =>{
        return setTimeout(()=>{resolve(true)},1000*60*minutes)
    })

}


export function getTextPosition(positionName,paddingX=0,paddingY=0) {
    switch (positionName) {
        case textPosition.top_left:    //   top_left: 
            return `x=${paddingX}:y=${paddingY}`;

        case textPosition.top_right:   // top_right: "x=w-tw-10:y=10",
            return `x=w-tw-${paddingX}:y=${paddingY}`;

        case textPosition.top_center:  //  top_center: "x=(w-text_w)/2:y=10",
            return `x=(w-text_w)/2:y=${paddingY}`;

        case textPosition.bottom_left:  // bottom_left: " x=10:y=h-th-10",
            return `x=${paddingX}:y=h-th-${paddingY}`;

        case textPosition.bottom_center:   // bottom_center: "x=(w-text_w)/2:y=h-th-10",
            return `x=(w-text_w)/2:y=h-th-${paddingY}`;

        case textPosition.bottom_right:  // bottom_right: "x=w-tw-10:y=h-th-10",
            return `x=w-tw-${paddingX}:y=h-th-${paddingY}`;
    
        default:    //  center: "x=(w-text_w)/2:y=(h-text_h)/2",
            return `x=(w-text_w)/2:y=(h-text_h)/2`;
    }
}


export async function finalizeTextImageKeys(userTextObjDB) {
    const rawTextImg = {...userTextObjDB};
    // check image keys for main title
    const mainTitleImgKeys = rawTextImg.mainTitleImgKeys?.length ? rawTextImg.mainTitleImgKeys : [rawTextImg.mainTitle];
    // change the object property of image keywords for main titile
    rawTextImg.mainTitleImgKeys = mainTitleImgKeys;
    for(let i=0; i<rawTextImg.all_para?.length; i++){
        // check if subtitle is exist elst make it main title
        rawTextImg.all_para[i].subTitle = rawTextImg.all_para[i]?.subTitle.length ? rawTextImg.all_para[i]?.subTitle : rawTextImg.mainTitle;
        // check image keys for sub title
        const subTitleImgKeys = rawTextImg.all_para[i]?.subTitleImgKeys?.length ? rawTextImg.all_para[i]?.subTitleImgKeys : [rawTextImg.all_para[i]?.subTitle];
        rawTextImg.all_para[i].subTitleImgKeys = subTitleImgKeys;
        // check image keys for sub para
        const subParaImgKeys = rawTextImg.all_para[i]?.subParaImgKeys?.length ? rawTextImg.all_para[i]?.subParaImgKeys : [rawTextImg.all_para[i]?.subTitle];
        rawTextImg.all_para[i].subParaImgKeys = subParaImgKeys;
    }

    return rawTextImg;
    
}





export async function checkLongSentence(textObj) {
    let isLongSentence = false;
    const longSentenceList = [];
    // check for title
    const titleCheck = await makeTextSentenceArray(textObj.mainTitle);
    if (!titleCheck.sentencePassed) {
        isLongSentence = true;
        titleCheck.long_sentence.forEach(text =>{
            longSentenceList.push(text);
        })
    }
    
     // check for paragraphs
    for(let para of textObj.all_para){
        // check for title of each para
        const paraTitleCheck = await makeTextSentenceArray(para.subTitle);
        if (!paraTitleCheck.sentencePassed) {
            isLongSentence = true;
            paraTitleCheck.long_sentence.forEach(text =>{
                longSentenceList.push(text);
            })
        }
        // check text for each para
        const paraTextCheck = await makeTextSentenceArray(para.subText);
        if (!paraTextCheck.sentencePassed) {
            isLongSentence = true;
            paraTextCheck.long_sentence.forEach(text =>{
                longSentenceList.push(text);
            })
        }
    }

    
    // console.log(longSentenceList);
    return {isLongSentence,longSentenceList};
}


async function makeTextSentenceArray(textArray) {
    const sentenceArray = textArray?.trim()?.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|")?.split("|")
    const long_sentence = [];
    sentenceArray.forEach(sentence =>{
        // console.log(sentence);
        if (sentence.length > 200) {
            long_sentence.push(sentence);
        }
    })
    const sentencePassed = long_sentence.length ? false : true;
    return sentencePassed ? {sentenceArray, sentencePassed} : {long_sentence, sentencePassed}
}



export function uniqueRandNumArr(maxNum,arrLength) {
    const randomNumbers = [];
    for(let i = 0; i < arrLength; i++){
        const number = getUniqueNum(randomNumbers,maxNum);
        if (number) {
            randomNumbers.push(number);
        }
    }
    return randomNumbers;
}


function getUniqueNum(numArray,maxNum) {
    const number = getRndInteger(0,maxNum);
    const isExistNum = numArray.includes(number);
    if (isExistNum) {
        if (numArray.length < maxNum) {
            return getUniqueNum(numArray,maxNum);
        }else{
            return null;
        }
    }else{
        // console.log(numArray,maxNum);
        return number;
    }
    
}


export function getRndInteger(min, max) {
    return Math.floor(Math.random() * (max - min + 1) ) + min;
}



export async function makeCenteredNewLine(mainText,fontSize,screenLength = 2200) {
    // const mainText = "abcdef ghijkl mno pqr stuv wxyz. abcdef ghijkl mno pqr stuv wxyz. uthdn gkshi jg ki dhj";
//   const fontSize = 100; // max - 100 font size
//   const screenLength = 2200;
  let tempLineArray = [];
  let tempLine = [];
  let lengthCounter = 0;
  const wordArray = mainText.split(" ")

  // optimize the words in a single line 
  for(let word of wordArray){
    lengthCounter += (word.length) * fontSize;
    if (lengthCounter <= screenLength) {
      tempLine.push(word);
      lengthCounter += (1* fontSize) ;  // plus 1 for space " " adding
    }else{
      tempLineArray.push(tempLine.join(" ")); 
      lengthCounter = word.length * fontSize;
      tempLine = [word];
    }
  }
  // insert last temp line
  tempLineArray.push(tempLine.join(" "));

  // find max length of the line
  const lineLength = tempLineArray.map(line => line.length);
  const maxLength = Math.max(...lineLength)
  console.log(lineLength,"   =   ",maxLength);

  // add free space to reach max line length
  const lineArray = tempLineArray.map(line => line.replace(/[\|&;\$%@"<>\(\)\+,]/g, "")).map(line =>{
    let spaceNeed = Math.floor((maxLength - line.length)/2);
    let freeSpace = "";
    for(let i of Array.from(Array(spaceNeed).keys())){
      freeSpace += " ";  // instead of adding empty space in this old method, we can user stringName.padStart() and padEnd() method
    }
    console.log(freeSpace);
    return `${freeSpace}${line}${freeSpace}`;
  });
  console.log(lineArray);
    // process.exit()
  // add \n for making new line
  const slashLine = lineArray.join("\n");
  console.log(slashLine);
  return slashLine;
}



export async function getAllFilesInDir(folderPath) {
    const fileNames = await new Promise((resolve,reject)=>{
        // read all the parted video files 
        fs.readdir(folderPath,(err,files)=>{
            if (err) throw err;
            resolve(files);
        })
    })
    const sortedFileNames = fileNames.sort((a,b)=>a.localeCompare(b,undefined,{numeric: true}));
    return sortedFileNames;
}


export async function deleteAllFiles(folderPath) {
    const fileNames = await new Promise((resolve,reject)=>{
        // read all the parted video files 
        fs.readdir(folderPath,(err,files)=>{
            if (err) throw err;
            console.log(files,"FFF");
            if (files.length) {
                for (const file of files) {
                    console.log(file + ' : File Deleted Successfully.');
                    fs.unlinkSync(folderPath+file);
                }
            }
            resolve({success: true});
        })
    })
    
}

