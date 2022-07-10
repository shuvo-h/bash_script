import axios from "axios";
import googleTTS from 'google-tts-api';



export async function getGoogleFontUrl(fontFamily="Poppins",fontVariant="regular") {
    try {
        const allFonts = await axios.get(`https://www.googleapis.com/webfonts/v1/webfonts?key=${process.env.GOOGLE_FONT_API_KEY}`)
        // console.log(allFonts," -> API");
        const selectedFontLink = allFonts.data.items.find(fontObj => fontObj.family == fontFamily).files[fontVariant]; 
        if (selectedFontLink.length) {
            console.log(selectedFontLink,"selectedFontLink");
            // process.exit()
            return selectedFontLink;
        }else{
            // Write a loger info that google font link is not found
            // console.error()
            // return a static font link from here or an available font link
            return getGoogleFontUrl("Poppins","regular");
        }
    } catch (error) {
        // Write a loger info that got error during fetching google font link 
        console.log(error,"font link try error");
    }

}



// download audio from google
export async function getAudioBase64(text,language) {
    const audioResponse = await googleTTS.getAllAudioBase64(text,{
        lang: language ? language : "en",  // lang: "en",
        slow: false,
        host: 'https://translate.google.com',
        timeout: 10000,
        // splitPunct: ',.?',
    })
    return audioResponse[0].base64; // return the base64
}


// get image kinks from unsplash
export async function getImgListPerKey(singleKeyword) {
    
    const unsplashConfig = {headers:{ "Authorization": `${process.env.UNSPLASH_KEY}`},};
    const {data} = await axios.get(`https://api.unsplash.com/search/photos?page=1&per_page=30&query=${singleKeyword}`,unsplashConfig)
    console.log(data.results.length," -> image links length");
    // const {data} = await axios.get(`https://api.unsplash.com/search/photos?page=1&per_page=30&query=${"background color"}`,unsplashConfig)
    return data.results;
}





