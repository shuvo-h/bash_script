import React, { useEffect, useState } from 'react';
import "../../../pages/ArticleInput/articleInput.css";
import { initialArrangedDataType } from '../../../pages/ArticleInput/ArticleInput';
import { parabasedTitleType } from '../../../../types/videoTypes';
import videoService from '../../../../services/videoService/video.Service';
import { useNavigate } from 'react-router-dom';
import { privatePageName, privateRoutes } from '../../../../routes/privateRoutes';
import TemplatesOptions from '../TemplatesOptions/TemplatesOptions';
import OtrOtx_04 from "../../../../assets/templateDemo/OtrOtx_04.mp4"
import colorBG_01 from "../../../../assets/templateDemo/colorBG_01.mp4"

type ArticleEditPreviewPropType = {
    initialTextObj: initialArrangedDataType[]
    setInitialTextObj:  React.Dispatch<React.SetStateAction<initialArrangedDataType[]>>
    mainTitle: string
}

const tpl_codeList = {  // get this list from server to make dynamic(right now it is static)
    onTrOnTx_04: "OtrOtx_04",
    colorBG_01: "colorBG_01",
}

const templateList = [
    {name: "Fade Title With Color Background" ,code: tpl_codeList.colorBG_01, videoFile: colorBG_01},
    {name: "Transition with Display Title" ,code: tpl_codeList.onTrOnTx_04 , videoFile: OtrOtx_04},
]




const ArticleEditPreview = ({initialTextObj, setInitialTextObj,mainTitle}:ArticleEditPreviewPropType) => {
    const [optimizedParaTitle,setOptimizedParaTitle] = useState<parabasedTitleType[] | []>([]);
    const [choosenTemplate,setChoosenTemplate] = useState(tpl_codeList.colorBG_01);
    const navigate = useNavigate();
    const navigateMyOrderPage = privateRoutes.find(route=> route.name === privatePageName.MyOrders)?.path;
console.log(optimizedParaTitle,"optimizedParaTitle");

    useEffect(()=>{
        makeTitleBasedPara(initialTextObj)
    },[initialTextObj.length])

    const txtArrayTagRearrange = (index: number,tagName:"h" | "p") =>{
        console.log({index,tagName});
        const tempArr = [...initialTextObj];
        tempArr[index].tag = tagName;
        setInitialTextObj(tempArr)

        makeTitleBasedPara(tempArr);  
    }

    const makeTitleBasedPara = (textArr: initialArrangedDataType[]) =>{
        const tempOptTextParaArr = []
        let tempOptTextParaObj:parabasedTitleType = {} as parabasedTitleType;
        let currentTag = "";
        let currentTitle = "";
        textArr.sort((a,b)=>a.pos-b.pos).forEach(txtpara =>{
            if (txtpara.tag === 'h') {
                if (currentTag === "p") {
                    tempOptTextParaArr.push({...tempOptTextParaObj, subTitle: currentTitle})
                    currentTitle = txtpara.subText;
                    tempOptTextParaObj = {} as parabasedTitleType;
                    currentTag = txtpara.tag;
                }else{
                    currentTag = txtpara.tag;
                    // check if last character is === ! || . || ? || ,  // if not, add a full stop, use regex here to match
                    const lastChar = txtpara.subText.trim().charAt(txtpara.subText.length - 1);
                    console.log(lastChar);
                    currentTitle = (lastChar === "." || "?" || "," || "!") ? currentTitle.concat(" ",txtpara.subText) : currentTitle.concat(". ",txtpara.subText);
                }
            }else{
                currentTag = txtpara.tag;
                const lastChar = txtpara.subText.trim().charAt(txtpara.subText.length - 1);
                const needFullStop = (lastChar === "." || "?" || "," || "!") ? false : true;
                if (needFullStop) {
                    tempOptTextParaObj.subText = tempOptTextParaObj.subText ? (  tempOptTextParaObj.subText?.concat(". ",txtpara.subText) ): txtpara.subText;
                }else{
                    tempOptTextParaObj.subText  = tempOptTextParaObj.subText ? (  tempOptTextParaObj.subText?.concat(" ",txtpara.subText) ): txtpara.subText;
                }
                tempOptTextParaObj.pos  = txtpara.pos;
            }
        })
        // push the last para title object
        tempOptTextParaArr.push({...tempOptTextParaObj, subTitle: currentTitle});
        setOptimizedParaTitle(tempOptTextParaArr);
        console.log(textArr,tempOptTextParaArr,"in fn");
        
    }

    const handleOrderPlace = async(textOrderInfo:parabasedTitleType[]) =>{
        if (textOrderInfo.length) {
            // send axios request to save info into database
            console.log(textOrderInfo);
            const textInfo = {
                mainTitle,
                all_para: textOrderInfo
            }
            console.log(textInfo);
            
            try {
                // const orderRes = await videoService.placeOrder({textInfo:textOrderInfo,template:choosenTemplate});
                const orderRes = await videoService.placeOrder({textInfo,template:choosenTemplate});
                
                if (orderRes.video_id) {
                    alert(`Order received successfully. Your order id is ${orderRes.video_id}`);
                    setOptimizedParaTitle([])
                    setInitialTextObj([])
                    navigate(navigateMyOrderPage? navigateMyOrderPage : "/")
                }else if(orderRes.message){
                    alert(orderRes.message)
                }
            } catch (error:any) {
                console.log(error);
            }
            
        }
    }

    return (
        <div>
            <div>
                <h2 className='text_center'>Finalize your Article</h2>
                <div>
                    <div>
                        <TemplatesOptions templateList={templateList} choosenTemplate={choosenTemplate} setChoosenTemplate={setChoosenTemplate}></TemplatesOptions>
                    </div>
                    <button  style={{margin:"10px auto", display:"block"}} className='btn_regular' onClick={()=>handleOrderPlace(optimizedParaTitle)}>Place order</button>
                </div>
            </div>
            <div  style={{display:"grid",gridTemplateColumns:"1fr 300px"}}>
                <div>
                    {
                        initialTextObj.map((textObj,idx) => {
                            if (textObj.tag === "p") {
                                return <p onClick={()=>txtArrayTagRearrange(idx, "h")} style={{cursor:"pointer"}} >{textObj.subText}</p>
                            }else{
                                return <h4 onClick={()=>txtArrayTagRearrange(idx, "p")} style={{cursor:"pointer"}} >{textObj.subText}</h4>
                            }
                        })
                    }
                </div>
                <div style={{position:"relative"}}>
                    <div style={{position:"fixed",border:"1px dotted rgba(125,85,190,0.9)", borderRadius:"6px"}}>
                        <h3 style={{textAlign:"center",fontSize:"15px",}}>Preview</h3>
                        <div className='previewContainer' >
                            <h3 style={{textAlign:"center"}}>{mainTitle}</h3>
                            {
                                optimizedParaTitle.map(paraTitle => {
                                    return <>
                                        {
                                            paraTitle.subTitle && <h3>{paraTitle.subTitle}</h3>
                                        }
                                        {
                                            paraTitle.subText && <p>{paraTitle.subText}</p>
                                        }
                                    </>
                                }) 
                            }
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default ArticleEditPreview;