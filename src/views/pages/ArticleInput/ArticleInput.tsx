import React, { useEffect, useState } from 'react';
import "./articleInput.css";
import ArticleEditPreview from '../../components/ArticleInputComponents/ArticleEditPreview/ArticleEditPreview';
import ArticleInputArea from '../../components/ArticleInputComponents/ArticleInputArea/ArticleInputArea';

export type initialArrangedDataType = {
    tag: string
    pos: number,
    subText: string
}
const textDemoData = [
    {tag:"h",pos: 0,subT:"This is text 1" },
    {tag:"p",pos: 0,subT:"This is text 2" },
    {tag:"h",pos: 0,subT:"This is text 3" },
    {tag:"h",pos: 0,subT:"This is text 4" },
]

const ArticleInput = () => {
    const [isTextAreaOpen,setIsTextAreaOpen] = useState(true);
    const [fieldTextData,setFieldTextData] = useState("");
    const [mainTitle,setMainTitle] = useState("");
    const [initialTextObj,setInitialTextObj] = useState<initialArrangedDataType[]>([]);

    useEffect(()=>{
        const splitedData = fieldTextData.split("\n").filter(tx => tx.length)
            console.log(splitedData, "splitedData");
            const initialArrangeData = splitedData.map((text, idx) =>{
                return {tag:"p",pos: idx, subText: text }
            })
            setInitialTextObj(initialArrangeData)
    },[fieldTextData.length])

    console.log(initialTextObj);
    
    return (
        <div className='article_input_container'>
            <div>
                {isTextAreaOpen && <ArticleInputArea setFieldTextData={setFieldTextData} fieldTextData={fieldTextData} setIsTextAreaOpen={setIsTextAreaOpen} setMainTitle={setMainTitle}  mainTitle={mainTitle}></ArticleInputArea>}
            </div>
            <div>
                {!isTextAreaOpen && <ArticleEditPreview initialTextObj={initialTextObj} setInitialTextObj={setInitialTextObj} mainTitle={mainTitle}></ArticleEditPreview>}
            </div>
            
        </div>
    );
};

export default ArticleInput;