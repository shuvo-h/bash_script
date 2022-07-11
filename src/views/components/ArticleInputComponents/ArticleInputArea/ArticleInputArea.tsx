import React, { useEffect, useRef, useState } from 'react';

type ArticleInputAreaPropType = {
    fieldTextData: String
    setFieldTextData :  React.Dispatch<React.SetStateAction<string>>
    setIsTextAreaOpen :  React.Dispatch<React.SetStateAction<boolean>>
    setMainTitle :  React.Dispatch<React.SetStateAction<string>>
    mainTitle: string
}


const ArticleInputArea = ({fieldTextData,setFieldTextData,setIsTextAreaOpen,setMainTitle,mainTitle}:ArticleInputAreaPropType) => {
    const textFieldRef = React.useRef<HTMLTextAreaElement>(null);
    const [allText,setAllText] = useState("");
    const [longSentences,setLongSentences] = useState<string[]>([]);

    const handleTextNext = () =>{
        if (!mainTitle.trim().length) {
            alert("Please, Write your Title first.")
        }else if (!textFieldRef.current?.value) {
            alert("Please, Write your article first.")
        }else{
            setFieldTextData(textFieldRef.current?.value ? textFieldRef.current?.value : ""); 
            setIsTextAreaOpen(false)
        }
    }

    useEffect(()=>{
        const sentenceArr = makeTextSentenceArray(allText)
        console.log(sentenceArr,"in effect");
        
    },[allText])

            
    function makeTextSentenceArray(allText: string) {
        const sentenceArray = allText?.trim()?.replace(/(\.+|\:|\!|\?)(\"*|\'*|\)*|}*|]*)(\s|\n|\r|\r\n)/gm, "$1$2|")?.split("|")
        const long_sentence: string[] = [];
        sentenceArray.forEach(sentence =>{
            // console.log(sentence);
            if (sentence.length > 200) {
                long_sentence.push(sentence);
            }
        })
        setLongSentences(long_sentence)
        // const sentencePassed = long_sentence.length ? false : true;
        // return sentencePassed ? {sentenceArray, sentencePassed} : {long_sentence, sentencePassed}
    }

    
    return (
        <div>
            <h2>Write your text here...</h2>
            <div style={{display:"flex",flexDirection:"column" ,justifyContent:"center", alignItems:"center"}}>
                
                <input style={{margin:"8px", padding:"3px 5px", width:"70%", fontSize:"18px", fontWeight:"600"}} onBlur={(e)=>setMainTitle(e.target.value)} type="text" placeholder='Type your article main title here' required />
        
                <textarea ref={textFieldRef } onChange={e=>setAllText(e.target.value)} style={{width:"80%", minHeight:"400px", fontSize:"15px", fontWeight:"normal", lineHeight:"20px", fontFamily:"sans-serif"}} required ></textarea>
                <div style={{width:"80%"}}>
                    {
                         longSentences.length ? <h5 style={{margin:"3px 0", color:"red", textDecoration:"underline"}}>Please Keep your sentence lower than 200 characters</h5> : ""
                    }
                    {
                        longSentences.map(sentence => <p style={{margin:"1px 0", color:"red"}}>[{sentence.length}]: {sentence}</p>)
                    }
                </div>
                <div  style={{display:"flex", justifyContent:"center", marginTop:"8px"}}>
                    {
                        !longSentences.length && <button className='btn_regular' onClick={()=>{handleTextNext()}}>Next</button>
                    }
                </div>
            </div>
        </div>
    );
};

export default ArticleInputArea;