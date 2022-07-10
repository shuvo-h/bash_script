import mongoose from "mongoose";

const textInfoSchema = new mongoose.Schema(
    {
        subTitle: {
            type: String,
            require: true,
            trim: true
        },
        subText: {
            type: String,
            require: true
        },
        pos: {
            type: Number,
            require: true
        },
    }
)

export const convertStatusTypes = {
    pending: "pending",
    working: "working",
    completed: "completed",
    convert_Error: "convert_error",
}


const videoTextInfoSchema = mongoose.Schema(
    {
        template:{
            type: String,
            require: true,
            trim: true
        },
        textInfo: {
            mainTitle: {
                type: String,
                require: true,
                trim: true
            },
            mainTitleImgKeys: [
                {
                    type: String,
                    trim: true
                }
            ],
            all_para: [
            {
                subTitle: {
                    type: String,
                    require: true,
                    trim: true
                },
                subTitleImgKeys: [
                    {
                        type: String,
                        trim: true
                    }
                ],
                subText: {
                    type: String,
                    require: true
                },
                subParaImgKeys: [
                    {
                        type: String,
                        trim: true
                    }
                ],
                pos: {
                    type: Number,
                    require: true
                },
            }
        ]},
        user_id:{
            type: Number,
            require: true
        },
        video_id: {
            type: Number,
            require: true
        },
        convert_status: {
            type:  String,
            require: true
        },
        status_messages: {
            type: String
        },

    },
    {
        timestamps:{createAt: true, updateAt: false}
    }
)

export const VideoTextInfo = mongoose.model("VideoTextInfo",videoTextInfoSchema);


