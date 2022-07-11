import React from "react";

type TemplatesOptionsPrpType = {
  templateList: {
    name: string;
    code: string;
    videoFile: string;
  }[];
  setChoosenTemplate: React.Dispatch<React.SetStateAction<string>>;
  choosenTemplate: string;
};

const TemplatesOptions = ({
  templateList,
  choosenTemplate,
  setChoosenTemplate,
}: TemplatesOptionsPrpType) => {
  return (
    <div>
      <div style={{ display: "flex", justifyContent: "center" }}>
        {
            templateList.map((template) => (
                <div style={{ position: "relative", margin: "5px 15px" }}>
                    <div
                        onClick={() => setChoosenTemplate(template.code)}
                        style={{
                            position: "relative",
                            cursor: "pointer",
                            border: template.code === choosenTemplate  ? "3px dashed blue" : "3px solid transparent",
                            padding: "5px",
                            width: "400px",
                            height: "225px",
                    }}
                    ></div>
                    <div  style={{   position: "absolute",   top: "0", left: "8px",  zIndex: -1 }}  >
                        <video autoPlay loop muted width={"400px"} height="240px">
                            <source src={template.videoFile} type="video/mp4" />
                        </video>
                    </div>
                    <h4 style={{textAlign:"center", marginTop:"5px",  color: template.code === choosenTemplate  ? "blue" : "black",}}>{template.name}</h4>
                </div>
            ))
        }
      </div>
    </div>
  );
};

export default TemplatesOptions;
