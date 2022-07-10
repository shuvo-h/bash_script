import { getGoogleFontUrl } from "./common3rdParyUtils.mjs";
import { getRndInteger, getTextPosition } from "./commonUtils.mjs";
import { defaultTextOption, tpl_codeList } from "./ffmpegInfoUtils.mjs";

export async function finalizeOptions(template_id,userOptions) {
    console.log(userOptions," use opt");
    console.log(template_id," use opt");
    const {textOption, frameOption} = userOptions;

    switch (template_id) {
        case tpl_codeList.demo_NoTrNoTx_Wm_01:
            
            return;

        case tpl_codeList.onTrOnTx_04:
            // get google font link
            const fontLink_TrTx = await getGoogleFontUrl(textOption.font.family,textOption.font.variant);
            // console.log(fontLink_TrTx,"gt hi");
            // get text position with padding 
            const textPosition_TrTx = getTextPosition(textOption.positionCtg,textOption.paddingX,textOption.paddingY);
            // console.log(textPosition_TrTx);
            //add text position, color, font size, border, background colr etc.
            const userTextOption_TrTx = {
                fontLink: fontLink_TrTx, 
                textPosition: textPosition_TrTx,
                text: textOption.text ? textOption.text : "",
                fontcolor: textOption.fontcolor ? textOption.fontcolor : "White",
                fontcolor_alpha: textOption.fontcolor_alpha ? textOption.fontcolor_alpha : 1.0,
                fontsize: textOption.fontsize ? textOption.fontsize : 40,
                box: textOption.box === 1 ? 1 : 0,
                boxborderw: textOption.boxborderw ? textOption.boxborderw : 10,
                boxcolor: textOption.boxcolor ? textOption.boxcolor : "black",
                boxcolor_alpha: textOption.boxcolor_alpha ? textOption.boxcolor_alpha : 1.0,
                borderw: textOption.borderw ? textOption.borderw : 0,
                bordercolor: textOption.bordercolor ? textOption.bordercolor : "black",
                bordercolor_alpha: textOption.bordercolor_alpha ? textOption.bordercolor_alpha : 1.0,
                fix_bounds: textOption.fix_bounds === false? false : true,
                shadowcolor: textOption.shadowcolor ? textOption.shadowcolor : "black",
                shadowcolor_alpha: textOption.shadowcolor_alpha ? textOption.shadowcolor_alpha : 1.0,
                
                shadowx: textOption.shadowx ? textOption.shadowx : 0,
                shadowy: textOption.shadowy ? textOption.shadowy : 0,
            };
            // combine with default option
            const userFinalTextOpt_TrTx = Object.assign(defaultTextOption,userTextOption_TrTx);  // mixing with deffault text option
            console.log({ frameOption, textOption: userFinalTextOpt_TrTx},"in case");
            // process.exit()
            // (in future) change the frame option similar to textOption, change height, width, transition name, transition duration, frame pad color 
            return { frameOption, textOption: userFinalTextOpt_TrTx};

        case tpl_codeList.colorBG_01 :
            const fontLink_BG_01 = await getGoogleFontUrl(textOption.font.family,textOption.font.variant);
            const textPosition_BG_01 = getTextPosition(textOption.positionCtg,textOption.paddingX,textOption.paddingY);
            const userTextOption_BG_01 = {
                fontLink: fontLink_BG_01, 
                textPosition: textPosition_BG_01,
                text: textOption.text ? textOption.text : "",
                fontcolor: textOption.fontcolor ? textOption.fontcolor : "White",
                fontcolor_alpha: textOption.fontcolor_alpha ? textOption.fontcolor_alpha : 1.0,
                fontsize: textOption.fontsize ? textOption.fontsize : 40,
                box: textOption.box === 1 ? 1 : 0,
                boxborderw: textOption.boxborderw ? textOption.boxborderw : 10,
                boxcolor: textOption.boxcolor ? textOption.boxcolor : "black",
                boxcolor_alpha: textOption.boxcolor_alpha ? textOption.boxcolor_alpha : 1.0,
                borderw: textOption.borderw ? textOption.borderw : 0,
                bordercolor: textOption.bordercolor ? textOption.bordercolor : "black",
                bordercolor_alpha: textOption.bordercolor_alpha ? textOption.bordercolor_alpha : 1.0,
                fix_bounds: textOption.fix_bounds === false? false : true,
                shadowcolor: textOption.shadowcolor ? textOption.shadowcolor : "black",
                shadowcolor_alpha: textOption.shadowcolor_alpha ? textOption.shadowcolor_alpha : 1.0,
                
                shadowx: textOption.shadowx ? textOption.shadowx : 0,
                shadowy: textOption.shadowy ? textOption.shadowy : 0,
            };
            const userFinalTextOpt_BG_01 = Object.assign(defaultTextOption,userTextOption_BG_01);  
            return { frameOption, textOption: userFinalTextOpt_BG_01};
            
            
        default:
                console.log("def case");
                // process.exit()
            return defaultTextOption;
    }


}

const transitionList1 = ["fade", "wipeleft", "wiperight", "wipeup", "wipedown", "slideleft", "slideright", "slideup", "slidedown", "circlecrop", "rectcrop", "distance", "fadeblack", "fadewhite", "radial", "smoothleft", "smoothright", "smoothup", "smoothdown", "circleopen", "circleclose", "vertopen", "vertclose", "horzopen", "horzclose", "dissolve", "pixelize", "diagtl", "diagtr", "diagbl", "diagbr", "hlslice", "hrslice", "vuslice","vdslice", "hblur", "fadegrays","wipetl", "wipetr", "wipebl", "wipebr", "squeezeh", "squeezev", "zoomin"];

const defaultVideoOptObj = {
    transitionName: "fade",
    transitionDuration: 1,
    videoWidth: 1280,
    videoHeight: 720,
    videoFramePadColor: "black"
}  
