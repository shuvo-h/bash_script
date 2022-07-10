export const delayMinuteIfNoCurrentOrder = 20; //times in minutes, after how long, the programm will check for the new order in database
// maximum amount of time in seconds, the audio duration will be converted so that ffmpeg don't get pthread error
export const maxAnimatedDuration = 40; // 50 seconds    
export const maxgeneralDuration = 120; // 200 seconds

// if change any code, change the list also from main thread because it is also related to Client side, in fileName: ____.mjs 
export const tpl_codeList = {
    demo_NoTrNoTx_Wm_01: "NtrNtx_Wm_01",
    demo_OnTrOnTx_Wm_02: "OtrOtx_Wm_02",
    noTrNoTx_01: "NtrNtx_01",
    noTrOnTx_02: "NtrOtx_02",
    onTrNoTx_03: "OtrNtx_03",
    onTrOnTx_04: "OtrOtx_04",
    colorBG_01: "colorBG_01",
}

// list of catagory of the ffmpeg templates 
export const tpl_ctgList = {
    waterMark:"waterMark",
    animation: "animation",
    no_img: "no_img",
}
// ffmpeg template file name in (.mjs)
export const templateList = [
    {tpl_name:"Demo Test",                  tpl_ctg:tpl_ctgList.waterMark,      tpl_code:tpl_codeList.demo_NoTrNoTx_Wm_01,  tpl_child_name:"noTransitionWithWaterMark"},
    {tpl_name:"Demo Test",                  tpl_ctg:tpl_ctgList.waterMark,      tpl_code:tpl_codeList.demo_OnTrOnTx_Wm_02,  tpl_child_name:"onlyTransitionWithWaterMark"},
    {tpl_name:"No Effect No Text",          tpl_ctg:"original",                 tpl_code:tpl_codeList.noTrNoTx_01,          tpl_child_name:"noTransitionNoText"},
    {tpl_name:"No Effect Only Text",        tpl_ctg:"original",                 tpl_code:tpl_codeList.noTrOnTx_02,          tpl_child_name:"noTransitionOnlyText"},
    {tpl_name:"Only Transition Effect",     tpl_ctg:"original",                 tpl_code:tpl_codeList.onTrNoTx_03,          tpl_child_name:"onlyTransitionNoText"},
    {tpl_name:"Both Transition with Text",  tpl_ctg: tpl_ctgList.animation,     tpl_code:tpl_codeList.onTrOnTx_04,          tpl_child_name:"onlyTransitionOnlyText"},
    {tpl_name:"Colored Background",         tpl_ctg: tpl_ctgList.no_img,        tpl_code:tpl_codeList.colorBG_01,           tpl_child_name:"coloredBackground"},
]

// need this list to check how long the audio file should be
// for animated templates, make audio and video duration 50 
export const animatedTemplates = ["onlyTransitionOnlyText"];
// for general templates, make audio and video duration 200 seconds
export const generalTemplates = [];

// text position on video frame
export const textPosition = {
    top_left: "top_left",
    top_right: "top_right",
    top_center: "top_center",
    center: "center",
    bottom_left: "bottom_left",
    bottom_center: "bottom_center",
    bottom_right: "bottom_right",
}

// ffmpeg default text  option 
export const defaultTextOption = {
    box: 1,   // 0 or 1;  1 = enable, 0 = disable
    boxborderw: 5, // width of the border to be drawn around the box using boxcolor. The default value = 0
    boxcolor: "white",  //  default value of boxcolor = "white".
    borderw: 0, // width of the character border(like shadow), default = 0;
    bordercolor: "black",  // default black (character border color like shadow)
    fix_bounds: true, // If true, check and fix text coords to avoid clipping.
    fontcolor: "White",  // color of the font
    fontcolor_expr: "", // dynamic fontcolor value
    font: "Sans",  // The font family
    fontfile: "",  // The font file to be used for drawing text. The path must be included.
    alpha: 1, // 0 to 1; Draw the text applying alpha blending. The default value is 1.
    fontsize: 16, //  default value 16.
    shadowcolor: "black", // The color to be used for drawing a shadow behind the drawn text. // https://ffmpeg.org/ffmpeg-utils.html#color-syntax
    shadowx: 0,
    shadowy: 0, // The x and y offsets for the text shadow position with respect to the position of the text. They can be either positive or negative values. The default value for both is "0".
    text: "", // text to be writen on video
    x: "0",  // horizontal position of text
    y: "0",  // vertical position of text
}

// ffmpeg allowed Color list
export const colorList = ["AliceBlue","AntiqueWhite","Aqua","Aquamarine","Azure","Beige","Bisque","Black","BlanchedAlmond","Blue","BlueViolet","Brown","BurlyWood","CadetBlue","Chartreuse","Chocolate","Coral","CornflowerBlue","Cornsilk","Crimson","Cyan","DarkBlue","DarkCyan","DarkGoldenRod","DarkGray","DarkGreen","DarkKhaki","DarkMagenta","DarkOliveGreen","Darkorange","DarkOrchid","DarkRed","DarkSlateBlue","DarkSeaGreen","DarkSalmon","DarkSlateGray","DarkTurquoise","DarkViolet","DeepPink","DeepSkyBlue","DimGray","DodgerBlue","FireBrick","FloralWhite","ForestGreen","Fuchsia","Gainsboro","GhostWhite","Gold","GoldenRod","Gray","Green","GreenYellow","HoneyDew","HotPink","IndianRed","Indigo","Ivory","Khaki","Lavender","LavenderBlush","LawnGreen","LemonChiffon","LightBlue","LightCoral","LightCyan","LightGoldenRodYellow","LightGreen","LightGrey","LightPink","LightSalmon","LightSeaGreen","LightSkyBlue","LightSlateGray","LightSteelBlue","LightYellow","Lime","LimeGreen","Linen","Magenta","Maroon","MediumAquaMarine","MediumBlue","MediumOrchid","MediumPurple","MediumSeaGreen","MediumSlateBlue","MediumSpringGreen","MediumTurquoise","MediumVioletRed","MidnightBlue","MintCream","MistyRose","Moccasin","NavajoWhite","Navy","OldLace","Olive","OliveDrab","Orange","OrangeRed","Orchid","PaleGoldenRod","PaleGreen","PaleTurquoise","PaleVioletRed","PapayaWhip","PeachPuff","Peru","Pink","Plum","PowderBlue","Purple","Red","RosyBrown","RoyalBlue","SaddleBrown","Salmon","SandyBrown","SeaGreen","SeaShell","Sienna","Silver","SkyBlue","SlateBlue","SlateGray","Snow","SpringGreen","SteelBlue","Tan","Teal","Thistle","Tomato","Turquoise","Violet","Wheat","White","WhiteSmoke","Yellow","YellowGreen"];

// this 9 transition isn't working. These have bug from ffmpeg
// const Not_worked_bugOf_ffmpeg_transitionList = ["hblur","fadegrays","wipetl","wipetr","wipebl","wipebr","squeezeh","squeezev","zoomin"]
// list of transition list working perfectly
export const transitionList = ["fade", "wipeleft", "wiperight", "wipeup", "wipedown", "slideleft", "slideright", "slideup", "slidedown", "circlecrop", "rectcrop", "distance", "fadeblack", "fadewhite", "radial", "smoothleft", "smoothright", "smoothup", "smoothdown", "circleopen", "circleclose", "vertopen", "vertclose", "horzopen", "horzclose", "dissolve", "pixelize", "diagtl", "diagtr", "diagbl", "diagbr", "hlslice", "hrslice", "vuslice","vdslice"];



